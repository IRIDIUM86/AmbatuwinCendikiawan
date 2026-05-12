# Configuration Checklist

## Pre-Deployment Checklist

### ✅ Environment Setup

- [ ] Python 3.13 installed
- [ ] Virtual environment created (`py -3.13 -m venv venv`)
- [ ] Virtual environment activated (`.\venv\Scripts\activate`)
- [ ] All dependencies installed (`pip install -r requirements.txt`)

### ✅ AWS Bedrock Configuration

- [ ] AWS account created
- [ ] IAM user created with Bedrock access
- [ ] Access key ID obtained
- [ ] Secret access key obtained
- [ ] Bedrock model access requested (Claude 3 Sonnet)
- [ ] Region confirmed (ap-southeast-2 or your preferred region)
- [ ] Credentials added to `.env` file

**Required IAM Permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
    }
  ]
}
```

### ✅ Supabase Configuration

- [ ] Supabase project created
- [ ] Database table created (`bazaar_booths` or custom name)
- [ ] Project URL obtained
- [ ] API key obtained (anon/public key)
- [ ] Credentials added to `.env` file
- [ ] Sample data inserted for testing

**Required Table Schema:**
```sql
CREATE TABLE bazaar_booths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event_type TEXT,
  location TEXT,
  booth_price NUMERIC,
  booth_size TEXT,
  event_date DATE,
  crowd_size TEXT,
  food_category TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ Environment Variables (.env)

- [ ] `.env` file created in project root
- [ ] All required variables set:
  - [ ] `supabaseUrl`
  - [ ] `supabaseKey`
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_REGION`
- [ ] `.env` added to `.gitignore`
- [ ] No credentials committed to git

**Example .env:**
```env
# Supabase
supabaseUrl=https://your-project.supabase.co
supabaseKey=your_anon_key_here

# AWS Bedrock
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-southeast-2
```

### ✅ Testing

- [ ] Integration test runs successfully (`python test_integration.py`)
- [ ] All 4 tests pass:
  - [ ] Database connection
  - [ ] Preference parsing
  - [ ] Event matching
  - [ ] Chatbot functionality
- [ ] API server starts without errors (`python api_server.py`)
- [ ] Health check endpoint responds (`curl http://localhost:5000/api/health`)
- [ ] Example client runs successfully (`python example_client.py`)

### ✅ Security

- [ ] `.env` file in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] AWS credentials have minimal required permissions
- [ ] Supabase RLS (Row Level Security) configured if needed
- [ ] CORS configured for your frontend domain (production)
- [ ] Rate limiting considered for production

### ✅ Code Quality

- [ ] No syntax errors (`getDiagnostics` passed)
- [ ] All imports working
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Comments and documentation present

## Production Deployment Checklist

### ✅ Server Setup

- [ ] Production server provisioned
- [ ] Python 3.13+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Firewall rules configured

### ✅ Application Configuration

- [ ] Flask debug mode disabled (`app.run(debug=False)`)
- [ ] Production WSGI server installed (Gunicorn)
- [ ] Process manager configured (systemd/supervisor)
- [ ] Log rotation configured
- [ ] Error monitoring setup (Sentry/CloudWatch)

### ✅ Web Server

- [ ] Nginx/Apache installed
- [ ] Reverse proxy configured
- [ ] SSL/TLS certificate installed
- [ ] HTTPS enabled
- [ ] HTTP to HTTPS redirect configured

### ✅ Security (Production)

- [ ] Environment variables in secure location
- [ ] File permissions set correctly
- [ ] Firewall configured (only necessary ports open)
- [ ] Rate limiting enabled
- [ ] CORS restricted to frontend domain only
- [ ] Security headers configured
- [ ] Regular security updates scheduled

### ✅ Monitoring

- [ ] Application logging configured
- [ ] Error tracking enabled
- [ ] Performance monitoring setup
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured
- [ ] Backup strategy implemented

### ✅ Performance

- [ ] Database connection pooling enabled
- [ ] Caching strategy implemented (if needed)
- [ ] CDN configured for static assets (if applicable)
- [ ] Load testing performed
- [ ] Auto-scaling configured (if needed)

## Common Issues and Solutions

### Issue: "Module not found"
**Solution:**
```bash
# Ensure virtual environment is activated
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "AWS Connection failed"
**Solution:**
1. Verify credentials in `.env`
2. Check IAM permissions
3. Confirm Bedrock model access in your region
4. Test with AWS CLI: `aws bedrock list-foundation-models --region ap-southeast-2`

### Issue: "Supabase connection error"
**Solution:**
1. Verify URL and key in `.env`
2. Check table name matches in `database_service.py`
3. Ensure table exists in Supabase
4. Test connection in Supabase dashboard

### Issue: "JSON parsing error"
**Solution:**
1. Check LLM response in logs
2. Verify prompt formatting in `llm_service.py`
3. Ensure temperature is set correctly (0.3)
4. Check for markdown code blocks in response

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process or change port in api_server.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Issue: "CORS error in frontend"
**Solution:**
```python
# In api_server.py, configure CORS properly
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://yourdomain.com"]
    }
})
```

## Performance Tuning

### Database Optimization
- [ ] Add indexes on frequently queried columns
- [ ] Use connection pooling
- [ ] Optimize SQL queries
- [ ] Consider read replicas for high traffic

### LLM Optimization
- [ ] Cache frequent queries
- [ ] Batch similar requests
- [ ] Use lower max_tokens when possible
- [ ] Monitor token usage and costs

### API Optimization
- [ ] Enable gzip compression
- [ ] Implement response caching
- [ ] Use async/await for I/O operations
- [ ] Configure worker processes appropriately

## Cost Monitoring

### AWS Bedrock Costs
- [ ] Monitor token usage
- [ ] Set up billing alerts
- [ ] Track requests per day
- [ ] Optimize prompt length

**Estimated Costs (as of 2026):**
- Claude 3 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Average query: ~500 input + 300 output tokens = ~$0.006 per query
- 1000 queries/day = ~$6/day = ~$180/month

### Supabase Costs
- [ ] Monitor database size
- [ ] Track API requests
- [ ] Optimize query efficiency
- [ ] Consider paid plan if needed

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Review AWS Bedrock usage

### Weekly
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Analyze user feedback
- [ ] Review hallucination prevention effectiveness

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize costs
- [ ] Backup database
- [ ] Security audit
- [ ] Performance optimization review

## Support Resources

- **AWS Bedrock Documentation**: https://docs.aws.amazon.com/bedrock/
- **Supabase Documentation**: https://supabase.com/docs
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Python Boto3 Documentation**: https://boto3.amazonaws.com/v1/documentation/api/latest/index.html

## Emergency Contacts

- [ ] AWS Support contact configured
- [ ] Supabase support contact configured
- [ ] On-call developer contact list
- [ ] Escalation procedures documented
