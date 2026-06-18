/**
 * Toast Notification System
 * Usage: toast.success("Done!") | toast.error("Oops") | toast.info("Hey") | toast.warning("Watch out")
 * Works on both setup pages (light/dark theme) and dashboard (HUD dark theme)
 */

(function () {
  // Inject styles once
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      #toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 280px;
        max-width: 380px;
        padding: 14px 18px;
        border-radius: 14px;
        font-family: 'DM Sans', 'Rajdhani', sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.45;
        backdrop-filter: blur(20px);
        border: 1px solid;
        pointer-events: all;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        animation: toastIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        position: relative;
        overflow: hidden;
      }
      .toast::before {
        content: '';
        position: absolute;
        bottom: 0; left: 0;
        height: 3px;
        width: 100%;
        background: currentColor;
        opacity: 0.35;
        transform-origin: left;
        animation: toastTimer linear forwards;
      }
      .toast-icon {
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .toast-body { flex: 1; }
      .toast-title {
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.3px;
        margin-bottom: 2px;
      }
      .toast-msg { opacity: 0.82; }
      .toast-close {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        opacity: 0.5;
        color: inherit;
        padding: 0;
        line-height: 1;
        flex-shrink: 0;
        transition: opacity 0.2s;
      }
      .toast-close:hover { opacity: 1; }

      /* Type styles */
      .toast-success {
        background: rgba(95, 255, 195, 0.12);
        border-color: rgba(95, 255, 195, 0.35);
        color: #5fffc3;
      }
      .toast-error {
        background: rgba(255, 77, 106, 0.13);
        border-color: rgba(255, 77, 106, 0.38);
        color: #ff4d6a;
      }
      .toast-info {
        background: rgba(107, 163, 255, 0.12);
        border-color: rgba(107, 163, 255, 0.35);
        color: #6ba3ff;
      }
      .toast-warning {
        background: rgba(255, 210, 80, 0.12);
        border-color: rgba(255, 210, 80, 0.35);
        color: #ffd250;
      }
      .toast.removing {
        animation: toastOut 0.3s ease forwards;
      }

      @keyframes toastIn {
        from { opacity: 0; transform: translateX(40px) scale(0.92); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0) scale(1); max-height: 120px; margin-bottom: 0; }
        to   { opacity: 0; transform: translateX(40px) scale(0.88); max-height: 0; margin-bottom: -10px; padding: 0; }
      }
      @keyframes toastTimer {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }

      @media (max-width: 480px) {
        #toast-container { right: 12px; left: 12px; }
        .toast { min-width: unset; }
      }
    `;
    document.head.appendChild(style);
  }

  // Create container if it doesn't exist
  function getContainer() {
    let el = document.getElementById("toast-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-container";
      document.body.appendChild(el);
    }
    return el;
  }

  const ICONS = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  const TITLES = {
    success: "Success",
    error: "Error",
    info: "Info",
    warning: "Warning",
  };

  /**
   * Show a toast notification
   * @param {string} type - 'success' | 'error' | 'info' | 'warning'
   * @param {string} message - Main message text
   * @param {string} [title] - Optional custom title
   * @param {number} [duration=4000] - Auto-dismiss time in ms
   */
  function show(type, message, title, duration = 4000) {
    const container = getContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Apply timer animation duration
    toast.style.setProperty("--toast-dur", duration + "ms");
    toast.style.cssText += `--toast-dur: ${duration}ms`;
    // Set the ::before animation duration via a style override
    const timerStyle = document.createElement("style");
    timerStyle.textContent = `.toast::before { animation-duration: ${duration}ms; }`;
    // We use inline approach instead
    toast.innerHTML = `
      <span class="toast-icon">${ICONS[type] || "•"}</span>
      <div class="toast-body">
        <div class="toast-title">${title || TITLES[type]}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">✕</button>
    `;

    // Set the progress bar animation duration dynamically
    toast.style.setProperty("--dur", duration + "ms");
    const beforeCSS = document.createElement("style");
    beforeCSS.textContent = `#${toast.id || ""}::before { animation-duration: ${duration}ms !important; }`;

    // Manual progress bar via pseudo-element override — inject per toast
    const uid = "t" + Date.now() + Math.random().toString(36).slice(2, 6);
    toast.id = uid;
    const prog = document.createElement("style");
    prog.textContent = `#${uid}::before { animation-duration: ${duration}ms !important; animation-name: toastTimer !important; }`;
    document.head.appendChild(prog);

    container.appendChild(toast);

    // Auto-dismiss
    const timer = setTimeout(() => remove(toast, prog), duration);

    // Click to dismiss
    toast.querySelector(".toast-close").addEventListener("click", (e) => {
      e.stopPropagation();
      clearTimeout(timer);
      remove(toast, prog);
    });

    toast.addEventListener("click", () => {
      clearTimeout(timer);
      remove(toast, prog);
    });
  }

  function remove(toast, progStyle) {
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => {
      toast.remove();
      progStyle?.remove();
    }, { once: true });
  }

  // Public API
  window.toast = {
    success: (msg, title, dur) => show("success", msg, title, dur),
    error:   (msg, title, dur) => show("error",   msg, title, dur),
    info:    (msg, title, dur) => show("info",    msg, title, dur),
    warning: (msg, title, dur) => show("warning", msg, title, dur),
    show,
  };
})();