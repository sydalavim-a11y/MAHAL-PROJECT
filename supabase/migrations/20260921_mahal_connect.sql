-- =========================================================
-- MAHAL CONNECT: Production Database Schema & RLS Policies
-- One Mahal. One Digital Home.
-- Database Target: Supabase / PostgreSQL 15+
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & PERMISSIONS
CREATE TYPE user_role AS ENUM (
  'PUBLIC',
  'MEMBER',
  'ADMIN',
  'NIKAH_STAFF',
  'WELFARE_STAFF',
  'ZAKAH_STAFF'
);

-- 2. MAHAL SETTINGS
CREATE TABLE IF NOT EXISTS mahal_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mahal_name TEXT NOT NULL,
  mahal_name_malayalam TEXT,
  registration_number TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  qazi_name TEXT,
  president_name TEXT,
  secretary_name TEXT,
  monthly_contribution_default NUMERIC(10,2) DEFAULT 1000.00,
  payment_due_day INT DEFAULT 10,
  grace_period_days INT DEFAULT 15,
  late_fee NUMERIC(10,2) DEFAULT 50.00,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FAMILIES
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id TEXT UNIQUE NOT NULL, -- e.g. "FAM-00042"
  family_name TEXT NOT NULL,
  house_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  monthly_contribution NUMERIC(10,2) DEFAULT 1000.00,
  payment_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE, -- REFERENCES auth.users(id) ON DELETE CASCADE
  member_id TEXT UNIQUE NOT NULL, -- e.g. "MHL-000124"
  membership_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_malayalam TEXT,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE')),
  date_of_birth DATE,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  occupation TEXT,
  education TEXT,
  blood_group TEXT,
  family_id TEXT REFERENCES families(family_id) ON DELETE SET NULL,
  family_role TEXT CHECK (family_role IN ('HEAD', 'SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'OTHER')),
  membership_status TEXT DEFAULT 'ACTIVE',
  monthly_contribution NUMERIC(10,2) DEFAULT 1000.00,
  photo_url TEXT,
  is_public_in_directory BOOLEAN DEFAULT FALSE,
  role user_role DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MONTHLY PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id TEXT REFERENCES profiles(member_id) ON DELETE CASCADE,
  family_id TEXT REFERENCES families(family_id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- "YYYY-MM"
  month_name TEXT NOT NULL, -- e.g. "September 2026"
  amount NUMERIC(10,2) NOT NULL,
  status TEXT CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'PARTIALLY_PAID', 'CANCELLED')),
  due_date DATE NOT NULL,
  paid_date TIMESTAMPTZ,
  transaction_id TEXT,
  receipt_number TEXT,
  payment_method TEXT,
  late_fee NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RECEIPTS
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number TEXT UNIQUE NOT NULL, -- "RCT-2026-00084"
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  member_id TEXT REFERENCES profiles(member_id),
  member_name TEXT NOT NULL,
  family_id TEXT,
  mahal_name TEXT NOT NULL,
  month_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT DEFAULT 'VERIFIED',
  signature_officer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NIKAH APPLICATIONS
CREATE TABLE IF NOT EXISTS nikah_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL, -- "NIK-2026-00124"
  applicant_id TEXT REFERENCES profiles(member_id),
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_relation TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  groom_age INT NOT NULL,
  groom_dob DATE,
  groom_address TEXT NOT NULL,
  groom_mahal TEXT NOT NULL,
  groom_father_name TEXT,
  groom_mother_name TEXT,
  groom_occupation TEXT,
  groom_phone TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  bride_age INT NOT NULL,
  bride_dob DATE,
  bride_address TEXT NOT NULL,
  bride_mahal TEXT NOT NULL,
  bride_father_name TEXT,
  bride_mother_name TEXT,
  bride_occupation TEXT,
  bride_phone TEXT NOT NULL,
  wali_name TEXT NOT NULL,
  wali_relation TEXT NOT NULL,
  wali_phone TEXT NOT NULL,
  proposed_date DATE NOT NULL,
  proposed_time TEXT,
  venue TEXT NOT NULL,
  officer_assigned TEXT,
  status TEXT DEFAULT 'SUBMITTED',
  admin_notes TEXT,
  certificate_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WELFARE APPLICATIONS
CREATE TABLE IF NOT EXISTS welfare_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL, -- "WEL-2026-00124"
  member_id TEXT REFERENCES profiles(member_id),
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  family_id TEXT,
  category TEXT NOT NULL,
  amount_requested NUMERIC(10,2) NOT NULL,
  amount_approved NUMERIC(10,2),
  description TEXT NOT NULL,
  medical_or_institute_name TEXT,
  status TEXT DEFAULT 'SUBMITTED',
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 9. ZAKAH APPLICATIONS
CREATE TABLE IF NOT EXISTS zakah_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL, -- "ZAK-2026-00124"
  member_id TEXT REFERENCES profiles(member_id),
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  family_id TEXT,
  dependents_count INT DEFAULT 0,
  monthly_family_income NUMERIC(10,2),
  category TEXT NOT NULL,
  amount_needed NUMERIC(10,2) NOT NULL,
  amount_distributed NUMERIC(10,2),
  financial_situation TEXT NOT NULL,
  status TEXT DEFAULT 'SUBMITTED',
  assessment_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  distribution_date TIMESTAMPTZ
);

