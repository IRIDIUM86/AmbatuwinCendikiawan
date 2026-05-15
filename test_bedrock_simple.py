"""
Simple Bedrock test to find working model ID
"""
import os
import json
import boto3
from dotenv import load_dotenv

load_dotenv()

region = os.getenv("AWS_REGION")
access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

bedrock = boto3.client(
    'bedrock-runtime',
    region_name=region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

# List of model IDs to try
model_ids_to_try = [
    "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
    "anthropic.claude-3-5-sonnet-20240620-v1:0",
    "us.anthropic.claude-3-sonnet-20240229-v1:0",
    "anthropic.claude-3-sonnet-20240229-v1:0",
]

body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 50,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": "Say 'Hello' in one word"}]
        }
    ]
})

print("=" * 60)
print("TESTING BEDROCK MODEL IDS")
print("=" * 60)
print(f"\nRegion: {region}\n")

for model_id in model_ids_to_try:
    print(f"Testing: {model_id}")
    try:
        response = bedrock.invoke_model(
            modelId=model_id,
            body=body
        )
        response_body = json.loads(response.get('body').read())
        result = response_body['content'][0]['text']
        print(f"  [SUCCESS] Response: {result}")
        print(f"  >>> USE THIS MODEL ID: {model_id} <<<\n")
        break  # Stop at first working model
    except Exception as e:
        error_msg = str(e)
        if "invalid" in error_msg.lower():
            print(f"  [FAIL] Invalid model ID\n")
        elif "throughput" in error_msg.lower():
            print(f"  [FAIL] Requires inference profile\n")
        elif "access" in error_msg.lower():
            print(f"  [FAIL] No access to this model\n")
        else:
            print(f"  [FAIL] {error_msg[:80]}...\n")

print("=" * 60)
