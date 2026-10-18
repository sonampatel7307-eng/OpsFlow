
# OpsFlow — Operations Under Pressure

OpsFlow is a web-based operations management dashboard designed to help teams organize tasks, prioritize work, assign responsibilities, and track progress through different workflow stages.

Developed for the Newtonite Software Engineering Challenge.

## Features

- **Task Management:** Create and view tasks.
- **Status Tracking:** Update tasks from Open to In Progress and Resolved.
- **Task Details:** Support task titles, projects, priorities, and assignees.
- **REST API:** Connect the frontend to the backend using API endpoints.
- **Input Validation:** Validate incoming data and return appropriate HTTP status codes.
- **SQLite Database:** Store task information locally.
- **Automated Testing:** Test backend API behavior using Node.js test runner and Supertest.
- **Responsive Dashboard:** Interactive frontend built with React and Vite.

## Technology Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite with better-sqlite3
- **Testing:** Node.js test runner and Supertest
- **Code Quality:** ESLint

## Project Structure

```text
OpsFlow/
├── server/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── test/
│       └── api.test.js
├── src/
├── public/
├── index.html
├── eslint.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed (optional, for cloning)

### 1. Clone the repository

```bash
git clone https://github.com/sonampatel7307-eng/OpsFlow.git
cd OpsFlow
```

### 2. Install frontend dependencies

Run from the project root:

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Start the backend

From the `server` directory:

```bash
npm start
```

Keep the backend terminal open.

### 5. Start the frontend

Open a second terminal and navigate to the project root:

```bash
cd "C:\Users\sonam\OneDrive\Desktop\Hello\operations-under-pressure"
npm run dev
```

Open the local URL displayed by Vite in your browser.

The backend uses port `5000` in the current development setup.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task status |

## Run Backend Tests

From the `server` directory:

```bash
npm test
```

The automated tests cover the health endpoint, task creation, input validation, invalid task IDs, missing tasks, and status updates.

## Code Quality Checks

Run these commands from the project root:

```bash
npm run lint
npm run build
```

## Engineering Considerations

- Input validation and appropriate HTTP responses
- Parameterized SQL queries
- Automated API tests
- Lightweight local SQLite storage
- Separation of frontend and backend responsibilities

## Future Improvements

- User authentication and role-based access control
- Task search, filtering, and sorting
- Deadlines and additional task-management features
- Dashboard analytics and reporting
- Cloud database and production deployment

## Author

**Sonam Patel**

GitHub: https://github.com/sonampatel7307-eng

## License

This project is available for learning and demonstration purposes. A formal open-source license has not yet been specified.
