"""
Simple Supabase Connection Test
Run this after updating your .env file with the correct API key
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

print("=" * 60)
print("SUPABASE CONNECTION TEST")
print("=" * 60)

url = os.getenv("supabaseUrl")
key = os.getenv("supabaseKey")

print(f"\nURL: {url}")
print(f"Key: {key[:20]}... (length: {len(key) if key else 0})")

if not key:
    print("\n❌ ERROR: supabaseKey not found in .env file")
    exit(1)

if not key.startswith("eyJ"):
    print("\n❌ ERROR: Invalid API key format!")
    print("   Your Supabase API key should start with 'eyJ' (JWT format)")
    print("\n📝 How to get the correct key:")
    print("   1. Go to https://app.supabase.com")
    print("   2. Select your project")
    print("   3. Go to Settings → API")
    print("   4. Copy the 'anon' 'public' key (the long one starting with 'eyJ')")
    print("   5. Replace the supabaseKey value in your .env file")
    exit(1)

print("\n📡 Testing connection...")

try:
    supabase = create_client(url, key)
    print("✅ Supabase client created successfully!")
    
    # Try to query the table
    print("\n📊 Testing database query...")
    response = supabase.table("bazaar_booths").select("*").limit(1).execute()
    
    if response.data:
        print(f"✅ SUCCESS! Found {len(response.data)} record(s)")
        print(f"\nSample data: {response.data[0] if response.data else 'No data'}")
    else:
        print("⚠️  Query successful but no data found")
        print("   Make sure you have data in the 'bazaar_booths' table")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nYou can now run: python test_integration.py")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n📝 Troubleshooting:")
    print("   1. Verify the API key is correct (should start with 'eyJ')")
    print("   2. Check if the table 'bazaar_booths' exists in your database")
    print("   3. Verify the URL matches your project")
    print("\n" + "=" * 60)
