# Node Todo API

Sample REST API built with **Express** and **Mongoose**, backed by **MongoDB Atlas**. It exposes full CRUD for todo items.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and a database user with read/write access
- Your client IP allowed in Atlas **Network Access** (or `0.0.0.0/0` for local testing only)

## Setup

1. Clone or copy this project, then install dependencies:

   ```bash
   npm install
   ```

2. Configure the environment. Copy the example file and edit the values:

   ```bash
   cp .env.example .env
   ```

   On Windows (Command Prompt):

   ```bat
   copy .env.example .env
   ```

3. Set `MONGODB_URI` in `.env` to your Atlas connection string. Include the database name in the path (for example `/todoapp`) and query options Atlas recommends, for example:

   ```text
   mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/todoapp?retryWrites=true&w=majority
   ```

4. Start the server:

   ```bash
   npm start
   ```

   For development with automatic restarts when files change (Node 18+):

   ```bash
   npm run dev
   ```

The server listens on `http://localhost:5000` by default when `PORT` is not set, or the port you set in `.env`.

## Environment variables

| Variable      | Description                                |
|---------------|--------------------------------------------|
| `MONGODB_URI` | Full MongoDB connection URI (**required**) |
| `PORT`        | HTTP port (optional, default **5000**)     |

## API

Base URL: `http://localhost:5000` (or your configured `PORT`).

### Root

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/`  | API name, short message, and links to main endpoints |

Example response:

```json
{
  "name": "node-todo-api",
  "message": "Todo REST API",
  "endpoints": {
    "health": "/health",
    "todos": "/api/todos"
  }
}
```

### Health

| Method | Path      | Description                    |
|--------|-----------|--------------------------------|
| `GET`  | `/health` | Returns `{ ok, mongo }` status |

### Todos

| Method   | Path             | Description                                       |
|----------|------------------|---------------------------------------------------|
| `GET`    | `/api/todos`     | List todos; optional `?completed=true` or `false` |
| `GET`    | `/api/todos/:id` | Get one todo by MongoDB `_id`                     |
| `POST`   | `/api/todos`     | Create a todo                                   |
| `PUT`    | `/api/todos/:id` | Update fields (partial)                         |
| `DELETE` | `/api/todos/:id` | Delete a todo (204 on success)                  |

**Create body (`POST /api/todos`):**

```json
{
  "title": "Buy milk",
  "description": "2% organic",
  "completed": false
}
```

`title` is required. `description` defaults to an empty string; `completed` defaults to `false`.

Successful list/get/create/update responses wrap the document in `{ "data": ... }`. Errors return `{ "error": "..." }` with an appropriate HTTP status.

### Example requests

Replace `5000` if your `PORT` differs.

```bash
# Root
curl -s http://localhost:5000/

# Health
curl -s http://localhost:5000/health

# List all todos
curl -s http://localhost:5000/api/todos

# Create
curl -s -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Express","description":"Build a small API"}'

# Update (replace ID)
curl -s -X PUT http://localhost:5000/api/todos/YOUR_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete
curl -s -X DELETE http://localhost:5000/api/todos/YOUR_ID_HERE
```

## Project structure

```text
├── server.js           # App entry: DB connect, middleware, routes
├── models/
│   └── Todo.js         # Mongoose schema
├── routes/
│   └── todos.js        # Todo CRUD handlers
├── .env.example        # Environment template (no secrets)
├── .gitignore
├── package.json
└── README.md
```

## Security

- Do not commit `.env` or real database credentials. This repository ignores `.env` via `.gitignore`.
- Rotate Atlas user passwords if they were ever exposed in chat, logs, or a public repository.

## License

MIT
