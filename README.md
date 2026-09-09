# TaskFlow-Task-management-Application

# TaskFlow-Task-management-Application
# TaskFlow - Full-Stack Kanban Task Management Application

TaskFlow is a modern, responsive, Trello-like task management application built with a **Next.js** frontend and a **Node.js/Express/MongoDB** backend. It features real-time drag-and-drop state management, JWT-based authentication, and granular Role-Based Access Control (RBAC) across tasks.

---

## Features

- **Interactive Kanban Board:** Drag-and-drop task movement across `To Do`, `Doing`, and `Done` status columns with instant state updates.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Assign tasks to any user across the system, update task details, and delete any task.
  - **User:** Manage self-assignments, create tasks, and delete personal tasks.
- **Secure Authentication:** JWT-based user authentication with salted password hashing using `bcrypt`.
- **Responsive UI:** Styled with Tailwind CSS, supporting crisp interaction feedback and toast notifications (`sonner`).
- **Audit Timestamps:** Automatic creation and modification tracking (`createdAt`, `updatedAt`) for every task card.

---

## Tech Stack

### **Frontend**
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **State & HTTP:** React Context API, Axios
- **Drag & Drop:** `@hello-pangea/dnd`
- **Notifications:** `sonner`

### **Backend**
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud) with Mongoose ORM
- **Security & Auth:** JSON Web Tokens (JWT), `bcryptjs`, CORS middleware

---

## Application Screenshots

![image alt]([image_url](https://github.com/SachinDilanka/TaskFlow-Task-management-Application/blob/main/Screenshot%202026-09-09%20233520.png?raw=true))


![image alt]([image_url](https://github.com/SachinDilanka/TaskFlow-Task-management-Application/blob/main/Screenshot%202026-09-09%20233709.png?raw=true))

![image alt]([image_url](https://github.com/SachinDilanka/TaskFlow-Task-management-Application/blob/main/Screenshot%202026-09-09%20233731.png?raw=true))

![image alt]([image_url](https://github.com/SachinDilanka/TaskFlow-Task-management-Application/blob/main/Screenshot%202026-09-09%20233848.png?raw=true))

![image alt]([image_url](https://github.com/SachinDilanka/TaskFlow-Task-management-Application/blob/main/Screenshot%202026-09-09%20234205.png?raw=true))
---

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Authentication & Task controllers
│   │   ├── middleware/      # JWT auth & RBAC middleware
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # Express API endpoints
│   │   └── utils/           # Database seeder script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router pages (Login, Register, Dashboard)
    │   ├── components/      # UI Components (Navbar, TaskCard, TaskModal)
    │   ├── context/         # AuthContext provider
    │   └── lib/             # Axios API client setup
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
