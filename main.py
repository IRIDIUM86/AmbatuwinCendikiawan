import os
import json
import boto3
import requests
from dotenv import load_dotenv
from config import BEDROCK_MODEL_ID

load_dotenv()

# --- 1. Supabase Connection (HTTP-based) ---
supabase_url = os.getenv("supabaseUrl")
supabase_key = os.getenv("supabaseKey")
supabase_headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json"
}

def fetch_booth_data():
    """Fetch booth data using HTTP requests"""
    try:
        url = f"{supabase_url}/rest/v1/bazaar_booths?select=*"
        response = requests.get(url, headers=supabase_headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching booth data: {e}")
        return []

# --- 2. AWS Bedrock Connection ---
try:
    # Check identity using STS client
    sts = boto3.client(
        'sts',
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    identity = sts.get_caller_identity()
    print(f"[OK] Authenticated as: {identity['Arn']}")

    # If identity works, initialize the Bedrock Runtime
    bedrock = boto3.client(
        'bedrock-runtime',
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    print(f"[OK] Using model: {BEDROCK_MODEL_ID}")
except Exception as e:
    print(f"[ERROR] AWS Connection failed: {e}")
    bedrock = None

# --- 3. Functions ---
def ask_bedrock(prompt_text):
    """Ask Bedrock LLM a question"""
    if not bedrock:
        return "Bedrock client not initialized."

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 500,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt_text}]
            }
        ]
    })

    try:
        response = bedrock.invoke_model(
            modelId=BEDROCK_MODEL_ID,  # From config.py
            body=body
        )
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']
    except Exception as e:
        return f"Bedrock invocation error: {e}"

# --- 4. Execution ---
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("BOOTH DATA ANALYSIS")
    print("=" * 60)
    
    data = fetch_booth_data()
    
    if data:
        # Only send the first 5 booths to stay under the token limit
        limited_data = data[:5]
        print(f"\n[*] Found {len(data)} booths in database")
        print(f"[*] Sending top 5 to Bedrock for analysis...\n")
        
        prompt = f"""Analyze the following booth data and provide insights about pricing, 
availability, and features. Keep your response concise.

Booth Data:
{json.dumps(limited_data, indent=2)}

Provide a brief analysis."""
        
        result = ask_bedrock(prompt)
        print("=" * 60)
        print("AI ANALYSIS")
        print("=" * 60)
        print(result)
        print("\n" + "=" * 60)
    else:
        print("\n[ERROR] No booth data found")
        print("Check your Supabase connection and table name")