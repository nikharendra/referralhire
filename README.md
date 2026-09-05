# ReferralHire

**Employee Referral Management SaaS for Small Businesses**

ReferralHire is a full-stack, multi-tenant SaaS platform that helps small and mid-size businesses run their employee referral program end-to-end — from job posting to referral tracking to automated bonus payouts.

🔗 **Live App:** [referralhire-nikharendra.vercel.app](https://referralhire.vercel.app)
🔗 **Live API:** [referralhire-backend.onrender.com](https://referralhire-backend.onrender.com)

> Note: the backend is hosted on Render's free tier and may take 30–50 seconds to wake up after a period of inactivity.

---

## The Problem

Small and mid-size companies know that referred candidates make better hires — they join faster, stay longer, and fit the team better than portal hires. Despite this, most small businesses have no real system for referrals. They're tracked over email, WhatsApp, or spreadsheets, which means HR loses track of who referred whom, forgets to update employees on status, and often delays or misses referral bonus payouts.

## The Solution

ReferralHire gives companies a dedicated, simple platform for their referral program:

- HR posts open roles with a defined referral bonus
- Employees browse open roles and refer candidates directly
- Every referral moves through a clear, trackable pipeline
- Bonuses are automatically validated and tracked through to payout
- Both sides get real-time notifications as things progress

Each company's data is fully isolated via a multi-tenant architecture, and users join a company using a unique invite code rather than free text — so there's no way for one company's data to leak into another's.

---

## Features

- **Authentication & Authorization** — JWT-based auth with bcrypt password hashing, role-based middleware (HR vs. Employee)
- **Multi-Tenant Company Scoping** — companies are first-class entities with unique join codes; all data is isolated per company at the database query level
- **Job Postings** — HR can create, list, and close roles with an attached referral bonus
- **Referral Pipeline** — employees submit referrals; status flows through Submitted → Under Review → Interview → Hired/Rejected
- **Automated Payout Logic** — bonuses can only be marked paid for hired candidates, with safeguards against double payouts
- **Live Dashboard** — HR sees real-time aggregated stats (open positions, total referrals, hires, pending payout) via MongoDB aggregation
- **Search & Filter** — backend-driven search and filtering on both job postings and referrals
- **In-App Notifications** — HR and employees are notified on new referrals, status changes, and payouts (polling-based)
- **Password Reset** — secure, token-based reset flow with hashed tokens and expiry
- **Company Settings** — HR can view and regenerate their company's join code at any time
- **Responsive UI** — fully responsive landing page, auth screens, and dashboards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT), bcrypt.js |
| Hosting | Render (backend) · Vercel (frontend) |

---

## Architecture Overview

```
Client (React)  →  REST API (Express)  →  MongoDB Atlas
                         │
                    JWT Middleware
                  (protect + hrOnly)
```

**Core data models:**

- `Company` — name, unique join code, creator reference
- `User` — name, email, hashed password, role (`hr` / `employee`), company reference
- `JobPosting` — title, department, bonus amount, status, posted-by + company reference
- `Referral` — candidate details, status, bonus-paid flag, job + referrer + company references
- `Notification` — recipient, message, type, read flag, company reference

Every query on `JobPosting`, `Referral`, and `Notification` is scoped by `company`, derived from the authenticated user's verified JWT — never from client-supplied input.

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register (create or join a company) |
| POST | `/api/auth/login` | Public | Authenticate, receive JWT |
| GET | `/api/auth/me` | Authenticated | Current user profile |
| POST | `/api/auth/forgot-password` | Public | Generate a password reset token |
| POST | `/api/auth/reset-password/:token` | Public | Reset password with a valid token |

### Jobs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/jobs` | HR only | Create a job posting |
| GET | `/api/jobs` | Authenticated | List open jobs (supports `?search=&department=`) |
| PATCH | `/api/jobs/:id/close` | HR only | Close a job posting |

### Referrals
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/referrals` | Authenticated | Submit a referral |
| GET | `/api/referrals/my` | Authenticated | View own submitted referrals |
| GET | `/api/referrals/job/:jobId` | HR only | View referrals for a job (supports `?search=&status=`) |
| PATCH | `/api/referrals/:id/status` | HR only | Update referral status |
| PATCH | `/api/referrals/:id/payout` | HR only | Mark a hired referral's bonus as paid |

### Dashboard & Company
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | HR only | Aggregated company stats |
| GET | `/api/company/me` | Authenticated | Company name (+ join code for HR) |
| PATCH | `/api/company/regenerate-code` | HR only | Invalidate and regenerate the join code |

### Notifications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/notifications` | Authenticated | Recent notifications + unread count |
| PATCH | `/api/notifications/:id/read` | Authenticated | Mark one notification as read |
| PATCH | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster (free tier is enough)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional — defaults to localhost if omitted):
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## Security Notes

- Passwords are hashed with bcrypt before storage — never stored in plain text
- Password reset tokens are hashed before storage and expire after 15 minutes, invalidated after use
- All protected routes verify JWTs server-side via middleware before any route logic runs
- Company data isolation is enforced at the database query level, not just hidden in the UI
- HR-only actions (posting jobs, updating referral status, processing payouts, viewing/regenerating join codes) are restricted via dedicated middleware

---

## Future Scope

- Real email delivery for password reset (currently returns the reset link directly for development/demo purposes)
- Real-time notifications via WebSockets (currently polling-based)
- Duplicate-referral detection across employees
- Analytics on which referral sources produce the best long-term hires
- Integration with external job boards

---

## Author

**Harendra Singh Yadav**
Pondicherry University
[harendranik2003@gmail.com](mailto:harendranik2003@gmail.com)

---

