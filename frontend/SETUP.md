# Legal Case Advisor - Setup and Run Instructions

## Overview

This project has been enhanced with a modern authentication flow, responsive design, and dark mode support.

## New Features

✅ **Landing Page** - Animated splash screen with 5-second auto-redirect
✅ **Authentication System** - Login and Sign-up pages with email/password and Google OAuth support
✅ **Protected Routes** - All main pages require authentication
✅ **Dark Mode** - Toggle between light and dark themes
✅ **Responsive Design** - Mobile and desktop optimized
✅ **Smooth Animations** - Using Framer Motion for page transitions
✅ **Dashboard Home** - Modern card-based layout for authenticated users
✅ **User Profile** - Avatar dropdown with logout functionality

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigation with theme toggle & user menu
│   │   ├── ProtectedRoute.tsx   # Route guard for authenticated pages
│   │   └── SearchBar.tsx
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   └── ThemeContext.tsx     # Dark/Light mode management
│   ├── pages/
│   │   ├── LandingPage.tsx      # Animated splash screen
│   │   ├── LoginPage.tsx        # Login with email/Google
│   │   ├── SignUpPage.tsx       # Registration with validation
│   │   ├── Home.tsx             # Dashboard for authenticated users
│   │   ├── AnalyzePage.tsx
│   │   ├── ResultPage.tsx
│   │   ├── LawsPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── styles.css               # Global styles with dark mode
```

## Installation & Running

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd /home/aravind/codebase/Law/frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## User Flow

1. **Landing Page** (`/`)
   - Shows animated logo and project title
   - Displays "Continue" button after 3 seconds
   - Auto-redirects to login after 5 seconds
   
2. **Login Page** (`/login`)
   - Email and password authentication
   - Google OAuth button (demo mode)
   - Link to sign-up page
   - "Remember me" and "Forgot password" options
   
3. **Sign-Up Page** (`/signup`)
   - Full name, email, and password fields
   - Password confirmation with validation
   - Terms acceptance checkbox
   - Google OAuth option
   
4. **Home Dashboard** (`/home`)
   - Personalized welcome message
   - Card-based navigation to main features
   - Quick access to Analyze, Laws, About, and Contact
   
5. **Protected Pages**
   - All main features require authentication
   - Automatic redirect to login if not authenticated
   - Persistent login using localStorage

## Features in Detail

### Authentication
- **Demo Mode**: For testing, any email/password combination works
- **State Persistence**: User session saved in localStorage
- **Protected Routes**: Redirects to login if not authenticated
- **Auto-login**: After signup, users are automatically logged in

### Dark Mode
- Toggle button in header (sun/moon icon)
- Preference saved in localStorage
- Smooth transitions between themes
- All components styled for both modes

### Responsive Design
- Mobile-first approach
- Breakpoints at 640px and 768px
- Touch-friendly buttons and forms
- Adaptive layouts for all screen sizes

### Animations
- Framer Motion for smooth transitions
- Page enter/exit animations
- Button hover effects
- Loading states with spinners

## Customization

### Adding Real Authentication
To connect to a real backend API:

1. Update `LoginPage.tsx` and `SignUpPage.tsx`:
   ```typescript
   // Replace the demo login with actual API call
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   const data = await response.json();
   login(data.user);
   ```

2. Configure Google OAuth:
   - Get OAuth credentials from Google Cloud Console
   - Update the `@react-oauth/google` configuration
   - Handle the OAuth callback

### Customizing Styles
All CSS variables are in `styles.css`:
```css
:root {
  --bg: #ffffff;
  --accent: #2563eb;
  --radius: 8px;
  /* ... more variables */
}
```

### Adding More Features
- Create new pages in `src/pages/`
- Add routes in `App.tsx`
- Wrap with `<ProtectedRoute>` if authentication required
- Update Header navigation if needed

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Vite** - Build tool
- **Context API** - State management

## Troubleshooting

**Port already in use:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Permission issues:**
```bash
# Fix node_modules permissions
chmod -R +x node_modules/.bin
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Real backend integration
- [ ] Email verification
- [ ] Password reset flow
- [ ] Social login (GitHub, Facebook)
- [ ] Multi-factor authentication
- [ ] User profile page
- [ ] Settings page
- [ ] Notifications system

## License

This project is for educational purposes.

---

**Note**: This is a demo implementation. For production use, implement proper backend authentication, HTTPS, CSRF protection, and other security measures.
