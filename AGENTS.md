# AGENTS.md

## System & Project Overview
This repository defines the core ecosystem for the **SCU Smart Mirror Fitness System**. The architecture follows a centralized, stateless data flow where a backend API acts as the secure orchestrator connecting the AI hardware module, the interactive user dashboard, and the database.

---

## Workspace Structure & Component Context

### 1. Frontend Dashboard (`smart-mirror-system/smart-mirror-dashboard`)
Contains the user interface runtime and profile configuration engines.
- `/dashboard`: Main runtime view reflecting metrics and active stats.
- `/setup`: Onboarding flow for user configurations and schedules.

### 2. Backend Service (`smart-mirror-api`)
A Node.js & Express service implementing an MVC architecture pattern.
- **Database:** MongoDB via Mongoose object modeling.
- **Security:** State-free JWT bearer authorization.
- **Capabilities:** Direct orchestration of Gemini LLM tokens for workout generation, diet mapping, and real-time chat.

### 3. AI Service (`smart-mirror-ai`)
A specialized Python system performing real-time pose estimation and exercise counting.

---

## UI Theme & Visual Guidelines
When editing layout structures, stylesheets (`dashboard/css/style.css` or `setup/css/settings-style.css`), or creating dynamic elements, prioritize clear scannability and adhere strictly to the designs demonstrated in **image_4ce163.jpg** and **image_4cde9f.png**.

### 1. Light and Dark Theme Specifications
The system manages states using a corner-anchored theme toggle:
- **Dark Mode (Default - refer to image_4ce163.jpg):** Fully pure black (`#000000`) foundational canvas designed to optimize mirror pane reflections. Uses deep charcoal container elements, crisp white title texts, and vibrant cyan-to-teal glow accents (`#3ae7e1` to `#4ba3ff`) for active cards, track segments, and progress indicators.
- **Light Mode (Alternative - refer to image_4cde9f.png):** Light, frosted aesthetic built over a soft gradient shifting from light ice-blue (`#eef2f7`) to pure white card bases. Text shifts to dark slate charcoal to guarantee strong visibility.

### 2. Typography & Component States
- **Headers:** Wide, futuristic, geometric sans-serif styling to reinforce an advanced embedded-system feel.
- **Body & Options:** Clean, spacing-optimized sans-serif layouts. 
- **Cards:** Defined round edges (`border-radius: 16px` to `24px`). Selected fitness focus profiles (e.g., Strength, Cardio, or Yoga options) must execute a bright bounding ring and generate a floating checkmark badge in the top-right corner.

### 3. Api documentation
- [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---