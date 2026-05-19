"""
Test all available Claude models to find one that works
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
print("TESTING ALL AVAILABLE CLAUDE MODELS")
print("=" * 60)
print(f"\nRegion: {region}\n")

bedrock = boto3.client(
    'bedrock-runtime',
    region_name=region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

# All Claude models from your list
models_to_test = [
    "anthropic.claude-sonnet-4-5-20250929-v1:0",
    "anthropic.claude-sonnet-4-6",
    "anthropic.claude-sonnet-4-20250514-v1:0",
    "anthropic.claude-haiku-4-5-20251001-v1:0",
    "anthropic.claude-opus-4-5-20251101-v1:0",
    "anthropic.claude-opus-4-6-v1",
    "anthropic.claude-opus-4-7",
]

body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 50,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": "Reply with just 'OK'"}]
        }
    ]
})

print("Testing each model...\n")

working_models = []

for model_id in models_to_test:
    print(f"Testing: {model_id}")
    try:
        response = bedrock.invoke_model(
            modelId=model_id,
            body=body
        )
        response_body = json.loads(response.get('body').read())
        result = response_body['content'][0]['text']
        
        print(f"  [SUCCESS] Response: {result}")
        working_models.append(model_id)
        
    except Exception as e:
        error_msg = str(e)
        if "throughput" in error_msg.lower():
            print(f"  [FAIL] Requires inference profile or provisioned throughput")
        elif "invalid" in error_msg.lower():
            print(f"  [FAIL] Invalid model ID")
        elif "access" in error_msg.lower():
            print(f"  [FAIL] No access to this model")
        else:
            print(f"  [FAIL] {error_msg[:70]}...")
    print()

print("=" * 60)
if working_models:
    print("WORKING MODELS FOUND!")
    print("=" * 60)
    for model in working_models:
        print(f"  ✓ {model}")
    print(f"\nRecommended model to use:")
    print(f'  self.model_id = "{working_models[0]}"')
else:
    print("NO WORKING MODELS FOUND")
    print("=" * 60)
    print("\nYour account requires either:")
    print("  1. Inference profiles (cross-region access)")
    print("  2. Provisioned throughput")
    print("  3. Different region with better support")
    print("\nPlease provide the model ID that works in your setup.")

print("\n" + "=" * 60)
