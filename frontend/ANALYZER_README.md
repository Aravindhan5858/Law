# 🚀 Client-Side Legal Case Analyzer

## Overview

A **fully client-side** complaint analyzer built with vanilla HTML, CSS, and JavaScript. No backend required, no API calls, works entirely in the browser!

---

## ✨ Features

### 🎯 **Core Functionality**
- **Client-side rule engine** - All logic runs in browser
- **Deterministic analysis** - Pattern matching on keywords
- **5 result cards** - Classification, Sections, Punishment, Steps, Outcome
- **No network calls** - 100% offline capable
- **Copy to clipboard** - Export results as plain text

### 🎨 **Design**
- **Responsive layout** - Mobile and desktop optimized
- **Light/Dark theme** - Toggle with theme persistence
- **Smooth animations** - Card slide-ups and fade-ins
- **Accessible typography** - Clear hierarchy and readability
- **CSS Grid layout** - Auto-responsive card arrangement

### 📱 **Responsive Behavior**
- **Desktop**: 2-column grid for cards
- **Tablet**: 2-column grid
- **Mobile**: Single column stack

---

## 🔧 **How It Works**

### **Rule Engine Logic**

#### 1. **Keyword Detection**
```javascript
Payment keywords: paid, payment, amount, money, rupees
Non-delivery: not delivered, never delivered, no delivery
No refund: no refund, not refunded, money not returned
Fraud: scam, fraud, cheat, stops replying
Online: website, e-commerce, portal, UPI, app
```

#### 2. **Classification Rules**
```
IF (payment keywords + non-delivery/no refund/fraud)
  → Consumer + Criminal

IF (also online keywords)
  → Add Cyber classification

Priority order: Criminal > Consumer > Cyber
```

#### 3. **Section Matching**
```javascript
IPC §420  - Cheating (always for fraud cases)
IPC §406  - Criminal breach of trust (if refund denied)
IT Act §66D - Cyber cheating (if online fraud)
Consumer Protection Act - All consumer cases
```

---

## 📋 **Pre-loaded Example**

The tool comes with this example complaint pre-filled:

> "A customer pays for a mobile phone on an e-commerce site. Product never delivered. Site stops replying. Money not refunded."

**Expected Analysis:**
- **Classification**: Criminal, Consumer, Cyber
- **Sections**: IPC §420, Consumer Act, IT Act §66D, IPC §406
- **Punishment**: 7 years + fine (IPC 420), 3 years (IT Act), civil remedies
- **7 Action Steps**: Evidence → Notice → Grievance → Consumer Court → FIR → Helpline → Settlement
- **Outcome**: Refund + compensation + interest + possible prosecution

---

## 🚀 **Usage**

### **Option 1: Open Directly**
1. Save `analyzer.html` to your computer
2. Double-click to open in any browser
3. Works offline - no server needed!

### **Option 2: Local Server**
```bash
cd /home/aravind/codebase/Law/frontend
python3 -m http.server 8000
# Open http://localhost:8000/analyzer.html
```

### **Option 3: Live Server (VS Code)**
1. Install "Live Server" extension
2. Right-click `analyzer.html`
3. Select "Open with Live Server"

---

## 🎮 **Features in Action**

### **Analyze a Complaint**
1. Enter or modify the complaint text
2. Click **"🔍 Analyze Case"**
3. Results appear in 5 animated cards
4. Auto-scrolls to results

### **Copy Results**
1. After analysis, click **"📋 Copy Result"**
2. Results copied as formatted plain text
3. Paste anywhere (email, document, etc.)

### **Toggle Theme**
1. Click **"🌙 Toggle Theme"**
2. Switches between light/dark mode
3. Preference saved in localStorage

### **Clear Input**
1. Click **"🗑️ Clear"**
2. Resets textarea and hides results

---

## 🧠 **Rule Engine Details**

### **Seed Rules Implemented**

#### **Classification Logic**
```javascript
// Consumer + Criminal
if (hasPayment && (hasNonDelivery || hasNoRefund || hasFraud)) {
    classifications = ['Consumer', 'Criminal'];
    
    // Add Cyber if online context
    if (isOnline) {
        classifications.push('Cyber');
    }
}
```

#### **Section Selection**
```javascript
// Always include for fraud
IPC §420 - Cheating

// Include if money not returned
IPC §406 - Breach of trust

// Include if online fraud
IT Act §66D - Cyber cheating

// Always include for consumer cases
Consumer Protection Act, 2019
```

