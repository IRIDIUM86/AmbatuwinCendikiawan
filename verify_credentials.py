"""
Credential Verification Script
Helps you verify your Supabase and AWS credentials are correct
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("CREDENTIAL VERIFICATION")
print("=" * 60)

# Check if .env file exists
if not os.path.exists('.env'):
    print("\n❌ ERROR: .env file not found!")
    print("   Create a .env file in the project root directory")
    exit(1)

print("\n✅ .env file found")

# Check Supabase credentials
print("\n" + "=" * 60)
print("SUPABASE CREDENTIALS")
print("=" * 60)

supabase_url = os.getenv("supabaseUrl")
supabase_key = os.getenv("supabaseKey")

if not supabase_url:
    print("❌ supabaseUrl is missing!")
else:
    print(f"✅ supabaseUrl: {supabase_url}")
    if not supabase_url.startswith("https://"):
        print("   ⚠️  WARNING: URL should start with https://")

if not supabase_key:
    print("❌ supabaseKey is missing!")
else:
    print(f"✅ supabaseKey: {supabase_key[:20]}... (length: {len(supabase_key)})")
    
    # Check if it's a valid JWT format (should start with eyJ)
    if not supabase_key.startswith("eyJ"):
        print("   ❌ ERROR: Invalid API key format!")
        print("   Your key should start with 'eyJ' (JWT format)")
        print("\n   📝 How to get the correct key:")
        print("   1. Go to https://app.supabase.com")
        print("   2. Select your project")
        print("   3. Go to Settings → API")
        print("   4. Copy the 'anon' 'public' key")
        print("   5. It should be a long string starting with 'eyJ'")
    else:
        print("   ✅ Key format looks correct (JWT)")

# Test Supabase connection
if supabase_url and supabase_key and supabase_key.startswith("eyJ"):
    print("\n📡 Testing Supabase connection...")
    try:
        from supabase import create_client
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Supabase connection successful!")
        
        # Try to query the table
        try:
            response = supabase.table("bazaar_booths").select("*").limit(1).execute()
            print(f"✅ Database query successful! Found {len(response.data)} record(s)")
        except Exception as e:
            print(f"⚠️  Database query failed: {e}")
            print("   Make sure the 'bazaar_booths' table exists in your database")
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")

# Check AWS credentials
print("\n" + "=" * 60)
print("AWS CREDENTIALS")
print("=" * 60)

aws_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION")

if not aws_key_id:
    print("❌ AWS_ACCESS_KEY_ID is missing!")
else:
    print(f"✅ AWS_ACCESS_KEY_ID: {aws_key_id[:10]}... (length: {len(aws_key_id)})")
    if not aws_key_id.startswith("AKIA"):
        print("   ⚠️  WARNING: AWS access keys typically start with 'AKIA'")

if not aws_secret:
    print("❌ AWS_SECRET_ACCESS_KEY is missing!")
else:
    print(f"✅ AWS_SECRET_ACCESS_KEY: {aws_secret[:10]}... (length: {len(aws_secret)})")

if not aws_region:
    print("❌ AWS_REGION is missing!")
else:
    print(f"✅ AWS_REGION: {aws_region}")

# Test AWS connection
if aws_key_id and aws_secret and aws_region:
    print("\n📡 Testing AWS connection...")
    try:
        import boto3
        sts = boto3.client(
            'sts',
            region_name=aws_region,
            aws_access_key_id=aws_key_id,
            aws_secret_access_key=aws_secret
        )
        identity = sts.get_caller_identity()
        print(f"✅ AWS connection successful!")
        print(f"   Account: {identity['Account']}")
        print(f"   User ARN: {identity['Arn']}")
        
        # Test Bedrock access
        print("\n📡 Testing AWS Bedrock access...")
        try:
            bedrock = boto3.client(
                'bedrock-runtime',
                region_name=aws_region,
                aws_access_key_id=aws_key_id,
                aws_secret_access_key=aws_secret
            )
            print("✅ AWS Bedrock client initialized successfully!")
            print("   Note: Actual model access will be tested when you make API calls")
        except Exception as e:
            print(f"⚠️  Bedrock client initialization warning: {e}")
            
    except Exception as e:
        print(f"❌ AWS connection failed: {e}")
        print("\n   📝 Troubleshooting:")
        print("   1. Verify your AWS credentials are correct")
        print("   2. Check if the IAM user has necessary permissions")
        print("   3. Ensure the region is correct")

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

issues = []
if not supabase_key or not supabase_key.startswith("eyJ"):
    issues.append("❌ Supabase API key needs to be fixed")
if not supabase_url:
    issues.append("❌ Supabase URL is missing")
if not aws_key_id:
    issues.append("❌ AWS Access Key ID is missing")
if not aws_secret:
    issues.append("❌ AWS Secret Access Key is missing")
if not aws_region:
    issues.append("❌ AWS Region is missing")

if issues:
    print("\n⚠️  Issues found:")
    for issue in issues:
        print(f"   {issue}")
    print("\n📝 Please fix these issues in your .env file before running the application")
else:
    print("\n✅ All credentials look good!")
    print("   You can now run: python test_integration.py")

print("\n" + "=" * 60)
