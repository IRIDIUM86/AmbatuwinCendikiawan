"""
Test Claude Sonnet 4.5 specifically
"""
import os
import json
import boto3
from dotenv import load_dotenv
from config import BEDROCK_MODEL_ID

load_dotenv()

region = os.getenv("AWS_REGION")
access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

print("=" * 60)
print("TESTING CLAUDE SONNET 4.5")
print("=" * 60)
print(f"\nRegion: {region}")
print(f"Model: {BEDROCK_MODEL_ID}\n")

bedrock = boto3.client(
    'bedrock-runtime',
    region_name=region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 100,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": "Say 'Hello, I am Claude Sonnet 4.5!' and nothing else."}]
        }
    ]
})

try:
    print("Invoking model...")
    response = bedrock.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        body=body
    )
    response_body = json.loads(response.get('body').read())
    result = response_body['content'][0]['text']
    
    print(f"\n[SUCCESS] Model Response:")
    print(f"  {result}")
    print(f"\n[OK] Claude Sonnet 4.5 is working!")
    print(f"\nModel ID: {BEDROCK_MODEL_ID}")
    
except Exception as e:
    print(f"\n[ERROR] {e}")
    print("\nTroubleshooting:")
    print("  1. Check if you have model access in AWS Console")
    print("  2. Verify your AWS credentials are correct")
    print("  3. Ensure the region supports this model")
    print(f"  4. Current model ID: {BEDROCK_MODEL_ID}")

print("\n" + "=" * 60)