#### **7 Action Steps (Numbered)**
1. Preserve evidence
2. Send written notice
3. File platform grievance
4. File consumer complaint
5. File FIR if fraud
6. Use helpline (1915)
7. Track and settle

---

## 🎨 **Design Highlights**

### **Color Scheme**
```css
Light Mode:
- Background: #ffffff
- Surface: #fafafa
- Primary: #2563eb (blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Danger: #dc2626 (red)

Dark Mode:
- Background: #0f172a
- Surface: #1e293b
- (Same accent colors with better contrast)
```

### **Card Types**
```
🔍 Classification - Color-coded badges
⚖️ Applicable Sections - Section cards with titles
⚡ Punishment - Warning-colored box
📋 Action Steps - Numbered list (①②③...)
🎯 Expected Outcome - Text paragraph
```

### **Animations**
- Card slide-up on appear
- Fade-in for results section
- Smooth scroll to results
- Button hover effects

---

## 📊 **Test Scenarios**

### **Scenario 1: E-commerce Non-delivery**
```
Input: "Paid ₹15,000 for laptop on Flipkart. Product not delivered. 
No refund given. Customer care not responding."

Expected:
- Classification: Consumer, Criminal, Cyber
- Sections: IPC 420, 406, IT Act 66D, Consumer Act
- All 7 action steps
```

### **Scenario 2: Offline Shop Issue**
```
Input: "Bought furniture from local shop. Paid advance. 
Never delivered. Owner disappeared."

Expected:
- Classification: Consumer, Criminal
- Sections: IPC 420, 406, Consumer Act
- Action steps (excluding cyber-specific ones)
```

### **Scenario 3: Generic Complaint**
```
Input: "Bad service quality"

Expected:
- Fallback message: "Unable to classify..."
- Recommendation to consult lawyer
```

---

## 🔒 **Privacy & Security**

- ✅ **No data sent to server** - Everything runs locally
- ✅ **No cookies** - Only localStorage for theme
- ✅ **No tracking** - Completely private
- ✅ **Offline capable** - Works without internet
- ✅ **No external dependencies** - Self-contained HTML file

---

## 📝 **Customization**

### **Add New Keywords**
```javascript
// In the rules object
paymentKeywords: ['paid', 'payment', 'YOUR_KEYWORD'],
```

### **Add New Legal Section**
```javascript
sections: {
    yourSection: {
        id: 'Your Act §123',
        title: 'Description',
        punishment: 'Penalty details',
        type: 'criminal' // or 'consumer', 'cyber'
    }
}
```

### **Modify Action Steps**
```javascript
actionSteps: [
    'Your step 1',
    'Your step 2',
    // ...
]
```

### **Change Theme Colors**
```css
:root {
    --accent: #your-color;
    --success: #your-color;
    /* ... */
}
```

---

## 🎯 **Technical Stack**

- **HTML5** - Semantic structure
- **CSS3** - Grid, animations, custom properties
- **Vanilla JavaScript** - No frameworks
- **LocalStorage API** - Theme persistence
- **Clipboard API** - Copy functionality

---

## 📦 **File Size**

- **Single file**: ~15 KB
- **No dependencies**: 0 KB
- **Total**: ~15 KB

---

## ✅ **Browser Compatibility**

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎓 **Use Cases**

1. **Quick complaint analysis** - Instant classification
2. **Legal education** - Learn about applicable laws
3. **Evidence gathering checklist** - Action steps guide
4. **Offline tool** - Works without internet
5. **Privacy-conscious users** - No data transmission
6. **Embed in apps** - Can be wrapped in Electron/Cordova

---

## 🔗 **Access**

**File Location:**
```
/home/aravind/codebase/Law/frontend/analyzer.html
```

**Open in Browser:**
```bash
# Option 1: Direct
open analyzer.html  # macOS
xdg-open analyzer.html  # Linux
start analyzer.html  # Windows

# Option 2: Local server
python3 -m http.server 8000
# Visit: http://localhost:8000/analyzer.html
```

---

## 🎉 **Key Benefits**

✅ **No backend required** - Pure client-side  
✅ **Instant results** - No API latency  
✅ **100% private** - No data leaves browser  
✅ **Offline capable** - Works without internet  
✅ **Mobile responsive** - Perfect on all devices  
✅ **Easy to customize** - Simple JavaScript rules  
✅ **Copy/paste results** - Export functionality  
✅ **Theme support** - Light/dark mode  

---

**Status:** ✅ Complete and ready to use!  
**Type:** Standalone HTML file  
**Dependencies:** None  
**Size:** ~15 KB  

🚀 **Open `analyzer.html` in any browser to start analyzing!**
