const BACKEND_URL = window.env?.BACKEND_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../setup/sign-in.html";
}

// ─── Marked.js config (render markdown) ───
marked.setOptions({
    breaks: true,      // \n → <br>
    gfm: true,
});

// Global state
let socket;
let currentChatId = null;
let currentBotMsgElement = null;
let currentBotRawText   = "";   // accumulate raw markdown during streaming

// DOM Elements
const chatListEl       = document.getElementById("chatList");
const chatMessagesEl   = document.getElementById("chatMessages");
const chatInput        = document.getElementById("chatInput");
const btnSend          = document.getElementById("btnSend");
const btnNewChat       = document.getElementById("btnNewChat");
const btnDeleteChat    = document.getElementById("btnDeleteChat");
const btnRenameChat    = document.getElementById("btnRenameChat");
const currentChatTitle = document.getElementById("currentChatTitle");
const typingIndicator  = document.getElementById("typingIndicator");

// Rename modal elements
const renameModal      = document.getElementById("renameModal");
const renameInput      = document.getElementById("renameInput");
const btnRenameConfirm = document.getElementById("btnRenameConfirm");
const btnRenameCancel  = document.getElementById("btnRenameCancel");

// --- Initialization ---
function init() {
    initSocket();
    fetchChats();
}

function initSocket() {
    socket = io(BACKEND_URL, {
        auth: { token },
        transports: ["websocket"]
    });

    socket.on("connect", () => console.log("Chatbot Socket Connected"));

    // Stream chunks — accumulate raw text, render markdown live
    socket.on("chat:chunk", (data) => {
        if (!currentBotMsgElement) {
            currentBotMsgElement = createMessageElement("Bot", "");
            currentBotRawText = "";
        }
        currentBotRawText += data.text;
        currentBotMsgElement.innerHTML = marked.parse(currentBotRawText);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });

    // Final message — use fullText for clean render
    socket.on("chat:reply:done", (data) => {
        if (currentBotMsgElement) {
            const finalText = data.fullText || currentBotRawText;
            currentBotMsgElement.innerHTML = marked.parse(finalText);
        }
        currentBotMsgElement = null;
        currentBotRawText = "";
        typingIndicator.style.display = "none";
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });

    socket.on("chat:typing", (data) => {
        typingIndicator.style.display = data.isTyping ? "block" : "none";
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });

    socket.on("chat:error", (err) => {
        console.error("Chat Error:", err);
        createMessageElement("System", `Error: ${err.reason || err.message || "Something went wrong"}`);
    });
}

// --- REST API Calls ---

// 1. Fetch Chat History
async function fetchChats() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/me/chatbot/chats?limit=20`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) {
            renderChatList(data.chats);
            // Auto-load first session on page load
            if (data.chats.length > 0 && !currentChatId) {
                loadChat(data.chats[0]._id, data.chats[0].title);
            }
        }
    } catch (error) {
        console.error("Failed to load chats", error);
    }
}

// 2. Create New Chat
async function createNewChat() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/me/chatbot/chats`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: "New Training Session" })
        });
        const data = await res.json();
        if (data.ok) {
            // Add to sidebar immediately without full re-fetch
            const newChat = { _id: data.chatId, title: data.title || "New Training Session" };
            prependChatItem(newChat);
            loadChat(data.chatId, newChat.title);
        }
    } catch (error) {
        console.error("Failed to create chat", error);
    }
}

// 3. Load Specific Chat Messages
async function loadChat(chatId, title) {
    currentChatId = chatId;
    currentChatTitle.textContent = title || "Fitness Session";

    chatInput.disabled = false;
    btnSend.disabled = false;
    btnDeleteChat.style.display = "inline-flex";
    btnRenameChat.style.display = "inline-flex";

    document.querySelectorAll('.chat-list-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === chatId);
    });

    try {
        const res = await fetch(`${BACKEND_URL}/api/me/chatbot/chats/${chatId}?limit=50`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) {
            chatMessagesEl.innerHTML = "";
            const messages = data.chatMessages.reverse();
            messages.forEach(msg => createMessageElement(msg.role, msg.message));
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
    } catch (error) {
        console.error("Failed to load messages", error);
    }
}

