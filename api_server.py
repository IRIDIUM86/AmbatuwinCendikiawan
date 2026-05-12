"""
Flask API Server - Backend endpoints for UI integration
Provides REST API for event matching and chatbot functionality
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
from llm_service import BedrockLLMService
from database_service import DatabaseService
from event_matcher import EventMatcher

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize services
supabase = create_client(
    os.getenv("supabaseUrl"),
    os.getenv("supabaseKey")
)

llm_service = BedrockLLMService(
    region=os.getenv("AWS_REGION"),
    access_key=os.getenv("AWS_ACCESS_KEY_ID"),
    secret_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

db_service = DatabaseService(supabase)
event_matcher = EventMatcher(llm_service, db_service)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "services": {
            "database": "connected",
            "llm": "connected"
        }
    })


@app.route('/api/events/search', methods=['POST'])
def search_events():
    """
    Search for events based on natural language input
    
    Request body:
    {
        "query": "I'm looking for a weekend bazaar in Jakarta with affordable booth prices"
    }
    """
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        
        if not user_query:
            return jsonify({
                "success": False,
                "error": "Query is required"
            }), 400
        
        # Find matching events
        results = event_matcher.find_matching_events(user_query)
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/events/all', methods=['GET'])
def get_all_events():
    """Get all available events"""
    try:
        events = db_service.fetch_all_events()
        return jsonify({
            "success": True,
            "events": events,
            "total": len(events)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    """Get a specific event by ID"""
    try:
        event = db_service.get_event_by_id(event_id)
        
        if not event:
            return jsonify({
                "success": False,
                "error": "Event not found"
            }), 404
        
        return jsonify({
            "success": True,
            "event": event
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chatbot endpoint for conversational interaction
    
    Request body:
    {
        "message": "What events do you have this weekend?",
        "conversation_history": [
            {"role": "user", "content": "previous message"},
            {"role": "assistant", "content": "previous response"}
        ]
    }
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        conversation_history = data.get('conversation_history', [])
        
        if not user_message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # Generate chatbot response
        result = event_matcher.chat(user_message, conversation_history)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/preferences/parse', methods=['POST'])
def parse_preferences():
    """
    Parse natural language into structured preferences
    
    Request body:
    {
        "input": "I need a large booth at a weekend market in South Jakarta under 5 million rupiah"
    }
    """
    try:
        data = request.get_json()
        user_input = data.get('input', '')
        
        if not user_input:
            return jsonify({
                "success": False,
                "error": "Input is required"
            }), 400
        
        # Parse preferences
        preferences = llm_service.parse_user_preferences(user_input)
        
        return jsonify({
            "success": True,
            "preferences": preferences
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
