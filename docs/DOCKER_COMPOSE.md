# 🚀 How to Run the Smart Mirror App (Using Docker)

Don't worry if you've never used Docker before — this guide will walk you through everything step by step!

---

## Step 1: Install Docker Desktop

Docker Desktop is the program that lets you run the app on your computer without installing any backend tools manually.

👉 **[Download Docker Desktop here](https://www.docker.com/products/docker-desktop/)**

Pick the version for your operating system (Windows, Mac, or Linux) and follow the installation steps.

---

## Step 2: Start Docker Desktop

After installing, **open Docker Desktop** and wait until you see it say **"Engine running"** (usually a green icon in the bottom-left of the app).

> 💡 **Why does this matter?**
> Think of Docker Desktop as an engine that needs to be turned on before you can drive. On Windows especially, this engine must be running in the background for the backend and database to work. If Docker Desktop is closed, nothing will start.

You don't need to do anything else inside Docker Desktop — just keep it open.

---

## Step 3: Set Up Your Environment Variables

### What are environment variables?

Every application — not just Docker apps — needs some settings to work: things like which port to use, which database to connect to, or secret keys for security. Instead of writing these directly in the code, we put them in special files called **environment variable files** (`.env` files).

Think of them like a configuration panel you fill in once before running the app.

### Our app has two `.env` files you need to create:

---

### 📄 `.env-api` — Settings for the Backend (API)

Create a file named `.env-api` in the same folder as `docker-compose.yaml`, and fill it like this:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/smart-mirror-mongo
JWT_SECRET=some-secret
JWT_EXPIRES=7d
GEMINI_API_KEY=your-gemini-secret-key
```

| Variable | What it does | Do you need to change it? |
|---|---|---|
| `PORT` | The port the backend runs on | ❌ Leave it as `3000` |
| `MONGO_URI` | Address of the database | ❌ Leave it as-is |
| `JWT_SECRET` | A secret password used to secure user logins | ✅ Change to any random string, e.g. `mysupersecret123` |
| `JWT_EXPIRES` | How long a user stays logged in | ❌ `7d` means 7 days, leave it |
| `GEMINI_API_KEY` | Your Google Gemini AI key | ✅ Replace with your actual Gemini API key |

---

### 📄 `.env-ai` — Settings for the AI Service

Create a file named `.env-ai` in the same folder, and fill it like this:

```env
BACKEND_URL=http://smart-mirror-api:3000
AI_JWT=PUT_USER_LOGIN_TOKEN_HERE
EXERCISE_TYPE=pushup
CAMERA_INDEX=0
MODEL_MODE=lightweight
SEND_EVERY_MS=250
SHOW_CAMERA=0
EXPORT_JSON=0
```

| Variable | What it does | Do you need to change it? |
|---|---|---|
| `BACKEND_URL` | Address of the backend the AI talks to | ❌ Leave it as-is |
| `AI_JWT` | A login token for the AI to authenticate with the backend | ✅ Replace with a real token after logging in via the API |
| `EXERCISE_TYPE` | Which exercise to track (e.g. `pushup`, `squat`, `situp`) | ✅ Change to whatever you're testing |
| `CAMERA_INDEX` | Which camera to use (`0` = default webcam) | ❌ Leave as `0` unless you have multiple cameras |
| `MODEL_MODE` | AI model speed/accuracy (`lightweight`, `balanced`, `performance`) | ✅ Change based on your machine's power |
| `SEND_EVERY_MS` | How often the AI sends updates (in milliseconds) | ❌ Leave as `250` |
| `SHOW_CAMERA` | Show a camera debug window? (`1` = yes, `0` = no) | ✅ Set to `1` if you want to see the camera while testing |
| `EXPORT_JSON` | Export a live JSON file for debugging? (`1` = yes, `0` = no) | ❌ Leave as `0` |

---

## Step 4: Run the Application

Open a terminal (Command Prompt, PowerShell, or Terminal) and **navigate to the folder that contains `docker-compose.yaml`**.

For example, if the project is on your Desktop:
```bash
cd Desktop/smart-mirror
```

> 💡 Make sure you're in the **same folder** as `docker-compose.yaml` — otherwise the command below won't find the file.

Then run:
```bash
docker compose up
```

That's it! Docker will download the required images and start the app. The first time may take a minute or two. You should start seeing logs appear in your terminal — that means everything is working.

To stop the app, press `Ctrl + C` in the terminal.

---

## Useful Docker Compose Commands

Here are a few handy commands you might need during development:

| Command | What it does |
|---|---|
| `docker compose up` | Start all services (shows logs in terminal) |
| `docker compose up -d` | Start all services in the background (no logs shown) |
| `docker compose down` | Stop and remove all running containers |
| `docker compose logs` | View logs from all services |
| `docker compose logs smart-mirror-api` | View logs from just the API service |
| `docker compose ps` | See which services are running |
| `docker compose restart` | Restart all services |

> 💡 **Tip:** If you make changes to your `.env` files, run `docker compose down` then `docker compose up` again to apply them.