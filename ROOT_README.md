# Legal Case Advisor - Full Stack Application

⚖️ **AI-Powered Legal Complaint Analysis System**

A complete web application for analyzing legal complaints and providing structured legal guidance based on Indian Penal Code (IPC) sections.

---

## 🚀 Quick Start (One Command)

```bash
./setup-and-run.sh
```

This single script will:
- ✅ Install all dependencies (root, frontend, backend)
- ✅ Setup database and seed data
- ✅ Start both frontend and backend servers
- ✅ Open application at http://localhost:5173

---

## 📋 Manual Setup

If you prefer to set up manually:

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
cp .env.example .env  # Create environment file
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
cd ..
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Run Both Servers
```bash
# From root directory
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application with Vite |
| **Backend** | http://localhost:4000 | Express API server |
| **API Health** | http://localhost:4000/api/health | Health check endpoint |

---

## 📁 Project Structure

```
Law/
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── .env               # Frontend environment variables
│   ├── vite.config.ts     # Vite configuration (with API proxy)
│   └── package.json
│
├── backend/               # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── app.ts         # Express app setup
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema and migrations
│   ├── data/              # Seed data (IPC sections)
│   ├── .env               # Backend environment variables
│   └── package.json
│
├── package.json           # Root package.json (runs both)
├── setup-and-run.sh       # One-command setup script
└── README.md              # This file
```

---

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Clerk** - Authentication (Google OAuth + Email/Password)
- **Axios** - HTTP client

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (dev.db)
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

---

## 🎯 Features

### ✨ Core Features
- 📝 **Complaint Analysis** - Submit legal complaints for AI analysis
- ⚖️ **IPC Section Matching** - Automatic matching to relevant IPC sections
- 🔍 **Law Search** - Search and browse IPC sections
- 📊 **Structured Results** - 5-section analysis format:
  1. Case Classification (Criminal/Consumer/Cyber)
  2. Applicable Legal Sections
  3. Punishment Details
  4. Action Steps
  5. Expected Outcome
- 🔐 **User Authentication** - Clerk-based auth with Google OAuth
- 🌓 **Dark/Light Theme** - Toggle between themes
- 📱 **Responsive Design** - Works on mobile and desktop

### 🔒 Security Features
- Helmet security headers
- CORS protection
- Environment variable management
- Secure authentication flow

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Analyze Complaint
```http
POST /api/laws/analyze
Content-Type: application/json

{
  "text": "Your complaint text here..."
}
```

**Response:**
```json
{
  "case_classification": ["Criminal", "Consumer", "Cyber"],
  "applicable_sections": [
    {
      "section": "IPC §420",
      "title": "Cheating",
      "punishment": "Rigorous imprisonment and/or fine"
    }
  ],
  "punishment": ["Rigorous imprisonment and/or fine"],
  "action_steps": ["File FIR...", "Collect evidence..."],
  "expected_outcome": ["Refund", "Compensation", "Prosecution"],
  "recommendations": [...],
  "disclaimer": "This tool provides informational suggestions only..."
}
```

### Search IPC Sections
```http
GET /api/laws?q=cheating
GET /api/laws?section=420
GET /api/laws/search?q=fraud
```

### Get Single Section
```http
GET /api/laws/420
```

---

## 🛠️ Available Scripts

### Root Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build both projects |
| `npm start` | Run production builds |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run seed` | Seed database with IPC data |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## ⚙️ Environment Variables

### Backend (`.env`)
```bash
PORT=4000
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

### Frontend (`.env`)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 🔄 How Frontend Connects to Backend

The frontend uses **Vite's proxy configuration** to forward API requests:

**vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000'  // Forward /api/* to backend
    }
  }
});
```

**Frontend API Call:**
```typescript
// Frontend makes request to /api/laws/analyze
const response = await axios.post('/api/laws/analyze', { text });

// Vite proxies it to http://localhost:4000/api/laws/analyze
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database Issues
```bash
cd backend
rm -f dev.db  # Delete database
npm run prisma:migrate  # Recreate
npm run seed  # Re-seed data
```

### Module Not Found Errors
```bash
# Reinstall all dependencies
npm run install:all
```

### CORS Errors
- Ensure backend is running on port 4000
- Check frontend proxy configuration in `vite.config.ts`
- Verify backend CORS settings in `src/app.ts`

### Clerk Authentication Issues
- Verify `VITE_CLERK_PUBLISHABLE_KEY` in frontend `.env`
- Check Clerk dashboard settings
- Ensure Google OAuth is enabled

---

## 📝 Usage Example

1. **Start the application:**
   ```bash
   ./setup-and-run.sh
   ```

2. **Open browser:** http://localhost:5173

3. **Sign in** with Google or email

4. **Navigate to "Analyze"** page

5. **Enter complaint:**
   ```
   A customer pays for a mobile phone on an e-commerce site. 
   Product is not delivered. The site stops responding and no refund is given.
   ```

6. **Click "Analyze Case"**

7. **View structured results:**
   - Case Classification: Criminal, Consumer, Cyber
   - Applicable Sections: IPC §420 (Cheating)
   - Punishment: Rigorous imprisonment and/or fine
   - Action Steps: File FIR, collect evidence, send notice...
   - Expected Outcome: Refund, compensation, prosecution

---

## 🚢 Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Backend
```bash
cd backend/dist
node index.js
```

### Deploy Frontend
```bash
cd frontend/dist
# Serve with any static file server
npx serve -s .
```

**Recommended Platforms:**
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Railway, Render, Heroku
- **Database:** PostgreSQL on Railway/Supabase (replace SQLite)

---

## 📄 License

This project is for educational purposes. Not a substitute for professional legal advice.

---

## 👥 Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Check console logs for errors
4. Verify environment variables

---

## ✅ Quick Checklist

- [ ] Run `./setup-and-run.sh`
- [ ] Wait for both servers to start
- [ ] Frontend opens at http://localhost:5173
- [ ] Backend running at http://localhost:4000
- [ ] Sign in with Clerk authentication
- [ ] Test complaint analysis
- [ ] View structured results

---

**🎉 Everything should now work with a single command!**

Run: `./setup-and-run.sh`
