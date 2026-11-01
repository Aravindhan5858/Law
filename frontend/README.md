# Frontend — Legal Case Advisor

Quick start:

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000`.

## Deploy on Render

The repository includes [`render.yaml`](../render.yaml), which defines separate
frontend and backend services. In Render, create a Blueprint from this
repository and deploy it. Render supplies the backend host to the frontend as
`VITE_API_URL` during the frontend build.
