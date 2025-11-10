# 🚀 QUICK START GUIDE# Legal Case Advisor - Quick Start Guide



## ✨ First Time Setup (One Command)## 🚀 Your Application is Now Running!



```bash### Access the Application

cd /home/aravind/codebase/Law**URL:** http://localhost:5173

./setup-and-run.sh

```---



This will:## 📸 What You'll See

1. Install all dependencies

2. Setup database### 1️⃣ Landing Page (First Screen)

3. Start both servers- **Animated logo** in the center

4. Open app at http://localhost:5173- **"Legal Case Advisor"** title with tagline

- **Loading dots** at the bottom

---- **"Continue →"** button appears after 3 seconds

- **Auto-redirects** to login after 5 seconds

## 🎯 After First Setup (Quick Start)

**Try it:**

```bash- Wait for the Continue button to appear

cd /home/aravind/codebase/Law- Click it to go to login, OR

./start.sh- Just wait 5 seconds for automatic redirect

```

---

Or:

### 2️⃣ Login Page

```bash**What's on the page:**

npm run dev- "Welcome Back" heading

```- Email input field

- Password input field

---- "Remember me" checkbox

- "Forgot password?" link

## 📱 Access Points- **Blue "Sign In" button**

- **OR divider**

- **Frontend:** http://localhost:5173- **Google sign-in button** (with colorful G logo)

- **Backend:** http://localhost:4000/api/health- "Don't have an account? Sign up" link at bottom



---**How to test:**

```

## 🛑 Stop ServersEmail: test@example.com

Password: anything

Press `Ctrl + C` in the terminal```

(Any email/password works in demo mode!)

---

**Or click:**

## 🔄 Restart Everything- "Continue with Google" → Instant login

- "Sign up" link → Go to registration

```bash

# Stop servers (Ctrl+C)---

# Then run:

./start.sh### 3️⃣ Sign-Up Page

```**What's on the page:**

- "Create Account" heading

---- Full Name input

- Email input

## 🐛 Common Issues- Password input (min 6 characters)

- Confirm Password input

### Port already in use?- "I agree to Terms..." checkbox

```bash- **Blue "Sign Up" button**

# Kill processes- **OR divider**

lsof -ti:4000 | xargs kill -9  # Backend- **Google sign-up button**

lsof -ti:5173 | xargs kill -9  # Frontend- "Already have an account? Sign in" link



# Then restart**How to test:**

./start.sh```

```Name: John Doe

Email: john@example.com

### Database issues?Password: password123

```bashConfirm: password123

cd backend✓ Check the terms box

rm -f dev.db```

npm run prisma:migrateClick "Sign Up" → Auto-logged in → Redirects to Home

npm run seed

cd ..---

./start.sh

```### 4️⃣ Home Dashboard (After Login)

**What you'll see:**

### Dependencies missing?- **Header with:**

```bash  - Logo and "Legal Case Advisor"

npm run install:all  - Navigation links (Home, Analyze, Laws, About, Contact)

./start.sh  - 🌓 Theme toggle (sun/moon icon)

```  - User avatar (your initial in a circle)



---- **Welcome message:**

  "Welcome back, [Your Name]!"

## 📝 Test the App

- **4 Feature Cards:**

1. Open http://localhost:5173  1. 📄 **Analyze Case** - Describe your legal situation

2. Sign in with Google  2. 📚 **Browse Laws** - Explore IPC sections

3. Go to "Analyze" page  3. ℹ️ **About** - Learn more about the tool

4. Enter complaint:  4. 💬 **Contact Us** - Get in touch

   ```

   I paid for a mobile phone online but never received it. - **How it Works section** (below cards)

   The seller is not responding and won't refund my money.- **Legal Disclaimer**

   ```

5. Click "Analyze Case"**Try clicking:**

6. View structured results!- Any feature card → Navigate to that page

- User avatar → See dropdown with:

---  - Your name and email

  - "Logout" button (red)

## ✅ You're All Set!- Theme toggle → Switch between light/dark mode



**Single command to start:** `./start.sh`---



Enjoy! 🎉## 🎨 Theme Toggle


**Light Mode (Default):**
- White/light gray background
- Blue accents
- Black text
- Clean, professional look

**Dark Mode:**
- Dark blue/gray background
- Lighter blue accents
- White text
- Easy on the eyes

