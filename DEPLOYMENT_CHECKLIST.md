# Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend Verification
- [x] Table names updated to `bazaar_events`
- [x] API endpoints return correct format
- [x] CORS enabled for frontend
- [x] Environment variables configured
- [x] AWS Bedrock credentials valid
- [x] Supabase credentials valid

### Frontend Verification
- [x] API service layer created
- [x] All components use apiService
- [x] Environment variables configured
- [x] Error handling implemented
- [x] Loading states working

### Integration Verification
- [x] Backend and frontend communicate
- [x] Chatbot uses backend API
- [x] AI Matchmaker uses backend API
- [x] Event Discovery uses backend API
- [x] No CORS errors
- [x] No table name errors

---

## 🚀 Local Testing Steps

### 1. Install Dependencies
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### 2. Configure Environment
- [x] `.env` file exists
- [x] All variables set correctly
- [x] AWS credentials valid
- [x] Supabase credentials valid

### 3. Start Services
```bash
# Terminal 1: Backend
python api_server.py

# Terminal 2: Frontend
npm start
```

### 4. Test Endpoints
```bash
# Run test script
test_integration.bat

# Or manual tests
curl http://localhost:5000/api/health
curl http://localhost:5000/api/events/all
```

### 5. Test Frontend Features
- [ ] Navigate to http://localhost:3000
- [ ] Test chatbot (send message, get AI response)
- [ ] Test AI Matchmaker (search, get real matches)
- [ ] Test Event Discovery (load events)
- [ ] Check browser console (no errors)
- [ ] Check Network tab (API calls succeed)

---

## 📋 Deployment Steps

### Backend Deployment (Choose One)

#### Option 1: AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.9 event-matcher-backend

# Create environment
eb create event-matcher-prod

# Deploy
eb deploy
```

#### Option 2: Heroku
```bash
# Install Heroku CLI
# Create app
heroku create event-matcher-backend

# Set environment variables
heroku config:set AWS_ACCESS_KEY_ID=your_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
heroku config:set AWS_REGION=ap-southeast-5
heroku config:set supabaseUrl=your_url
heroku config:set supabaseKey=your_key

# Deploy
git push heroku main
```

#### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Frontend Deployment (Choose One)

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_BASE_URL=https://your-backend.com/api
REACT_APP_USE_BACKEND_API=true
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build

# Set environment variables in Netlify dashboard
```

#### Option 3: AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront distribution
```

---

## 🔧 Production Configuration

### Backend `.env` (Production)
```env
# Supabase
supabaseUrl=https://your-project.supabase.co
supabaseKey=your_service_role_key

# AWS
AWS_ACCESS_KEY_ID=your_production_key
AWS_SECRET_ACCESS_KEY=your_production_secret
AWS_REGION=ap-southeast-5

# Flask
FLASK_ENV=production
FLASK_DEBUG=False
```

### Frontend `.env.production`
```env
REACT_APP_API_BASE_URL=https://your-backend.com/api
REACT_APP_USE_BACKEND_API=true
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🔒 Security Checklist

### Backend Security
- [ ] Use HTTPS in production
- [ ] Set `FLASK_DEBUG=False`
- [ ] Use environment variables (never commit secrets)
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Validate all inputs
- [ ] Use CORS whitelist (not `*`)
- [ ] Enable logging
- [ ] Set up monitoring

### Frontend Security
- [ ] Use HTTPS
- [ ] Don't expose API keys in code
- [ ] Use environment variables
- [ ] Implement CSP headers
- [ ] Sanitize user inputs
- [ ] Enable HTTPS-only cookies
- [ ] Implement error boundaries

---

## 📊 Monitoring Setup

### Backend Monitoring
```python
# Add to api_server.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.before_request
def log_request():
    logging.info(f"{request.method} {request.path}")
```

### Frontend Monitoring
```javascript
// Add to src/index.js
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // Send to monitoring service
})
```

---

## 🧪 Production Testing

### Smoke Tests
- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] Chatbot sends and receives messages
- [ ] AI Matchmaker searches work
- [ ] Event Discovery loads events
- [ ] All API calls succeed
- [ ] No console errors
- [ ] No network errors

### Load Tests
- [ ] Backend handles 100 concurrent requests
- [ ] Response times < 5 seconds
- [ ] No memory leaks
- [ ] Database connections stable

### Security Tests
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] No exposed secrets
- [ ] Input validation works
- [ ] Rate limiting works

---

## 🔄 Rollback Plan

### If Deployment Fails

#### Backend Rollback
```bash
# Heroku
heroku rollback

# AWS EB
eb deploy --version previous-version

# Railway
railway rollback
```

#### Frontend Rollback
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## 📈 Post-Deployment

### Immediate (First Hour)
- [ ] Verify all endpoints work
- [ ] Check error logs
- [ ] Monitor response times
- [ ] Test all features
- [ ] Verify database connections

### Short Term (First Day)
- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Review performance metrics
- [ ] Verify AI responses quality
- [ ] Check AWS Bedrock usage

### Long Term (First Week)
- [ ] Analyze usage patterns
- [ ] Optimize slow endpoints
- [ ] Review error logs
- [ ] Plan improvements
- [ ] Scale if needed

---

## 📞 Support Contacts

### Services
- **AWS Support**: https://console.aws.amazon.com/support
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Heroku Support**: https://help.heroku.com

### Documentation
- **AWS Bedrock**: https://docs.aws.amazon.com/bedrock
- **Supabase**: https://supabase.com/docs
- **Flask**: https://flask.palletsprojects.com
- **React**: https://react.dev

---

## ✅ Final Checklist

Before going live:
- [ ] All tests pass
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Error logging working
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Rollback plan ready
- [ ] Team notified

---

**Ready for Deployment!** 🚀

**Last Updated**: 2024  
**Version**: 1.0
