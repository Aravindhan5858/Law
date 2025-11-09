# Legal Case Advisor — MVP scaffold

This workspace contains a starter full-stack scaffold for the "Legal Case Advisor" project.

Structure:
- backend/: Express + TypeScript API, Prisma schema (SQLite), rule-based matcher stub + LLM stub
- frontend/: React + TypeScript (Vite) minimal UI to call the `/api/analyze` endpoint
- data/: seed data for IPC sections

Next steps (run locally):
1. Install dependencies in `backend` and `frontend` directories.
2. Configure environment variables (see `.env.example` files in subfolders).
3. Run the backend and frontend (commands included in READMEs in each folder).

I scaffolded the initial files and a small IPC seed. If you'd like, I can now:
- install dependencies and run the dev server here (I can't run installs automatically without permission), or
- add Dockerfiles and GitHub Actions, or
- implement LLM integration (needs API key) and more IPC entries.

Tell me which to do next.