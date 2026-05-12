"""
LLM Service for AWS Bedrock Integration
Handles prompt engineering, JSON parsing, and event filtering
"""
import json
import boto3
from typing import Dict, List, Optional, Any
from datetime import datetime


class BedrockLLMService:
    """Service for interacting with AWS Bedrock LLM with hallucination prevention"""
    
    def __init__(self, region: str, access_key: str, secret_key: str):
        self.bedrock = boto3.client(
            'bedrock-runtime',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )
        self.model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    def parse_user_preferences(self, user_input: str) -> Dict[str, Any]:
        """
        Parse natural language input into structured preferences using LLM
        Returns JSON with event criteria
        """
        prompt = self._build_preference_extraction_prompt(user_input)
        
        try:
            response = self._invoke_bedrock(prompt, max_tokens=300)
            parsed_json = self._extract_json_from_response(response)
            return parsed_json
        except Exception as e:
            print(f"Error parsing preferences: {e}")
            return {}
    
    def filter_events_with_llm(
        self, 
        user_preferences: Dict[str, Any], 
        events: List[Dict], 
        user_input: str
    ) -> List[Dict]:
        """
        Use LLM to intelligently filter and rank events based on preferences
        Includes hallucination prevention by grounding in actual data
        """
        if not events:
            return []
        
        prompt = self._build_filtering_prompt(user_preferences, events, user_input)
        
        try:
            response = self._invoke_bedrock(prompt, max_tokens=1000)
            filtered_results = self._extract_json_from_response(response)
            
            # Validate that returned IDs exist in original dataset (hallucination check)
            valid_event_ids = {event.get('id') for event in events}
            validated_results = [
                result for result in filtered_results.get('matches', [])
                if result.get('event_id') in valid_event_ids
            ]
            
            return validated_results
        except Exception as e:
            print(f"Error filtering events: {e}")
            return []

    
    def generate_chatbot_response(
        self, 
        user_message: str, 
        conversation_history: List[Dict],
        available_events: List[Dict]
    ) -> str:
        """
        Generate contextual chatbot response grounded in available events
        """
        prompt = self._build_chatbot_prompt(user_message, conversation_history, available_events)
        
        try:
            response = self._invoke_bedrock(prompt, max_tokens=500)
            return response
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def _invoke_bedrock(self, prompt: str, max_tokens: int = 500) -> str:
        """Core method to invoke Bedrock API"""
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": 0.3,  # Lower temperature for more consistent outputs
            "messages": [
                {
                    "role": "user",
                    "content": [{"type": "text", "text": prompt}]
                }
            ]
        })
        
        response = self.bedrock.invoke_model(
            modelId=self.model_id,
            body=body
        )
        
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']
    
    def _build_preference_extraction_prompt(self, user_input: str) -> str:
        """Build prompt for extracting structured preferences from natural language"""
        return f"""You are a JSON parser for a food vendor event matching system. Extract event preferences from the user's input.

User Input: "{user_input}"

Extract the following information and return ONLY valid JSON (no markdown, no explanation):
{{
  "event_type": "string or null (e.g., bazaar, festival, market)",
  "location": "string or null",
  "date_preference": "string or null (e.g., weekend, specific date, this month)",
  "budget_range": {{"min": number or null, "max": number or null}},
  "booth_size": "string or null (small, medium, large)",
  "food_category": "string or null (e.g., desserts, beverages, main course)",
  "crowd_size": "string or null (small, medium, large)",
  "keywords": ["array of relevant keywords"]
}}

Return ONLY the JSON object, nothing else."""

    
    def _build_filtering_prompt(
        self, 
        preferences: Dict[str, Any], 
        events: List[Dict],
        user_input: str
    ) -> str:
        """Build prompt for filtering events with hallucination prevention"""
        events_json = json.dumps(events, indent=2)
        prefs_json = json.dumps(preferences, indent=2)
        
        return f"""You are an event matching assistant for food vendors. Your task is to filter and rank events based on vendor preferences.

CRITICAL RULES:
1. ONLY return event IDs that exist in the provided events list
2. DO NOT invent or hallucinate event details
3. Base your matching STRICTLY on the data provided
4. Return results in JSON format only

User Input: "{user_input}"

Extracted Preferences:
{prefs_json}

Available Events (COMPLETE LIST - only use these):
{events_json}

Analyze each event and return ONLY matching events ranked by relevance. Return ONLY valid JSON:
{{
  "matches": [
    {{
      "event_id": "exact ID from events list",
      "relevance_score": 0-100,
      "match_reasons": ["reason1", "reason2"],
      "concerns": ["any concerns or mismatches"]
    }}
  ],
  "total_matches": number
}}

Return ONLY the JSON object, nothing else."""
    
    def _build_chatbot_prompt(
        self, 
        user_message: str, 
        conversation_history: List[Dict],
        available_events: List[Dict]
    ) -> str:
        """Build prompt for chatbot with context grounding"""
        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in conversation_history[-5:]  # Last 5 messages for context
        ])
        
        events_summary = json.dumps(available_events[:10], indent=2)  # Limit to prevent token overflow
        
        return f"""You are a helpful assistant for food vendors looking for events. You help them find suitable bazaars, festivals, and markets.

CRITICAL RULES:
1. Base your responses on the available events data provided
2. DO NOT make up event details, dates, or locations
3. If you don't know something, say so
4. Be helpful, friendly, and concise
5. Guide users to provide preferences if they're unclear

Recent Conversation:
{history_text}

Available Events (for reference):
{events_summary}

User: {user_message}

Respond naturally and helpfully. If the user is asking about events, reference the actual events provided. If asking for recommendations, ask clarifying questions about their preferences."""

    
    def _extract_json_from_response(self, response: str) -> Dict[str, Any]:
        """Extract and parse JSON from LLM response, handling markdown code blocks"""
        # Remove markdown code blocks if present
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        elif response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        
        response = response.strip()
        
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Response was: {response}")
            return {}
    
    def generate_chatbot_response(
        self, 
        user_message: str, 
        conversation_history: List[Dict],
        available_events: List[Dict]
    ) -> str:
        """
        Generate contextual chatbot response grounded in available events
        """
        prompt = self._build_chatbot_prompt(user_message, conversation_history, available_events)
        
        try:
            response = self._invoke_bedrock(prompt, max_tokens=500)
            return response
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
