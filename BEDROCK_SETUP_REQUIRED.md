# AWS Bedrock Setup Required

## Current Status

✅ **Supabase Connection**: Working perfectly with static API key  
✅ **Database Service**: All CRUD operations working  
✅ **API Structure**: Complete and ready  
❌ **AWS Bedrock**: Model access needs configuration  

## The Issue

Your AWS account in region `ap-southeast-5` has Claude 4 models listed, but they require **inference profiles** or **provisioned throughput** which aren't currently configured.

## Solution Options

### Option 1: Request Model Access (Recommended)

1. Go to AWS Console: https://console.aws.amazon.com/bedrock/
2. Navigate to **Bedrock** → **Model access**
3. Click **Modify model access** or **Request model access**
4. Enable access to:
   - **Claude 3.5 Sonnet** (recommended)
   - **Claude 3 Sonnet** (fallback)
5. Submit the request (usually approved instantly)
6. Wait 2-5 minutes for activation

After approval, the model IDs should work:
- `anthropic.claude-3-5-sonnet-20241022-v2:0`
- `anthropic.claude-3-sonnet-20240229-v1:0`

### Option 2: Use a Different Region

Some regions have better Bedrock support. Try changing your region in `.env`:

```env
# Try one of these regions
AWS_REGION=us-east-1      # US East (N. Virginia) - Best support
AWS_REGION=us-west-2      # US West (Oregon) - Good support  
AWS_REGION=ap-southeast-2 # Asia Pacific (Sydney)
```

Then run `python test_bedrock_simple.py` again to test.

### Option 3: Use Cross-Region Inference (If Available)

Cross-region inference profiles allow you to use models from other regions. These usually work without additional setup:

Try updating `llm_service.py` with:
```python
self.model_id = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"
```

But this requires your account to have cross-region inference enabled.

### Option 4: Temporary Workaround - Skip LLM Features

For now, you can test the system without LLM by using the database filtering only:

1. Use `/api/events/all` endpoint to get all events
2. Use `/api/events/<id>` to get specific events
3. Implement client-side filtering in your frontend

The LLM features (natural language search, chatbot) will be added once Bedrock access is configured.

## How to Check Model Access

Run this command to see your current model access:

```bash
python check_bedrock_models.py
```

This will show which models you have access to.

## Testing After Setup

Once you've configured model access:

```bash
# Test Bedrock connection
python test_bedrock_simple.py

# Test full integration
python test_integration.py

# Start the API server
python api_server.py
```

## Current Working Features

Even without Bedrock, these features work:

✅ **Database Operations**
- `GET /api/events/all` - List all events
- `GET /api/events/<id>` - Get specific event
- Database filtering by criteria

✅ **API Server**
- All endpoints respond
- Error handling works
- CORS configured

## Features Requiring Bedrock

These features need Bedrock access:

❌ **Natural Language Processing**
- `POST /api/events/search` - NL search
- `POST /api/preferences/parse` - Parse preferences
- `POST /api/chat` - Chatbot

## Recommended Next Steps

1. **Request Bedrock model access** (5 minutes)
   - Go to AWS Console → Bedrock → Model access
   - Enable Claude 3.5 Sonnet
   - Wait for approval

2. **Test the connection**
   ```bash
   python test_bedrock_simple.py
   ```

3. **Update model ID in code** (if needed)
   - Edit `llm_service.py`
   - Change `self.model_id` to the working model ID

4. **Run full integration test**
   ```bash
   python test_integration.py
   ```

5. **Start using the API**
   ```bash
   python api_server.py
   ```

## Alternative: Use OpenAI Instead

If AWS Bedrock is too complex, you can modify the code to use OpenAI's API instead:

1. Install OpenAI SDK: `pip install openai`
2. Modify `llm_service.py` to use OpenAI
3. Add `OPENAI_API_KEY` to `.env`

Let me know if you want me to create an OpenAI version!

## Support

- **AWS Bedrock Documentation**: https://docs.aws.amazon.com/bedrock/
- **Model Access Guide**: https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html
- **Pricing**: https://aws.amazon.com/bedrock/pricing/

---

**Bottom Line**: Your backend is 90% complete! Just need to configure AWS Bedrock model access to enable the AI features. The database and API structure are working perfectly.
