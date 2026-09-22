-- ==============================================================================
-- ISLAMIC MAHAL COMMITTEE (MAHAL CONNECT) - SUPABASE POSTGRESQL SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER', -- 'ADMIN', 'PRESIDENT', 'SECRETARY', 'MEMBER'
  phone TEXT,
  member_id TEXT,
  family_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- 2. Families Table
CREATE TABLE IF NOT EXISTS public.families (
  id TEXT PRIMARY KEY,
  family_code TEXT UNIQUE NOT NULL,
  head_of_family_name TEXT NOT NULL,
  head_of_family_id TEXT,
  house_name TEXT NOT NULL,
  house_number TEXT,
  ward_number INTEGER NOT NULL DEFAULT 1,
  street_address TEXT,
  primary_contact_number TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'APL', -- 'BPL', 'APL', 'ORPHAN', 'WIDOW_HEADED'
  monthly_contribution_amount NUMERIC NOT NULL DEFAULT 200,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Families are viewable by authenticated users" 
  ON public.families FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can modify families" 
  ON public.families FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'PRESIDENT', 'SECRETARY')
    )
  );

-- 3. Members Table
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL, -- 'MALE', 'FEMALE', 'OTHER'
  dob DATE NOT NULL,
  relationship_to_head TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  education_level TEXT,
  occupation TEXT,
  monthly_income NUMERIC DEFAULT 0,
  blood_group TEXT,
  phone TEXT,
  email TEXT,
  is_alive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members viewable by authenticated users" 
  ON public.members FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can modify members" 
  ON public.members FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'PRESIDENT', 'SECRETARY')
    )
  );

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id),
  member_id TEXT,
  month_for TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'OVERDUE'
  payment_method TEXT, -- 'STRIPE', 'UPI_QR', 'NET_BANKING', 'CASH'
  transaction_id TEXT,
  receipt_number TEXT,
  paid_at TIMESTAMPTZ,
  verified_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view payments" 
  ON public.payments FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Members can insert payment submissions" 
  ON public.payments FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admins can update payments" 
  ON public.payments FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'PRESIDENT', 'SECRETARY')
    )
  );

-- 5. Admin Access Grants Table
CREATE TABLE IF NOT EXISTS public.admin_access_grants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  designation TEXT NOT NULL,
  granted_by TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Seed initial chief admin grant
INSERT INTO public.admin_access_grants (email, role, designation, granted_by)
VALUES ('rumaispkdr@gmail.com', 'ADMIN', 'Chief Mahal Administrator', 'SYSTEM')
ON CONFLICT (email) DO NOTHING;
