# WebDashboardFrontend

A lightweight React dashboard for the Bug Detector project.

## Features Implemented
- Routing: login, register, dashboard overview, bug reports list/detail, metrics, notifications, profile, settings
- Auth UI: login/register with token storage (placeholder JWT handling)
- API client: secure fetch wrapper using REACT_APP_BACKEND_BASE_URL
- Bug reports list with filters/search/pagination and export (PDF/CSV/JSON)
- Bug report detail with update form and placeholders for history/comments/attachments
- Metrics overview from `/api/metrics`
- Notifications list, Profile view/edit, Basic Settings
- Error handling and loading states; CORS-friendly requests

## Quick Start
1. Copy `.env.example` to `.env` and set:
   - `REACT_APP_BACKEND_BASE_URL=http://localhost:3002` (or your backend URL)
2. Install dependencies:
   - `npm install`
3. Start:
   - `npm start` (http://localhost:3000)

## Notes
- Auth: Expects backend to return `{ "access_token": "<JWT>" }` from `/auth/login`.
- Exports: Calls `POST /api/export` with body `{ format, filters }` and downloads the response blob.
- All requests include `Authorization: Bearer <token>` when signed in.

## Scripts
- `npm start` - dev server
- `npm test` - tests
- `npm run build` - production build
