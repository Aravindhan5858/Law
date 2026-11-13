# Backend — Legal Case Advisor

Quick start (Windows PowerShell):

1. Install dependencies

```powershell
cd backend
npm install
```

2. Generate Prisma client and create DB

```powershell
npx prisma generate
npx prisma db push
npm run seed
```

3. Run dev server

```powershell
npm run dev
```

Contact messages require MongoDB and SMTP configuration in `backend/.env`. Copy
`.env.example`, set `MONGODB_URI`, `ADMIN_EMAIL`, `EMAIL_USER`, `EMAIL_PASS`,
and a long `ADMIN_JWT_SECRET`. The admin API expects a JWT bearer token whose
payload includes `role: "admin"` (or `isAdmin: true`).

API Endpoints:
- GET /api/health
- POST /api/analyze { text }
- POST /api/contact { fullName, email, phone, subject, message }
- GET/PATCH/DELETE /api/admin/contact-messages (admin JWT required)
- GET /api/admin/contact-messages/unread-count (admin JWT required)
- GET /api/admin/contact-messages/recent (admin JWT required)
- PATCH /api/admin/contact-messages/:id/read (admin JWT required)

The backend emits Socket.IO `contact:created` and `contact:updated` events to
authenticated admin connections. Set `FRONTEND_ORIGIN` when the dashboard is
served from a different origin.
- Admin: GET/POST /api/ipc (stubs)

Notes:
- Add your OpenAI API key to `.env` as `OPENAI_API_KEY` and implement `llmService.ts` to enable LLM fallback.
