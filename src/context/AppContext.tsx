import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Language,
  Profile,
  Family,
  PaymentRecord,
  Receipt,
  NikahApplication,
  NikahStatus,
  WelfareApplication,
  WelfareStatus,
  ZakahApplication,
  ZakahStatus,
  Certificate,
  EventItem,
  Announcement,
  Enquiry,
  NotificationItem,
  MahalSettings,
  CreativeProject,
  AuditLogItem,
  AdminAccessGrant,
  RegisteredAccount,
  CounsellingBooking,
  EducationGuidanceRegistration,
  BloodDonor,
  BloodRequest,
  DeathCertificateApplication,
  FinancialLedgerEntry,
  InstitutionFinancialSummary,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_PROFILES,
  INITIAL_FAMILIES,
  INITIAL_PAYMENTS,
  INITIAL_RECEIPTS,
  INITIAL_NIKAH_APPLICATIONS,
  INITIAL_WELFARE_APPLICATIONS,
  INITIAL_ZAKAH_APPLICATIONS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ENQUIRIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_CERTIFICATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_COUNSELLING_BOOKINGS,
  INITIAL_EDUCATION_REGISTRATIONS,
  INITIAL_BLOOD_DONORS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_DEATH_CERTIFICATE_APPLICATIONS,
  INITIAL_FINANCIAL_SUMMARY,
  INITIAL_FINANCIAL_LEDGER,
} from '../lib/mockData';
import { translations } from '../i18n/translations';
import {
  isSupabaseConfigured,
  supabaseSignUp,
  supabaseSignIn,
  syncMemberToSupabase,
  syncFamilyToSupabase,
  syncPaymentToSupabase,
  testSupabaseConnection,
} from '../lib/supabase';

interface AppContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;

  // Supabase Integration
  isSupabaseConfigured: boolean;
  supabaseStatus: string;
  syncDataToSupabase: () => Promise<{ success: boolean; message: string }>;

  // Auth & Roles
  currentUser: User | null;
  currentRole: Role;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; isAdmin: boolean }>;
  register: (accountData: { name: string; email: string; password: string; phone: string; houseName?: string }) => Promise<{ success: boolean; error?: string; isAdmin: boolean }>;
  logout: () => void;
  switchPersona: (role: Role) => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  adminAccessGrants: AdminAccessGrant[];
  isUserAdmin: (email?: string) => boolean;
  addAdminAccess: (email: string, role?: Role, notes?: string) => { success: boolean; message: string };
  removeAdminAccess: (email: string) => { success: boolean; message: string };

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data & Member State
  settings: MahalSettings;
  updateSettings: (newSettings: Partial<MahalSettings>) => void;
  currentProfile: Profile | null;
  currentFamily: Family | null;
  profiles: Profile[];
  families: Family[];
  payments: PaymentRecord[];
  receipts: Receipt[];
  nikahApplications: NikahApplication[];
  welfareApplications: WelfareApplication[];
  zakahApplications: ZakahApplication[];
  certificates: Certificate[];
  events: EventItem[];
  announcements: Announcement[];
  enquiries: Enquiry[];
  notifications: NotificationItem[];
  creativeProjects: CreativeProject[];
  auditLogs: AuditLogItem[];

  // Actions
  makePayment: (paymentId: string, method: string) => Promise<Receipt>;
  submitNikahApplication: (data: Omit<NikahApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'status'>) => NikahApplication;
  updateNikahStatus: (id: string, status: NikahStatus, adminNotes?: string) => void;
  submitWelfareApplication: (data: Omit<WelfareApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>) => WelfareApplication;
  updateWelfareStatus: (id: string, status: WelfareStatus, reviewerNotes?: string, amountApproved?: number) => void;
  submitZakahApplication: (data: Omit<ZakahApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>) => ZakahApplication;
  updateZakahStatus: (id: string, status: ZakahStatus, assessmentNotes?: string, amountDistributed?: number) => void;
  updateProfile: (profileData: Partial<Profile> & { id?: string; memberId?: string }) => void;
  generateCertificate: (type: Certificate['type'], memberId: string) => Certificate;
  verifyCertificate: (query: string) => Certificate | null;
  createEvent: (event: Omit<EventItem, 'id' | 'registeredCount'>) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedDate'>) => void;
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'enquiryNumber' | 'status' | 'createdAt'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], reply?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  saveCreativeProject: (project: Omit<CreativeProject, 'id' | 'createdAt'>) => void;

  // Programs & Projects
  counsellingBookings: CounsellingBooking[];
  bookCounselling: (data: Omit<CounsellingBooking, 'id' | 'bookingNumber' | 'createdAt' | 'status'>) => CounsellingBooking;
  educationRegistrations: EducationGuidanceRegistration[];
  registerEducationGuidance: (data: Omit<EducationGuidanceRegistration, 'id' | 'regNumber' | 'createdAt' | 'status'>) => EducationGuidanceRegistration;
  bloodDonors: BloodDonor[];
  registerBloodDonor: (data: Omit<BloodDonor, 'id'>) => BloodDonor;
  bloodRequests: BloodRequest[];
  submitBloodRequest: (data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => BloodRequest;
  updateCounsellingStatus: (id: string, status: CounsellingBooking['status']) => void;
  updateEducationStatus: (id: string, status: EducationGuidanceRegistration['status']) => void;
  updateBloodRequestStatus: (id: string, status: BloodRequest['status']) => void;

  // Finance & Treasury
  financialSummary: InstitutionFinancialSummary;
  financialLedger: FinancialLedgerEntry[];
  addLedgerEntry: (entry: Omit<FinancialLedgerEntry, 'id'>) => FinancialLedgerEntry;

  // Death Certificates
  deathCertificateApplications: DeathCertificateApplication[];
  submitDeathCertificateApplication: (data: Omit<DeathCertificateApplication, 'id' | 'applicationNumber' | 'createdAt' | 'status'>) => DeathCertificateApplication;
  approveDeathCertificateApplication: (id: string, notes?: string) => Certificate;
  rejectDeathCertificateApplication: (id: string, notes: string) => void;

  // Modal triggers
  activePaymentModal: PaymentRecord | null;
  setActivePaymentModal: (payment: PaymentRecord | null) => void;
  activeReceiptModal: Receipt | null;
  setActiveReceiptModal: (receipt: Receipt | null) => void;
  activeCertificateModal: Certificate | null;
  setActiveCertificateModal: (cert: Certificate | null) => void;
  openNikahModal: boolean;
  setOpenNikahModal: (open: boolean) => void;
  openWelfareModal: boolean;
  setOpenWelfareModal: (open: boolean) => void;
  openZakahModal: boolean;
  setOpenZakahModal: (open: boolean) => void;
  openEnquiryModal: boolean;
  setOpenEnquiryModal: (open: boolean) => void;
  openVerifyModal: boolean;
  setOpenVerifyModal: (open: boolean) => void;
  openDeathCertModal: boolean;
  setOpenDeathCertModal: (open: boolean) => void;
}

const INITIAL_ADMIN_GRANTS: AdminAccessGrant[] = [
  {
    id: 'grant-superadmin',
    email: 'rumaispkdr@gmail.com',
    role: 'ADMIN',
    grantedBy: 'System Primary Authority',
    grantedAt: '2026-09-21',
    notes: 'Primary Chief Administrator / Owner',
  },
  {
    id: 'grant-committee-admin',
    email: 'admin@mahalconnect.org',
    role: 'ADMIN',
    grantedBy: 'Mahal Committee',
    grantedAt: '2026-09-21',
    notes: 'Executive General Secretary Desk',
  },
  {
    id: 'grant-nikah-desk',
    email: 'nikah@mahalconnect.org',
    role: 'NIKAH_STAFF',
    grantedBy: 'Mahal Committee',
    grantedAt: '2026-09-21',
    notes: 'Nikah Solemnization Desk',
  },
  {
    id: 'grant-welfare-desk',
    email: 'welfare@mahalconnect.org',
    role: 'WELFARE_STAFF',
    grantedBy: 'Mahal Committee',
    grantedAt: '2026-09-21',
    notes: 'Baithul Maal Relief Desk',
  },
  {
    id: 'grant-zakah-desk',
    email: 'zakah@mahalconnect.org',
    role: 'ZAKAH_STAFF',
    grantedBy: 'Mahal Committee',
    grantedAt: '2026-09-21',
    notes: 'Zakah Assessment Desk',
  },
];

