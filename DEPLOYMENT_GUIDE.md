# Deployment Guide

## 🚀 Production Deployment Options

### Option 1: AWS EC2 (Recommended)

#### Step 1: Launch EC2 Instance

```bash
# Choose Ubuntu 22.04 LTS
# Instance type: t3.small or larger
# Security group: Allow ports 80, 443, 22
```

#### Step 2: Connect and Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.13
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install python3.13 python3.13-venv python3.13-dev -y

# Install nginx
sudo apt install nginx -y

# Install supervisor (process manager)
sudo apt install supervisor -y
```

#### Step 3: Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/www/food-vendor-api
cd /var/www/food-vendor-api

# Clone or upload your code
# (Use git clone or scp to transfer files)

# Create virtual environment
python3.13 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create .env file
sudo nano .env
# (Add your credentials)
```

#### Step 4: Configure Gunicorn

Create `/var/www/food-vendor-api/gunicorn_config.py`:

```python
bind = "127.0.0.1:8000"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
errorlog = "/var/log/gunicorn/error.log"
accesslog = "/var/log/gunicorn/access.log"
loglevel = "info"
```

Create log directory:
```bash
sudo mkdir -p /var/log/gunicorn
sudo chown -R ubuntu:ubuntu /var/log/gunicorn
```

#### Step 5: Configure Supervisor

Create `/etc/supervisor/conf.d/food-vendor-api.conf`:

```ini
[program:food-vendor-api]
directory=/var/www/food-vendor-api
command=/var/www/food-vendor-api/venv/bin/gunicorn -c gunicorn_config.py api_server:app
user=ubuntu
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/food-vendor-api/err.log
stdout_logfile=/var/log/food-vendor-api/out.log
environment=PATH="/var/www/food-vendor-api/venv/bin"
```

Create log directory and start:
```bash
sudo mkdir -p /var/log/food-vendor-api
sudo chown -R ubuntu:ubuntu /var/log/food-vendor-api

sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start food-vendor-api
```

#### Step 6: Configure Nginx

Create `/etc/nginx/sites-available/food-vendor-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://127.0.0.1:8000/api/health;
        access_log off;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/food-vendor-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

#### Step 8: Verify Deployment

```bash
# Check supervisor status
sudo supervisorctl status food-vendor-api

# Check nginx status
sudo systemctl status nginx

# Test API
curl http://your-domain.com/api/health
```

---

### Option 2: AWS Elastic Beanstalk

#### Step 1: Prepare Application

Create `application.py` (Elastic Beanstalk entry point):
```python
from api_server import app as application

if __name__ == "__main__":
    application.run()
```

Create `.ebextensions/python.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: application:application
  aws:elasticbeanstalk:application:environment:
    PYTHONPATH: "/var/app/current:$PYTHONPATH"
```

#### Step 2: Deploy

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p python-3.13 food-vendor-api --region ap-southeast-2

# Create environment
eb create food-vendor-api-prod

# Set environment variables
eb setenv supabaseUrl=your_url supabaseKey=your_key \
  AWS_ACCESS_KEY_ID=your_key AWS_SECRET_ACCESS_KEY=your_secret \
  AWS_REGION=ap-southeast-2

# Deploy
eb deploy

# Open in browser
eb open
```

---

### Option 3: Docker Container

#### Step 1: Create Dockerfile

```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5000

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api_server:app"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Step 3: Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 4: Heroku

#### Step 1: Prepare Files

Create `Procfile`:
```
web: gunicorn api_server:app
```

Create `runtime.txt`:
```
python-3.13.0
```

#### Step 2: Deploy

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create food-vendor-api

# Set environment variables
heroku config:set supabaseUrl=your_url
heroku config:set supabaseKey=your_key
heroku config:set AWS_ACCESS_KEY_ID=your_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_secret
heroku config:set AWS_REGION=ap-southeast-2

# Deploy
git push heroku main

# Open app
heroku open
```

---

## 🔒 Production Security Checklist

### Environment Variables
- [ ] All secrets in environment variables (not in code)
- [ ] `.env` file not committed to git
- [ ] Different credentials for dev/staging/prod
- [ ] Regular credential rotation

### API Security
- [ ] CORS restricted to frontend domain only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced (no HTTP)
- [ ] Security headers configured

### AWS Security
- [ ] IAM user with minimal permissions
- [ ] MFA enabled on AWS account
- [ ] CloudTrail logging enabled
- [ ] Regular access key rotation

