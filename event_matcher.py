"""
Event Matcher - Main orchestration layer
Combines LLM and Database services for intelligent event matching
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
from llm_service import BedrockLLMService
from database_service import DatabaseService


class EventMatcher:
    """
    Main service that orchestrates event matching using LLM and database
    Prevents hallucination by validating all LLM outputs against database
    """
    
    def __init__(self, llm_service: BedrockLLMService, db_service: DatabaseService):
        self.llm = llm_service
        self.db = db_service
    
    def find_matching_events(self, user_input: str) -> Dict[str, Any]:
        """
        Main method to find events matching user's natural language input
        
        Process:
        1. Parse user preferences using LLM
        2. Pre-filter database using structured criteria
        3. Use LLM to rank and match remaining events
        4. Validate all results against database
        """
        try:
            # Step 1: Extract structured preferences from natural language
            preferences = self.llm.parse_user_preferences(user_input)
            
            if not preferences:
                return {
                    "success": False,
                    "error": "Could not understand preferences",
                    "extracted_preferences": {},
                    "matches": []
                }
            
            # Step 2: Pre-filter database to reduce LLM token usage
            candidate_events = self.db.fetch_events_by_criteria(preferences)
            
            # Fallback to all events if no database matches
            if not candidate_events:
                candidate_events = self.db.fetch_all_events()
            
            # Step 3: Use LLM for intelligent ranking and matching
            llm_matches = self.llm.filter_events_with_llm(
                preferences, 
                candidate_events, 
                user_input
            )
            
            # Step 4: Validate and enrich results with full event data
            validated_matches = self._validate_and_enrich_matches(llm_matches)
            
            return {
                "success": True,
                "user_input": user_input,
                "extracted_preferences": preferences,
                "total_candidates": len(candidate_events),
                "matches": validated_matches
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_preferences": {},
                "matches": []
            }
    
    def _validate_and_enrich_matches(self, llm_matches: List[Dict]) -> List[Dict]:
        """
        Validate LLM results against database and enrich with full event data
        Critical for preventing hallucination
        """
        validated = []
        
        for match in llm_matches:
            event_id = match.get('event_id')
            event_data = self.db.get_event_by_id(event_id)
            
            if event_data:  # Only include if event exists in database
                validated.append({
                    **event_data,  # Full event data from database
                    "relevance_score": match.get('relevance_score', 0),
                    "match_reasons": match.get('match_reasons', []),
                    "concerns": match.get('concerns', [])
                })
        
        # Sort by relevance score
        validated.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        return validated
    
    def chat(
        self, 
        user_message: str, 
        conversation_history: List[Dict] = None
    ) -> Dict[str, Any]:
        """
        Handle chatbot conversation with context awareness
        """
        if conversation_history is None:
            conversation_history = []
        
        # Get available events for context grounding
        available_events = self.db.fetch_all_events()
        
        # Generate response
        response = self.llm.generate_chatbot_response(
            user_message,
            conversation_history,
            available_events
        )
        
        return {
            "success": True,
            "response": response,
            "timestamp": str(datetime.now())
        }
