/**
 * app.js — Dashboard main logic v4
 * - Username injected into navbar
 * - Calories live tracking
 * - Skeleton renderer
 * - Socket.IO workout events
 */

const BACKEND_URL = window.env?.BACKEND_URL || "http://localhost:3000";
const token       = localStorage.getItem("token");

if (!token) window.location.href = "../setup/sign-in.html";

// ════════════════════════════════════════
// USER PROFILE — load + inject into navbar
// ════════════════════════════════════════
async function loadUser() {
  try {
    const res  = await fetch(`${BACKEND_URL}/api/me`, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();

    if (data.ok && data.user) {
      const p    = data.user.profile || {};
      const name = p.name || p.firstName || data.user.email?.split("@")[0] || "Athlete";

      // Inject name into navbar (between live dot and right cluster)
      injectNavUsername(name);

      // Cache for navbar avatar
      localStorage.setItem("sm_user", JSON.stringify(data.user));
    }
  } catch (err) {
    console.error("Profile load:", err);
    injectNavUsername("Athlete");
  }
}

function injectNavUsername(name) {
  // Find the navbar live section and append name after the clock
  const clock = document.getElementById("smNavClock");
  if (!clock) return;

  // Avoid duplicate
  if (document.getElementById("smNavUsername")) return;

  const sep  = document.createElement("span");
  sep.style.cssText = "width:1px;height:16px;background:rgba(255,255,255,0.12);margin:0 4px;display:inline-block;vertical-align:middle;";

  const span = document.createElement("span");
  span.id    = "smNavUsername";
  span.className = "sm-navbar-username";
  span.textContent = name;

  clock.insertAdjacentElement("afterend", sep);
  sep.insertAdjacentElement("afterend", span);
}

loadUser();

// ════════════════════════════════════════
// LIVE METRICS SIM (until real sensor connected)
// ════════════════════════════════════════
// setInterval(() => {
//   const el = document.getElementById("bpmVal");
//   if (el) el.textContent = 76 + Math.floor(Math.random() * 22);
// }, 2200);

// ════════════════════════════════════════
// WORKOUT TIMER
// ════════════════════════════════════════
let workoutSecs   = 0;
let timerInterval = null;

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    workoutSecs++;
    const m = String(Math.floor(workoutSecs / 60)).padStart(2, "0");
    const s = String(workoutSecs % 60).padStart(2, "0");
    const el = document.getElementById("timerVal");
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  workoutSecs = 0;
  const el = document.getElementById("timerVal");
  if (el) el.textContent = "00:00";
}

// ════════════════════════════════════════
// CALORIES — estimated from reps + exercise type
// Replace with real data from backend when available
// ════════════════════════════════════════
const CALS_PER_REP = {
  squat:          0.62,
  pushup:         0.50,
  situp:          0.38,
  bicep_curl:     0.28,
  lateral_raise:  0.30,
  overhead_press: 0.40,
  leg_raise:      0.45,
  knee_raise:     0.35,
  knee_press:     0.42,
  crunch:         0.32
};
const DAILY_GOAL_KCAL = 300;

function updateCalories(exerciseId, reps) {
  const rate = CALS_PER_REP[exerciseId] || 0.40;
  const kcal = Math.round(rate * reps);
  const valEl = document.getElementById("calsVal");
  const barEl = document.getElementById("calsBarFill");
  if (valEl) valEl.textContent = kcal;
  if (barEl) barEl.style.width = Math.min((kcal / DAILY_GOAL_KCAL) * 100, 100) + "%";
}

// ════════════════════════════════════════
// SOCKET.IO
// ════════════════════════════════════════
let socket        = null;
let workoutActive = false;
let currentEx     = "pushup";

