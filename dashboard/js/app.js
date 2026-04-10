const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/setup/index.html";
}
async function loadUser() {
  const res = await fetch("http://localhost:5000/api/me", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  if (data.ok) {
    console.log(data.user);

    document.getElementById("username").innerText =
      data.user.profile?.firstName || "User";
  }
}

loadUser();

// Live clock
function tick() {
  document.getElementById('clockVal').textContent =
    new Date().toTimeString().slice(0, 8);
}
setInterval(tick, 1000); tick();

// Heart rate fluctuation
setInterval(() => {
  document.getElementById('bpmVal').textContent =
    85 + Math.floor(Math.random() * 12) - 5;
}, 2000);

// Timer counting up
let secs = 24 * 60 + 33;
setInterval(() => {
  secs++;
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  document.getElementById('timerVal').textContent = `${m}:${s}`;
}, 1000);

// ===== Socket.IO Realtime =====
const BACKEND_URL = window.env?.BACKEND_URL || "http://localhost:3000";

let socket = null;

// --------- Auth helpers ---------
function setAuthStatus(msg) {
  const el = document.getElementById("authStatus");
  if (el) el.textContent = msg || "";
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

async function login(email, password) {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Login failed");

  setToken(data.token);
  return data.token;
}

// --------- Socket connect / disconnect ---------
function connectSocket() {
  const token = getToken();
  if (!token) {
    setAuthStatus("Please login first.");
    return;
  }

  // close old socket if exists
  if (socket) {
    try { socket.disconnect(); } catch {}
    socket = null;
  }

  socket = io(BACKEND_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("dashboard connected:", socket.id);
    setAuthStatus("Connected ✅");
    document.getElementById("controls").style.display = "block";
    document.getElementById("btnLogin").style.display = "none";
    document.getElementById("btnLogout").style.display = "inline-block";
  });

  socket.on("connect_error", (err) => {
    console.log("connect_error:", err?.message);
    setAuthStatus("Connect error: " + (err?.message || ""));
  });

  // ----- incoming events -----
  socket.on("workout:progress", (p) => {
    // 1) reps
    const repsEl = document.getElementById("repCount");
    if (repsEl) {
      repsEl.textContent = String(p.reps ?? 0);
      repsEl.style.animation = "none";
      repsEl.offsetHeight;
      repsEl.style.animation = "countUp 0.3s ease";
    }

    // 2) exercise type
    const ex = (p.exerciseType || "start").toUpperCase();
    const tag = document.getElementById("exerciseTag");
    if (tag) tag.textContent = `▶ ${ex}`;

    // 3) form status + tip
    const score = Number(p.formScore ?? 0);
    const status = document.getElementById("formStatus");
    if (status) status.textContent = score >= 75 ? "Form OK" : "Fix Form";

    const tip = document.getElementById("formTip");
    const m = p.mistakes?.[0]?.type;

    const tips = {
      knees_in: "Keep knees out.",
      back_round: "Keep back straight.",
      shallow: "Go lower (aim ~90°).",
    };
    if (tip) tip.textContent = tips[m] || "Keep steady and controlled.";

    // 4) formScore in top left
    const formVal = document.getElementById("formScoreVal");
    if (formVal) formVal.textContent = String(score);
  });

  socket.on("workout:start", (d) => {
    console.log("workout:start", d);
    const summaryBox = document.getElementById("summaryBox");
    if (summaryBox) summaryBox.style.display = "none";
  });

  socket.on("workout:stop", (d) => {
    console.log("workout:stop", d);
  });

  socket.on("workout:summary", (s) => {
    console.log("workout:summary", s);
    const summaryBox = document.getElementById("summaryBox");
    if (summaryBox) {
      summaryBox.style.display = "block";
      summaryBox.textContent =
        `Summary\n` +
        `Exercise: ${s.exerciseType}\n` +
        `Reps: ${s.reps}\n` +
        `Avg Score: ${s.avgScore}\n` +
        `Top Mistake: ${s.topMistake || "None"} (${s.topMistakeCount || 0})\n` +
        `Duration: ${s.durationSec}s`;
    }
  });
}

// --------- UI wiring ---------
document.getElementById("btnLogin")?.addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    setAuthStatus("Logging in...");
    await login(email, password);
    connectSocket();
  } catch (e) {
    setAuthStatus("Login failed: " + (e?.message || ""));
  }
});

document.getElementById("btnLogout")?.addEventListener("click", () => {
  clearToken();
  setAuthStatus("Logged out.");
  document.getElementById("controls").style.display = "none";
  document.getElementById("btnLogin").style.display = "inline-block";
  document.getElementById("btnLogout").style.display = "none";
  if (socket) {
    try { socket.disconnect(); } catch {}
    socket = null;
  }
});

// Start / Stop
document.getElementById("btnStart")?.addEventListener("click", () => {
  if (!socket?.connected) return setAuthStatus("Not connected.");
  const ex = document.getElementById("exerciseSelect")?.value || "pushup";
  socket.emit("workout:start", { exerciseType: ex });
});

document.getElementById("btnStop")?.addEventListener("click", () => {
  if (!socket?.connected) return setAuthStatus("Not connected.");
  socket.emit("workout:stop");
});

// Auto-connect if token already saved
if (getToken()) {
  setAuthStatus("Found saved token. Connecting...");
  connectSocket();
} else {
  setAuthStatus("Please login.");
}

/*
  // Legacy Code
  <script>
    // Live clock
    function tick() {
      document.getElementById('clockVal').textContent =
        new Date().toTimeString().slice(0,8);
    }
    setInterval(tick, 1000); tick();
  
    // Reps animation
    let reps = 12;
    setInterval(() => {
      reps = reps < 20 ? reps + 1 : 1;
      const el = document.getElementById('repCount');
      el.textContent = reps;
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = 'countUp 0.3s ease';
    }, 2800);
  
    // Heart rate fluctuation
    setInterval(() => {
      document.getElementById('bpmVal').textContent =
        85 + Math.floor(Math.random() * 12) - 5;
    }, 2000);
  
    // Timer counting up
    let secs = 24 * 60 + 33;
    setInterval(() => {
      secs++;
      const m = String(Math.floor(secs / 60)).padStart(2,'0');
      const s = String(secs % 60).padStart(2,'0');
      document.getElementById('timerVal').textContent = `${m}:${s}`;
    }, 1000);
  </script>
*/
