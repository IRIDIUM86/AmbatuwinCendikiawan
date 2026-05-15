"""
Example client demonstrating how to interact with the backend API
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"


def search_events_example():
    """Example: Search for booths using natural language"""
    print("=" * 60)
    print("EXAMPLE 1: Search Booths")
    print("=" * 60)
    
    query = "I'm looking for an affordable booth under 500 rupiah"
    
    response = requests.post(
        f"{BASE_URL}/events/search",
        json={"query": query}
    )
    
    result = response.json()
    
    print(f"\nQuery: {query}")
    print(f"\nExtracted Preferences:")
    print(json.dumps(result.get('extracted_preferences', {}), indent=2))
    
    print(f"\nFound {len(result.get('matches', []))} matching booths:")
    for i, event in enumerate(result.get('matches', [])[:3], 1):
        print(f"\n{i}. Booth {event.get('booth_number', 'N/A')}")
        print(f"   Relevance Score: {event.get('relevance_score')}/100")
        print(f"   Booth ID: {event.get('booth_id', 'N/A')}")
        price = event.get('price', 0)
        print(f"   Price: Rp {price:,.2f}" if isinstance(price, (int, float)) else f"   Price: {price}")
        print(f"   Match Reasons: {', '.join(event.get('match_reasons', []))}")


def chatbot_example():
    """Example: Conversational chatbot interaction"""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Chatbot Conversation")
    print("=" * 60)
    
    conversation_history = []
    
    # First message
    message1 = "Hi, I'm a dessert vendor looking for events"
    print(f"\nUser: {message1}")
    
    response1 = requests.post(
        f"{BASE_URL}/chat",
        json={
            "message": message1,
            "conversation_history": conversation_history
        }
    )
    
    result1 = response1.json()
    assistant_response1 = result1.get('response', '')
    print(f"Assistant: {assistant_response1}")
    
    # Update conversation history
    conversation_history.append({"role": "user", "content": message1})
    conversation_history.append({"role": "assistant", "content": assistant_response1})
    
    # Second message
    message2 = "What events do you have this weekend?"
    print(f"\nUser: {message2}")
    
    response2 = requests.post(
        f"{BASE_URL}/chat",
        json={
            "message": message2,
            "conversation_history": conversation_history
        }
    )
    
    result2 = response2.json()
    assistant_response2 = result2.get('response', '')
    print(f"Assistant: {assistant_response2}")


def parse_preferences_example():
    """Example: Parse natural language into structured preferences"""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Parse Preferences")
    print("=" * 60)
    
    inputs = [
        "Large booth at a weekend market in South Jakarta under 5 million",
        "I need a small space for beverages at any festival next month",
        "Looking for high-traffic events with medium booth size"
    ]
    
    for user_input in inputs:
        response = requests.post(
            f"{BASE_URL}/preferences/parse",
            json={"input": user_input}
        )
        
        result = response.json()
        
        print(f"\nInput: {user_input}")
        print("Parsed Preferences:")
        print(json.dumps(result.get('preferences', {}), indent=2))


def get_all_events_example():
    """Example: Retrieve all available booths"""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Get All Booths")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/events/all")
    result = response.json()
    
    events = result.get('events', [])
    print(f"\nTotal booths available: {result.get('total', 0)}")
    
    if events:
        print("\nFirst 3 booths:")
        for i, event in enumerate(events[:3], 1):
            print(f"\n{i}. Booth {event.get('booth_number', 'N/A')}")
            print(f"   Booth ID: {event.get('booth_id', 'N/A')}")
            print(f"   Event ID: {event.get('event_id', 'N/A')}")
            price = event.get('price', 0)
            print(f"   Price: Rp {price:,.2f}" if isinstance(price, (int, float)) else f"   Price: {price}")
            print(f"   Available: {event.get('is_available', 'N/A')}")
            print(f"   Suitable for: {event.get('suitable_for', 'N/A')}")


def health_check_example():
    """Example: Check API health"""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Health Check")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/health")
    result = response.json()
    
    print(f"\nAPI Status: {result.get('status', 'unknown')}")
    print("Services:")
    for service, status in result.get('services', {}).items():
        print(f"  - {service}: {status}")


if __name__ == "__main__":
    print("\n🚀 Food Vendor Event Matching API - Example Client\n")
    print("Make sure the API server is running on http://localhost:5000")
    print("Start it with: python api_server.py\n")
    
    try:
        # Run all examples
        health_check_example()
        search_events_example()
        parse_preferences_example()
        get_all_events_example()
        chatbot_example()
        
        print("\n" + "=" * 60)
        print("✅ All examples completed successfully!")
        print("=" * 60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API server")
        print("Please start the server with: python api_server.py\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