function connectSocket() {
  if (socket) { try { socket.disconnect(); } catch {} }

  socket = io(BACKEND_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    showWorkoutBar();
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket error:", err?.message);
    toast.error("Could not connect to tracking server.", "Connection Error");
    showWorkoutBar(); // still show UI in preview mode
  });

  // ── Progress ──
  socket.on("workout:progress", (p) => {
    // Reps counter
    const repsEl = document.getElementById("repCount");
    if (repsEl) {
      repsEl.textContent = String(p.reps ?? 0);
      repsEl.style.animation = "none";
      void repsEl.offsetHeight;
      repsEl.style.animation = "countUp 0.3s ease";
    }

    // Calories
    updateCalories(currentEx, p.reps ?? 0);

    // Real skeleton from backend
    const canvas = document.getElementById("skeletonCanvas");
    if (canvas && p.skeleton) drawSkeleton(canvas, p.skeleton);

    // Form feedback
    const score  = Number(p.formScore ?? 0);
    const isGood = score >= 75;

    const statusEl = document.getElementById("formStatus");
    const tipEl    = document.getElementById("formTip");
    const iconEl   = document.getElementById("feedbackIcon");

    if (statusEl) statusEl.textContent = isGood ? "Form OK ✓" : "Fix Form ⚠";
    if (iconEl) {
      iconEl.classList.toggle("good", isGood);
      iconEl.classList.toggle("bad",  !isGood);
      // Update checkmark vs warning icon
      iconEl.innerHTML = isGood
        ? `<svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 12 12" fill="none"><path d="M6 2v4M6 9.5v.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg> `;
    }

    const TIPS = {
      knees_in:   "Keep knees pushed out.",
      back_round: "Keep your back straight.",
      shallow:    "Go lower — aim for ~90°.",
      elbows_out: "Keep elbows tucked in.",
    };
    const mistake = p.mistakes?.[0]?.type;
    if (tipEl) tipEl.textContent = TIPS[mistake] || "Looking good — keep it steady!";
  });

  socket.on("workout:start", () => {
    document.body.style.cursor = "none";
    const box = document.getElementById("summaryBox");
    if (box) box.style.display = "none";
    // Hide static skeleton while real tracking is on
    const staticSkel = document.getElementById("skeletonPanel");
    if (staticSkel) staticSkel.style.opacity = "0";
    startTimer();
  });

  socket.on("workout:stop", () => {
    // Clear canvas
    const canvas = document.getElementById("skeletonCanvas");
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // Restore static skeleton
    const staticSkel = document.getElementById("skeletonPanel");
    if (staticSkel) staticSkel.style.opacity = "";

    setTimeout(() => {
      document.body.style.cursor            = "default";
      document.documentElement.style.cursor = "default";
    }, 100);

    stopTimer();
    setWorkoutState(false);
  });

socket.on("workout:summary", (s) => {
    const box = document.getElementById("summaryBox");
    if (box) {
      box.style.display = "block";
      box.textContent =
        `── Workout Summary ──\n` +
        `Exercise  : ${s.exerciseType}\n` +
        `Reps      : ${s.reps}\n` +
        `Avg Score : ${s.avgScore}\n` +
        `Mistake   : ${s.topMistake || "None"} (${s.topMistakeCount || 0}×)\n` +
        `Duration  : ${s.durationSec}s`;
    }
    toast.success(`Done! ${s.reps} reps · ${s.durationSec}s`, "Workout Complete");

    // ── 👏 Applause Animation & Celebration Scene ──
    const demoWrap = document.getElementById("exDemoWrap");
    const prevBtn  = document.getElementById("prevDemoBtn");
    const nextBtn  = document.getElementById("nextDemoBtn");

    if (demoWrap) {
      // 1. Clear current workout media player (SVG + image) to prep for celebration video
      demoWrap.querySelectorAll(".ex-demo-svg, img, video").forEach(el => el.remove());

      // 2. Add clapping video (make sure to place the clapping.mp4 file in the correct assets folder)
      const v = document.createElement("video");
      v.src = "/smart-mirror-dashboard/assets/clapping.mp4";
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      demoWrap.appendChild(v);

      // 3. Hide navigation arrows during celebration
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
    }
  });
}

function showWorkoutBar() {
  const bar = document.getElementById("workoutBar");
  if (bar) bar.style.display = "flex";
  
  // Init exercise demo
  const sel = document.getElementById("exerciseSelect");
  if (sel) {
    // update exercise demo based on current selection (this will trigger the change event listener we set up in DOMContentLoaded to handle the rest of the UI updates)
    if (window.updateExerciseDemo) window.updateExerciseDemo(sel.value);
    
    // ── New binding for smart arrows ──
    // When the workout bar is shown, we want to ensure the arrows are correctly displayed based on the current exercise selection. This is crucial for user navigation through exercise demos.
    if (typeof currentMirrorMediaIndex !== 'undefined') currentMirrorMediaIndex = 0;
    if (typeof checkArrowsVisibility === 'function') checkArrowsVisibility();
  }
}

