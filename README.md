# Course Management System (CMS)

A full-stack Course Management System built with **React + TypeScript** on the frontend and **Node.js + Express** on the backend, featuring role-based access control (RBAC) for Admins, Instructors, Leads, and Students.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
  - [Backend .env](#backend-env)
  - [Frontend .env](#frontend-env)
- [API Reference](#api-reference)
- [Roles and Permissions](#roles-and-permissions)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

The CMS platform enables instructors to create and manage courses, leads to manage their student teams and track progress, students to enroll and view course content, and admins to oversee the entire platform including withdrawals, users, and course access.

**Live Demo:**
- Frontend: [https://cms4.vercel.app](https://cms4.vercel.app)
- Backend API: [https://course-management-system-1-a96d.onrender.com](https://course-management-system-1-a96d.onrender.com)

---

## Features

### Authentication
- JWT-based authentication with HTTP-only cookies
- Google OAuth via Firebase
- Role selection on first login (Student, Instructor, Lead)
- Protected routes with role-based guards

### Admin
- View and manage all instructors, students, and leads
- Approve or revoke course access
- Browse all platform orders
- Review and manage instructor withdrawal requests
- Full course overview

### Instructor
- Create, edit, and delete courses
- Upload course content (videos via Cloudinary, thumbnails via Supabase)
- View enrolled student progress
- Track earnings per course
- Submit and track withdrawal requests

### Lead
- Browse and purchase courses via PayPal
- Manage assigned team members (students)
- View team progress across enrolled courses
- Update profile with picture

### Student
- Browse and purchase courses via PayPal
- Track personal course progress
- View enrolled course content with video player
- Update profile

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Radix UI + shadcn/ui | Accessible component library |
| Framer Motion | Animations |
| Firebase | Google OAuth |
| Supabase | Profile image storage |
| Cloudinary | Course video storage |
| React Player | In-browser video playback |
| PayPal JS SDK | Payment processing |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie management |
| PayPal REST SDK | Payment integration |
| dotenv | Environment configuration |
| CORS | Cross-origin requests |

---

## Project Structure

```
cms-2/
├── Backend/
│   ├── index.js                  # Express app entry point
│   ├── package.json
│   ├── Controllers/
│   │   ├── admin/                # Admin-specific business logic
│   │   ├── auth/                 # Auth (login, register, token verify)
│   │   ├── Common/               # Shared course logic
│   │   ├── instructor/           # Instructor course and profile logic
│   │   ├── Lead/                 # Lead courses, profile, team, messages
│   │   ├── Orders/               # Order processing logic
│   │   ├── Roles/                # Role assignment logic
│   │   └── student/              # Student course and profile logic
│   ├── Models/
│   │   ├── Common/OrderModel.js
│   │   ├── Instructor/           # Course and withdrawal models
│   │   ├── Lead/PurchaseCourses.js
│   │   ├── RBAC/                 # User role models
│   │   └── Student/PurchaseCourses.js
│   ├── routes/                   # Express route definitions (mirrors Controllers)
│   └── Utils/
│       ├── DB/db.js              # MongoDB connection
│       └── lib/paypal.js         # PayPal SDK config
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── App.tsx               # Root router and auth check
        ├── components/           # Reusable layout and UI components
        │   ├── Admin/
        │   ├── Auth/
        │   ├── Instructor/
        │   ├── Lead/
        │   ├── Student/
        │   ├── Payments/
        │   ├── Private/          # Route guards
        │   ├── store/            # Redux store and slices
        │   └── ui/               # shadcn/ui primitives
        ├── Pages/                # Route-level page components
        │   ├── Admin/
        │   ├── Auth/
        │   ├── Instructor/
        │   ├── Lead/
        │   ├── Student/
        │   └── Verify/
        ├── hooks/                # Custom React hooks
        └── lib/                  # Utilities, types, API helpers
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (or local MongoDB instance)
- **PayPal Developer** account (sandbox credentials)
- **Firebase** project with Google OAuth enabled
- **Supabase** project with a storage bucket
- **Cloudinary** account

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/RayuduBharani/Course-Management-System.git
cd cms-2
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory (see [Environment Variables](#environment-variables)), then start the server:

```bash
# Development (with nodemon)
npx nodemon index.js

# Production
npm start
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (see [Environment Variables](#environment-variables)), then start the dev server:

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend `.env`

```env
PORT=8000
SECRET_KEY=your_secret_key
JWT_KEY=your_jwt_key
JWT_SECRET=your_jwt_secret

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/CMS?retryWrites=true&w=majority

CLIENT_URL=http://localhost:5173

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET_KEY=your_paypal_secret_key
```

### Frontend `.env`

```env
COOKIE_NAME=your_cookie_name
VITE_API_URL=http://localhost:8000

# Firebase (Google OAuth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_KEY=your_firebase_auth_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
```

> **Never commit `.env` files to version control.** Both files are listed in `.gitignore`.

---

## API Reference

All protected routes require a valid JWT cookie. Role-restricted routes additionally require the matching user role.

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | — | Register a new user |
| POST | `/api/auth/login` | No | — | Login and receive JWT cookie |
| GET | `/api/auth/logout` | Yes | — | Logout and clear cookie |
| GET | `/api/check-verify` | Yes | — | Verify token and get role |
| GET | `/courses` | No | — | List all available courses |
| POST | `/instructor/course` | Yes | Instructor | Create a course |
| PUT | `/instructor/course/:id` | Yes | Instructor | Update a course |
| DELETE | `/instructor/course/:id` | Yes | Instructor | Delete a course |
| GET | `/instructor/earning` | Yes | Instructor | Get earnings summary |
| POST | `/instructor/withdrawal` | Yes | Instructor | Request a withdrawal |
| GET | `/admin/instructor` | Yes | Admin | List all instructors |
| GET | `/admin/courseview` | Yes | Admin | View all courses |
| PUT | `/admin/course/:id` | Yes | Admin | Approve or revoke course access |
| GET | `/admin/withdrawals` | Yes | Admin | List all withdrawal requests |
| POST | `/order` | Yes | — | Create a PayPal order |
| GET | `/lead/mycourse` | Yes | Lead | Get lead purchased courses |
| GET | `/lead/team` | Yes | Lead | Get lead team members |
| GET | `/student/mycourse` | Yes | Student | Get student enrolled courses |
| GET | `/student/progress-page/:id` | Yes | Student | Get course progress |

---

## Roles and Permissions

| Feature | Admin | Instructor | Lead | Student |
|---|:---:|:---:|:---:|:---:|
| View all courses | ✅ | ✅ | ✅ | ✅ |
| Create and edit courses | — | ✅ | — | — |
| Purchase courses | — | — | ✅ | ✅ |
| Manage team members | — | — | ✅ | — |
| View student progress | — | ✅ | ✅ | — |
| Manage withdrawals | ✅ | ✅ | — | — |
| Manage all users | ✅ | — | — | — |
| Approve course access | ✅ | — | — | — |

---

## Deployment

### Frontend — Vercel

The frontend includes a `vercel.json` that handles SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Set all `VITE_*` environment variables in your Vercel project settings before deploying.

### Backend — Render / Railway / Fly.io

1. Set all environment variables in your hosting dashboard.
2. Set the start command to `node index.js`.
3. Update `CLIENT_URL` to your production frontend URL.
4. Add your production frontend URL to the `origin` array in `Backend/index.js`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code style and keep commits focused and descriptive.

---

## Author

**Rayudu Bharani Satya Siva Durga Prasad**
*(Also known as Bharani Rayudu)*

| | |
|---|---|
| Portfolio | [rayudubharani.vercel.app](https://rayudubharani.vercel.app) |
| GitHub | [@RayuduBharani](https://github.com/RayuduBharani) |
| LinkedIn | [rayudu-bharani](https://www.linkedin.com/in/rayudu-bharani) |
| LeetCode | [RayuduBharani](https://leetcode.com/u/RayuduBharani) |

---

> Licensed under the ISC License.
