# 🤖 Chatbot Frontend Guide

## 🚀 Quick Start

### Step 1: Start the Backend API
```bash
python api_server.py
```
Wait for: `Running on http://127.0.0.1:5000`

### Step 2: Open the Chatbot
Simply double-click `chatbot.html` or open it in your browser:
```
file:///path/to/your/project/chatbot.html
```

### Step 3: Start Chatting!
The chatbot will automatically connect to your backend.

---

## ✨ Features

### 🎨 Beautiful UI
- Modern gradient design
- Smooth animations
- Responsive layout
- Clean and professional

### 💬 Chat Interface
- Real-time messaging
- Typing indicators
- Conversation history
- Smooth scrolling

### ⚡ Quick Actions
Pre-built questions you can click:
- 📋 Available Booths
- 💰 Affordable Options
- 🚗 With Parking
- ⚡ Features

### 🔌 Connection Status
- Green dot = Connected
- Gray dot = Disconnected
- Shows booth count
- Error notifications

---

## 🎯 Example Questions to Try

### General Queries
```
"What booths are available?"
"Tell me about your booths"
"How can you help me?"
```

### Price-Based
```
"Show me affordable booths under 500"
"What's the cheapest booth?"
"I have a budget of 300 rupiah"
```

### Feature-Based
```
"I need a booth with parking"
"Show me booths with electricity"
"Do any booths have storage?"
```

### Specific Needs
```
"I'm looking for a food and beverage booth"
"What booth is best for a dessert vendor?"
"I need a booth that's available now"
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to API"
**Solution:**
1. Make sure backend is running: `python api_server.py`
2. Check it's on port 5000
3. Refresh the chatbot page

### Issue: "Disconnected" status
**Solution:**
1. Restart the backend: `python api_server.py`
2. Wait 2-3 seconds
3. Refresh the chatbot page

### Issue: Chatbot not responding
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running
3. Try a simple question like "Hello"

### Issue: CORS errors in console
**Solution:**
The backend already has CORS enabled. If you still see errors:
1. Make sure you're using `http://localhost:5000` not `127.0.0.1:5000`
2. Restart the backend

---

## 📱 How It Works

### Architecture
```
chatbot.html (Browser)
    ↓ HTTP POST
http://localhost:5000/api/chat
    ↓
api_server.py
    ↓
event_matcher.py
    ↓
llm_service.py (Claude Sonnet 4.5)
    ↓
Response back to chatbot
```

### API Calls Made
1. **On Load:** `GET /api/health` - Check connection
2. **On Load:** `GET /api/events/all` - Get booth count
3. **On Message:** `POST /api/chat` - Send message and get response

---

## 🎨 Customization

### Change Colors
Edit the CSS in `chatbot.html`:
```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Change Title
```html
<h1>🍔 Food Vendor Booth Finder</h1>
<!-- Change to -->
<h1>Your Title Here</h1>
```

### Add More Quick Actions
```html
<button class="quick-action-btn" onclick="sendQuickMessage('Your question here')">
    🎯 Your Label
</button>
```

### Change API URL
If your backend is on a different port:
```javascript
const API_URL = 'http://localhost:5000/api';
// Change to
const API_URL = 'http://localhost:YOUR_PORT/api';
```

---

## 📊 Features Breakdown

### Connection Status
- ✅ Auto-connects on page load
- ✅ Shows connection status with colored dot
- ✅ Displays total booth count
- ✅ Shows error messages if connection fails

### Chat Features
- ✅ Send messages with Enter key or button
- ✅ Typing indicator while waiting
- ✅ Conversation history maintained
- ✅ Smooth animations
- ✅ Auto-scroll to latest message

### User Experience
- ✅ Quick action buttons for common questions
- ✅ Disabled send button while processing
- ✅ Error notifications with auto-hide
- ✅ Responsive design (works on mobile)
- ✅ Clean, modern interface

---

## 🚀 Advanced Usage

### Deploy to Web Server
1. Upload `chatbot.html` to your web server
2. Update API_URL to your backend URL:
   ```javascript
   const API_URL = 'https://your-backend-domain.com/api';
   ```
3. Ensure CORS is configured for your domain

### Embed in Existing Website
```html
<iframe 
    src="chatbot.html" 
    width="400" 
    height="600" 
    style="border: none; border-radius: 20px;"
></iframe>
```

### Add to React/Vue App
Copy the HTML structure and convert to components, or use as iframe.

---

## 📝 Testing Checklist

- [ ] Backend is running (`python api_server.py`)
- [ ] Chatbot shows "Connected" status
- [ ] Booth count is displayed
- [ ] Can send messages
- [ ] Bot responds within 2-3 seconds
- [ ] Quick action buttons work
- [ ] Conversation history is maintained
- [ ] Error messages appear when backend is down

---

## 💡 Tips

### Best Practices
1. **Keep backend running** - Don't close the terminal
2. **Refresh page** if connection is lost
3. **Use quick actions** for common queries
4. **Be specific** in your questions for better results

### Example Conversation Flow
```
You: "Hi, I'm looking for a booth"
Bot: "Hello! I'd be happy to help..."

You: "What's available under 500?"
Bot: "I found several booths under 500 rupiah..."

You: "Tell me about booth A1"
Bot: "Booth A1 is priced at 250 rupiah..."
```

---

## 🎉 Success!

Your chatbot is now ready to use! 

**To start:**
1. Run: `python api_server.py`
2. Open: `chatbot.html`
3. Start chatting!

**Enjoy testing your AI-powered booth finder!** 🚀
