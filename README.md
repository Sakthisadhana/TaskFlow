# TaskFlow — Full-Stack Task Management Web App

React.js + Node/Express + PostgreSQL task manager with login, categories, priorities, and status tracking.

## Stack
- **Frontend:** React.js, Bootstrap 5, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt password hashing

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running locally (or a free hosted instance like Neon/Supabase/Render)

## 1. Set up the database

Create a database, then run the schema:

```bash
# create the database (adjust user as needed)
createdb taskflow

# load the schema
psql -U postgres -d taskflow -f server/db/schema.sql
```

## 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set your real `DATABASE_URL` (username/password/host) and a `JWT_SECRET` (any long random string).

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check it's alive:
```
GET http://localhost:5000/api/health
```

## 3. Set up the frontend

Open a **second terminal**:

```bash
cd client
npm install
npm start
```

The app opens at `http://localhost:3000`.

## Using the app
1. Register a new account (name, email, password).
2. Add tasks with a title, priority, category, and due date.
3. Filter by status (pending / in progress / completed) and update status inline.
4. Delete tasks with the ✕ button.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/tasks` | List the logged-in user's tasks |
| GET | `/api/tasks/categories` | List task categories |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

All `/api/tasks` routes require an `Authorization: Bearer <token>` header — the frontend handles this automatically after login.

## Project Structure
```
taskflow/
├── server/
│   ├── db/            # schema.sql + PostgreSQL pool
│   ├── middleware/     # JWT auth middleware
│   ├── routes/         # auth.js, tasks.js
│   └── index.js        # Express entrypoint
└── client/
    └── src/
        ├── components/  # AuthForm, TaskForm, TaskList
        ├── api.js       # Axios instance with auth header
        └── App.js
```
