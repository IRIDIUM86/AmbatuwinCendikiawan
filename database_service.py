"""
Database Service for Supabase Integration
Handles all database operations with filtering capabilities
"""
from typing import List, Dict, Optional, Any
from datetime import datetime
import requests
import os


class DatabaseService:
    """Service for interacting with Supabase database using direct HTTP requests"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase_url = supabase_url.rstrip('/')
        self.supabase_key = supabase_key
        self.events_table = "bazaar_events"  # Updated to match frontend table name
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
    
    def fetch_all_events(self) -> List[Dict]:
        """Fetch all available events from database"""
        try:
            url = f"{self.supabase_url}/rest/v1/{self.events_table}?select=*"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching events: {e}")
            return []
    
    def fetch_events_by_criteria(self, criteria: Dict[str, Any]) -> List[Dict]:
        """
        Fetch events filtered by specific criteria
        Performs database-level filtering before LLM processing
        
        Note: Filtering based on event schema
        """
        try:
            url = f"{self.supabase_url}/rest/v1/{self.events_table}?select=*"
            
            # Build query parameters based on available columns
            filters = []
            
            # Filter by price (booth_price maps to price column)
            if criteria.get('budget_range'):
                budget = criteria['budget_range']
                if budget.get('min') is not None:
                    filters.append(f"price=gte.{budget['min']}")
                if budget.get('max') is not None:
                    filters.append(f"price=lte.{budget['max']}")
            
            # Filter by availability
            filters.append("is_available=eq.true")
            
            if filters:
                url += "&" + "&".join(filters)
            
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching filtered events: {e}")
            # Return all events as fallback
            return self.fetch_all_events()
    
    def get_event_by_id(self, event_id: str) -> Optional[Dict]:
        """Fetch a single event by ID"""
        try:
            url = f"{self.supabase_url}/rest/v1/{self.events_table}?id=eq.{event_id}&select=*"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data[0] if data else None
        except Exception as e:
            print(f"Error fetching event by ID: {e}")
            return None
    
    def validate_event_ids(self, event_ids: List[str]) -> List[Dict]:
        """
        Validate that event IDs exist in database
        Returns only valid events (hallucination prevention)
        """
        try:
            # Build IN query for multiple IDs
            ids_str = ",".join([f'"{id}"' for id in event_ids])
            url = f"{self.supabase_url}/rest/v1/{self.events_table}?id=in.({ids_str})&select=*"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error validating event IDs: {e}")
            return []
