/**
 * Smart Mirror — Shared Navbar Controller v2
 * - Removed duplicate AI Coach link (only right-side button)
 * - Removed Dashboard link (brand is the home link)
 * - Live dot + clock inside navbar (dashboard only)
 * - Avatar loads from API / localStorage
 */
(function () {
  const BACKEND_URL = window.env?.BACKEND_URL || "http://localhost:3000";

  function buildNavbar(el) {
    const isDashboard = el.dataset.context === "dashboard";
    const setupRoot   = el.dataset.setupRoot || "../setup/";

    el.innerHTML = `
      <!-- Brand (clicking goes home) -->
      <a class="sm-navbar-brand" href="${isDashboard ? "index.html" : setupRoot + "../dashboard/index.html"}">
        <div class="sm-navbar-brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
        </div>
        <span class="sm-navbar-brand-name">SmartMirror</span>
      </a>

      <!-- Live dot + clock (dashboard only, auto-hidden on setup via CSS) -->
      <div class="sm-navbar-live">
        <div class="sm-navbar-dot"></div>
        <span class="sm-navbar-live-label">Live</span>
        <span class="sm-navbar-clock" id="smNavClock"></span>
      </div>

      <div class="sm-navbar-spacer"></div>

      <!-- Right cluster -->
      <div class="sm-navbar-right">
      <a class="sm-btn-ai" href="${setupRoot}../dashboard/chat.html">
        AI Coach
      </a>

        <!-- Avatar -->
        <a class="sm-avatar-btn" id="smNavAvatar"
           href="${isDashboard ? setupRoot + "profile.html" : "profile.html"}"
           title="My Profile">
          <span id="smNavAvatarLetter">?</span>
        </a>

        <!-- Logout -->
        <button class="sm-btn-logout" id="smNavLogout">Logout</button>

        <!-- Hamburger -->
        <button class="sm-navbar-hamburger" id="smNavHamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    // Mobile drawer
    const drawer = document.createElement("div");
    drawer.className = "sm-navbar-drawer";
    drawer.id = "smNavDrawer";
    drawer.innerHTML = isDashboard ? `
      <a class="sm-drawer-link" href="chat.html">AI Coach</a>
      <a class="sm-drawer-link" href="${setupRoot}profile.html">My Profile</a>
      <button class="sm-btn-logout" id="smDrawerLogout" style="margin-top:8px;width:100%;text-align:center;border-radius:8px;padding:11px;">Logout</button>
    ` : `
      <a class="sm-drawer-link" href="../dashboard/index.html">Dashboard</a>
      <a class="sm-drawer-link" href="profile.html">My Profile</a>
      <button class="sm-btn-logout" id="smDrawerLogout" style="margin-top:8px;width:100%;text-align:center;border-radius:8px;padding:11px;">Logout</button>
    `;
    el.insertAdjacentElement("afterend", drawer);

    // Hamburger
    document.getElementById("smNavHamburger")?.addEventListener("click", () => {
      drawer.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!el.contains(e.target) && !drawer.contains(e.target))
        drawer.classList.remove("open");
    });

    // Logout
    function doLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("sm_user");
      localStorage.removeItem("sm_avatar");
      window.location.href = isDashboard ? setupRoot + "sign-in.html" : "sign-in.html";
    }
    document.getElementById("smNavLogout")?.addEventListener("click", doLogout);
    document.getElementById("smDrawerLogout")?.addEventListener("click", doLogout);

    const clockEl = document.getElementById("smNavClock");

    function tick() {
      if (clockEl) {
        clockEl.textContent = new Date().toTimeString().slice(0, 5);
      }
    }

    setInterval(tick, 1000);
    tick();

    loadAvatar();
  }

  async function loadAvatar() {
    const avatarEl = document.getElementById("smNavAvatar");
    const letterEl = document.getElementById("smNavAvatarLetter");
    if (!avatarEl || !letterEl) return;

    // Use cached data first for instant render
    const cached = localStorage.getItem("sm_user");
    if (cached) {
      try { applyAvatar(avatarEl, letterEl, JSON.parse(cached)); } catch {}
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res  = await fetch(`${BACKEND_URL}/api/me`, {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (data.ok && data.user) {
        localStorage.setItem("sm_user", JSON.stringify(data.user));
        applyAvatar(avatarEl, letterEl, data.user);
      }
    } catch {}
  }

  function applyAvatar(avatarEl, letterEl, user) {
    const profile = user?.profile || {};
    const name    = profile.name || profile.firstName || user?.email || "?";
    const letter  = name.trim().charAt(0).toUpperCase();
    const avatar  = profile.avatar || localStorage.getItem("sm_avatar");

    if (avatar && avatar.startsWith("data:")) {
      letterEl.style.display = "none";
      let img = avatarEl.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        avatarEl.appendChild(img);
      }
      img.src = avatar;
      img.alt = name;
    } else {
      letterEl.textContent   = letter;
      letterEl.style.display = "";
      const img = avatarEl.querySelector("img");
      if (img) img.remove();
    }
  }

  function init() {
    document.querySelectorAll(".sm-navbar").forEach(buildNavbar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.smNavbar = { refresh: loadAvatar };
})();