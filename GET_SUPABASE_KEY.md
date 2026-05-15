# 🔑 How to Get Your Supabase API Key

## The Problem

Your current `.env` file has an invalid Supabase API key:
```
supabaseKey=sb_publishable_bnwIzeVwHIwhX3JRrlO3rg_Dageb5dh  ❌ INVALID
```

This is not a real Supabase API key format. You need to get the actual key from your Supabase dashboard.

## Step-by-Step Guide

### Step 1: Go to Supabase Dashboard
Open your browser and go to: **https://app.supabase.com**

### Step 2: Select Your Project
Click on your project. Based on your URL, it should be the project with:
- **Project URL**: `https://avyzdesjygqmfsgmvrzl.supabase.co`

### Step 3: Open Settings
Click the **⚙️ Settings** icon in the left sidebar (at the bottom)

### Step 4: Go to API Settings
In the Settings menu, click on **API**

### Step 5: Find Project API Keys
Scroll down to the **Project API keys** section. You'll see:

```
┌─────────────────────────────────────────────────────────┐
│ Project API keys                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ anon public                                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [Copy] [Show]                                           │
│                                                         │
│ This key is safe to use in a browser if you have       │
│ enabled Row Level Security for your tables and         │
│ configured policies.                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ service_role secret                                     │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [Copy] [Show]                                           │
│                                                         │
│ This key has the ability to bypass Row Level Security. │
│ Never share it publicly.                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 6: Copy the Anon Public Key
Click **[Copy]** next to the **anon public** key (the first one)

⚠️ **Important**: 
- Use the **anon public** key (first one)
- DO NOT use the **service_role secret** key (second one)

### Step 7: Update Your .env File
Open your `.env` file and replace the `supabaseKey` value:

**Before:**
```env
supabaseKey=sb_publishable_bnwIzeVwHIwhX3JRrlO3rg_Dageb5dh
```

**After:**
```env
supabaseKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eXpkZXNqeWdxbWZzZ212cnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzYwNjA0MDAsImV4cCI6MTk1MTYzNjQwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

(Use your actual key, not this example)

### Step 8: Save the File
Save your `.env` file

### Step 9: Test the Connection
Run the test script:
```bash
python test_supabase_only.py
```

You should see:
```
✅ Supabase client created successfully!
✅ SUCCESS! Found X record(s)
✅ ALL TESTS PASSED!
```

## What the Key Should Look Like

✅ **Valid Supabase API Key:**
- Starts with `eyJ`
- Very long (200+ characters)
- Contains dots (.) separating three parts
- Looks like: `eyJhbGc...part1...eyJpc3M...part2...xxxxxx...part3`

❌ **Invalid Key (what you have now):**
- Starts with `sb_publishable_`
- Short (< 50 characters)
- This is not a real Supabase key format

## Common Issues

### "I don't see the API section"
- Make sure you're logged into the correct Supabase account
- Verify you have access to the project
- Try refreshing the page

### "The key is too long to copy"
- Click the **[Show]** button first to reveal the full key
- Then click **[Copy]** to copy it to clipboard
- Or manually select all the text and copy it

### "I copied the key but it still doesn't work"
- Make sure you copied the **anon public** key (first one)
- Check there are no extra spaces before or after the key
- Verify the key starts with `eyJ`
- Make sure you saved the `.env` file after pasting

## Security Note

🔒 The **anon public** key is safe to use in your application because:
- It respects Row Level Security (RLS) policies
- It can only access data you've explicitly allowed
- It's meant to be used in client applications

⚠️ Never commit your `.env` file to git! It's already in `.gitignore`.

## Next Steps

After updating your key:

1. ✅ Run `python test_supabase_only.py` to verify
2. ✅ Run `python test_integration.py` to test the full system
3. ✅ Run `python api_server.py` to start the API server

## Still Having Issues?

If you're still having problems:

1. Double-check you're using the **anon public** key
2. Verify the key starts with `eyJ`
3. Make sure there are no spaces or line breaks in the key
4. Try creating a new API key in Supabase (Settings → API → Reset API keys)
5. Check if your Supabase project is active and not paused

---

**Need more help?** Check the Supabase documentation: https://supabase.com/docs/guides/api
