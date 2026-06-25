# 📡 API Documentation

### 1. Authentication

| Method | Endpoint             | Description                           |
| :----- | :------------------- | :------------------------------------ |
| `POST` | `/api/auth/register` | Register a new user account.          |
| `POST` | `/api/auth/login`    | Login and receive a JWT Bearer token. |

### 2. Sessions (Workouts)

| Method | Endpoint               | Description                                         |
| :----- | :--------------------- | :-------------------------------------------------- |
| `POST` | `/api/sessions`        | **(AI Mirror Only)** Upload completed workout data. |
| `GET`  | `/api/sessions/latest` | Retrieve the most recent workout session.           |

**Example: AI Mirror Upload Payload**

```json
{
  "exerciseType": "squat",
  "reps": 18,
  "formScore": 82,
  "mistakes": [{ "type": "knees_in", "count": 3 }],
  "ts": "2026-02-10T18:00:00Z"
}
```

### 3. Analytics

| Method | Endpoint                 | Description                                    |
| :----- | :----------------------- | :--------------------------------------------- |
| `GET`  | `/api/analytics/summary` | Get aggregated stats. Query param: `?range=7d` |

**Example: Analytics Response**

```json
{
  "ok": true,
  "range": "7d",
  "totalSessions": 1,
  "totalReps": 18,
  "avgFormScore": 82,
  "topMistakes": [{ "type": "knees_in", "count": 3 }]
}
```

### 4. User Profile

| Method | Endpoint  | Description                                        |
| :----- | :-------- | :------------------------------------------------- |
| `GET`  | `/api/me` | Retrieve the current authenticated user's profile. |

**Example: User Profile Response**

```json
{
  "ok": true,
  "user": {
    "_id": "64a7c93...",
    "email": "user@example.com",
    "profile": {
      "name": "John Doe",
      "age": 25,
      "heightCm": 180,
      "weightKg": 75,
      "goal": "Build Muscle",
      "informations": "Some informations about the user to personalize the ai recommendations"
    },
    "trainingSchedule": {
      //
    },
    "diet": {
      //
    },
    "createdAt": "2026-03-01T12:00:00.000Z",
    "updatedAt": "2026-03-05T12:00:00.000Z"
  }
}
```

### 5. Training Schedule

| Method   | Endpoint           | Description                                     |
| :------- | :----------------- | :---------------------------------------------- |
| `GET`    | `/api/me/schedule` | Retrieve the user's current training schedule.  |
| `POST`   | `/api/me/schedule` | Generate a new training schedule for the user.  |
| `PUT`    | `/api/me/schedule` | Update/regenerate the user's training schedule. |
| `DELETE` | `/api/me/schedule` | Delete the user's training schedule.            |

**Example: Schedule Response**

```json
{
  "ok": true,
  "schedule": {
    "summary_message": "Ready to crush your goals this week! Let's get started.",
    "schedule": [
      {
        "day": "Monday",
        "focus": "Upper Body Strength",
        "exercises": [
          {
            "name": "Push-ups",
            "sets": 3,
            "reps": "10-12",
            "rest_seconds": 60,
            "notes": "Keep your core tight and back straight."
          }
        ]
      }
    ]
  }
}
```

### 6. Diet

| Method   | Endpoint       | Description                        |
| :------- | :------------- | :--------------------------------- |
| `GET`    | `/api/me/diet` | Retrieve the user's current diet.  |
| `POST`   | `/api/me/diet` | Generate a diet for the user.      |
| `PUT`    | `/api/me/diet` | Update/regenerate the user's diet. |
| `DELETE` | `/api/me/diet` | Delete the user's diet.            |

**Example: diet Response**

```json
{
  "ok": true,
  "diet": {
    "summary_message": "A brief, motivating one-sentence nutritional tip or encouragement for the mirror UI.",
    "weekly_targets": {
      "calories": 2200,
      "protein_g": 150,
      "carbs_g": 200,
      "fat_g": 70
    },
    "plan": [
      {
        "day": "Monday",
        "meals": [
          {
            "type": "Breakfast",
            "name": "Oatmeal with Mixed Berries",
            "calories": 350,
            "notes": "Rich in fiber for sustained energy."
          },
          {
            "type": "Lunch",
            "name": "Grilled Chicken Salad",
            "calories": 500,
            "notes": "High protein to support muscle recovery."
          },
          {
            "type": "Dinner",
            "name": "Baked Salmon with Quinoa",
            "calories": 600,
            "notes": "Excellent source of Omega-3s."
          },
          {
            "type": "Snack",
            "name": "Greek Yogurt",
            "calories": 150,
            "notes": "Great for digestion."
          }
        ]
      }
    ]
  }
```

