import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Profile, Family, PaymentRecord, User } from '../types';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Robust URL verification: Must be a non-empty string starting with http:// or https:// and parseable by URL()
const isValidHttpUrl = (url: string | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) return false;
  try {
    const parsed = new URL(clean);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      !clean.includes('placeholder') &&
      !clean.includes('your-project') &&
      !clean.includes('<') &&
      parsed.hostname.length > 3
    );
  } catch {
    return false;
  }
};

const isValidAnonKey = (key: string | undefined): boolean => {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return (
    clean.length > 15 &&
    !clean.includes('placeholder') &&
    !clean.includes('your-anon-key') &&
    !clean.includes('<')
  );
};

// True ONLY if both URL and Anon Key are valid and properly formatted
export const isSupabaseConfigured: boolean =
  isValidHttpUrl(rawSupabaseUrl) && isValidAnonKey(rawSupabaseAnonKey);

// Safely instantiate Supabase client with try-catch so it NEVER crashes module evaluation
function createSafeSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !rawSupabaseUrl || !rawSupabaseAnonKey) {
    return null;
  }
  try {
    return createClient(rawSupabaseUrl.trim(), rawSupabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Supabase client initialization skipped safely:', err);
    return null;
  }
}

// Create client safely if configured
export const supabase: SupabaseClient | null = createSafeSupabaseClient();

/**
 * Check connection status with Supabase
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase URL and Anon Key not configured in .env',
    };
  }

  try {
    const { data, error } = await supabase.from('members').select('count', { count: 'exact', head: true });
    if (error) {
      // Table might not be created yet, but connection to project succeeds
      if (error.code === '42P01') {
        return {
          connected: true,
          message: 'Connected to Supabase project (Tables ready to be created with schema.sql)',
        };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase PostgreSQL database' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Network error connecting to Supabase' };
  }
}

/**
 * Sign up a user in Supabase Auth
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  metadata: { name: string; role: string; phone?: string; memberId?: string; familyId?: string }
): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Also insert or upsert into `profiles` table
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name: metadata.name,
        role: metadata.role,
        phone: metadata.phone || '',
        member_id: metadata.memberId || '',
        family_id: metadata.familyId || '',
        created_at: new Date().toISOString(),
      });
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Supabase signup failed' };
  }
}

/**
 * Sign in a user with Supabase Auth
 */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; profile?: any; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    let profile = null;
    if (data.user) {
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      profile = profData;
    }

    return { success: true, user: data.user, profile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Supabase signin failed' };
  }
}

/**
 * Sync Profile (Member) to Supabase
 */
export async function syncMemberToSupabase(profile: Profile): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('members').upsert({
      id: profile.id,
      family_id: profile.familyId,
      full_name: profile.name,
      gender: profile.gender,
      dob: profile.dateOfBirth,
      relationship_to_head: profile.familyRole,
      occupation: profile.occupation,
      blood_group: profile.bloodGroup,
      phone: profile.phone,
      email: profile.email,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync Family to Supabase
 */
export async function syncFamilyToSupabase(family: Family): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('families').upsert({
      id: family.id,
      family_code: family.familyId,
      head_of_family_name: family.headName,
      head_of_family_id: family.headMemberId,
      house_name: family.houseName,
      street_address: family.address,
      primary_contact_number: family.phone,
      monthly_contribution_amount: family.monthlyContribution,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync Payment to Supabase
 */
export async function syncPaymentToSupabase(payment: PaymentRecord): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('payments').upsert({
      id: payment.id,
      family_id: payment.familyId,
      member_id: payment.memberId,
      month_for: payment.monthName,
      amount: payment.amount,
      status: payment.status,
      payment_method: payment.paymentMethod,
      transaction_id: payment.transactionId,
      receipt_number: payment.receiptNumber,
      paid_at: payment.paidDate,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch all members from Supabase
 */
export async function fetchSupabaseMembers(): Promise<Profile[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('members').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      userId: row.id,
      memberId: row.id,
      membershipNumber: row.id,
      name: row.full_name || '',
      gender: (row.gender === 'FEMALE' ? 'FEMALE' : 'MALE') as 'MALE' | 'FEMALE',
      dateOfBirth: row.dob || '1990-01-01',
      phone: row.phone || '',
      email: row.email || '',
      address: row.street_address || 'Noor-ul-Huda Mahal',
      occupation: row.occupation || 'Private Sector',
      education: 'Graduate',
      bloodGroup: row.blood_group || 'O+',
      familyId: row.family_id || 'FAM-10001',
      familyRole: (row.relationship_to_head || 'HEAD') as any,
      mahalName: 'Noor-ul-Huda Juma Masjid & Mahal Committee',
      membershipDate: row.created_at ? row.created_at.split('T')[0] : '2024-01-01',
      membershipStatus: 'ACTIVE' as const,
      monthlyContribution: 1000,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch all families from Supabase
 */
export async function fetchSupabaseFamilies(): Promise<Family[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('families').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      familyId: row.family_code || row.id,
      familyName: `${row.head_of_family_name || 'Member'}'s Family`,
      houseName: row.house_name || 'Baitul Aman',
      headMemberId: row.head_of_family_id || row.id,
      headName: row.head_of_family_name || 'Head of Family',
      address: row.street_address || 'West Hill, Kozhikode',
      phone: row.primary_contact_number || '',
      memberCount: 4,
      monthlyContribution: Number(row.monthly_contribution_amount) || 1000,
      paymentStatus: 'PAID' as const,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch all payments from Supabase
 */
export async function fetchSupabasePayments(): Promise<PaymentRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('payments').select('*');
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      familyId: row.family_id,
      memberId: row.member_id,
      month: row.month_for || '2026-09',
      monthName: row.month_for || 'September 2026',
      amount: Number(row.amount) || 1000,
      status: (row.status || 'PAID') as any,
      dueDate: '2026-09-10',
      paidDate: row.paid_at,
      transactionId: row.transaction_id,
      receiptNumber: row.receipt_number,
      paymentMethod: (row.payment_method || 'CARD') as any,
    }));
  } catch {
    return null;
  }
}