// ════════════════════════════════════════
// START / STOP TOGGLE
// ════════════════════════════════════════
function setWorkoutState(active) {
  workoutActive = active;
  const btn   = document.getElementById("btnStartStop");
  const icon  = document.getElementById("toggleIcon");
  const label = document.getElementById("toggleLabel");
  if (!btn) return;

  if (active) {
    btn.classList.add("running");
    if (icon)  icon.textContent  = "■";
    if (label) label.textContent = "Stop";
  } else {
    btn.classList.remove("running");
    if (icon)  icon.textContent  = "▶";
    if (label) label.textContent = "Start";
  }
}

function toggleWorkout() {
  if (!socket?.connected) {
    toast.error("Not connected to tracking server.", "Not Connected");
    return;
  }

  if (!workoutActive) {
    currentEx = document.getElementById("exerciseSelect")?.value || "pushup";
    socket.emit("workout:start", { exerciseType: currentEx });
    setWorkoutState(true);
    resetTimer();
    startTimer();
    toast.info(`${currentEx.replace(/_/g, " ")} tracking started`, "Workout");
  } else {
    socket.emit("workout:stop");
    setWorkoutState(false);
    stopTimer();
    toast.warning("Workout stopped.", "Stopped");
  }
}

// ── Auto-connect ──
connectSocket();

// ── Monitor workout selection changes to update arrows dynamically ──
document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("exerciseSelect");
  if (sel) {
    sel.addEventListener("change", () => {
      // Reset media index and update arrows visibility whenever the exercise selection changes, ensuring the user always starts at the first demo media for the newly selected exercise.
      if (typeof currentMirrorMediaIndex !== 'undefined') currentMirrorMediaIndex = 0;
      setTimeout(() => {
        if (typeof checkArrowsVisibility === 'function') checkArrowsVisibility();
      }, 150); // Small delay to ensure the default media for the new exercise is loaded first
    });
  }
});

// ════════════════════════════════════════
// REAL-TIME SKELETON RENDERER
// Draws COCO keypoints sent from backend via socket
// Format: p.skeleton = [[x,y], [x,y], ...] — 17 points
// ════════════════════════════════════════
const COCO_CONNECTIONS = [
  [5,6],  [5,7],  [7,9],  [6,8],  [8,10],
  [5,11], [6,12], [11,12],
  [11,13],[13,15],[12,14],[14,16],
];

// Joint colors by body region
const JOINT_COLORS = {
  arms:  "#3ae7e1",
  legs:  "#6ba3ff",
  torso: "#5fffc3",
};

function getJointColor(idx) {
  if (idx >= 5  && idx <= 10) return JOINT_COLORS.arms;
  if (idx >= 11 && idx <= 16) return JOINT_COLORS.legs;
  return JOINT_COLORS.torso;
}

