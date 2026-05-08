# TeamReviewer — Frontend

The React-based single-page application for the TeamReviewer performance review management system. Built with **React**, **React Router**, **Axios**, and **Tailwind CSS**.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Tailwind CSS | Utility-first styling |

---

## Project Structure

```
frontend/frontend/
├── src/
│   ├── api/
│   │   └── axios.js                  # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx    # Admin stats + recent activity
│   │   │   └── EmployeeDashboard.jsx # Employee workspace + action items
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx        # Sidebar + navigation shell
│   │   │   └── ProtectedRoute.jsx    # Auth & role-based route guard
│   │   ├── reviews/
│   │   │   ├── AdminReviews.jsx      # Admin review CRUD + view feedbacks
│   │   │   └── EmployeeReviews.jsx   # Employee assigned reviews + feedback submission
│   │   └── ui/
│   │       └── Modal.jsx             # Reusable modal component
│   ├── pages/
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Registration page
│   │   ├── Dashboard.jsx             # Role-router: renders Admin or Employee dashboard
│   │   ├── Employees.jsx             # Admin-only employee management page
│   │   └── Reviews.jsx               # Role-router: renders Admin or Employee reviews
│   ├── App.jsx                       # Route definitions
│   ├── main.jsx                      # React root entry point
│   └── index.css                     # Global styles
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js v18+
- The backend server running (see `backend/README.md`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> If `VITE_API_URL` is not set, the Axios client defaults to `http://localhost:5000/api`.

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at **http://localhost:5173** by default.

---

## Demo Credentials

Use these credentials to log in and explore the app:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gmail.com` | `admin` |
| **Employee** | *(any other employee)* | `12345678` |

> The admin account has full access to employee management, review creation/deletion, and the admin dashboard. Employee accounts can only view their assigned reviews and submit feedback.

---

## Application Routes

| Path | Access | Component | Description |
|---|---|---|---|
| `/` | Public | `Login.jsx` | User login form |
| `/register` | Public | `Register.jsx` | New user registration form |
| `/dashboard` | Protected | `Dashboard.jsx` | Role-specific dashboard |
| `/reviews` | Protected | `Reviews.jsx` | Role-specific reviews page |
| `/employees` | Admin only | `Employees.jsx` | Full employee management |

---

## Authentication Flow

1. User submits credentials on the **Login** page.
2. On success, the API returns a **JWT token** and the **user object**.
3. Both are saved in `localStorage` (`token` and `user` keys).
4. The **Axios interceptor** (`src/api/axios.js`) automatically reads `localStorage.token` and attaches it as `Authorization: Bearer <token>` on every subsequent request.
5. **`ProtectedRoute`** checks for the token before rendering a protected page. If absent, it redirects to `/`.
6. For admin-only routes, `ProtectedRoute` also checks `user.role === 'admin'`.

---

## Role-Based UI

The application adjusts its entire UI based on the user's role:

### Admin
- **Dashboard:** Displays total employees, pending/completed review counts, and a recent activity feed of the latest review events.
- **Reviews:** Full CRUD interface to create, edit, and delete performance review cycles. Each review row has a **"View Feedbacks"** button that opens a modal displaying all submitted peer feedbacks (reviewer name, rating, and comment).
- **Employees:** Full CRUD page to manage employee records (name, email, password, role).

### Employee
- **Dashboard:** Shows how many peer reviews they still need to submit feedback for, and how many feedbacks they have received on their own reviews. An "Action Items" panel with a direct link to the Reviews page appears when reviews are pending.
- **Reviews:** Shows only the reviews they have been assigned to as a peer reviewer. Each row shows the review title, the subject employee, and their current feedback submission status. A **"Submit Feedback"** button opens a modal for rating (1–5) and a written comment. Once submitted, the button is disabled and shows **"Submitted"**.

---

## Key Components

### `ProtectedRoute`
Wraps routes that require authentication. Accepts an optional `allowedRoles` prop for role-based access control. Redirects to `/` if the user is not authenticated or lacks the required role.

### `MainLayout`
The persistent application shell containing the sidebar navigation (Dashboard, Reviews, Employees links) and a logout button. Renders child routes via `<Outlet />`.

### `Modal`
A reusable, accessible modal component used throughout the app for create/edit forms and the feedback viewer. Supports an `isOpen` flag, `onClose` handler, and a `title` prop.

### `src/api/axios.js`
A pre-configured Axios instance with the base URL and a request interceptor that automatically injects the JWT Bearer token from localStorage into every outgoing request.