const INITIAL_REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'acc-admin-1',
    email: 'rumaispkdr@gmail.com',
    password: 'password123',
    name: 'Rumais (Chief Administrator)',
    phone: '+91 98460 00000',
    role: 'ADMIN',
    memberId: 'MHL-000001',
    familyId: 'FAM-00001',
    createdAt: '2026-09-21',
  },
  {
    id: 'acc-member-1',
    email: 'member@mahalconnect.org',
    password: 'password123',
    name: 'Ahamed Basheer',
    phone: '+91 98460 11223',
    houseName: 'Baitul Aman',
    role: 'MEMBER',
    memberId: 'MHL-000124',
    familyId: 'FAM-00042',
    createdAt: '2026-09-21',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mahal_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mahal_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = translations[language];

  // 1b. Admin Access Grants list (persisted)
  const [adminAccessGrants, setAdminAccessGrants] = useState<AdminAccessGrant[]>(() => {
    const saved = localStorage.getItem('mahal_admin_grants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure rumaispkdr@gmail.com is always present
        if (!parsed.some((g: AdminAccessGrant) => g.email.toLowerCase() === 'rumaispkdr@gmail.com')) {
          parsed.unshift(INITIAL_ADMIN_GRANTS[0]);
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ADMIN_GRANTS;
  });

  useEffect(() => {
    localStorage.setItem('mahal_admin_grants', JSON.stringify(adminAccessGrants));
  }, [adminAccessGrants]);

  // 1c. Registered accounts list (persisted)
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('mahal_registered_accounts');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('mahal_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Helper: check if email has admin accessibility
  const isUserAdmin = (email?: string): boolean => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return adminAccessGrants.some((g) => g.email.toLowerCase() === clean);
  };

  // 2. Auth: Check stored user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mahal_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default to unauthenticated/public visitor so only real logins access portal
    return null;
  });

  const currentRole: Role = currentUser ? currentUser.role : 'PUBLIC';

  // 3. Navigation
  const [activeTab, setActiveTab] = useState<string>(() => {
    return 'home';
  });

  // Supabase connection state
  const [supabaseStatus, setSupabaseStatus] = useState<string>(
    isSupabaseConfigured ? 'Connecting to Supabase...' : 'Supabase configured for PostgreSQL integration'
  );

  useEffect(() => {
    if (isSupabaseConfigured) {
      testSupabaseConnection().then((res) => {
        setSupabaseStatus(res.message);
      });
    }
  }, []);

  // 4. Data states with local storage caching
  const [settings, setSettings] = useState<MahalSettings>(() => {
    const saved = localStorage.getItem('mahal_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('mahal_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [families, setFamilies] = useState<Family[]>(() => {
    const saved = localStorage.getItem('mahal_families');
    return saved ? JSON.parse(saved) : INITIAL_FAMILIES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('mahal_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem('mahal_receipts');
    return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
  });

  const [nikahApplications, setNikahApplications] = useState<NikahApplication[]>(() => {
    const saved = localStorage.getItem('mahal_nikah_apps');
    return saved ? JSON.parse(saved) : INITIAL_NIKAH_APPLICATIONS;
  });

  const [welfareApplications, setWelfareApplications] = useState<WelfareApplication[]>(() => {
    const saved = localStorage.getItem('mahal_welfare_apps');
    return saved ? JSON.parse(saved) : INITIAL_WELFARE_APPLICATIONS;
  });

  const [zakahApplications, setZakahApplications] = useState<ZakahApplication[]>(() => {
    const saved = localStorage.getItem('mahal_zakah_apps');
    return saved ? JSON.parse(saved) : INITIAL_ZAKAH_APPLICATIONS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('mahal_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('mahal_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('mahal_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('mahal_enquiries');
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('mahal_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [creativeProjects, setCreativeProjects] = useState<CreativeProject[]>(() => {
    const saved = localStorage.getItem('mahal_creative_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('mahal_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [counsellingBookings, setCounsellingBookings] = useState<CounsellingBooking[]>(() => {
    const saved = localStorage.getItem('mahal_counselling_bookings');
    return saved ? JSON.parse(saved) : INITIAL_COUNSELLING_BOOKINGS;
  });

  const [educationRegistrations, setEducationRegistrations] = useState<EducationGuidanceRegistration[]>(() => {
    const saved = localStorage.getItem('mahal_education_registrations');
    return saved ? JSON.parse(saved) : INITIAL_EDUCATION_REGISTRATIONS;
  });

  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(() => {
    const saved = localStorage.getItem('mahal_blood_donors');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_DONORS;
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem('mahal_blood_requests');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_REQUESTS;
  });

  const [financialLedger, setFinancialLedger] = useState<FinancialLedgerEntry[]>(() => {
    const saved = localStorage.getItem('mahal_financial_ledger');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_LEDGER;
  });

  const [deathCertificateApplications, setDeathCertificateApplications] = useState<DeathCertificateApplication[]>(() => {
    const saved = localStorage.getItem('mahal_death_apps');
    return saved ? JSON.parse(saved) : INITIAL_DEATH_CERTIFICATE_APPLICATIONS;
  });

  // Modal triggers
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [activePaymentModal, setActivePaymentModal] = useState<PaymentRecord | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<Receipt | null>(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState<Certificate | null>(null);
  const [openNikahModal, setOpenNikahModal] = useState(false);
  const [openWelfareModal, setOpenWelfareModal] = useState(false);
  const [openZakahModal, setOpenZakahModal] = useState(false);
  const [openEnquiryModal, setOpenEnquiryModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [openDeathCertModal, setOpenDeathCertModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mahal_payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('mahal_receipts', JSON.stringify(receipts));
  }, [receipts]);
  useEffect(() => {
    localStorage.setItem('mahal_nikah_apps', JSON.stringify(nikahApplications));
  }, [nikahApplications]);
  useEffect(() => {
    localStorage.setItem('mahal_welfare_apps', JSON.stringify(welfareApplications));
  }, [welfareApplications]);
  useEffect(() => {
    localStorage.setItem('mahal_zakah_apps', JSON.stringify(zakahApplications));
  }, [zakahApplications]);
  useEffect(() => {
    localStorage.setItem('mahal_certificates', JSON.stringify(certificates));
  }, [certificates]);
  useEffect(() => {
    localStorage.setItem('mahal_events', JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem('mahal_announcements', JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('mahal_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);
  useEffect(() => {
    localStorage.setItem('mahal_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('mahal_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('mahal_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('mahal_financial_ledger', JSON.stringify(financialLedger));
  }, [financialLedger]);
  useEffect(() => {
    localStorage.setItem('mahal_death_apps', JSON.stringify(deathCertificateApplications));
  }, [deathCertificateApplications]);

  // Dynamic Financial Summary calculated from ledger entries
  const financialSummary: InstitutionFinancialSummary = React.useMemo(() => {
    const currentMonthPrefix = '2026-09';
    let masjidInc = 0;
    let masjidExp = 0;
    let madrasaInc = 0;
    let madrasaExp = 0;

    financialLedger.forEach((entry) => {
      if (entry.date.startsWith(currentMonthPrefix)) {
        if (entry.institution === 'MASJID') {
          if (entry.type === 'INCOME') masjidInc += entry.amount;
          else masjidExp += entry.amount;
        } else if (entry.institution === 'MADRASA') {
          if (entry.type === 'INCOME') madrasaInc += entry.amount;
          else madrasaExp += entry.amount;
        }
      }
    });

    const mInc = masjidInc || INITIAL_FINANCIAL_SUMMARY.masjidIncomeThisMonth;
    const mExp = masjidExp || INITIAL_FINANCIAL_SUMMARY.masjidExpensesThisMonth;
    const mdInc = madrasaInc || INITIAL_FINANCIAL_SUMMARY.madrasaIncomeThisMonth;
    const mdExp = madrasaExp || INITIAL_FINANCIAL_SUMMARY.madrasaExpensesThisMonth;

    return {
      masjidIncomeThisMonth: mInc,
      masjidExpensesThisMonth: mExp,
      masjidProfitThisMonth: mInc - mExp,
      madrasaIncomeThisMonth: mdInc,
      madrasaExpensesThisMonth: mdExp,
      madrasaProfitThisMonth: mdInc - mdExp,
      totalIncomeThisMonth: mInc + mdInc,
      totalExpensesThisMonth: mExp + mdExp,
      netProfitThisMonth: (mInc + mdInc) - (mExp + mdExp),
      currentMonthName: 'September 2026',
    };
  }, [financialLedger]);

  // Derived current profile & family strictly matching currentUser
  const currentProfile: Profile | null = React.useMemo(() => {
    if (!currentUser) return null;
    // 1. Find profile matching currentUser memberId or email
    const match = profiles.find(
      (p) =>
        (currentUser.memberId && p.memberId === currentUser.memberId) ||
        (currentUser.email && p.email?.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (match) {
      return { ...match, name: currentUser.name || match.name };
    }
    // 2. Synthesize dedicated profile for this account
    const memberId =
      currentUser.memberId ||
      `MHL-${Math.abs(currentUser.email.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0) % 900000) + 100000}`;
    const familyId =
      currentUser.familyId ||
      `FAM-${Math.abs(currentUser.email.split('').reduce((acc, char) => acc * 17 + char.charCodeAt(0), 0) % 90000) + 10000}`;
    return {
      id: `prof-${currentUser.id}`,
      userId: currentUser.id,
      memberId,
      membershipNumber: memberId,
      name: currentUser.name,
      gender: 'MALE',
      dateOfBirth: '1990-01-01',
      phone: currentUser.phone || '+91 98460 00000',
      email: currentUser.email,
      address: 'Noor-ul-Huda Mahal, West Hill, Kozhikode',
      occupation: currentUser.role === 'ADMIN' ? 'Mahal Chief Administrator' : 'Private Employment',
      education: 'Graduate',
      bloodGroup: 'B+',
      familyId,
      familyRole: 'HEAD',
      mahalName: settings.mahalName,
      membershipDate: '2024-01-01',
      membershipStatus: 'ACTIVE',
      monthlyContribution: settings.monthlyContributionDefault || 1000,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isPublicInDirectory: true,
    };
  }, [currentUser, profiles, settings]);

  const currentFamily: Family | null = React.useMemo(() => {
    if (!currentProfile) return null;
    const match = families.find(
      (f) => f.familyId === currentProfile.familyId || f.headMemberId === currentProfile.memberId
    );
    if (match) {
      return { ...match, headName: currentProfile.name };
    }
    return {
      id: `fam-${currentProfile.familyId}`,
      familyId: currentProfile.familyId,
      familyName: `${currentProfile.name}'s Family`,
      houseName: 'Baitul Aman',
      headMemberId: currentProfile.memberId,
      headName: currentProfile.name,
      address: currentProfile.address,
      phone: currentProfile.phone,
      memberCount: 3,
      monthlyContribution: currentProfile.monthlyContribution,
      paymentStatus: 'PAID',
    };
  }, [currentProfile, families]);

  // Automatically synchronize profiles, family members, receipts, certificates, and dues whenever an account is active
  useEffect(() => {
    if (!currentUser || !currentProfile) return;
    const memberId = currentProfile.memberId;
    const memberName = currentProfile.name;
    const familyId = currentProfile.familyId;
    const houseName = currentFamily?.houseName || 'Baitul Aman';

    // 1. Sync or add primary profile & household members for this account
    setProfiles((prevProfiles) => {
      let updated = [...prevProfiles];
      const headIdx = updated.findIndex((p) => p.memberId === memberId || (p.email && currentUser.email && p.email.toLowerCase() === currentUser.email.toLowerCase()));
      if (headIdx >= 0) {
        updated[headIdx] = {
          ...updated[headIdx],
          name: memberName,
          email: currentUser.email,
          phone: currentUser.phone || updated[headIdx].phone,
          memberId,
          familyId,
        };
      } else {
        updated = [currentProfile, ...updated];
      }

      // Check if family has household members (spouse, children)
      const existingKin = updated.filter((p) => p.familyId === familyId && p.memberId !== memberId);
      if (existingKin.length === 0) {
        const baseFirst = memberName.split(' ')[0];
        const kin: Profile[] = [
          {
            id: `prof-spouse-${memberId}`,
            userId: currentUser?.id || 'user-member-1',
            memberId: `${memberId}-S`,
            membershipNumber: `MH-S-${memberId}`,
            email: currentProfile.email,
            name: `${baseFirst}'s Spouse (Fathima)`,
            gender: 'FEMALE',
            dateOfBirth: '1992-04-12',
            phone: currentProfile.phone,
            address: currentProfile.address,
            occupation: 'Homemaker',
            education: 'Graduate',
            bloodGroup: 'O+',
            familyId,
            familyRole: 'SPOUSE',
            mahalName: settings.mahalName,
            membershipDate: currentProfile.membershipDate,
            membershipStatus: 'ACTIVE',
            monthlyContribution: 0,
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            isPublicInDirectory: false,
          },
          {
            id: `prof-son-${memberId}`,
            userId: currentUser?.id || 'user-member-1',
            memberId: `${memberId}-C1`,
            membershipNumber: `MH-C1-${memberId}`,
            email: currentProfile.email,
            name: `Aayan ${baseFirst}`,
            gender: 'MALE',
            dateOfBirth: '2016-08-20',
            phone: currentProfile.phone,
            address: currentProfile.address,
            occupation: 'Student (Class 5, Madrasa & School)',
            education: 'Primary',
            bloodGroup: 'B+',
            familyId,
            familyRole: 'SON',
            mahalName: settings.mahalName,
            membershipDate: currentProfile.membershipDate,
            membershipStatus: 'ACTIVE',
            monthlyContribution: 0,
            photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
            isPublicInDirectory: false,
          },
          {
            id: `prof-daughter-${memberId}`,
            userId: currentUser?.id || 'user-member-1',
            memberId: `${memberId}-C2`,
            membershipNumber: `MH-C2-${memberId}`,
            email: currentProfile.email,
            name: `Zoya ${baseFirst}`,
            gender: 'FEMALE',
            dateOfBirth: '2019-11-05',
            phone: currentProfile.phone,
            address: currentProfile.address,
            occupation: 'Student (Class 2)',
            education: 'Pre-Primary',
            bloodGroup: 'A+',
            familyId,
            familyRole: 'DAUGHTER',
            mahalName: settings.mahalName,
            membershipDate: currentProfile.membershipDate,
            membershipStatus: 'ACTIVE',
            monthlyContribution: 0,
            photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            isPublicInDirectory: false,
          },
        ];
        updated = [...updated, ...kin];
      }
      return updated;
    });

    // 2. Sync family registry
    setFamilies((prevFamilies) => {
      const famIdx = prevFamilies.findIndex((f) => f.familyId === familyId || f.headMemberId === memberId);
      if (famIdx >= 0) {
        const updated = [...prevFamilies];
        updated[famIdx] = {
          ...updated[famIdx],
          headName: memberName,
          familyName: `${memberName}'s Family`,
          houseName,
        };
        return updated;
      } else {
        const newFam: Family = {
          id: `fam-${familyId}`,
          familyId,
          familyName: `${memberName}'s Family`,
          houseName,
          headMemberId: memberId,
          headName: memberName,
          address: currentProfile.address,
          phone: currentProfile.phone,
          memberCount: 4,
          monthlyContribution: currentProfile.monthlyContribution || 1000,
          paymentStatus: 'PAID',
        };
        return [newFam, ...prevFamilies];
      }
    });

    // 3. Sync or generate certificates for this user
    setCertificates((prevCerts) => {
      const userCerts = prevCerts.filter((c) => c.memberId === memberId);
      if (userCerts.length > 0) {
        let changed = false;
        const updated = prevCerts.map((c) => {
          if (c.memberId === memberId && (c.memberName !== memberName || c.details?.FamilyHead !== memberName)) {
            changed = true;
            return {
              ...c,
              memberName,
              details: {
                ...c.details,
                FamilyHead: memberName,
                HouseName: houseName,
              },
            };
          }
          return c;
        });
        return changed ? updated : prevCerts;
      } else {
        const seedCerts: Certificate[] = [
          {
            id: `cert-${Date.now()}-1`,
            certificateNumber: `CERT-MEM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            type: 'MEMBERSHIP',
            title: 'MAHAL MEMBERSHIP CERTIFICATE',
            memberId,
            memberName,
            familyId,
            mahalName: settings.mahalName,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: `${new Date().getFullYear() + 1}-12-31`,
            issuedBy: `${settings.secretaryName} (General Secretary)`,
            verificationHash: `MH-MEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            details: {
              HouseName: houseName,
              FamilyHead: memberName,
              MembershipYear: new Date().getFullYear().toString(),
              Status: 'Active Member in Good Standing',
              MonthlyContribution: `₹${currentProfile.monthlyContribution || 1000}`,
            },
          },
          {
            id: `cert-${Date.now()}-2`,
            certificateNumber: `CERT-RES-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            type: 'RESIDENCE',
            title: 'MAHAL RESIDENCE CERTIFICATE',
            memberId,
            memberName,
            familyId,
            mahalName: settings.mahalName,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: `${new Date().getFullYear() + 1}-12-31`,
            issuedBy: `${settings.secretaryName} (General Secretary)`,
            verificationHash: `MH-RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            details: {
              HouseName: houseName,
              FamilyHead: memberName,
              Address: currentProfile.address,
              ResidingSince: '2015',
            },
          },
          {
            id: `cert-${Date.now()}-3`,
            certificateNumber: `CERT-NIK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            type: 'NIKAH',
            title: 'MAHAL NIKAH NOC & CHARACTER CERTIFICATE',
            memberId,
            memberName,
            familyId,
            mahalName: settings.mahalName,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: `${new Date().getFullYear()}-12-31`,
            issuedBy: `${settings.secretaryName} (General Secretary)`,
            verificationHash: `MH-NIK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            details: {
              HouseName: houseName,
              FamilyHead: memberName,
              Status: 'Verified Citizen & Good Standing',
            },
          },
        ];
        return [...seedCerts, ...prevCerts];
      }
    });

    // 4. Sync or generate receipts for this user
    setReceipts((prevReceipts) => {
      const userReceipts = prevReceipts.filter((r) => r.memberId === memberId);
      if (userReceipts.length > 0) {
        let changed = false;
        const updated = prevReceipts.map((r) => {
          if (r.memberId === memberId && r.memberName !== memberName) {
            changed = true;
            return { ...r, memberName };
          }
          return r;
        });
        return changed ? updated : prevReceipts;
      } else {
        const seedReceipts: Receipt[] = [
          {
            receiptNumber: `RCT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            paymentId: `pay-${memberId}-aug-2026`,
            memberId,
            memberName,
            familyId,
            mahalName: settings.mahalName,
            monthName: 'August 2026',
            amount: 1000,
            paymentDate: '2026-08-06 11:20 AM',
            paymentMethod: 'UPI (GPay / PhonePe)',
            transactionId: `TXN-UPI-${Math.floor(1000000 + Math.random() * 9000000)}`,
            status: 'VERIFIED',
            signatureOfficer: `${settings.secretaryName} (General Secretary)`,
          },
          {
            receiptNumber: `RCT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            paymentId: `pay-${memberId}-jul-2026`,
            memberId,
            memberName,
            familyId,
            mahalName: settings.mahalName,
            monthName: 'July 2026',
            amount: 1000,
            paymentDate: '2026-07-08 04:15 PM',
            paymentMethod: 'UPI',
            transactionId: `TXN-UPI-${Math.floor(1000000 + Math.random() * 9000000)}`,
            status: 'VERIFIED',
            signatureOfficer: `${settings.secretaryName} (General Secretary)`,
          },
        ];
        return [...seedReceipts, ...prevReceipts];
      }
    });

    // 5. Ensure payments ledger exists for this user
    setPayments((prevPayments) => {
      const userPayments = prevPayments.filter((p) => p.memberId === memberId);
      if (userPayments.length === 0) {
        return [
          {
            id: `pay-${memberId}-sep-2026`,
            memberId,
            familyId,
            month: '2026-09',
            monthName: 'September 2026',
            amount: 1000,
            status: 'PENDING',
            dueDate: '2026-09-10',
            lateFee: 0,
          },
          {
            id: `pay-${memberId}-aug-2026`,
            memberId,
            familyId,
            month: '2026-08',
            monthName: 'August 2026',
            amount: 1000,
            status: 'PAID',
            dueDate: '2026-08-10',
            paidDate: '2026-08-06',
            transactionId: `TXN-UPI-${Math.floor(1000000 + Math.random() * 9000000)}`,
            receiptNumber: `RCT-2026-00084`,
            paymentMethod: 'UPI',
          },
          ...prevPayments,
        ];
      }
      return prevPayments;
    });
  }, [currentUser?.email, currentUser?.memberId, currentUser?.name, currentProfile?.name]);

  // Audit log helper
  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userEmail: currentUser?.email || 'anonymous',
      userName: currentUser?.name || 'Public Visitor',
      role: currentRole,
      action,
      entity,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Real Authentication methods
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; isAdmin: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please provide a valid Gmail or email address.', isAdmin: false };
    }

    // Find existing account in registeredAccounts
    let existingAccount = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    // If chief admin or default demo accounts aren't in registeredAccounts yet, populate from INITIAL_REGISTERED_ACCOUNTS
    if (!existingAccount) {
      const defaultMatch = INITIAL_REGISTERED_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);
      if (defaultMatch) {
        existingAccount = defaultMatch;
      }
    }

    if (!existingAccount) {
      return {
        success: false,
        error: 'No registered account found with this email. Please click "Register" to create an account first.',
        isAdmin: false,
      };
    }

    // STRICT PASSWORD VERIFICATION: Do not enter account if password is missing or incorrect
    if (!password || password.trim() === '') {
      return {
        success: false,
        error: 'Password is required. Please enter your account password.',
        isAdmin: false,
      };
    }

    if (existingAccount.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Access denied. Please check your credentials.',
        isAdmin: false,
      };
    }

    const adminGrant = adminAccessGrants.find((g) => g.email.toLowerCase() === cleanEmail);
    let assignedRole: Role = adminGrant ? adminGrant.role : existingAccount.role;
    let userName = existingAccount.name;
    let userPhone = existingAccount.phone;
    let userMemberId: string =
      existingAccount.memberId ||
      `MHL-${Math.abs(cleanEmail.split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0) % 900000) + 100000}`;
    let userFamilyId: string =
      existingAccount.familyId ||
      `FAM-${Math.abs(cleanEmail.split('').reduce((acc, char) => acc * 17 + char.charCodeAt(0), 0) % 90000) + 10000}`;

    const authenticatedUser: User = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      name: userName,
      role: assignedRole,
      phone: userPhone,
      memberId: userMemberId,
      familyId: userFamilyId,
    };

    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.email.toLowerCase() === cleanEmail || p.memberId === userMemberId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: userName, memberId: userMemberId, familyId: userFamilyId };
        return copy;
      }
      return prev;
    });

    setCurrentUser(authenticatedUser);
    localStorage.setItem('mahal_current_user', JSON.stringify(authenticatedUser));
    addAuditLog('USER_LOGIN', 'USER', authenticatedUser.id, `User logged in with role ${assignedRole}`);

    const isAdmin = Boolean(adminGrant || assignedRole === 'ADMIN');

    // Route to appropriate view
    if (isAdmin) {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('member-dashboard');
    }

    return { success: true, isAdmin };
  };

  const register = async (accountData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    houseName?: string;
  }): Promise<{ success: boolean; error?: string; isAdmin: boolean }> => {
    const cleanEmail = accountData.email.trim().toLowerCase();
    if (!cleanEmail || !accountData.password) {
      return { success: false, error: 'Please enter a valid email and password.', isAdmin: false };
    }
    if (accountData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.', isAdmin: false };
    }

    const existingAccount = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existingAccount) {
      return { success: false, error: 'An account with this email is already registered. Please sign in.', isAdmin: false };
    }

    // Check if this Gmail already has an admin access grant
    const adminGrant = adminAccessGrants.find((g) => g.email.toLowerCase() === cleanEmail);
    const assignedRole: Role = adminGrant ? adminGrant.role : 'MEMBER';
    const newMemberId = `MHL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newFamilyId = `FAM-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAccount: RegisteredAccount = {
      id: `acc-${Date.now()}`,
      email: cleanEmail,
      password: accountData.password,
      name: accountData.name,
      phone: accountData.phone,
      houseName: accountData.houseName,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      memberId: assignedRole === 'MEMBER' ? newMemberId : undefined,
      familyId: assignedRole === 'MEMBER' ? newFamilyId : undefined,
    };

    setRegisteredAccounts((prev) => [newAccount, ...prev]);

    // If Member role, create their profile & family unit if not already present
    if (assignedRole === 'MEMBER') {
      const newProfile: Profile = {
        id: `prof-${Date.now()}`,
        userId: newAccount.id,
        memberId: newMemberId,
        membershipNumber: newMemberId,
        name: accountData.name,
        gender: 'MALE',
        dateOfBirth: '1995-05-15',
        phone: accountData.phone,
        email: cleanEmail,
        address: accountData.houseName ? `${accountData.houseName}, Noor-ul-Huda Mahal, West Hill` : 'Noor-ul-Huda Mahal, West Hill',
        occupation: 'Private Employment',
        education: 'Graduate',
        bloodGroup: 'B+',
        familyId: newFamilyId,
        familyRole: 'HEAD',
        mahalName: settings.mahalName,
        membershipDate: new Date().toISOString().split('T')[0],
        membershipStatus: 'ACTIVE',
        monthlyContribution: settings.monthlyContributionDefault || 1000,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isPublicInDirectory: true,
      };
      setProfiles((prev) => [newProfile, ...prev]);

      const newFamilyRecord: Family = {
        id: `fam-${Date.now()}`,
        familyId: newFamilyId,
        familyName: `${accountData.name}'s Family`,
        houseName: accountData.houseName || 'Baitul Falah',
        headMemberId: newMemberId,
        headName: accountData.name,
        address: accountData.houseName ? `${accountData.houseName}, West Hill` : 'West Hill, Kozhikode',
        phone: accountData.phone,
        memberCount: 1,
        monthlyContribution: settings.monthlyContributionDefault || 1000,
        paymentStatus: 'PAID',
      };
      setFamilies((prev) => [newFamilyRecord, ...prev]);

      // Automatically issue an active Membership Certificate for new member
      const newCertNumber = `CERT-MEM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const memberCertificate: Certificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: newCertNumber,
        type: 'MEMBERSHIP',
        title: 'MAHAL MEMBERSHIP CERTIFICATE',
        memberId: newMemberId,
        memberName: accountData.name,
        familyId: newFamilyId,
        mahalName: settings.mahalName,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: `${new Date().getFullYear() + 1}-12-31`,
        issuedBy: `${settings.secretaryName} (General Secretary)`,
        verificationHash: `MH-MEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        details: {
          HouseName: accountData.houseName || 'Baitul Falah',
          FamilyHead: accountData.name,
          MembershipYear: new Date().getFullYear().toString(),
          Status: 'Active Member in Good Standing',
          MonthlyContribution: `₹${settings.monthlyContributionDefault || 1000}`,
        },
      };
      setCertificates((prev) => [memberCertificate, ...prev]);
    }

    // Store login and member details neatly on Supabase
    if (isSupabaseConfigured) {
      supabaseSignUp(cleanEmail, accountData.password, {
        name: accountData.name,
        role: assignedRole,
        phone: accountData.phone,
        memberId: assignedRole === 'MEMBER' ? newMemberId : undefined,
        familyId: assignedRole === 'MEMBER' ? newFamilyId : undefined,
      }).catch((err) => {
        console.warn('Supabase profile storage:', err);
      });
    }

    const authenticatedUser: User = {
      id: newAccount.id,
      email: cleanEmail,
      name: accountData.name,
      role: assignedRole,
      phone: accountData.phone,
      memberId: newMemberId,
      familyId: newFamilyId,
    };

    setCurrentUser(authenticatedUser);
    localStorage.setItem('mahal_current_user', JSON.stringify(authenticatedUser));
    addAuditLog('USER_REGISTER', 'USER', newAccount.id, `New member registration for ${cleanEmail}`);

    const isAdmin = Boolean(adminGrant || assignedRole === 'ADMIN');
    if (isAdmin) {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('member-dashboard');
    }

    return { success: true, isAdmin };
  };

  const syncDataToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase is not configured yet. Please add your Supabase URL & Anon Key in .env',
      };
    }
    try {
      let count = 0;
      for (const fam of families) {
        await syncFamilyToSupabase(fam);
        count++;
      }
      for (const p of profiles) {
        await syncMemberToSupabase(p);
        count++;
      }
      for (const pay of payments) {
        await syncPaymentToSupabase(pay);
        count++;
      }
      return {
        success: true,
        message: `Neatly synchronized ${count} records (Families, Members, and Payments) to Supabase PostgreSQL!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Error communicating with Supabase',
      };
    }
  };

  // Admin Access Delegation: Add another Gmail to admin authority
  const addAdminAccess = (
    email: string,
    role: Role = 'ADMIN',
    notes?: string
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid Gmail or email address.' };
    }

    const existingIndex = adminAccessGrants.findIndex((g) => g.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      // Update role
      const updated = [...adminAccessGrants];
      updated[existingIndex] = {
        ...updated[existingIndex],
        role,
        notes: notes || updated[existingIndex].notes,
      };
      setAdminAccessGrants(updated);
      addAuditLog('UPDATE_ADMIN_ACCESS', 'ADMIN_GRANT', updated[existingIndex].id, `Updated admin role for ${cleanEmail} to ${role}`);
      return { success: true, message: `Updated administrative permissions for ${cleanEmail}.` };
    }

    const newGrant: AdminAccessGrant = {
      id: `grant-${Date.now()}`,
      email: cleanEmail,
      role,
      grantedBy: currentUser?.email || 'Chief Admin',
      grantedAt: new Date().toISOString().split('T')[0],
      notes: notes || 'Administrative access grant',
    };

    setAdminAccessGrants((prev) => [newGrant, ...prev]);

    // If the user is currently logged in, update their session role immediately
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      localStorage.setItem('mahal_current_user', JSON.stringify(updatedUser));
    }

    // Also update any registered account
    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.email.toLowerCase() === cleanEmail ? { ...acc, role } : acc))
    );

    addAuditLog('GRANT_ADMIN_ACCESS', 'ADMIN_GRANT', newGrant.id, `Granted ${role} access to ${cleanEmail}`);
    return { success: true, message: `Administrative accessibility successfully granted to ${cleanEmail}.` };
  };

  // Revoke admin accessibility
  const removeAdminAccess = (email: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rumaispkdr@gmail.com') {
      return { success: false, message: 'The primary owner / SuperAdmin (rumaispkdr@gmail.com) cannot be revoked.' };
    }

    setAdminAccessGrants((prev) => prev.filter((g) => g.email.toLowerCase() !== cleanEmail));

    // If user is currently logged in with this email, demote to MEMBER
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      const demotedUser = { ...currentUser, role: 'MEMBER' as Role };
      setCurrentUser(demotedUser);
      localStorage.setItem('mahal_current_user', JSON.stringify(demotedUser));
      setActiveTab('member-dashboard');
    }

    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.email.toLowerCase() === cleanEmail ? { ...acc, role: 'MEMBER' as Role } : acc))
    );

    addAuditLog('REVOKE_ADMIN_ACCESS', 'ADMIN_GRANT', cleanEmail, `Revoked admin rights for ${cleanEmail}`);
    return { success: true, message: `Administrative access revoked for ${cleanEmail}.` };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('USER_LOGOUT', 'USER', currentUser.id, 'User signed out');
    }
    setCurrentUser(null);
    localStorage.removeItem('mahal_current_user');
    setActiveTab('home');
  };

  // Backward compatibility stub (demo switchers are removed from UI)
  const switchPersona = (role: Role) => {
    if (role === 'PUBLIC') {
      logout();
      return;
    }
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(found);
    localStorage.setItem('mahal_current_user', JSON.stringify(found));
    if (role === 'ADMIN' || role === 'NIKAH_STAFF' || role === 'WELFARE_STAFF' || role === 'ZAKAH_STAFF') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('member-dashboard');
    }
  };

  const updateSettings = (newSettings: Partial<MahalSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('UPDATE_SETTINGS', 'MAHAL_SETTINGS', 'settings-1', 'Updated community settings');
  };

  // Payment execution
  const makePayment = async (paymentId: string, method: string): Promise<Receipt> => {
    const payment = payments.find((p) => p.id === paymentId) || payments[0];

    // Call server verification API
    let verifiedReceiptNo = `RCT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    let verifiedTxnId = `TXN-${method.toUpperCase()}-${Date.now().toString().slice(-8)}`;

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.id,
          memberId: payment.memberId,
          amount: payment.amount,
          paymentMethod: method,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.receiptNumber) verifiedReceiptNo = data.receiptNumber;
        if (data.transactionId) verifiedTxnId = data.transactionId;
      }
    } catch (e) {
      // Fallback works automatically
    }

    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'PAID' as const,
          paidDate: new Date().toISOString().split('T')[0],
          transactionId: verifiedTxnId,
          receiptNumber: verifiedReceiptNo,
          paymentMethod: method as any,
        };
      }
      return p;
    });
    setPayments(updatedPayments);

    // Update family status to PAID if all due are settled
    setFamilies((prev) =>
      prev.map((f) => (f.familyId === payment.familyId ? { ...f, paymentStatus: 'PAID' } : f))
    );

    const matchedProfile =
      profiles.find((p) => p.memberId === payment.memberId) ||
      (currentProfile && currentProfile.memberId === payment.memberId ? currentProfile : null) ||
      (currentUser && currentUser.memberId === payment.memberId ? currentUser : null) ||
      currentProfile ||
      currentUser;

    const payerName =
      matchedProfile?.name ||
      currentUser?.name ||
      currentProfile?.name ||
      'Mahal Member';

    const newReceipt: Receipt = {
      receiptNumber: verifiedReceiptNo,
      paymentId: payment.id,
      memberId: payment.memberId,
      memberName: payerName,
      familyId: payment.familyId,
      mahalName: settings.mahalName,
      monthName: payment.monthName,
      amount: payment.amount,
      paymentDate: new Date().toLocaleString(),
      paymentMethod: method,
      transactionId: verifiedTxnId,
      status: 'VERIFIED',
      signatureOfficer: `${settings.secretaryName} (General Secretary)`,
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    // Send notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Payment Successful & Receipt Ready',
      message: `Your contribution of ₹${payment.amount} for ${payment.monthName} was received. Receipt ${verifiedReceiptNo} generated.`,
      type: 'PAYMENT',
      read: false,
      date: new Date().toISOString().split('T')[0],
      linkUrl: '#receipts',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog('PAYMENT_COMPLETED', 'PAYMENT', payment.id, `Paid ₹${payment.amount} via ${method}. Receipt: ${verifiedReceiptNo}`);

    return newReceipt;
  };

  // Nikah Application
  const submitNikahApplication = (
    data: Omit<NikahApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ): NikahApplication => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const appNumber = `NIK-2026-00${randomSuffix}`;
    const newApp: NikahApplication = {
      ...data,
      id: `nikah-${Date.now()}`,
      applicationNumber: appNumber,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setNikahApplications((prev) => [newApp, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Nikah Application Submitted',
      message: `Your marriage registration application ${appNumber} has been submitted for document verification.`,
      type: 'NIKAH',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('NIKAH_SUBMITTED', 'NIKAH_APPLICATION', appNumber, `Submitted by ${data.applicantName}`);
    return newApp;
  };

  const updateNikahStatus = (id: string, status: NikahStatus, adminNotes?: string) => {
    setNikahApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const certNum =
            status === 'COMPLETED' || status === 'CERTIFICATE_AVAILABLE'
              ? app.certificateNumber || `CERT-NIK-2026-00${Math.floor(100 + Math.random() * 900)}`
              : app.certificateNumber;

          return {
            ...app,
            status,
            adminNotes: adminNotes !== undefined ? adminNotes : app.adminNotes,
            certificateNumber: certNum,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );
    addAuditLog('NIKAH_STATUS_UPDATED', 'NIKAH_APPLICATION', id, `Updated status to ${status}`);
  };

  // Welfare Application
  const submitWelfareApplication = (
    data: Omit<WelfareApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>
  ): WelfareApplication => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const appNumber = `WEL-2026-00${randomSuffix}`;
    const newApp: WelfareApplication = {
      ...data,
      id: `wel-${Date.now()}`,
      applicationNumber: appNumber,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setWelfareApplications((prev) => [newApp, ...prev]);
    addAuditLog('WELFARE_SUBMITTED', 'WELFARE_APPLICATION', appNumber, `Category: ${data.category}, ₹${data.amountRequested}`);
    return newApp;
  };

  const updateWelfareStatus = (
    id: string,
    status: WelfareStatus,
    reviewerNotes?: string,
    amountApproved?: number
  ) => {
    setWelfareApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status,
            reviewerNotes: reviewerNotes || app.reviewerNotes,
            amountApproved: amountApproved !== undefined ? amountApproved : app.amountApproved,
            processedAt: status === 'APPROVED' ? new Date().toISOString().split('T')[0] : app.processedAt,
          };
        }
        return app;
      })
    );
    addAuditLog('WELFARE_STATUS_UPDATED', 'WELFARE_APPLICATION', id, `Updated to ${status}`);
  };

  // Zakah Application
  const submitZakahApplication = (
    data: Omit<ZakahApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>
  ): ZakahApplication => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const appNumber = `ZAK-2026-00${randomSuffix}`;
    const newApp: ZakahApplication = {
      ...data,
      id: `zak-${Date.now()}`,
      applicationNumber: appNumber,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setZakahApplications((prev) => [newApp, ...prev]);
    addAuditLog('ZAKAH_SUBMITTED', 'ZAKAH_APPLICATION', appNumber, `Category: ${data.category}, ₹${data.amountNeeded}`);
    return newApp;
  };

  const updateZakahStatus = (
    id: string,
    status: ZakahStatus,
    assessmentNotes?: string,
    amountDistributed?: number
  ) => {
    setZakahApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status,
            assessmentNotes: assessmentNotes || app.assessmentNotes,
            amountDistributed: amountDistributed !== undefined ? amountDistributed : app.amountDistributed,
            distributionDate: status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : app.distributionDate,
          };
        }
        return app;
      })
    );
    addAuditLog('ZAKAH_STATUS_UPDATED', 'ZAKAH_APPLICATION', id, `Updated to ${status}`);
  };

  // Certificate Generator
  const generateCertificate = (type: Certificate['type'], memberId: string): Certificate => {
    const profile = profiles.find((p) => p.memberId === memberId) || profiles[0];
    const family = families.find((f) => f.familyId === profile.familyId) || families[0];

    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certNumber = `CERT-${type.substring(0, 3)}-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const titles: Record<Certificate['type'], string> = {
      MEMBERSHIP: 'MAHAL MEMBERSHIP CERTIFICATE',
      FAMILY: 'MAHAL FAMILY REGISTER CERTIFICATE',
      NIKAH: 'MAHAL NIKAH VERIFICATION CERTIFICATE',
      RESIDENCE: 'MAHAL RESIDENCE CERTIFICATE',
      DEATH: 'MAHAL DEATH & BURIAL REGISTER CERTIFICATE',
    };

    const detailsMap: Record<Certificate['type'], Record<string, any>> = {
      MEMBERSHIP: {
        HouseName: family.houseName,
        FamilyHead: family.headName,
        MembershipYear: profile.membershipDate.substring(0, 4),
        Status: 'Active Member in Good Standing',
        MonthlyContribution: `₹${profile.monthlyContribution}`,
      },
      FAMILY: {
        HouseName: family.houseName,
        FamilyHead: family.headName,
        RegisteredMembers: family.memberCount,
        Address: family.address,
      },
      NIKAH: {
        GroomName: 'Sayyid Adil Hashim',
        BrideName: 'Fathima Safa Binte Basheer',
        DateOfSolemnization: '2026-10-18',
        Venue: 'Noor-ul-Huda Juma Masjid',
      },
      RESIDENCE: {
        ResidentName: profile.name,
        HouseName: family.houseName,
        PeriodOfResidence: '15+ Years',
      },
      DEATH: {
        DeceasedName: 'Late Hajiar Mohammed Kutty',
        DateOfDeath: '2026-03-12',
        PlaceOfDeath: 'General Hospital, Palakkad',
        KabristanName: 'Noor-ul-Huda Juma Masjid Qabrastan',
        KhabarPlotNumber: 'KB-North-082',
        KafnAndJanazahLedBy: 'Usthad Abdul Kareem Faizy (Chief Imam)',
      },
    };

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      type,
      title: titles[type],
      memberId: profile.memberId,
      memberName: profile.name,
      familyId: profile.familyId,
      mahalName: settings.mahalName,
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: `${settings.secretaryName} (General Secretary)`,
      verificationHash: `MH-${type.substring(0, 3)}-${randomHash}`,
      details: detailsMap[type],
    };

    setCertificates((prev) => [newCert, ...prev]);
    addAuditLog('CERTIFICATE_GENERATED', 'CERTIFICATE', certNumber, `Issued ${type} certificate to ${profile.name}`);
    return newCert;
  };

  const updateProfile = (profileData: Partial<Profile> & { id?: string; memberId?: string }) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if ((profileData.id && p.id === profileData.id) || (profileData.memberId && p.memberId === profileData.memberId)) {
          const updated = { ...p, ...profileData };
          // If name changed, also update all certificates AND receipts holding this memberId!
          if (profileData.name && profileData.name !== p.name) {
            setCertificates((cPrev) =>
              cPrev.map((cert) => {
                if (cert.memberId === p.memberId) {
                  return { ...cert, memberName: profileData.name! };
                }
                return cert;
              })
            );
            setReceipts((rPrev) =>
              rPrev.map((rcpt) => {
                if (rcpt.memberId === p.memberId) {
                  return { ...rcpt, memberName: profileData.name! };
                }
                return rcpt;
              })
            );
          }
          return updated;
        }
        return p;
      })
    );
  };

  const verifyCertificate = (query: string): Certificate | null => {
    if (!query || !query.trim()) return null;
    const clean = query.trim().toUpperCase();

    // 1. Direct Certificate Number match
    let cert = certificates.find((c) => c.certificateNumber.toUpperCase() === clean);

    // 2. Stripped alphanumeric match (handles hyphens/spaces variation)
    if (!cert) {
      const strippedClean = clean.replace(/[^A-Z0-9]/g, '');
      cert = certificates.find(
        (c) => c.certificateNumber.replace(/[^A-Z0-9]/g, '').toUpperCase() === strippedClean
      );
    }

    // 3. Match by Member ID (e.g. MHL-000124)
    if (!cert) {
      cert = certificates.find((c) => c.memberId.toUpperCase() === clean);
    }

    // 4. Match by Member Name substring
    if (!cert) {
      cert = certificates.find((c) => {
        const liveProf = profiles.find((p) => p.memberId === c.memberId);
        const nameToCheck = (liveProf?.name || c.memberName).toUpperCase();
        return nameToCheck.includes(clean);
      });
    }

    // 5. Match by Verification Hash
    if (!cert) {
      cert = certificates.find((c) => c.verificationHash.toUpperCase() === clean);
    }

    if (!cert) return null;

    // Automatically synchronize the certificate holder's name with their live Profile
    const matchedProfile =
      profiles.find((p) => p.memberId === cert!.memberId) ||
      (currentProfile && (currentProfile.memberId === cert!.memberId || currentProfile.name.toLowerCase() === cert!.memberName.toLowerCase())
        ? currentProfile
        : null);

    const latestHolderName = matchedProfile?.name || cert.memberName;
    const latestFamily = matchedProfile?.familyId
      ? families.find((f) => f.familyId === matchedProfile.familyId)
      : families.find((f) => f.familyId === cert.familyId);

    return {
      ...cert,
      memberName: latestHolderName,
      familyId: latestFamily?.familyId || cert.familyId,
      details: {
        ...cert.details,
        ...(cert.details?.FamilyHead ? { FamilyHead: latestFamily?.headName || latestHolderName } : {}),
        ...(cert.details?.ResidentName ? { ResidentName: latestHolderName } : {}),
      },
    };
  };

  // Events & Announcements
  const createEvent = (eventData: Omit<EventItem, 'id' | 'registeredCount'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    addAuditLog('EVENT_CREATED', 'EVENT', newEvent.id, `Created event: ${newEvent.title}`);
  };

  const createAnnouncement = (announcementData: Omit<Announcement, 'id' | 'publishedDate'>) => {
    const newAnn: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('ANNOUNCEMENT_PUBLISHED', 'ANNOUNCEMENT', newAnn.id, `Published announcement: ${newAnn.title}`);
  };

  // Enquiries
  const submitEnquiry = (
    enquiryData: Omit<Enquiry, 'id' | 'enquiryNumber' | 'status' | 'createdAt'>
  ): Enquiry => {
    const appNum = `ENQ-2026-00${Math.floor(100 + Math.random() * 900)}`;
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      enquiryNumber: appNum,
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    addAuditLog('ENQUIRY_RECEIVED', 'ENQUIRY', appNum, `From ${enquiryData.name} (${enquiryData.category})`);
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status'], reply?: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, replyMessage: reply || e.replyMessage } : e))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const saveCreativeProject = (projectData: Omit<CreativeProject, 'id' | 'createdAt'>) => {
    const newProj: CreativeProject = {
      ...projectData,
      id: `creative-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCreativeProjects((prev) => [newProj, ...prev]);
    addAuditLog('CREATIVE_PROJECT_SAVED', 'CREATIVE_PROJECT', newProj.id, `Saved project: ${newProj.title}`);
  };

  // Programs & Projects handlers
  const bookCounselling = (
    data: Omit<CounsellingBooking, 'id' | 'bookingNumber' | 'createdAt' | 'status'>
  ): CounsellingBooking => {
    const newBooking: CounsellingBooking = {
      ...data,
      id: `couns-${Date.now()}`,
      bookingNumber: `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCounsellingBookings((prev) => [newBooking, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Counselling Appointment Confirmed',
      message: `Appointment ${newBooking.bookingNumber} registered for ${newBooking.applicantName}.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications((prev) => [notif, ...prev]);
    addAuditLog('COUNSELLING_BOOKED', 'COUNSELLING', newBooking.bookingNumber, `Registered by ${newBooking.applicantName}`);
    return newBooking;
  };

  const registerEducationGuidance = (
    data: Omit<EducationGuidanceRegistration, 'id' | 'regNumber' | 'createdAt' | 'status'>
  ): EducationGuidanceRegistration => {
    const newReg: EducationGuidanceRegistration = {
      ...data,
      id: `edu-${Date.now()}`,
      regNumber: `EGC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'REGISTERED',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEducationRegistrations((prev) => [newReg, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Educational Guidance Registered',
      message: `Enrolled ${newReg.studentName} for career mentorship.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications((prev) => [notif, ...prev]);
    addAuditLog('EDUCATION_REGISTERED', 'EDUCATION_GUIDANCE', newReg.regNumber, `Student: ${newReg.studentName}`);
    return newReg;
  };

  const registerBloodDonor = (data: Omit<BloodDonor, 'id'>): BloodDonor => {
    const newDonor: BloodDonor = {
      ...data,
      id: `donor-${Date.now()}`,
    };
    setBloodDonors((prev) => [newDonor, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Blood Donor Enlisted',
      message: `Enlisted ${newDonor.name} (${newDonor.bloodGroup}) into the Mahal emergency blood donor registry.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications((prev) => [notif, ...prev]);
    addAuditLog('BLOOD_DONOR_REGISTERED', 'BLOOD_DONOR', newDonor.id, `Donor ${newDonor.name} (${newDonor.bloodGroup})`);
    return newDonor;
  };

  const submitBloodRequest = (
    data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>
  ): BloodRequest => {
    const newReq: BloodRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBloodRequests((prev) => [newReq, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'user-member-1',
      title: 'Emergency Blood Alert Broadcast',
      message: `Urgent request for ${newReq.bloodGroup} units for ${newReq.patientName} at ${newReq.hospital}.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    setNotifications((prev) => [notif, ...prev]);
    addAuditLog('BLOOD_REQUEST_SUBMITTED', 'BLOOD_REQUEST', newReq.id, `Blood: ${newReq.bloodGroup} for ${newReq.patientName}`);
    return newReq;
  };

  const updateCounsellingStatus = (id: string, status: CounsellingBooking['status']) => {
    setCounsellingBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    addAuditLog('COUNSELLING_STATUS_UPDATED', 'COUNSELLING', id, `Updated to ${status}`);
  };

  const updateEducationStatus = (id: string, status: EducationGuidanceRegistration['status']) => {
    setEducationRegistrations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    addAuditLog('EDUCATION_STATUS_UPDATED', 'EDUCATION_GUIDANCE', id, `Updated to ${status}`);
  };

  const updateBloodRequestStatus = (id: string, status: BloodRequest['status']) => {
    setBloodRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    addAuditLog('BLOOD_REQUEST_STATUS_UPDATED', 'BLOOD_REQUEST', id, `Updated to ${status}`);
  };

  // Financial Ledger Handlers
  const addLedgerEntry = (entry: Omit<FinancialLedgerEntry, 'id'>): FinancialLedgerEntry => {
    const newEntry: FinancialLedgerEntry = {
      ...entry,
      id: `led-${Date.now()}`,
    };
    setFinancialLedger((prev) => [newEntry, ...prev]);
    addAuditLog(
      'FINANCIAL_TRANSACTION_RECORDED',
      'TREASURY_LEDGER',
      newEntry.referenceNo || newEntry.id,
      `${newEntry.institution} ${newEntry.type}: ₹${newEntry.amount.toLocaleString('en-IN')} - ${newEntry.title}`
    );
    return newEntry;
  };

  // Death Certificate Application & Approval Handlers
  const submitDeathCertificateApplication = (
    data: Omit<DeathCertificateApplication, 'id' | 'applicationNumber' | 'createdAt' | 'status'>
  ): DeathCertificateApplication => {
    const appNum = `DTH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: DeathCertificateApplication = {
      ...data,
      id: `dth-${Date.now()}`,
      applicationNumber: appNum,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
    setDeathCertificateApplications((prev) => [newApp, ...prev]);

    // Scoped notification for applicant member only
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: data.applicantId,
      title: 'Death Certificate Application Submitted',
      message: `Application ${appNum} for late ${data.deceasedName} submitted to Mahal Committee for verification.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
      linkUrl: '#certificates',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('DEATH_CERT_APPLIED', 'DEATH_CERTIFICATE', appNum, `Deceased: ${data.deceasedName}, Applicant: ${data.applicantName}`);
    return newApp;
  };

  const approveDeathCertificateApplication = (id: string, notes?: string): Certificate => {
    const app = deathCertificateApplications.find((a) => a.id === id);
    if (!app) throw new Error('Application not found');

    const certNum = `CERT-DTH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: Certificate = {
      id: `cert-dth-${Date.now()}`,
      certificateNumber: certNum,
      type: 'DEATH',
      title: 'OFFICIAL MAHAL DEATH & BURIAL CERTIFICATE',
      memberId: app.applicantId,
      memberName: app.applicantName,
      familyId: currentProfile?.familyId || 'FAM-00042',
      mahalName: settings.mahalName,
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: `${settings.secretaryName} (General Secretary)`,
      verificationHash: `DTH-VER-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      details: {
        DeceasedName: `Late ${app.deceasedName}`,
        DeceasedGender: app.deceasedGender === 'MALE' ? 'Male' : 'Female',
        AgeAtDeath: app.deceasedAge,
        DateOfDeath: app.dateOfDeath,
        TimeOfDeath: app.timeOfDeath || 'N/A',
        PlaceOfDeath: app.placeOfDeath,
        CauseOfDeath: app.causeOfDeath || 'Natural',
        BurialQabarstan: app.burialQabarstan,
        BurialDate: app.burialDate,
        BurialTime: app.burialTime || 'Standard Rites',
        QabrRegistrationNo: app.qabrNumber || 'Recorded in Central Register',
        ApplicantKin: `${app.applicantName} (${app.applicantRelation})`,
        DoctorCertificateRef: app.doctorHospitalCertificateNo || 'Verified by Local Authority',
      },
    };

    setCertificates((prev) => [newCert, ...prev]);

    setDeathCertificateApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'APPROVED',
              certificateId: newCert.id,
              certificateNumber: certNum,
              approvedAt: new Date().toISOString(),
              adminNotes: notes || a.adminNotes,
            }
          : a
      )
    );

    // Scoped notification strictly for applicant member only
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: app.applicantId,
      title: 'Death Certificate Approved & Ready to Download',
      message: `Death Certificate #${certNum} for late ${app.deceasedName} has been approved and issued by the Mahal Committee. You can download and print it now from your portal.`,
      type: 'GENERAL',
      read: false,
      date: new Date().toISOString().split('T')[0],
      linkUrl: '#certificates',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('DEATH_CERT_APPROVED', 'DEATH_CERTIFICATE', certNum, `Approved certificate for late ${app.deceasedName}`);
    return newCert;
  };

  const rejectDeathCertificateApplication = (id: string, notes: string) => {
    setDeathCertificateApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'REJECTED',
              adminNotes: notes,
            }
          : a
      )
    );
  };

  // Scoped notifications: Standard members strictly only see notifications for their own matters, never others!
  const userNotifications: NotificationItem[] = React.useMemo(() => {
    if (!currentUser) return [];
    if (isUserAdmin(currentUser.email)) {
      return notifications;
    }
    const myId = currentUser.id;
    const myEmail = currentUser.email?.toLowerCase();
    const myMemberId = currentProfile?.memberId || currentUser.memberId;
    return notifications.filter((n) => {
      if (n.userId === myId) return true;
      if (myEmail && n.userId?.toLowerCase() === myEmail) return true;
      if (myMemberId && n.userId === myMemberId) return true;
      if (n.userId === 'ALL' || n.userId === 'PUBLIC') return true;
      return false;
    });
  }, [notifications, currentUser, currentProfile, isUserAdmin]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        currentRole,
        login,
        register,
        logout,
        switchPersona,
        openAuthModal,
        setOpenAuthModal,
        adminAccessGrants,
        isUserAdmin,
        addAdminAccess,
        removeAdminAccess,
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        currentProfile,
        currentFamily,
        profiles,
        families,
        payments,
        receipts,
        nikahApplications,
        welfareApplications,
        zakahApplications,
        certificates,
        events,
        announcements,
        enquiries,
        notifications: userNotifications,
        creativeProjects,
        auditLogs,
        counsellingBookings,
        bookCounselling,
        educationRegistrations,
        registerEducationGuidance,
        bloodDonors,
        registerBloodDonor,
        bloodRequests,
        submitBloodRequest,
        updateCounsellingStatus,
        updateEducationStatus,
        updateBloodRequestStatus,
        financialSummary,
        financialLedger,
        addLedgerEntry,
        deathCertificateApplications,
        submitDeathCertificateApplication,
        approveDeathCertificateApplication,
        rejectDeathCertificateApplication,
        makePayment,
        submitNikahApplication,
        updateNikahStatus,
        submitWelfareApplication,
        updateWelfareStatus,
        submitZakahApplication,
        updateZakahStatus,
        updateProfile,
        generateCertificate,
        verifyCertificate,
        createEvent,
        createAnnouncement,
        submitEnquiry,
        updateEnquiryStatus,
        markNotificationRead,
        markAllNotificationsRead,
        saveCreativeProject,
        activePaymentModal,
        setActivePaymentModal,
        activeReceiptModal,
        setActiveReceiptModal,
        activeCertificateModal,
        setActiveCertificateModal,
        openNikahModal,
        setOpenNikahModal,
        openWelfareModal,
        setOpenWelfareModal,
        openZakahModal,
        setOpenZakahModal,
        openEnquiryModal,
        setOpenEnquiryModal,
        openVerifyModal,
        setOpenVerifyModal,
        openDeathCertModal,
        setOpenDeathCertModal,
        isSupabaseConfigured,
        supabaseStatus,
        syncDataToSupabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
