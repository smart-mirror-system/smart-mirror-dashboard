const BACKEND_URL = window.env?.BACKEND_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../setup/sign-in.html";
}

// Global state
let socket;
let currentChatId = null;
let currentBotMsgElement = null;
let currentBotRawText = ""; // Track unparsed stream contents 

// DOM Elements
const chatListEl = document.getElementById("chatList");
const chatMessagesEl = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const btnSend = document.getElementById("btnSend");
const btnNewChat = document.getElementById("btnNewChat");
const btnDeleteChat = document.getElementById("btnDeleteChat");
const currentChatTitle = document.getElementById("currentChatTitle");
const typingIndicator = document.getElementById("typingIndicator");

// --- Initialization ---
function init() {
    initClock();
    initSocket();
    fetchChats();
}

function initClock() {
    function tick() {
        document.getElementById('clockVal').textContent = new Date().toTimeString().slice(0, 8);
    }
    setInterval(tick, 1000);
    tick();
}

function initSocket() {
    socket = io(BACKEND_URL, {
        auth: { token },
        transports: ["websocket"]
    });

    socket.on("connect", () => console.log("Chatbot Socket Connected"));

    // Handling streamed chunks from the AI
    socket.on("chat:chunk", (data) => {
        if (!currentBotMsgElement) {
            currentBotMsgElement = createMessageElement("Bot", "");
            currentBotRawText = ""; // Reset raw text layer
        }
        
        // Append raw stream token and compile markdown dynamically
        currentBotRawText += data.text;
        currentBotMsgElement.innerHTML = marked.parse(currentBotRawText);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });

    // Finalize message
    socket.on("chat:reply:done", (data) => {
        if (currentBotMsgElement && data.fullText) {
            currentBotMsgElement.innerHTML = marked.parse(data.fullText);
        }
        currentBotMsgElement = null;
        currentBotRawText = "";
        typingIndicator.style.display = "none";
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
            fetchChats().then(() => loadChat(data.chatId, data.title));
        }
    } catch (error) {
        console.error("Failed to create chat", error);
    }
}

// 3. Load Specific Chat Messages
async function loadChat(chatId, title) {
    currentChatId = chatId;
    currentChatTitle.textContent = title || "Fitness Session";
    
    // Enable inputs
    chatInput.disabled = false;
    btnSend.disabled = false;
    btnDeleteChat.style.display = "block";

    // Highlight active in sidebar
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
            // Reverse historical page mapping arrays to balance historical visibility flow
            const messages = data.chatMessages.reverse(); 
            messages.forEach(msg => createMessageElement(msg.role, msg.message));
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
    } catch (error) {
        console.error("Failed to load messages", error);
    }
}

// 4. Delete Chat
async function deleteChat() {
    if (!currentChatId) return;
    try {
        const res = await fetch(`${BACKEND_URL}/api/me/chatbot/chats/${currentChatId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.ok) {
            currentChatId = null;
            chatMessagesEl.innerHTML = "";
            currentChatTitle.textContent = "Select a session";
            chatInput.disabled = true;
            btnSend.disabled = true;
            btnDeleteChat.style.display = "none";
            fetchChats();
        }
    } catch (error) {
        console.error("Failed to delete chat", error);
    }
}

// --- UI Helpers ---
function renderChatList(chats) {
    chatListEl.innerHTML = "";
    chats.forEach(chat => {
        const div = document.createElement("div");
        div.className = `chat-list-item ${chat._id === currentChatId ? "active" : ""}`;
        div.textContent = chat.title || "Workout Chat";
        div.dataset.id = chat._id;
        div.onclick = () => loadChat(chat._id, chat.title);
        chatListEl.appendChild(div);
    });
}

function createMessageElement(role, text) {
    const div = document.createElement("div");
    div.className = `msg-bubble ${role === "User" ? "msg-user" : "msg-bot"}`;
    
    // Process markdown string structures safely. If text content is falsey/empty during streaming setups, assign empty text payload.
    div.innerHTML = text ? marked.parse(text) : "";
    
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    return div;
}

// --- Event Listeners ---
btnNewChat.addEventListener("click", createNewChat);
btnDeleteChat.addEventListener("click", deleteChat);

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChatId) return;

    // Output raw user inputs securely
    createMessageElement("User", text);
    chatInput.value = "";

    // Emit payload to Socket engine
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