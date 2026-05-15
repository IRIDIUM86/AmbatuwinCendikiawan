"""
Find the correct inference profile for Claude Sonnet 4.5
"""
import os
import json
import boto3
from dotenv import load_dotenv

load_dotenv()

region = os.getenv("AWS_REGION")
access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

print("=" * 60)
print("FINDING CLAUDE SONNET 4.5 INFERENCE PROFILE")
print("=" * 60)
print(f"\nRegion: {region}\n")

bedrock = boto3.client(
    'bedrock-runtime',
    region_name=region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

# Possible inference profile patterns for Sonnet 4.5
possible_profiles = [
    # Cross-region profiles
    "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "ap.anthropic.claude-sonnet-4-5-20250929-v1:0",
    
    # Regional profiles
    "anthropic.claude-sonnet-4-5-20250929-v1:0",
    
    # Shorter versions
    "us.anthropic.claude-sonnet-4-5",
    "anthropic.claude-sonnet-4-5",
    
    # Alternative formats
    "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-sonnet-4-5-20250929-v1:0",
]

body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 50,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": "Say 'Working!' in one word."}]
        }
    ]
})

print("Testing inference profiles...\n")

for profile in possible_profiles:
    print(f"Trying: {profile}")
    try:
        response = bedrock.invoke_model(
            modelId=profile,
            body=body
        )
        response_body = json.loads(response.get('body').read())
        result = response_body['content'][0]['text']
        
        print(f"  [SUCCESS] Response: {result}")
        print(f"\n" + "=" * 60)
        print(f"WORKING INFERENCE PROFILE FOUND!")
        print(f"=" * 60)
        print(f"\nUse this in your code:")
        print(f'  self.model_id = "{profile}"')
        print("\n" + "=" * 60)
        break
        
    except Exception as e:
        error_msg = str(e)
        if "invalid" in error_msg.lower() or "not found" in error_msg.lower():
            print(f"  [SKIP] Not available")
        elif "throughput" in error_msg.lower():
            print(f"  [SKIP] Still requires profile")
        elif "access" in error_msg.lower():
            print(f"  [SKIP] No access")
        else:
            print(f"  [SKIP] {error_msg[:60]}...")
    print()

print("\nIf no profile worked, you may need to:")
print("  1. Contact AWS Support to enable inference profiles")
print("  2. Use provisioned throughput instead")
print("  3. Try a different region (us-east-1, us-west-2)")
print("\n" + "=" * 60)
