# Smart Mirror Fitness Dashboard

A futuristic fitness dashboard designed for a Smart Mirror, featuring real-time health tracking, workout analytics, and interactive feedback.

## Features

-   **Live Health Tracking**: Real-time display of Heart Rate (BPM) and SpO2 levels.
-   **Workout Assistant**:
    -   Repetition counting.
    -   Exercise type recognition.
    -   Real-time form correction feedback.
-   **Dashboard Utilities**: Live clock, workout timer, and calorie tracking.
-   **Real-time Integration**: Connects to a backend server via Socket.IO for live data streaming.

## Local Development

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd smart-mirror-dashboard
    ```

2.  **Open the dashboard**:
    Simply open the `index.html` file in your web browser.

    By default, it attempts to connect to a backend at `http://localhost:3000`.

3.  **Configuration**:
    To change the backend URL for local testing, modify `js/env-config.js`:
    ```javascript
    window.env = {
      BACKEND_URL: "http://your-backend-url:port"
    };
    ```

## Docker Deployment

The application is containerized using Nginx to serve the static files. It supports runtime environment variable configuration.

### Build the Image

```bash
docker build -t smart-mirror-dashboard .
```

### Run the Container

You can configure the `BACKEND_URL` using an environment variable when running the container.

```bash
docker run -p 80:80 -e BACKEND_URL="http://your-production-backend.com" smart-mirror-dashboard
```

-   **`-p 80:80`**: Maps port 80 of the container to port 80 on your host.
-   **`-e BACKEND_URL="..."`**: Sets the URL of the backend server.

### Technical Details

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript.
-   **Real-time Communication**: Socket.IO Client.
-   **Container**: Alpine Linux + Nginx.
-   **Config Injection**: `docker-entrypoint.sh` generates `config.js` at runtime based on environment variables, allowing the same image to be deployed across different environments without rebuilding.
