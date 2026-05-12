"""
Database Service for Supabase Integration
Handles all database operations with filtering capabilities
"""
from supabase import Client
from typing import List, Dict, Optional, Any
from datetime import datetime


class DatabaseService:
    """Service for interacting with Supabase database"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.events_table = "bazaar_booths"  # Adjust table name as needed
    
    def fetch_all_events(self) -> List[Dict]:
        """Fetch all available events from database"""
        try:
            response = self.supabase.table(self.events_table).select("*").execute()
            return response.data
        except Exception as e:
            print(f"Error fetching events: {e}")
            return []
    
    def fetch_events_by_criteria(self, criteria: Dict[str, Any]) -> List[Dict]:
        """
        Fetch events filtered by specific criteria
        Performs database-level filtering before LLM processing
        """
        try:
            query = self.supabase.table(self.events_table).select("*")
            
            # Apply filters based on criteria
            if criteria.get('location'):
                query = query.ilike('location', f"%{criteria['location']}%")
            
            if criteria.get('event_type'):
                query = query.ilike('event_type', f"%{criteria['event_type']}%")
            
            if criteria.get('budget_range'):
                budget = criteria['budget_range']
                if budget.get('min') is not None:
                    query = query.gte('booth_price', budget['min'])
                if budget.get('max') is not None:
                    query = query.lte('booth_price', budget['max'])
            
            if criteria.get('booth_size'):
                query = query.eq('booth_size', criteria['booth_size'])
            
            response = query.execute()
            return response.data
        except Exception as e:
            print(f"Error fetching filtered events: {e}")
            return []
    
    def get_event_by_id(self, event_id: str) -> Optional[Dict]:
        """Fetch a single event by ID"""
        try:
            response = self.supabase.table(self.events_table).select("*").eq('id', event_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching event by ID: {e}")
            return None
    
    def validate_event_ids(self, event_ids: List[str]) -> List[Dict]:
        """
        Validate that event IDs exist in database
        Returns only valid events (hallucination prevention)
        """
        try:
            response = self.supabase.table(self.events_table).select("*").in_('id', event_ids).execute()
            return response.data
        except Exception as e:
            print(f"Error validating event IDs: {e}")
            return []