### Database Security
- [ ] Supabase RLS (Row Level Security) enabled
- [ ] Database backups configured
- [ ] Connection pooling enabled
- [ ] Query timeout limits set

### Server Security
- [ ] Firewall configured (only necessary ports)
- [ ] SSH key-based authentication only
- [ ] Regular security updates
- [ ] Fail2ban or similar installed
- [ ] Log monitoring enabled

---

## 📊 Monitoring Setup

### Application Monitoring

#### Option 1: AWS CloudWatch

```python
# Add to api_server.py
import logging
from logging.handlers import CloudWatchLogHandler

logger = logging.getLogger(__name__)
handler = CloudWatchLogHandler(log_group='food-vendor-api')
logger.addHandler(handler)
```

#### Option 2: Sentry

```bash
pip install sentry-sdk[flask]
```

```python
# Add to api_server.py
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

### Health Monitoring

Setup monitoring service (UptimeRobot, Pingdom, etc.):
- Monitor: `https://your-domain.com/api/health`
- Interval: 5 minutes
- Alert on: HTTP status != 200

### Log Aggregation

#### Using ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Install Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.0.0-amd64.deb
sudo dpkg -i filebeat-8.0.0-amd64.deb

# Configure to send logs to Elasticsearch
sudo nano /etc/filebeat/filebeat.yml
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.13'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest
    
    - name: Run tests
      run: pytest
    
    - name: Deploy to EC2
      env:
        PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
        HOST: ${{ secrets.EC2_HOST }}
        USER: ubuntu
      run: |
        echo "$PRIVATE_KEY" > private_key && chmod 600 private_key
        ssh -o StrictHostKeyChecking=no -i private_key ${USER}@${HOST} '
          cd /var/www/food-vendor-api &&
          git pull origin main &&
          source venv/bin/activate &&
          pip install -r requirements.txt &&
          sudo supervisorctl restart food-vendor-api
        '
```

---

## 📈 Scaling Strategy

### Vertical Scaling (Single Server)
```
t3.small  → t3.medium → t3.large → t3.xlarge
2GB RAM     4GB RAM     8GB RAM    16GB RAM
$15/mo      $30/mo      $60/mo     $120/mo
```

### Horizontal Scaling (Multiple Servers)

```
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼──┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐
│API 1│ │API 2│ │API 3│ │API 4│
└─────┘ └─────┘ └─────┘ └─────┘
```

Setup with AWS Application Load Balancer:
1. Create multiple EC2 instances
2. Setup ALB
3. Configure health checks
4. Add instances to target group

---

## 💰 Cost Estimation

### AWS Costs (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| EC2 (t3.small) | 24/7 | $15 |
| Bedrock (Claude 3) | 10K queries | $60 |
| Data Transfer | 100GB | $9 |
| **Total** | | **~$84/mo** |

### Optimization Tips
- Use Reserved Instances (save 30-40%)
- Cache frequent queries (reduce Bedrock calls)
- Optimize prompts (reduce tokens)
- Use Spot Instances for non-critical workloads

---

## 🔧 Maintenance Tasks

### Daily
- Check error logs
- Monitor API response times
- Review AWS Bedrock usage

### Weekly
- Review performance metrics
- Check disk space
- Analyze user patterns
- Review security logs

### Monthly
- Update dependencies
- Rotate credentials
- Review and optimize costs
- Database maintenance
- Security audit

---

## 🆘 Troubleshooting Production Issues

### High Response Times
```bash
# Check Gunicorn workers
sudo supervisorctl status

# Check system resources
htop

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application logs
sudo tail -f /var/log/food-vendor-api/out.log
```

### Application Crashes
```bash
# Check supervisor logs
sudo tail -f /var/log/food-vendor-api/err.log

# Restart application
sudo supervisorctl restart food-vendor-api

# Check system logs
sudo journalctl -u supervisor -f
```

### Database Connection Issues
```bash
# Test Supabase connection
python3 -c "from supabase import create_client; print('OK')"

# Check network connectivity
curl https://your-project.supabase.co
```

---

## 📞 Support Contacts

- **AWS Support**: https://console.aws.amazon.com/support/
- **Supabase Support**: https://supabase.com/support
- **Emergency Hotline**: [Your on-call number]

---

**Deployment Complete! Your API is now live! 🎉**
