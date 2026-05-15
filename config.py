"""
Configuration file for the Food Vendor Event Matching System
Update the MODEL_ID with your working Bedrock model ID
"""

# AWS Bedrock Model Configuration
# ================================
# Using global inference profile for Claude Sonnet 4.5
BEDROCK_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"

# Alternative model IDs (if the above doesn't work):
# BEDROCK_MODEL_ID = "us.anthropic.claude-sonnet-4-5-20250929-v1:0"  # Cross-region US
# BEDROCK_MODEL_ID = "eu.anthropic.claude-sonnet-4-5-20250929-v1:0"  # Cross-region EU
# BEDROCK_MODEL_ID = "ap.anthropic.claude-sonnet-4-5-20250929-v1:0"  # Cross-region Asia Pacific
# BEDROCK_MODEL_ID = "anthropic.claude-sonnet-4-5-20250929-v1:0"  # Direct (requires on-demand access)

# Supabase Configuration
# ======================
# Your Supabase uses a static API key format (sb_publishable_...)
# This is correctly configured in .env file

# Database Table Name
# ===================
DATABASE_TABLE_NAME = "bazaar_booths"
