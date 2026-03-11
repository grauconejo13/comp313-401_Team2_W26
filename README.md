# ClearPath – Financial Tracker

## Tech Stack

* **Frontend:** React + TypeScript + Vite + Bootstrap
* **Backend:** Node.js + Express
* **Database:** SQL (TBD: MySQL / PostgreSQL)

---

## Project Structure

```
financial-tracker
│
├── client        # React + Vite frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── server        # Express backend API
│   ├── routes
│   ├── controllers
│   ├── models
│   └── package.json
│
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```
git clone <repository-url>
cd financial-tracker
```

---

### 2. Start the Frontend (React + Vite)

```
cd client
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

### 3. Start the Backend (Express API)

Open another terminal:

```
cd server
npm install
npm run dev
```

or

```
npm start
```

Backend typically runs at:

```
http://localhost:5000
```

---

## Environment Variables

Copy the example file and configure your environment variables.

```
cp .env.example .env
```

Add database connection details and API configuration as needed.

---

## Contributors

ClearPath Team
