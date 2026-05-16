# InterviewIQ Project Documentation

## Project Overview
InterviewIQ is a full-stack AI-powered mock interview platform built using React, Tailwind CSS, Vite, Node.js, Express, MongoDB, JWT authentication, and OpenAI-powered interview intelligence.

## Folder Structure
- `backend/` — Express API, MongoDB models, authentication, interview logic, file uploads, and Socket.io real-time connectivity
- `frontend/` — React app, Tailwind styling, authentication UI, interview pages, dashboard, and responsive layout
- `frontend/public/` — Static assets including the app logo and favicon
- `frontend/src/components/` — Shared UI components such as Navbar, Footer, ProtectedRoute, question cards, and resume uploader
- `frontend/src/pages/` — Main page views: Home, Login, Signup, Dashboard, Profile, InterviewRoom, ResumeUpload, AnalyticsReport

## Setup Instructions

### 1. Install dependencies
```bash
cd InterviewIQ/backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables
Create a `.env` file in `backend/` containing at least:
```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 3. Run the backend server
```bash
cd InterviewIQ/backend
npm run dev
```

### 4. Run the frontend app
```bash
cd InterviewIQ/frontend
npm run dev
```

## Backend Service Verification
The backend now exposes a health endpoint:
- `GET http://localhost:5000/api/health`

If the service is running correctly, it should return:
```json
{ "status": "ok", "service": "InterviewIQ backend" }
```

### Key backend routes
- `POST /api/auth/register` — create a new user
- `POST /api/auth/login` — authenticate and return a JWT token
- `GET /api/auth/profile` — get user profile (protected)
- `PUT /api/auth/profile` — update user profile (protected)
- `POST /api/upload` — upload resume files
- `GET /api/interview` — manage interview sessions

## Frontend Notes
- The app uses a Vite React setup with Tailwind for responsive design
- The logo asset is served from `frontend/public/InterviewAILogo1.png`
- `frontend/index.html` now uses `/InterviewAILogo1.png` for the favicon icon
- The navbar includes mobile menu support and a responsive layout
- A new footer component is included across all pages for a polished UI

## Mobile Responsiveness Improvements
- Navbar now includes a mobile hamburger menu for small screens
- Footer is responsive and adapts to mobile sizes
- Main page sections use Tailwind responsive utilities for layout and spacing

## Recommended Next Steps
1. Add a proper `/api/health` check in production container health probes
2. Add form validation and error messages for login/register flows
3. Add a dedicated interview progress dashboard and analytics charts
4. Implement user roles or saved interview history
5. Add deployment steps for Vercel/Netlify (frontend) and Heroku/DigitalOcean (backend)

## Important Notes
- Do not commit environment files like `backend/.env`
- Add `node_modules/` to `.gitignore` in both frontend and backend if not already ignored
- Keep MongoDB credentials secure and never store them in Git

## Commands Summary
| Task | Command |
| --- | --- |
| Start backend | `cd InterviewIQ/backend && npm run dev` |
| Start frontend | `cd InterviewIQ/frontend && npm run dev` |
| Health check | `curl http://localhost:5000/api/health` |

## Project Workflow
1. Develop backend API routes and verify with Postman/cURL
2. Build React UI and connect to backend using `/api` calls
3. Test authentication flows and protected route behavior
4. Add responsiveness for mobile devices with Tailwind
5. Document setup and run instructions for teammates

---

For any enhancements, update the documentation and keep API route names consistent across frontend and backend.
