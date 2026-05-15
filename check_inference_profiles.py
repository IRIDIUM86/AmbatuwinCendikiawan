"""
Check available Bedrock inference profiles
"""
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("AWS BEDROCK INFERENCE PROFILES")
print("=" * 60)

region = os.getenv("AWS_REGION")
access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

print(f"\nRegion: {region}")

try:
    bedrock = boto3.client(
        'bedrock',
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    
    print("\n📡 Fetching inference profiles...")
    
    # List inference profiles
    response = bedrock.list_inference_profiles()
    
    profiles = response.get('inferenceProfileSummaries', [])
    
    if profiles:
        print(f"\n✅ Found {len(profiles)} inference profiles")
        print("\n🎯 Available Inference Profiles:")
        print("-" * 60)
        
        for profile in profiles:
            print(f"\nProfile ID: {profile['inferenceProfileId']}")
            print(f"  Name: {profile.get('inferenceProfileName', 'N/A')}")
            print(f"  Type: {profile.get('type', 'N/A')}")
            if 'models' in profile:
                print(f"  Models: {', '.join([m.get('modelId', '') for m in profile['models']])}")
        
        # Find Claude Sonnet profiles
        sonnet_profiles = [
            p for p in profiles 
            if 'sonnet' in p['inferenceProfileId'].lower()
        ]
        
        if sonnet_profiles:
            print("\n" + "=" * 60)
            print("RECOMMENDED PROFILE IDS FOR YOUR CODE:")
            print("=" * 60)
            print("\nUse one of these in llm_service.py:")
            for profile in sonnet_profiles[:3]:
                print(f"  {profile['inferenceProfileId']}")
        
    else:
        print("\n⚠️  No inference profiles found")
        print("   Trying to use cross-region inference profile...")
        
        # Try common cross-region profiles
        common_profiles = [
            "us.anthropic.claude-sonnet-4-20250514-v1:0",
            "us.anthropic.claude-sonnet-4-6",
            "eu.anthropic.claude-sonnet-4-20250514-v1:0"
        ]
        
        print("\n📋 Try these cross-region inference profiles:")
        for profile in common_profiles:
            print(f"  {profile}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    
    # Provide fallback recommendations
    print("\n📋 FALLBACK: Try these cross-region inference profiles:")
    print("-" * 60)
    print("  us.anthropic.claude-sonnet-4-20250514-v1:0")
    print("  us.anthropic.claude-sonnet-4-6")
    print("  us.anthropic.claude-3-5-sonnet-20241022-v2:0")
    print("\nThese work across regions and don't require model access requests")

print("\n" + "=" * 60)
