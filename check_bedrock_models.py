"""
Check available Bedrock models in your region
"""
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("AWS BEDROCK MODEL CHECKER")
print("=" * 60)

region = os.getenv("AWS_REGION")
access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

print(f"\nRegion: {region}")
print(f"Access Key: {access_key[:10]}...")

try:
    # Create Bedrock client
    bedrock = boto3.client(
        'bedrock',
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    
    print("\n📡 Fetching available foundation models...")
    
    response = bedrock.list_foundation_models()
    
    print(f"\n✅ Found {len(response['modelSummaries'])} models")
    
    # Filter for Claude models
    claude_models = [
        model for model in response['modelSummaries']
        if 'claude' in model['modelId'].lower()
    ]
    
    if claude_models:
        print(f"\n🤖 Available Claude Models ({len(claude_models)}):")
        print("-" * 60)
        for model in claude_models:
            print(f"\nModel ID: {model['modelId']}")
            print(f"  Name: {model.get('modelName', 'N/A')}")
            print(f"  Provider: {model.get('providerName', 'N/A')}")
            if 'inputModalities' in model:
                print(f"  Input: {', '.join(model['inputModalities'])}")
            if 'outputModalities' in model:
                print(f"  Output: {', '.join(model['outputModalities'])}")
    else:
        print("\n⚠️  No Claude models found in this region")
        print("   You may need to request model access in the AWS Console")
    
    # Show all models
    print(f"\n📋 All Available Models:")
    print("-" * 60)
    for model in response['modelSummaries']:
        print(f"  - {model['modelId']}")
    
    print("\n" + "=" * 60)
    print("RECOMMENDED MODEL IDS FOR YOUR CODE:")
    print("=" * 60)
    
    # Find the best Claude 3 model
    claude_3_models = [
        m for m in claude_models 
        if 'claude-3' in m['modelId'].lower()
    ]
    
    if claude_3_models:
        print("\nUse one of these in llm_service.py:")
        for model in claude_3_models[:3]:  # Show top 3
            print(f"  {model['modelId']}")
    else:
        print("\n⚠️  No Claude 3 models available")
        print("   You need to request model access:")
        print("   1. Go to AWS Console → Bedrock → Model access")
        print("   2. Request access to Claude 3 models")
        print("   3. Wait for approval (usually instant)")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n📝 Troubleshooting:")
    print("   1. Verify AWS credentials are correct")
    print("   2. Check IAM permissions include 'bedrock:ListFoundationModels'")
    print("   3. Verify the region supports Bedrock")
    print("   4. Try region 'us-east-1' or 'us-west-2' if ap-southeast-2 doesn't work")

print("\n" + "=" * 60)
