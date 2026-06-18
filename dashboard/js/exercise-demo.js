/**
 * exercise-demo.js v2
 * Animated stick-figure exercise demos
 * Full-body muscle map SVG with targeted muscles highlighted + pulse animation
 */

// ════════════════════════════════════════
// EXERCISE METADATA
// ════════════════════════════════════════
const EXERCISES = {
  greeting: {
    label: "Welcome Athlete!",
    primary:   [], // مفيش عضلات للترحيب
    secondary: [],
    media: [
      { src: "/smart-mirror-dashboard/assets/greeting.mp4", type: "video" } // فيديو الـ 3D اللي بيسلم
    ]
  },
  pushup: {
    label: "Push-up",
    primary:   ["chest", "triceps"],
    secondary: ["shoulders", "core"],
    media: [
      { src: "/smart-mirror-dashboard/assets/push-up.gif", type: "gif" },
      { src: "/smart-mirror-dashboard/assets/push-up.mp4", type: "video" }
    ]
  },
  squat: {
    label: "Squat",
    primary:   ["quads", "glutes"],
    secondary: ["hamstrings", "core"],
    media: [
      { src: "/smart-mirror-dashboard/assets/squat.gif", type: "gif" }
    ]
  },
  bicep_curl: {
    label: "Bicep Curl",
    primary:   ["biceps"],
    secondary: ["forearms", "shoulders"],
    media: [
      { src: "/smart-mirror-dashboard/assets/bicep-curl.gif", type: "gif" },
      { src: "/smart-mirror-dashboard/assets/bicep-curl2.gif", type: "gif" },
      { src: "/smart-mirror-dashboard/assets/bicep-curl.mp4", type: "video" }
    ]
  },
  situp: {
    label: "Sit-up",
    primary:   ["abs", "core"],
    secondary: ["hip_flexors"],
    media: [
      { src: "/smart-mirror-dashboard/assets/situp.mp4", type: "video" },
      { src: "/smart-mirror-dashboard/assets/situp.gif", type: "gif" }
    ]
  },
  lateral_raise: {
    label: "Lateral Raise",
    primary:   ["shoulders"],
    secondary: ["core", "forearms"],
    media: [
      { src: "/smart-mirror-dashboard/assets/lateral-raise.gif", type: "gif" }
    ]
  },
  overhead_press: {
    label: "Overhead Press",
    primary:   ["shoulders", "triceps"],
    secondary: ["chest", "core"],
    media: [
      { src: "/smart-mirror-dashboard/assets/overhead-press.gif", type: "gif" }
    ]
  },
  leg_raise: {
    label: "Leg Raise",
    primary:   ["core", "abs"],
    secondary: ["hip_flexors", "quads"],
    media: [
      { src: "/smart-mirror-dashboard/assets/leg-raise.gif", type: "gif" }
    ]
  },
  knee_raise: {
    label: "Knee Raise",
    primary:   ["core", "hip_flexors"],
    secondary: ["abs", "quads"],
    media: [
      { src: "/smart-mirror-dashboard/assets/knee-raise.gif", type: "gif" },
      { src: "/smart-mirror-dashboard/assets/knee-raise2.gif", type: "gif" }
    ]
  },
  knee_press: {
    label: "Knee Press",
    primary:   ["quads", "glutes"],
    secondary: ["hamstrings", "core"],
    media: [
      { src: "/smart-mirror-dashboard/assets/high-kness.gif", type: "gif" }
    ]
  },
  crunch: {
    label: "Crunch",
    primary:   ["abs"],
    secondary: ["core"],
    media: [
      { src: "/smart-mirror-dashboard/assets/crunch.gif", type: "gif" },
      { src: "/smart-mirror-dashboard/assets/cross-crunch.gif", type: "gif" }
    ]
  }
};
// ════════════════════════════════════════
// ANIMATED STICK FIGURES
// ════════════════════════════════════════
// ════════════════════════════════════════
// PROFESSIONAL UNIFIED CYBER-STICK FIGURES (10 EXERCISES)
// Symmetrical, glowing neon-cyan lines optimized for Smart Mirror UI
// ════════════════════════════════════════
const STICK_FIGURES = {

  pushup: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sfd{fill:rgba(58,231,225,.9)}
      @keyframes pu{0%,100%{transform:translateY(0)}50%{transform:translateY(22px)}}
      .pu-g{animation:pu 1.8s ease-in-out infinite;transform-origin:50% 60%}
    </style>
    <line class="sf" x1="20" y1="110" x2="180" y2="110" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <g class="pu-g">
      <circle class="sfd" cx="100" cy="25" r="11"/>
      <line class="sf" x1="100" y1="36" x2="100" y2="73"/>
      <line class="sf" x1="100" y1="48" x2="62"  y2="73"/>
      <line class="sf" x1="100" y1="48" x2="138" y2="73"/>
      <line class="sf" x1="62"  y1="73" x2="52"  y2="95"/>
      <line class="sf" x1="138" y1="73" x2="148" y2="95"/>
      <line class="sf" x1="100" y1="73" x2="82"  y2="110"/>
      <line class="sf" x1="100" y1="73" x2="118" y2="110"/>
    </g>
  </svg>`,

  squat: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf2{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf2d{fill:rgba(58,231,225,.9)}
      @keyframes sq{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(26px) scaleY(.80)}}
      .sq-g{animation:sq 2s ease-in-out infinite;transform-origin:50% 70%}
    </style>
    <line class="sf2" x1="40" y1="140" x2="160" y2="140" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <g class="sq-g">
      <circle class="sf2d" cx="100" cy="20" r="11"/>
      <line class="sf2" x1="100" y1="31" x2="100" y2="70"/>
      <line class="sf2" x1="100" y1="45" x2="66"  y2="62"/>
      <line class="sf2" x1="100" y1="45" x2="134" y2="62"/>
      <line class="sf2" x1="100" y1="70" x2="74"  y2="112"/>
      <line class="sf2" x1="100" y1="70" x2="126" y2="112"/>
      <line class="sf2" x1="74"  y1="112" x2="68" y2="140"/>
      <line class="sf2" x1="126" y1="112" x2="132" y2="140"/>
    </g>
  </svg>`,

  bicep_curl: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf3{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf3d{fill:rgba(58,231,225,.9)}
      @keyframes curlL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-65deg)}}
      @keyframes curlR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(65deg)}}
      .arm-L{animation:curlL 1.6s ease-in-out infinite;transform-origin:75px 48px}
      .arm-R{animation:curlR 1.6s ease-in-out infinite;transform-origin:125px 48px}
    </style>
    <circle class="sf3d" cx="100" cy="22" r="11"/>
    <line class="sf3" x1="100" y1="33" x2="100" y2="78"/>
    <g class="arm-L">
      <line class="sf3" x1="100" y1="48" x2="75"  y2="52"/>
      <line class="sf3" x1="75"  y1="52" x2="60"  y2="28"/>
    </g>
    <g class="arm-R">
      <line class="sf3" x1="100" y1="48" x2="125" y2="52"/>
      <line class="sf3" x1="125" y1="52" x2="140" y2="28"/>
    </g>
    <line class="sf3" x1="100" y1="78" x2="82"  y2="120"/>
    <line class="sf3" x1="100" y1="78" x2="118" y2="120"/>
    <line class="sf3" x1="82"  y1="120" x2="82"  y2="150"/>
    <line class="sf3" x1="118" y1="120" x2="118" y2="150"/>
  </svg>`,

  situp: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf4{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf4d{fill:rgba(58,231,225,.9)}
      @keyframes su{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-48deg)}}
      .su-body{animation:su 2s ease-in-out infinite;transform-origin:110px 115px}
    </style>
    <line class="sf4" x1="30"  y1="135" x2="170" y2="135" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <line class="sf4" x1="110" y1="135" x2="80"  y2="105"/>
    <line class="sf4" x1="110" y1="135" x2="140" y2="105"/>
    <line class="sf4" x1="80"  y1="105" x2="70"  y2="135"/>
    <line class="sf4" x1="140" y1="105" x2="150" y2="135"/>
    <g class="su-body">
      <circle class="sf4d" cx="110" cy="45" r="11"/>
      <line class="sf4" x1="110" y1="56"  x2="110" y2="115"/>
      <line class="sf4" x1="110" y1="70"  x2="78"  y2="60"/>
      <line class="sf4" x1="110" y1="70"  x2="142" y2="60"/>
    </g>
  </svg>`,

  lateral_raise: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf5{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf5d{fill:rgba(58,231,225,.9)}
      @keyframes lat{0%,100%{transform:rotate(0deg)}50%{transform:rotate(80deg)}}
      .l-arm-L{animation:lat 1.8s ease-in-out infinite;transform-origin:100px 48px}
      @keyframes latR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-80deg)}}
      .l-arm-R{animation:latR 1.8s ease-in-out infinite;transform-origin:100px 48px}
    </style>
    <circle class="sf5d" cx="100" cy="22" r="11"/>
    <line class="sf5" x1="100" y1="33" x2="100" y2="82"/>
    <g class="l-arm-L">
      <line class="sf5" x1="100" y1="48" x2="65" y2="75"/>
    </g>
    <g class="l-arm-R">
      <line class="sf5" x1="100" y1="48" x2="135" y2="75"/>
    </g>
    <line class="sf5" x1="100" y1="82" x2="82"  y2="122"/>
    <line class="sf5" x1="100" y1="82" x2="118" y2="122"/>
    <line class="sf5" x1="82"  y1="122" x2="82"  y2="152"/>
    <line class="sf5" x1="118" y1="122" x2="118" y2="152"/>
  </svg>`,

  overhead_press: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf6{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf6d{fill:rgba(58,231,225,.9)}
      @keyframes ohp{0%,100%{transform:translateY(0)}50%{transform:translateY(-25px)}}
      .ohp-hands{animation:ohp 1.7s ease-in-out infinite;transform-origin:50% 50%}
    </style>
    <circle class="sf6d" cx="100" cy="25" r="11"/>
    <line class="sf6" x1="100" y1="36" x2="100" y2="85"/>
    <g class="ohp-hands">
      <line class="sf6" x1="100" y1="48" x2="72" y2="48"/>
      <line class="sf6" x1="72" y1="48" x2="72" y2="15"/>
      <line class="sf6" x1="100" y1="48" x2="128" y2="48"/>
      <line class="sf6" x1="128" y1="48" x2="128" y2="15"/>
      <line class="sf6" x1="55" y1="15" x2="145" y2="15" stroke="#ffd250" stroke-width="4.5"/>
    </g>
    <line class="sf6" x1="100" y1="85" x2="82"  y2="125"/>
    <line class="sf6" x1="100" y1="85" x2="118" y2="125"/>
    <line class="sf6" x1="82"  y1="125" x2="82"  y2="155"/>
    <line class="sf6" x1="118" y1="125" x2="118" y2="155"/>
  </svg>`,

  leg_raise: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf7{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf7d{fill:rgba(58,231,225,.9)}
      @keyframes lr{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-55deg)}}
      .lr-legs{animation:lr 2.2s ease-in-out infinite;transform-origin:110px 115px}
    </style>
    <line class="sf7" x1="20"  y1="120" x2="180" y2="120" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <circle class="sf7d" cx="50" cy="110" r="11"/>
    <line class="sf7" x1="50" y1="110"  x2="110" y2="115"/>
    <line class="sf7" x1="70" y1="112"  x2="80"  y2="90"/>
    <g class="lr-legs">
      <line class="sf7" x1="110" y1="115" x2="170" y2="115"/>
    </g>
  </svg>`,

  knee_raise: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf8{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf8d{fill:rgba(58,231,225,.9)}
      @keyframes kr{0%,100%{transform:rotate(0deg)}50%{transform:rotate(65deg)}}
      .kr-thigh{animation:kr 1.8s ease-in-out infinite;transform-origin:100px 82px}
    </style>
    <circle class="sf8d" cx="100" cy="22" r="11"/>
    <line class="sf8" x1="100" y1="33" x2="100" y2="82"/>
    <line class="sf8" x1="100" y1="48" x2="70"  y2="65"/>
    <line class="sf8" x1="100" y1="48" x2="130" y2="65"/>
    <line class="sf8" x1="100" y1="82" x2="78"  y2="125"/>
    <line class="sf8" x1="78"  y1="125" x2="78" y2="155"/>
    <g class="kr-thigh">
      <line class="sf8" x1="100" y1="82" x2="125" y2="105"/>
      <line class="sf8" x1="125" y1="105" x2="125" y2="140"/>
    </g>
  </svg>`,

  knee_press: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf9{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf9d{fill:rgba(58,231,225,.9)}
      @keyframes kp{0%,100%{transform:translateX(0)}50%{transform:translateX(-22px)}}
      .kp-leg{animation:kp 1.6s ease-in-out infinite;transform-origin:50% 50%}
    </style>
    <line class="sf9" x1="20"  y1="125" x2="180" y2="125" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <circle class="sf9d" cx="140" cy="55" r="11"/>
    <line class="sf9" x1="140" y1="66" x2="120" y2="110"/>
    <line class="sf9" x1="125" y1="80" x2="95"  y2="85"/>
    <g class="kp-leg">
      <line class="sf9" x1="120" y1="110" x2="65"  y2="110"/>
      <line class="sf9" x1="65"  y1="110" x2="40"  y2="85"/>
    </g>
  </svg>`,

  crunch: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sf10{stroke:rgba(58,231,225,.9);stroke-width:4;stroke-linecap:round;fill:none;filter:drop-shadow(0 0 4px rgba(58,231,225,0.4))}
      .sf10d{fill:rgba(58,231,225,.9)}
      @keyframes cr{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-22deg)}}
      .cr-torso{animation:cr 1.5s ease-in-out infinite;transform-origin:110px 115px}
    </style>
    <line class="sf10" x1="20"  y1="120" x2="180" y2="120" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
    <line class="sf10" x1="110" y1="120" x2="75"  y2="90"/>
    <line class="sf10" x1="75"  y1="90"  x2="45"  y2="120"/>
    <g class="cr-torso">
      <circle class="sf10d" cx="110" cy="55" r="11"/>
      <line class="sf10" x1="110" y1="66"  x2="110" y2="120"/>
      <line class="sf10" x1="110" y1="78"  x2="135" y2="60"/>
    </g>
  </svg>`
};
// ════════════════════════════════════════
// FULL-BODY MUSCLE MAP SVG
// Larger, more detailed human silhouette
// Targeted muscles glow + pulse in red/yellow
// ════════════════════════════════════════
function buildMuscleSvg(primary, secondary) {

  function fillColor(m) {
    if (primary.includes(m))   return "#ff4d6a";
    if (secondary.includes(m)) return "#ffd250";
    return "rgba(255,255,255,0.35)";
  }
  function opacity(m) {
    if (primary.includes(m))   return "1";
    if (secondary.includes(m)) return "0.85";
    return "0.7";
  }
  function pulse(m) {
    if (!primary.includes(m) && !secondary.includes(m)) return "";
    const dur = primary.includes(m) ? "1.3s" : "1.8s";
    return `<animate attributeName="opacity" values="1;0.45;1" dur="${dur}" repeatCount="indefinite"/>`;
  }
  function glow(m) {
    if (primary.includes(m))   return 'filter="url(#glowRed)"';
    if (secondary.includes(m)) return 'filter="url(#glowYellow)"';
    return "";
  }

  const outlineC = "rgba(255,255,255,0.75)";

  return `<svg viewBox="0 0 100 230" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glowRed" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowYellow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- HEAD -->
  <ellipse cx="50" cy="13" rx="10" ry="11"
    fill="rgba(255,255,255,0.10)" stroke="${outlineC}" stroke-width=".7"/>

  <!-- NECK -->
  <rect x="45.5" y="23" width="9" height="7" rx="2"
    fill="rgba(255,255,255,0.08)" stroke="${outlineC}" stroke-width=".5"/>

  <!-- SHOULDERS -->
  <ellipse cx="24" cy="38" rx="9" ry="6" ${glow("shoulders")}
    fill="${fillColor("shoulders")}" opacity="${opacity("shoulders")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("shoulders")}
  </ellipse>
  <ellipse cx="76" cy="38" rx="9" ry="6" ${glow("shoulders")}
    fill="${fillColor("shoulders")}" opacity="${opacity("shoulders")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("shoulders")}
  </ellipse>

  <!-- CHEST -->
  <path d="M33 32 Q50 28 67 32 L66 52 Q50 57 34 52 Z" ${glow("chest")}
    fill="${fillColor("chest")}" opacity="${opacity("chest")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("chest")}
  </path>

  <!-- ABS -->
  <rect x="39" y="53" width="8.5" height="7"  rx="2" ${glow("abs")}
    fill="${fillColor("abs")}" opacity="${opacity("abs")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("abs")}
  </rect>
  <rect x="52" y="53" width="8.5" height="7"  rx="2" ${glow("abs")}
    fill="${fillColor("abs")}" opacity="${opacity("abs")}" stroke="${outlineC}" stroke-width=".5"/>

  <!-- CORE (lower abs) -->
  <rect x="39" y="62" width="8.5" height="7"  rx="2" ${glow("core")}
    fill="${fillColor("core")}" opacity="${opacity("core")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("core")}
  </rect>
  <rect x="52" y="62" width="8.5" height="7"  rx="2" ${glow("core")}
    fill="${fillColor("core")}" opacity="${opacity("core")}" stroke="${outlineC}" stroke-width=".5"/>
  <rect x="39" y="71" width="8.5" height="6"  rx="2" ${glow("core")}
    fill="${fillColor("core")}" opacity="${opacity("core")}" stroke="${outlineC}" stroke-width=".5"/>
  <rect x="52" y="71" width="8.5" height="6"  rx="2" ${glow("core")}
    fill="${fillColor("core")}" opacity="${opacity("core")}" stroke="${outlineC}" stroke-width=".5"/>

  <!-- BICEPS -->
  <ellipse cx="18" cy="52" rx="6"  ry="12" ${glow("biceps")}
    fill="${fillColor("biceps")}" opacity="${opacity("biceps")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("biceps")}
  </ellipse>
  <ellipse cx="82" cy="52" rx="6"  ry="12" ${glow("biceps")}
    fill="${fillColor("biceps")}" opacity="${opacity("biceps")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("biceps")}
  </ellipse>

  <!-- TRICEPS -->
  <ellipse cx="13" cy="54" rx="4"  ry="10" ${glow("triceps")}
    fill="${fillColor("triceps")}" opacity="${opacity("triceps")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("triceps")}
  </ellipse>
  <ellipse cx="87" cy="54" rx="4"  ry="10" ${glow("triceps")}
    fill="${fillColor("triceps")}" opacity="${opacity("triceps")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("triceps")}
  </ellipse>

  <!-- FOREARMS -->
  <ellipse cx="12" cy="76" rx="4.5" ry="11" ${glow("forearms")}
    fill="${fillColor("forearms")}" opacity="${opacity("forearms")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("forearms")}
  </ellipse>
  <ellipse cx="88" cy="76" rx="4.5" ry="11" ${glow("forearms")}
    fill="${fillColor("forearms")}" opacity="${opacity("forearms")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("forearms")}
  </ellipse>

  <!-- HIPS -->
  <path d="M33 78 Q50 74 67 78 L68 96 Q50 100 32 96 Z"
    fill="rgba(255,255,255,0.08)" stroke="${outlineC}" stroke-width=".5"/>

  <!-- GLUTES -->
  <ellipse cx="39" cy="98" rx="10" ry="8" ${glow("glutes")}
    fill="${fillColor("glutes")}" opacity="${opacity("glutes")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("glutes")}
  </ellipse>
  <ellipse cx="61" cy="98" rx="10" ry="8" ${glow("glutes")}
    fill="${fillColor("glutes")}" opacity="${opacity("glutes")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("glutes")}
  </ellipse>

  <!-- QUADS -->
  <ellipse cx="37" cy="127" rx="10" ry="23" ${glow("quads")}
    fill="${fillColor("quads")}" opacity="${opacity("quads")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("quads")}
  </ellipse>
  <ellipse cx="63" cy="127" rx="10" ry="23" ${glow("quads")}
    fill="${fillColor("quads")}" opacity="${opacity("quads")}" stroke="${outlineC}" stroke-width=".6">
    ${pulse("quads")}
  </ellipse>

  <!-- HAMSTRINGS (slightly behind quads) -->
  <ellipse cx="35" cy="130" rx="7.5" ry="20" ${glow("hamstrings")}
    fill="${fillColor("hamstrings")}" opacity="${opacity("hamstrings")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("hamstrings")}
  </ellipse>
  <ellipse cx="65" cy="130" rx="7.5" ry="20" ${glow("hamstrings")}
    fill="${fillColor("hamstrings")}" opacity="${opacity("hamstrings")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("hamstrings")}
  </ellipse>

  <!-- HIP FLEXORS -->
  <ellipse cx="42" cy="104" rx="6" ry="8" ${glow("hip_flexors")}
    fill="${fillColor("hip_flexors")}" opacity="${opacity("hip_flexors")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("hip_flexors")}
  </ellipse>
  <ellipse cx="58" cy="104" rx="6" ry="8" ${glow("hip_flexors")}
    fill="${fillColor("hip_flexors")}" opacity="${opacity("hip_flexors")}" stroke="${outlineC}" stroke-width=".5">
    ${pulse("hip_flexors")}
  </ellipse>

  <!-- CALVES -->
  <ellipse cx="36" cy="168" rx="7" ry="14"
    fill="rgba(255,255,255,0.08)" stroke="${outlineC}" stroke-width=".5"/>
  <ellipse cx="64" cy="168" rx="7" ry="14"
    fill="rgba(255,255,255,0.08)" stroke="${outlineC}" stroke-width=".5"/>

  <!-- FEET -->
  <ellipse cx="34" cy="188" rx="9"  ry="4"
    fill="rgba(255,255,255,0.07)" stroke="${outlineC}" stroke-width=".5"/>
  <ellipse cx="66" cy="188" rx="9"  ry="4"
    fill="rgba(255,255,255,0.07)" stroke="${outlineC}" stroke-width=".5"/>
</svg>`;
}


