# SlotWise – Smart Appointment Booking System

Many businesses such as salons, clinics and consultants still manage appointments manually,
leading to double bookings and long waiting times. SlotWise solves this with a simple,
role-based booking platform for **customers** and **admins**.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router v6, Context API, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication
- **Architecture:** REST API

## Features
- ✅ User Registration / Login
- ✅ JWT Authentication (role-based: customer / admin)
- ✅ Admin Dashboard
- ✅ Book Appointment (calendar + slot picker)
- ✅ Manage Time Slots (create in bulk, block/unblock, delete)
- ✅ Search Available Slots
- ✅ Filter by Date (bookings & admin appointment list)
- ✅ Appointment History (My Bookings, cancel appointment)
- ✅ Reports (summary stats, status breakdown, appointments-by-date chart)
- ✅ Role-based Access (protected + admin-only routes, both frontend and backend)
- ✅ Responsive Design (Tailwind, mobile-friendly layout)

## Pages
Home · Login · Register · Dashboard · Book Appointment · My Bookings · Admin Panel · Reports · Profile

## Project Structure
```
slotwise/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, slot, appointment, report logic
│   ├── middleware/         # JWT auth, admin guard, error handler
│   ├── models/             # User, Slot, Appointment (Mongoose schemas)
│   ├── routes/             # /api/auth, /api/slots, /api/appointments, /api/reports
│   ├── utils/generateToken.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js         # Axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx  # Context API for auth state
    │   ├── components/          # Layout, Sidebar, Topbar, PrivateRoute, StatCard, StatusBadge
    │   ├── pages/                # Home, Login, Register, Dashboard, BookAppointment,
    │   │                          # MyBookings, AdminPanel, Reports, Profile
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Getting Started

### 1. Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # starts on http://localhost:5173
```

### 3. Create an admin user
Register normally via the app (defaults to role `customer`), then manually
update that user's `role` field to `"admin"` in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API Overview
| Method | Endpoint                          | Access        |
|--------|------------------------------------|---------------|
| POST   | /api/auth/register                 | Public        |
| POST   | /api/auth/login                    | Public        |
| GET    | /api/auth/profile                  | Private       |
| PUT    | /api/auth/profile                  | Private       |
| GET    | /api/slots?date=YYYY-MM-DD         | Public        |
| POST   | /api/slots                         | Admin         |
| POST   | /api/slots/bulk                    | Admin         |
| PUT    | /api/slots/:id/block                | Admin         |
| DELETE | /api/slots/:id                      | Admin         |
| POST   | /api/appointments                  | Private       |
| GET    | /api/appointments/my               | Private       |
| GET    | /api/appointments?date=&status=    | Admin         |
| PUT    | /api/appointments/:id/status        | Admin         |
| PUT    | /api/appointments/:id/cancel        | Private       |
| GET    | /api/reports/summary                | Admin         |
| GET    | /api/reports/by-date                | Admin         |

## Notes
This is a coursework/portfolio build. Before any real deployment, add rate
limiting, input validation (e.g. Joi/Zod), refresh tokens, and stronger
password policies.