### 7. Chatbot (AI Coach)

#### REST Endpoints

| Method   | Endpoint                        | Description                                                                                                      |
| :------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/me/chatbot/chats`         | List all chat sessions for the authenticated user. Supports pagination with `page` and `limit` query params.     |
| `POST`   | `/api/me/chatbot/chats`         | Create a new chat session. Body: `{ "title": "string (optional)" }`                                              |
| `GET`    | `/api/me/chatbot/chats/:chatId` | Retrieve a chat session and its messages. Supports pagination for messages with `page` and `limit` query params. |
| `PUT`    | `/api/me/chatbot/chats/:chatId` | Rename a chat session. Body: `{ "title": "string (required)" }`                                                  |
| `PATCH`  | `/api/me/chatbot/chats/:chatId` | Rename a chat session (alias). Body: `{ "title": "string (required)" }`                                          |
| `DELETE` | `/api/me/chatbot/chats/:chatId` | Delete a chat session and all its messages.                                                                      |

#### Pagination

For `GET /api/me/chatbot/chats` and `GET /api/me/chatbot/chats/:chatId`, you can use:

- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 10 for chats, 5 for messages)

Responses include a `pagination` object:

```json
{
  "ok": true,
  "chats": [ ... ],
  "pagination": {
    "total": 23,
    "page": 1,
    "pages": 3
  }
}
```

or for messages:

```json
{
  "ok": true,
  "pagination": {
    "totalMessages": 12,
    "page": 1,
    "totalPages": 3
  },
  "chat": { ... },
  "chatMessages": [ ... ]
}
```

#### Error Responses

- Invalid `chatId` format: `{ "ok": false, "error": "Invalid chat ID format" }`
- Chat not found or unauthorized: `{ "ok": false, "error": "Chat not found or unauthorized" }`
- Missing or invalid `title` on update: `{ "ok": false, "error": "A valid text title is required" }`

#### Request Body Requirements

- `POST /api/me/chatbot/chats`: Optional `title` (string)
- `PUT`/`PATCH /api/me/chatbot/chats/:chatId`: Required `title` (non-empty string)

**Example: Create Chat Response**

```json
{
  "ok": true,
  "chatId": "68a1b2c3...",
  "title": "New Chat"
}
```

**Example: Get Chat Response**

```json
{
  "ok": true,
  "chat": {
    "_id": "68a1b2c3...",
    "title": "My Workout Questions",
    "createdAt": "2026-04-15T10:00:00.000Z",
    "updatedAt": "2026-04-15T10:05:00.000Z"
  },
  "chatMessages": [
    {
      "_id": "68a1b2c4...",
      "chatId": "68a1b2c3...",
      "message": "How many sets should I do for hypertrophy?",
      "role": "User",
      "createdAt": "2026-04-15T10:01:00.000Z"
    },
    {
      "_id": "68a1b2c5...",
      "chatId": "68a1b2c3...",
      "message": "For hypertrophy, aim for 3-4 sets of 8-12 reps...",
      "role": "Bot",
      "createdAt": "2026-04-15T10:01:05.000Z"
    }
  ]
}
```

#### Socket.IO Events (Real-time Chat)

Connect via Socket.IO with a JWT token in the `auth` handshake:

```js
const socket = io('http://localhost:3000', {
  auth: { token: '<JWT_TOKEN>' },
});
```

| Direction       | Event             | Payload                       | Description                                 |
| :-------------- | :---------------- | :---------------------------- | :------------------------------------------ |
| Client → Server | `chat:message`    | `{ chatId, message }`         | Send a message to the AI coach.             |
| Server → Client | `chat:typing`     | `{ isTyping: true/false }`    | Indicates the AI is processing a response.  |
| Server → Client | `chat:chunk`      | `{ text }`                    | A streamed chunk of the AI's response.      |
| Server → Client | `chat:reply:done` | `{ fullText }`                | Emitted when the full response is complete. |
| Server → Client | `chat:error`      | `{ reason }` or `{ message }` | Emitted on validation or server errors.     |

### 8. AI Pause/Resume (Camera Control)

| Method | Endpoint          | Description                                                    |
| :----- | :---------------- | :------------------------------------------------------------- |
| `POST` | `/api/ai/pause`   | Pause the AI service's camera feed (for face registration).    |
| `POST` | `/api/ai/resume`  | Resume the AI service's camera feed (after face registration). |

**Response:**
```json
{ "ok": true }
```

> Called automatically by the face registration flow in `setup/profile.html` and `setup/sign-in.html`.
