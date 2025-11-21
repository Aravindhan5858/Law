# 🔍 Law Search Feature - Complete Guide

## Overview
The Law Search page allows users to search for any law, IPC section, IT Act section, or Consumer Act provision using Gemini AI. The system automatically fetches structured legal information and displays it in a clean, readable format.

---

## 🚀 Quick Start

### 1. Get Your Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 2. Configure Environment Variables
Open `/home/aravind/codebase/Law/frontend/.env` and replace the placeholder:

```env
VITE_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Restart the Development Server
If your server is running, restart it to load the new environment variable:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 📍 Access the Feature

### Route
- **URL**: `http://localhost:5173/law-search`
- **Navigation**: Protected route (requires authentication)

### Navigation Options
You can navigate to the Law Search page by:
1. Directly visiting `/law-search` in your browser
2. Adding a navigation link in the Header component
3. Creating a card/button on the Home page

---

## 🎨 Features

### ✅ Implemented Features

1. **Smart Search Input**
   - Type any law, section, or provision
   - Press Enter or click "Search" button
   - Clean, centered, responsive design

2. **Gemini AI Integration**
   - Automatically fetches law details from Gemini API
   - Structured JSON response parsing
   - Intelligent error handling

3. **Beautiful Result Display**
   - **Section Name**: Highlighted in gradient header
   - **Act/Law Name**: Displayed with the section
   - **Definition**: Clear explanation with blue accent
   - **Punishment/Penalty**: Red-accented section
   - **Example Usage**: Green-accented practical example
   - Scrollable content area (max 600px height)

4. **Loading States**
   - Animated spinner while searching
   - "Searching..." text indicator
   - Disabled input/button during search

5. **Error Handling**
   - **API Failure**: Red error box - "Unable to fetch law details right now."
   - **Not Found**: Yellow info box - "No results. Try another law or IPC section."
   - **Empty Input**: Friendly validation message
   - **Missing API Key**: Configuration error message
   - No alert popups - all errors shown inline

6. **LocalStorage Persistence**
   - Automatically saves last successful search
   - Auto-loads on page refresh
   - Shows "💾 Result saved automatically" footer

7. **Responsive Design**
   - Mobile-first approach
   - Adapts to all screen sizes
   - Touch-friendly on mobile devices

8. **Smooth Animations**
   - Framer Motion transitions
   - Fade-in effects for results
   - Scale animations for errors
   - Professional feel throughout

---

## 🔍 Usage Examples

### Example Searches
Try searching for:
- `IPC 420` - Cheating and dishonesty
- `Section 66A IT Act` - Offensive messages
- `IPC 302` - Murder
- `Section 138 NI Act` - Dishonor of cheque
- `Consumer Protection Act Section 2` - Definitions
- `IPC 376` - Sexual assault
- `Section 499 IPC` - Defamation

### Expected Response Format
```json
{
  "section_name": "Section 420 IPC",
  "act_name": "Indian Penal Code, 1860",
  "definition": "Cheating and dishonestly inducing delivery of property...",
  "punishment": "Imprisonment up to 7 years and fine",
  "example": "A person promises to deliver goods after receiving payment..."
}
```

---

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **API**: Gemini 1.5 Flash
- **State Management**: React useState + localStorage
- **Routing**: React Router v6

### File Structure
```
frontend/src/
├── pages/
│   └── LawSearchPage.tsx         # Main law search component
├── App.tsx                        # Updated with /law-search route
└── .env                          # Contains VITE_GEMINI_API_KEY
```

### API Request Format
```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}

Body:
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "You are a legal information assistant. User search: \"IPC 420\"..."
        }
      ]
    }
  ]
}
```

### Response Parsing
- Extracts JSON from Gemini's text response
- Removes markdown code blocks if present
- Validates structure before displaying
- Handles both success and error responses

---

## 🎯 Next Steps

### Optional Enhancements (Not Implemented Yet)

1. **Add Navigation Link**
   Update `Header.tsx` to include a link to Law Search:
   ```tsx
   <Link to="/law-search">Law Search</Link>
   ```

2. **Search History**
   - Show recent searches
   - Quick access to previous results

3. **Favorite Laws**
   - Bookmark frequently accessed laws
   - Quick reference section

4. **Share Results**
   - Copy to clipboard button
   - Share via WhatsApp/Email

5. **Export to PDF**
   - Generate downloadable PDF reports

6. **Related Laws**
   - Show related sections
   - Cross-reference suggestions

---

## 🐛 Troubleshooting

### Issue: "API key not configured"
**Solution**: Make sure you've added your Gemini API key to `.env` and restarted the server.

### Issue: "Unable to fetch law details"
**Possible Causes**:
- No internet connection
- Invalid API key
- API rate limit exceeded
- Gemini service down

**Solution**: Check console for detailed error logs.

### Issue: Result not displaying
**Solution**: 
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify the API response in Network tab
4. Ensure the response matches expected JSON format

### Issue: Page not found (404)
**Solution**: Make sure you're navigating to `/law-search` (not `/laws`)

---

## 📊 API Limits

### Gemini API Free Tier
- **Rate Limit**: 60 requests per minute
- **Daily Limit**: Varies by region
- **Token Limit**: ~32,000 tokens per request

### Cost Optimization
- Results are cached in localStorage
- No duplicate API calls for same search
- Efficient prompt design minimizes token usage

---

## 🎨 Customization

### Change Color Scheme
Edit the gradient colors in `LawSearchPage.tsx`:
```tsx
// Header gradient
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Search button gradient  
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Background gradient
className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
```

### Adjust Result Card Height
```tsx
// Change max-height in result card
className="max-h-[600px] overflow-y-auto"
```

### Modify Loading Text
```tsx
<p className="text-gray-600 text-lg font-medium">Searching...</p>
```

---

## ✅ Checklist

- [ ] Get Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Add key to `/frontend/.env` as `VITE_GEMINI_API_KEY`
- [ ] Restart development server
- [ ] Navigate to http://localhost:5173/law-search
- [ ] Test with a sample search (e.g., "IPC 420")
- [ ] Verify result displays correctly
- [ ] Test error cases (invalid search, no API key)
- [ ] Test localStorage persistence (refresh page)
- [ ] Test responsive design (resize browser)

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Search button shows "Searching..." during API call
2. ✅ Result card displays with gradient header
3. ✅ All 5 sections visible (Section, Act, Definition, Punishment, Example)
4. ✅ Refreshing page shows last successful result
5. ✅ Error messages appear inline (no popups)
6. ✅ Mobile view is responsive and readable

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify API key is correct and valid
3. Ensure server is running on port 5173
4. Check network tab for API response details

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Gemini AI**
