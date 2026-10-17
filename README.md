# OpsFlow – Operations Management Dashboard

OpsFlow is a web-based operations management application designed to help users manage and track tasks through different workflow stages. It provides a simple interface for creating tasks and updating their status.

## Features

- **Task Management:** Create and view tasks.
- **Status Tracking:** Update task status from Open to In Progress and Resolved.
- **REST API:** Communicate between the frontend and backend using API endpoints.
- **React Frontend:** Interactive user interface built with React and Vite.
- **Express Backend:** Backend API built using Node.js and Express.
- **SQLite Database:** Local database support for task data.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- SQLite

## Project Structure

```text
OpsFlow/
├── public/
├── server/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── src/
├── index.html
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed (optional, for cloning the repository)

### 1. Clone the repository

```bash
git clone https://github.com/sonampatel7307-eng/OpsFlow.git
cd OpsFlow
```

### 2. Install frontend dependencies

Run this command in the project root:

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Start the backend

From the `server` directory, run:

```bash
node index.js
```

Keep this terminal open while using the application.

### 5. Start the frontend

Open a second terminal, return to the project root, and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |

The backend runs locally on port `5000` in the current development setup.

## Future Improvements

- User authentication and role-based access
- Search, filtering, and sorting
- Task priorities and deadlines
- Dashboard analytics and reporting
- Cloud database and deployment

## Author

**Sonam Patel**

GitHub: [sonampatel7307-eng](https://github.com/sonampatel7307-eng)

## License

This project is available for learning and demonstration purposes. A formal open-source license has not yet been specified.
