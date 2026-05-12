import os
import json
import boto3
from dotenv import load_dotenv
from supabase import create_client, Client

def fetch_booth_data():
    try:
        # Only select columns necessary for analysis to save tokens
        response = supabase.table("bazaar_booths").select("*").execute()
        return response.data
    except Exception as e:
        return []
    
load_dotenv()

# --- 1. Supabase Connection ---
url = os.getenv("supabaseUrl")
key = os.getenv("supabaseKey")
supabase: Client = create_client(url, key)

# --- 2. AWS Bedrock Connection ---
# We use STS just once to verify the keys are valid before moving on
try:
    # Check identity using STS client
    sts = boto3.client(
        'sts',
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    identity = sts.get_caller_identity()
    print(f"✅ Authenticated as: {identity['Arn']}")

    # If identity works, initialize the Bedrock Runtime
    bedrock = boto3.client(
        'bedrock-runtime',
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
except Exception as e:
    print(f"❌ AWS Connection failed: {e}")
    bedrock = None # Prevents the script from crashing later

# --- 3. Functions ---
def fetch_booths():
    try:
        response = supabase.table("bazaar_booths").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching Supabase data: {e}")
        return []

def ask_bedrock(prompt_text):
    if not bedrock:
        return "Bedrock client not initialized."

    # Body format for Claude 3
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
            modelId="anthropic.claude-3-sonnet-20240229-v1:0",
            body=body
        )
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']
    except Exception as e:
        return f"Bedrock invocation error: {e}"

# --- 4. Execution ---
if __name__ == "__main__":
    data = fetch_booth_data()
    
    if data:
        # Only send the first 5 booths to stay under the token limit
        limited_data = data[:5] 
        print(f"📊 Found {len(data)} booths. Sending top 5 to Bedrock...")
        prompt = f"Analyze the following booth price data and provide insights:\n{limited_data}"
        result = ask_bedrock(prompt)
        print("\n--- AI ANALYSIS ---\n", result)