// ════════════════════════════════════════
// RENDER EXERCISE DEMO + MUSCLE MAP
// ════════════════════════════════════════
let currentMediaIndex = 0;
function updateExerciseDemo(exerciseId) {
  const ex          = EXERCISES[exerciseId];
  const demoWrap    = document.getElementById("exDemoWrap");
  const placeholder = document.getElementById("exDemoPlaceholder");
  const muscleDiv   = document.getElementById("muscleMapSvg");
  const legendDiv   = document.getElementById("muscleLegend");

  if (!ex || !demoWrap) return;

  currentMediaIndex = 0;

  const mediaCount = ex.media?.length || 0;
  const prevBtn = document.getElementById("prevDemoBtn");
  const nextBtn = document.getElementById("nextDemoBtn");

  if (prevBtn && nextBtn) {
    const showArrows = mediaCount > 1;

    prevBtn.style.display = showArrows ? "block" : "none";
    nextBtn.style.display = showArrows ? "block" : "none";
  }

  // ── Exercise animation ──
  if (placeholder) placeholder.style.display = "none";
  demoWrap.querySelectorAll(".ex-demo-svg, img, video").forEach(el => el.remove());

  const media = ex.media?.[currentMediaIndex];

  if (media) {
    if (media.type === "video") {
      const v = document.createElement("video");
      v.src = media.src;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      demoWrap.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = media.src;
      img.alt = ex.label;
      demoWrap.appendChild(img);
    }
  }
  // ── Muscle map ──
  if (muscleDiv) {
    muscleDiv.innerHTML = buildMuscleSvg(ex.primary, ex.secondary);
  }

  // ── Legend ──
  if (legendDiv) {
    const items = [
      ...ex.primary.map(m => ({ m, cls: "primary" })),
      ...ex.secondary.map(m => ({ m, cls: "secondary" })),
    ];
    legendDiv.innerHTML = items.map(({ m, cls }) => `
      <div class="muscle-legend-item">
        <div class="muscle-legend-dot ${cls}"></div>
        ${m.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
      </div>`).join("");
  }
}

function toggleDemoView(direction) {
  const exerciseId =
    document.getElementById("exerciseSelect")?.value;

  const ex = EXERCISES[exerciseId];

  if (!ex?.media || ex.media.length <= 1) return;

  currentMediaIndex =
    (currentMediaIndex + direction + ex.media.length) %
    ex.media.length;

  const demoWrap = document.getElementById("exDemoWrap");

  demoWrap.querySelectorAll("img, video").forEach(el => el.remove());

  const media = ex.media[currentMediaIndex];

  if (media.type === "video") {
    const v = document.createElement("video");
    v.src = media.src;
    v.autoplay = true;
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    demoWrap.appendChild(v);
  } else {
    const img = document.createElement("img");
    img.src = media.src;
    demoWrap.appendChild(img);
  }
}

// Called when dropdown changes
function onExerciseChange(val) {
  updateExerciseDemo(val);
}

// Init on page load
document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("exerciseSelect");
  if (sel) updateExerciseDemo(sel.value);
});