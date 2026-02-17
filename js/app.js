// Live clock
function tick() {
  document.getElementById('clockVal').textContent =
    new Date().toTimeString().slice(0,8);
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
  const m = String(Math.floor(secs / 60)).padStart(2,'0');
  const s = String(secs % 60).padStart(2,'0');
  document.getElementById('timerVal').textContent = `${m}:${s}`;
}, 1000);

// ===== Socket.IO Realtime =====
const BACKEND_URL = "http://localhost:3000";

const TOKEN = "";
const USER_ID = ""; 
const socket = io(BACKEND_URL, {
  auth: { token: TOKEN },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("dashboard connected:", socket.id);
  socket.emit("room:join", { userId: USER_ID });
});

socket.on("connect_error", (err) => {
  console.log("connect_error:", err?.message);
});

socket.on("workout:progress", (p) => {
  // 1) reps
  const repsEl = document.getElementById("repCount");
  if (repsEl) {
    repsEl.textContent = String(p.reps ?? 0);
    repsEl.style.animation = 'none';
    repsEl.offsetHeight;
    repsEl.style.animation = 'countUp 0.3s ease';
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

  // 4) formScore in top left (optional)
  const formVal = document.getElementById("formScoreVal");
  if (formVal) formVal.textContent = String(score);
});

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