**To toggle:**
Click the sun ☀️ or moon 🌙 icon in the header

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Landing page animations work
- [ ] Auto-redirect after 5 seconds works
- [ ] Login with any email/password works
- [ ] Google login button works (demo mode)
- [ ] Sign-up form validation works
- [ ] Password mismatch shows error
- [ ] Successful signup logs you in
- [ ] User stays logged in on refresh

### Navigation
- [ ] All nav links work
- [ ] Protected pages require login
- [ ] Logout redirects to login
- [ ] Logging in goes to home
- [ ] Back button works correctly

### UI/UX
- [ ] Theme toggle switches modes
- [ ] Theme persists on refresh
- [ ] Animations are smooth
- [ ] Buttons have hover effects
- [ ] Forms show validation errors
- [ ] Responsive on mobile (resize browser)

### User Features
- [ ] User avatar shows correct initial
- [ ] Dropdown shows user info
- [ ] Logout works and clears session
- [ ] Remember me checkbox (visual)
- [ ] All links are clickable

---

## 📱 Mobile Testing

**Resize your browser to test:**
1. Desktop: Full width
2. Tablet: ~768px width
3. Mobile: ~375px width

**What should happen:**
- Layout adjusts automatically
- Cards stack vertically on mobile
- Header navigation adapts
- Forms remain easy to use
- Text is readable
- Buttons are touch-friendly

---

## 🎯 Key Features to Demonstrate

### 1. Landing Page Animation
- Watch the logo fade in and pulse
- See the smooth transitions
- Notice the loading dots

### 2. Form Validation
- Try submitting empty form → See errors
- Type mismatched passwords → See error
- Enter short password → See error

### 3. Authentication
- Login with any credentials → Success
- Check localStorage → See user data
- Refresh page → Still logged in

### 4. Protected Routes
- Logout
- Try accessing /home → Redirected to login
- Login → Can access all pages

### 5. Theme System
- Toggle dark mode
- Refresh page → Theme persists
- All pages respect theme
- Smooth color transitions

### 6. User Session
- Login
- See your name in header
- Click avatar → See dropdown
- Click anywhere → Dropdown closes
- Logout → Session cleared

---

## 🐛 If Something Doesn't Work

### Server not running?
```bash
cd /home/aravind/codebase/Law/frontend
npm run dev
```

### Port already in use?
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Changes not showing?
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

### Login not working?
- Check browser console (F12)
- Check Network tab for errors
- Verify localStorage in DevTools

---

## 🎨 Customization Tips

### Change Primary Color
In `styles.css`, find:
```css
--accent: #2563eb;  /* Blue */
```
Change to your preferred color!

### Update Logo
In `LandingPage.tsx`, replace the SVG with your logo

### Modify Landing Timer
In `LandingPage.tsx`:
```typescript
setTimeout(() => setShowButton(true), 3000); // Show button after 3s
setTimeout(() => navigate('/login'), 5000);   // Redirect after 5s
```

### Change Animation Speed
Look for `transition={{ duration: X }}` in components

---

## 📊 Current Flow

```
START
  ↓
Landing Page (/)
  ↓ (5s or click)
Login (/login) ←→ Sign-Up (/signup)
  ↓ (authenticate)
Home Dashboard (/home)
  ↓
├─ Analyze (/analyze)
├─ Laws (/laws)
├─ About (/about)
└─ Contact (/contact)
  ↓
Logout → Back to Login
```

---

## 🎓 Learning Points

**This implementation demonstrates:**
- React functional components
- TypeScript interfaces
- Context API for state management
- Protected routing
- localStorage persistence
- CSS custom properties
- Responsive design
- Animation with Framer Motion
- Form validation
- User session management

---

## 🚀 Next Development Steps

1. **Backend Integration**
   - Create API endpoints
   - Connect login/signup to real database
   - Implement JWT tokens

2. **Email Features**
   - Email verification
   - Password reset
   - Welcome emails

3. **Enhanced Security**
   - Rate limiting
   - CSRF protection
   - Input sanitization
   - Secure headers

4. **Additional Features**
   - User profile page
   - Settings panel
   - Notification system
   - Search functionality

---

## 🎉 Enjoy Your New Application!

You now have a professional, modern web application with:
- ✨ Beautiful UI
- 🔐 Authentication system
- 🌓 Dark mode
- 📱 Responsive design
- 🎬 Smooth animations
- 🔒 Protected routes

**Happy Testing! 🚀**

---

**Questions?** Check the SETUP.md or IMPLEMENTATION_SUMMARY.md files for more details.
