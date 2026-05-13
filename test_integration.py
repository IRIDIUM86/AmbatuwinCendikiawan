"""
Integration test script to verify the complete system
"""
import os
from dotenv import load_dotenv
from llm_service import BedrockLLMService
from database_service import DatabaseService
from event_matcher import EventMatcher
from config import BEDROCK_MODEL_ID

load_dotenv()

def test_system():
    """Test the complete integration"""
    print("[*] Initializing services...")
    
    # Initialize services
    llm_service = BedrockLLMService(
        region=os.getenv("AWS_REGION"),
        access_key=os.getenv("AWS_ACCESS_KEY_ID"),
        secret_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        model_id=BEDROCK_MODEL_ID  # From config.py
    )
    
    db_service = DatabaseService(
        supabase_url=os.getenv("supabaseUrl"),
        supabase_key=os.getenv("supabaseKey")
    )
    
    event_matcher = EventMatcher(llm_service, db_service)
    
    print("[OK] Services initialized\n")
    
    # Test 1: Database connection
    print("[TEST 1] Fetching events from database...")
    events = db_service.fetch_all_events()
    print(f"[OK] Found {len(events)} events in database\n")
    
    # Test 2: Preference parsing
    print("[TEST 2] Parsing user preferences...")
    test_input = "I'm looking for a weekend bazaar in Jakarta with booth prices under 3 million rupiah"
    preferences = llm_service.parse_user_preferences(test_input)
    print(f"[OK] Extracted preferences: {preferences}\n")
    
    # Test 3: Event matching
    print("[TEST 3] Finding matching events...")
    results = event_matcher.find_matching_events(test_input)
    print(f"[OK] Found {len(results['matches'])} matching events")
    print(f"   Extracted preferences: {results['extracted_preferences']}")
    if results['matches']:
        print(f"   Top match: {results['matches'][0].get('name', 'N/A')} (score: {results['matches'][0].get('relevance_score')})")
    print()
    
    # Test 4: Chatbot
    print("[TEST 4] Testing chatbot...")
    chat_result = event_matcher.chat("What events do you have available?")
    print(f"[OK] Chatbot response: {chat_result['response'][:100]}...\n")
    
    print("[SUCCESS] All tests completed successfully!")

if __name__ == "__main__":
    test_system()
