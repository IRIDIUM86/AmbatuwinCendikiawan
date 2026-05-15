# Setting Up Your Bedrock Model ID

## Current Status

✅ **Supabase**: Working with static API key `sb_publishable_...`  
✅ **Database**: All operations working  
✅ **API Structure**: Complete  
⚠️ **Bedrock Model**: Needs correct model ID configuration  

## The Issue

Your AWS account in `ap-southeast-5` has Claude Sonnet 4.5 available, but it requires either:
1. An **inference profile** (cross-region access)
2. **Provisioned throughput** (dedicated capacity)

## How to Find Your Working Model ID

### Option 1: Check Your Working Code

If you have code that's currently working with Bedrock, check what model ID it uses:

```python
# Look for lines like:
modelId="your-model-id-here"
# or
model_id = "your-model-id-here"
```

### Option 2: Check AWS Console

1. Go to AWS Console → Bedrock
2. Click **Provisioned throughput** in the left menu
3. If you see a provisioned model, copy its ARN or ID
4. It will look like: `arn:aws:bedrock:ap-southeast-5:123456789012:provisioned-model/xxxxx`

### Option 3: Check Inference Profiles

1. AWS Console → Bedrock → **Cross-region inference**
2. Look for enabled profiles
3. Copy the profile ID (e.g., `us.anthropic.claude-sonnet-4-5-20250929-v1:0`)

## How to Configure

### Step 1: Update config.py

Open `config.py` and update the `BEDROCK_MODEL_ID`:

```python
# Example 1: Direct model (if you have on-demand access)
BEDROCK_MODEL_ID = "anthropic.claude-sonnet-4-5-20250929-v1:0"

# Example 2: Cross-region inference profile
BEDROCK_MODEL_ID = "us.anthropic.claude-sonnet-4-5-20250929-v1:0"

# Example 3: Provisioned throughput
BEDROCK_MODEL_ID = "arn:aws:bedrock:ap-southeast-5:123456789012:provisioned-model/your-id"
```

### Step 2: Test the Configuration

```bash
python test_sonnet_45.py
```

If it works, you'll see:
```
[SUCCESS] Model Response:
  Hello, I am Claude Sonnet 4.5!

[OK] Claude Sonnet 4.5 is working!
```

### Step 3: Run Full Integration Test

```bash
python test_integration.py
```

## Common Model ID Formats

### Direct Model Access (On-Demand)
```
anthropic.claude-sonnet-4-5-20250929-v1:0
```
- Requires: Model access enabled in AWS Console
- Works: If your account has on-demand access

### Cross-Region Inference Profile
```
us.anthropic.claude-sonnet-4-5-20250929-v1:0
eu.anthropic.claude-sonnet-4-5-20250929-v1:0
ap.anthropic.claude-sonnet-4-5-20250929-v1:0
```
- Requires: Cross-region inference enabled
- Works: Across all regions

### Provisioned Throughput
```
arn:aws:bedrock:ap-southeast-5:123456789012:provisioned-model/abc123xyz
```
- Requires: Provisioned model created
- Works: Dedicated capacity, guaranteed throughput

## If You Don't Know Your Model ID

**Please provide me with:**

1. The model ID from your working Bedrock code, OR
2. Screenshot of your AWS Bedrock console showing provisioned models, OR
3. The exact error message you get when trying to use Bedrock

Then I can update the configuration for you!

## Testing Different Model IDs

You can test different model IDs by editing `config.py` and running:

```bash
# Test the model
python test_sonnet_45.py

# If it works, test full integration
python test_integration.py
```

## Current Configuration Files

All these files now use the model ID from `config.py`:
- ✅ `llm_service.py` - LLM service
- ✅ `api_server.py` - API server
- ✅ `test_integration.py` - Integration tests

Just update `config.py` once, and all files will use the correct model!

## Need Help?

If you're still stuck, please share:
1. Your working model ID (if you have one)
2. Or tell me if you have provisioned throughput set up
3. Or let me know if you want to try a different region

I'll update the configuration for you!
