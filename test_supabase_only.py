"""
Simple Supabase Connection Test
Run this after updating your .env file with the correct API key
"""
import os
import requests
from dotenv import load_dotenv

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

if not url:
    print("\n❌ ERROR: supabaseUrl not found in .env file")
    exit(1)

print("\n� Testing connection with static API key...")

try:
    # Test connection using direct HTTP request
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    
    test_url = f"{url.rstrip('/')}/rest/v1/bazaar_booths?select=*&limit=1"
    response = requests.get(test_url, headers=headers)
    
    if response.status_code == 200:
        print("✅ Supabase connection successful!")
        
        data = response.json()
        if data:
            print(f"✅ SUCCESS! Found {len(data)} record(s)")
            print(f"\nSample data: {data[0]}")
        else:
            print("⚠️  Query successful but no data found")
            print("   Make sure you have data in the 'bazaar_booths' table")
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\nYou can now run: python test_integration.py")
    else:
        print(f"\n❌ ERROR: HTTP {response.status_code}")
        print(f"Response: {response.text}")
        print("\n📝 Troubleshooting:")
        print("   1. Verify the API key is correct")
        print("   2. Check if the table 'bazaar_booths' exists in your database")
        print("   3. Verify the URL matches your project")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n📝 Troubleshooting:")
    print("   1. Verify the API key is correct")
    print("   2. Check if the table 'bazaar_booths' exists in your database")
    print("   3. Verify the URL matches your project")
    print("\n" + "=" * 60)
