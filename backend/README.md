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

API Endpoints:
- GET /api/health
- POST /api/analyze { text }
- Admin: GET/POST /api/ipc (stubs)

Notes:
- Add your OpenAI API key to `.env` as `OPENAI_API_KEY` and implement `llmService.ts` to enable LLM fallback.
