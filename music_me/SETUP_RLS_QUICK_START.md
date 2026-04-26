# Fix Premium Music Access - Quick Start

## 🚨 The Problem
Premium users see blank page, can't play songs, can't add to list.

## ✅ The Solution (MUST DO ALL 3 STEPS)

### STEP 1: Copy This SQL (Important: Copy EXACTLY as shown)

```sql
ALTER TABLE public.Songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view songs" ON public.Songs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own songs" ON public.Songs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own songs" ON public.Songs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own songs" ON public.Songs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own liked songs" ON public.liked_songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert liked songs" ON public.liked_songs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete liked songs" ON public.liked_songs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view prices" ON public.prices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to view products" ON public.products FOR SELECT USING (auth.role() = 'authenticated');
```

### STEP 2: Run SQL in Supabase

1. Go to https://app.supabase.com
2. Click your project
3. Left sidebar → **SQL Editor**
4. Click **New Query**
5. **Paste the SQL from STEP 1**
6. Press **Ctrl+Enter** or click **Run**
7. Wait for ✅ **Success** message (DO NOT close before success)

### STEP 3: Test Your App

1. Refresh browser (F5)
2. Sign in as premium user
3. Go to Home page
4. **Check browser console** (F12):
   - **GOOD:** `[getSongs] ✓ Successfully fetched X songs`
   - **BAD:** `[getSongs] RLS ERROR`

5. Try these:
   - ✅ See songs on page
   - ✅ Click play button → Music plays
   - ✅ Click heart icon → Song added to liked
   - ✅ Click + button → Upload modal opens
   - ✅ Click "Go Premium" link → Takes to /account, then auto-redirects to home

---

## 🆘 If Songs Still Don't Appear

**Check console (F12) for errors:**

### Error Message: "RLS violation" or "permission denied"
→ RLS policy failed
→ Try Step 2 again, make sure no errors

### No error but blank page
→ RLS is correct but no songs in database
→ Upload a test song using the upload feature

### Says "No authenticated user"
→ User not logged in
→ Sign in first

---

## 📝 Notes

- This setup allows users to only see/edit their OWN songs (except everyone can view all songs)
- RLS is database-level security (NOT code-level)
- Without this, Supabase blocks ALL database access
- This is standard security practice for SaaS apps

---

## 🎉 After Success

All premium users will now be able to:
- ✅ View all songs
- ✅ Play songs
- ✅ Add songs to liked list
- ✅ Upload their own songs
- ✅ See their subscription status
