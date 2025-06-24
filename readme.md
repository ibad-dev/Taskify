# 🧠 Taskify – Task Management App

**Taskify** is a full-stack task management application that allows authenticated users to manage their personal tasks efficiently. Users can create, edit, delete, and filter tasks by their current status.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Axios, React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)  
- **Authentication:** JWT (HttpOnly cookies)

---

## ✅ Features

### 🔐 Authentication

- User registration & login using email and password
- JWT stored in **HttpOnly cookies** for secure authentication
- Auth state managed via **React Context API**
- Persistent session & logout functionality
- Protected routes (Dashboard access only when logged in)

### 📋 Task Management

- **CRUD Operations:**
  - ✅ Create tasks with title, description, and state (`Pending`, `Active`, `Finished`)
  - ✏️ Inline edit task name, description, or state
  - ❌ Delete any task
- Each task is user-specific and securely stored in MongoDB

### 🔎 Filtering

- Filter tasks by state:
  - `All`, `Pending`, `Active`, `Finished`

### 💅 UI/UX

- Responsive and clean UI using **Tailwind CSS**
- Toast notifications (via **React Toastify**) for feedback on every action
- Modal for creating new tasks

---