// 4. Delete Chat — instant UI removal
async function deleteChat() {
    if (!currentChatId) return;

    const deletedId = currentChatId;

    const itemEl = chatListEl.querySelector(`[data-id="${deletedId}"]`);
    if (itemEl) itemEl.remove();

    currentChatId = null;
    chatMessagesEl.innerHTML = "";
    currentChatTitle.textContent = "Select a session";
    chatInput.disabled = true;
    btnSend.disabled = true;
    btnDeleteChat.style.display = "none";
    btnRenameChat.style.display = "none";

    const firstRemaining = chatListEl.querySelector('.chat-list-item');
    if (firstRemaining) {
        loadChat(firstRemaining.dataset.id, firstRemaining.querySelector('.chat-item-title').textContent);
    }

    try {
        await fetch(`${BACKEND_URL}/api/me/chatbot/chats/${deletedId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Failed to delete chat on server", error);
    }
}

// 5. Rename Chat
function openRenameModal() {
    if (!currentChatId) return;
    renameInput.value = currentChatTitle.textContent;
    renameModal.classList.add("open");
    renameInput.focus();
    renameInput.select();
}

function closeRenameModal() {
    renameModal.classList.remove("open");
}

async function confirmRename() {
    const newTitle = renameInput.value.trim();
    if (!newTitle || !currentChatId) return closeRenameModal();

    currentChatTitle.textContent = newTitle;
    const itemEl = chatListEl.querySelector(`[data-id="${currentChatId}"]`);
    if (itemEl) itemEl.querySelector('.chat-item-title').textContent = newTitle;
    closeRenameModal();

    try {
        await fetch(`${BACKEND_URL}/api/me/chatbot/chats/${currentChatId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: newTitle })
        });
    } catch (error) {
        console.error("Failed to rename chat", error);
    }
}

// --- UI Helpers ---
function renderChatList(chats) {
    chatListEl.innerHTML = "";
    chats.forEach(chat => {
        chatListEl.appendChild(buildChatItem(chat));
    });
}

function prependChatItem(chat) {
    chatListEl.prepend(buildChatItem(chat));
}

function buildChatItem(chat) {
    const div = document.createElement("div");
    div.className = `chat-list-item ${chat._id === currentChatId ? "active" : ""}`;
    div.dataset.id = chat._id;
    div.innerHTML = `<span class="chat-item-title">${chat.title || "Workout Chat"}</span>`;
    div.onclick = () => loadChat(chat._id, chat.title);
    return div;
}

// Detect Arabic / RTL text
function isRTL(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

function createMessageElement(role, text) {
    const div = document.createElement("div");

    const isUser = role === "User";
    div.className = `msg-bubble ${isUser ? "msg-user" : "msg-bot"}`;

    if (isUser) {
        // User messages: plain text, respect RTL
        div.textContent = text;
        div.dir = isRTL(text) ? "rtl" : "ltr";
    } else {
        // Bot messages: render markdown
        div.innerHTML = marked.parse(text || "");
        div.dir = "auto";
    }

    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    return div;
}

// --- Event Listeners ---
btnNewChat.addEventListener("click", createNewChat);
btnDeleteChat.addEventListener("click", deleteChat);
btnRenameChat.addEventListener("click", openRenameModal);
btnRenameConfirm.addEventListener("click", confirmRename);
btnRenameCancel.addEventListener("click", closeRenameModal);

renameModal.addEventListener("click", (e) => {
    if (e.target === renameModal) closeRenameModal();
});

renameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmRename();
    if (e.key === "Escape") closeRenameModal();
});

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChatId) return;

    createMessageElement("User", text);
    chatInput.value = "";

    socket.emit("chat:message", {
        chatId: currentChatId,
        message: text
    });
}

btnSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Start
init();