function drawSkeleton(canvas, pts) {
  // Match canvas resolution to CSS size
  const rect    = canvas.getBoundingClientRect();
  canvas.width  = rect.width  || 640;
  canvas.height = rect.height || 480;

  const ctx    = canvas.getContext("2d");
  const scaleX = canvas.width  / 640;
  const scaleY = canvas.height / 480;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw limb connections
  COCO_CONNECTIONS.forEach(([a, b]) => {
    const p1 = pts[a], p2 = pts[b];
    if (!p1 || !p2) return;
    if ((p1[0] === 0 && p1[1] === 0) || (p2[0] === 0 && p2[1] === 0)) return;

    ctx.beginPath();
    ctx.moveTo(p1[0] * scaleX, p1[1] * scaleY);
    ctx.lineTo(p2[0] * scaleX, p2[1] * scaleY);
    ctx.strokeStyle = "rgba(58,231,225,0.55)";
    ctx.lineWidth   = 2.5;
    ctx.stroke();
  });

  // Draw joints with glow
  pts.forEach((p, idx) => {
    if (!p || (p[0] === 0 && p[1] === 0)) return;
    const color = getJointColor(idx);
    ctx.beginPath();
    ctx.arc(p[0] * scaleX, p[1] * scaleY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle   = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = 10;
    ctx.fill();
    ctx.shadowBlur  = 0;
  });
}

// ==========================================
// ADVANCED DYNAMIC MEDIA PLAYER MODULE 
// ==========================================

// 1. Track playlist (manual duration removed completely)
const playlist = [
  { 
    name: "القرآن الكريم - سورة النجم", 
    artist: "الشيخ محمود خليل الحصري",
    type: "Podcast / Audio", 
    url: "/smart-mirror-dashboard/assets/audio/Najm.mp3" 
  },
  { 
    name: "أذكار الصباح", 
    artist: "مشاري بن راشد العفاسي",
    type: "Audio", 
    url: "/smart-mirror-dashboard/assets/audio/azkarSabah.mp3"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Define audio object
let audioPlayer = new Audio();

// 2. Gather UI elements
const trackNameEl       = document.getElementById("currentTrackName");
const trackArtistEl     = document.getElementById("currentTrackArtist");
const trackTypeEl       = document.getElementById("currentTrackType");
const playBtn           = document.getElementById("mediaPlayBtn");
const playIcon          = document.getElementById("playIcon");
const prevBtn           = document.getElementById("mediaPrevBtn");
const nextBtn           = document.getElementById("mediaNextBtn");
const progressContainer = document.querySelector(".media-progress-container");
const progressBar       = document.querySelector(".media-progress-bar"); // Progress bar element for seeking
const progressFill      = document.querySelector(".media-progress-fill");

// Helper function to format seconds as time (00:00)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 3. Update track UI details function
function updatePlayerUI() {
  const currentTrack = playlist[currentTrackIndex];
  
  if (trackNameEl) trackNameEl.textContent = currentTrack.name;
  if (trackArtistEl) trackArtistEl.textContent = currentTrack.artist;
  if (trackTypeEl) trackTypeEl.textContent = currentTrack.type;
  
  audioPlayer.pause();
  audioPlayer.src = currentTrack.url;
  audioPlayer.load(); 
  
  // Reset time display until the actual file duration loads
  const timeLabels = document.querySelectorAll(".media-time");
  if (timeLabels.length >= 2) {
    timeLabels[0].textContent = "0:00";
    timeLabels[1].textContent = "--:--"; // Will update automatically once metadata is loaded
  }
  if (progressFill) progressFill.style.width = "0%";
}

// ==========================================
// 4. All the magic here: auto compute duration from the file
// ==========================================
audioPlayer.addEventListener("loadedmetadata", () => {
  const timeLabels = document.querySelectorAll(".media-time");
  if (timeLabels.length >= 2) {
    // Read the file's actual duration and format it as time
    timeLabels[1].textContent = formatTime(audioPlayer.duration);
  }
});

// Update the progress bar and current time display during playback
audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    
    const timeLabels = document.querySelectorAll(".media-time");
    if (timeLabels.length > 0) {
      timeLabels[0].textContent = formatTime(audioPlayer.currentTime);
    }
  }
});

// When the track ends automatically, move to the next one
audioPlayer.addEventListener("ended", () => {
  if (nextBtn) nextBtn.click();
});

// ==========================================
// 5. Seeking feature on the progress bar
// ==========================================
if (progressBar) {
  // Change mouse cursor to pointer to indicate interactive seek bar
  progressBar.style.cursor = "pointer";
  
  progressBar.addEventListener("click", (e) => {
    if (audioPlayer.duration) {
      // Compute the total width of the seek bar in pixels
      const barWidth = progressBar.clientWidth;
      // Find click position relative to the bar
      const clickX = e.offsetX;
      // Convert click position into a playback percentage
      const clickPercent = clickX / barWidth;
      
      // Seek audio to the selected time
      audioPlayer.currentTime = clickPercent * audioPlayer.duration;
    }
  });
}

// 6. Play/Pause button control
if (playBtn) {
  playBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      if (playIcon) playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
      playBtn.style.borderColor = "#3ae7e1"; 
      
      audioPlayer.play().catch(err => {
        console.warn("Autoplay blocked:", err);
        isPlaying = false;
        if (playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
        playBtn.style.borderColor = "rgba(58, 231, 225, 0.4)";
      });
    } else {
      if (playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
      playBtn.style.borderColor = "rgba(58, 231, 225, 0.4)";
      audioPlayer.pause();
    }
  });
}

// 7. Next and previous buttons
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) < playlist.length ? currentTrackIndex + 1 : 0;
    updatePlayerUI();
    if (isPlaying) { isPlaying = false; playBtn.click(); }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1) >= 0 ? currentTrackIndex - 1 : playlist.length - 1;
    updatePlayerUI();
    if (isPlaying) { isPlaying = false; playBtn.click(); }
  });
}

// Automatically load the first track when the mirror screen opens
updatePlayerUI();