-- 10. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT UNIQUE NOT NULL, -- "CERT-MEM-2026-00124"
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  member_id TEXT REFERENCES profiles(member_id),
  member_name TEXT NOT NULL,
  family_id TEXT,
  mahal_name TEXT NOT NULL,
  issue_date DATE NOT NULL,
  valid_until DATE,
  issued_by TEXT NOT NULL,
  verification_hash TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EVENTS & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_malayalam TEXT,
  description TEXT NOT NULL,
  description_malayalam TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  speaker_or_chief_guest TEXT,
  image_url TEXT,
  registered_count INT DEFAULT 0,
  registration_limit INT,
  is_registration_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_malayalam TEXT,
  content TEXT NOT NULL,
  content_malayalam TEXT,
  priority TEXT CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
  published_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'NEW',
  assigned_to TEXT,
  reply_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  date TIMESTAMPTZ DEFAULT NOW(),
  link_url TEXT
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  role user_role NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nikah_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakah_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin or staff
CREATE OR REPLACE FUNCTION is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('ADMIN', 'NIKAH_STAFF', 'WELFARE_STAFF', 'ZAKAH_STAFF')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Members see own profile or public directory members; Admin sees all
CREATE POLICY "Profiles read policy" ON profiles
  FOR SELECT USING (
    auth.uid() = user_id
    OR is_public_in_directory = TRUE
    OR is_admin_or_staff()
  );

-- Payments: Members see own payments; Admin sees all
CREATE POLICY "Payments read policy" ON payments
  FOR SELECT USING (
    member_id = (SELECT member_id FROM profiles WHERE user_id = auth.uid())
    OR is_admin_or_staff()
  );

-- Receipts: Members see own receipts; Admin sees all
CREATE POLICY "Receipts read policy" ON receipts
  FOR SELECT USING (
    member_id = (SELECT member_id FROM profiles WHERE user_id = auth.uid())
    OR is_admin_or_staff()
  );

-- Nikah: Applicant sees own; Admin/Nikah staff sees all
CREATE POLICY "Nikah read policy" ON nikah_applications
  FOR SELECT USING (
    applicant_id = (SELECT member_id FROM profiles WHERE user_id = auth.uid())
    OR is_admin_or_staff()
  );

-- Welfare & Zakah: Private to applicant and respective staff/admin
CREATE POLICY "Welfare read policy" ON welfare_applications
  FOR SELECT USING (
    member_id = (SELECT member_id FROM profiles WHERE user_id = auth.uid())
    OR is_admin_or_staff()
  );

CREATE POLICY "Zakah read policy" ON zakah_applications
  FOR SELECT USING (
    member_id = (SELECT member_id FROM profiles WHERE user_id = auth.uid())
    OR is_admin_or_staff()
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON profiles(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_nikah_app_num ON nikah_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_num ON receipts(receipt_number);
