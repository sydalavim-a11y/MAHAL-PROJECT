import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreativeStudio } from '../ai/CreativeStudio';
import { AdminFinanceAnalytics } from './AdminFinanceAnalytics';
import { AdminDeathCertificates } from './AdminDeathCertificates';
import { AdminProgramsProjects } from './AdminProgramsProjects';
import { Role } from '../../types';
import {
  Users,
  CreditCard,
  Heart,
  HeartHandshake,
  Coins,
  Calendar,
  Bell,
  HelpCircle,
  Settings,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  ArrowUpRight,
  Filter,
  Shield,
  Trash2,
  Mail,
  UserCheck,
  Database,
  RefreshCw,
  Menu,
  X,
  LogOut,
  Globe,
  Activity,
  GraduationCap,
  Droplets,
  Layers,
  ChevronRight,
  Phone,
  Clock,
  Award,
  PieChart,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    t,
    profiles,
    families,
    payments,
    receipts,
    nikahApplications,
    updateNikahStatus,
    welfareApplications,
    updateWelfareStatus,
    zakahApplications,
    updateZakahStatus,
    events,
    createEvent,
    announcements,
    createAnnouncement,
    enquiries,
    updateEnquiryStatus,
    settings,
    updateSettings,
    auditLogs,
    setActiveReceiptModal,
    setActiveCertificateModal,
    generateCertificate,
    currentRole,
    currentUser,
    adminAccessGrants,
    addAdminAccess,
    removeAdminAccess,
    isSupabaseConfigured,
    supabaseStatus,
    syncDataToSupabase,
    counsellingBookings,
    educationRegistrations,
    bloodDonors,
    bloodRequests,
    deathCertificateApplications,
    setActiveTab: setGlobalActiveTab,
    logout,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSupabaseSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncDataToSupabase();
      setIsSyncing(false);
      setSyncFeedback({ text: res.message, isError: !res.success });
    } catch (err: any) {
      setIsSyncing(false);
      setSyncFeedback({ text: err?.message || 'Sync failed', isError: true });
    }
  };

  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'MEMBERS'
    | 'FAMILIES'
    | 'PAYMENTS'
    | 'FINANCE_ANALYTICS'
    | 'DEATH_CERTIFICATES'
    | 'NIKAH'
    | 'WELFARE'
    | 'ZAKAH'
    | 'PROGRAMS_PROJECTS'
    | 'EVENTS_CIRCULARS'
    | 'ENQUIRIES'
    | 'CREATIVE_STUDIO'
    | 'ADMIN_GRANTS'
    | 'SETTINGS'
    | 'AUDIT_LOGS'
  >('OVERVIEW');

  const [programSubTab, setProgramSubTab] = useState<'ALL' | 'COUNSELLING' | 'EDUCATION' | 'BLOOD'>('ALL');

  // Admin access management state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<Role>('ADMIN');
  const [newAdminNotes, setNewAdminNotes] = useState('');
  const [grantFeedback, setGrantFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    titleMalayalam: '',
    description: '',
    descriptionMalayalam: '',
    date: '',
    time: '',
    venue: '',
    speakerOrChiefGuest: '',
    isRegistrationOpen: true,
  });

  // New Announcement Form State
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    titleMalayalam: '',
    content: '',
    contentMalayalam: '',
    priority: 'NORMAL' as const,
    author: 'Mahal Secretariat',
  });

  // Settings edit state
  const [editSettings, setEditSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Financial calculations
  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingNikahCount = nikahApplications.filter((n) => n.status === 'SUBMITTED' || n.status === 'DOCUMENTS_RECEIVED' || n.status === 'UNDER_VERIFICATION').length;
  const pendingWelfareCount = welfareApplications.filter((w) => w.status === 'SUBMITTED' || w.status === 'UNDER_REVIEW').length;
  const pendingZakahCount = zakahApplications.filter((z) => z.status === 'SUBMITTED' || z.status === 'UNDER_ASSESSMENT').length;
  const pendingDeathCertsCount = (deathCertificateApplications || []).filter((d) => d.status === 'SUBMITTED' || d.status === 'UNDER_VERIFICATION').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(editSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Handlers for granting and revoking admin privileges
  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrantFeedback(null);
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setGrantFeedback({ text: 'Please enter a valid Gmail address.', isError: true });
      return;
    }
    const result = addAdminAccess(newAdminEmail.trim(), newAdminRole, newAdminNotes.trim());
    setGrantFeedback({ text: result.message, isError: !result.success });
    if (result.success) {
      setNewAdminEmail('');
      setNewAdminNotes('');
    }
  };

  const handleRevoke = (email: string) => {
    const res = removeAdminAccess(email);
    setGrantFeedback({ text: res.message, isError: !res.success });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent(newEvent);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      titleMalayalam: '',
      description: '',
      descriptionMalayalam: '',
      date: '',
      time: '',
      venue: '',
      speakerOrChiefGuest: '',
      isRegistrationOpen: true,
    });
  };

  const handleCreateAnn = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement(newAnn);
    setShowAnnForm(false);
    setNewAnn({
      title: '',
      titleMalayalam: '',
      content: '',
      contentMalayalam: '',
      priority: 'NORMAL',
      author: 'Mahal Secretariat',
    });
  };

  return (
    <div className="min-h-screen bg-[#fafdf2] flex flex-col lg:flex-row font-sans text-stone-900">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* LEFT-SIDE ADMIN NAVBAR / SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#00434c] text-white flex flex-col justify-between border-r border-[#ecffb6]/20 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Full size Text Logo & Brand */}
        <div className="p-5 sm:p-6 border-b border-[#ecffb6]/15 bg-[#003840]/60">
          <div className="flex items-start gap-3.5">
            <img
              src="https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6aaddefb454100171fe8c7ff/6ab21b514d7fa8af16e72fd0/d695192d-image-qgxv.png"
              alt="Mahal Crest"
              className="w-12 h-12 object-contain drop-shadow shrink-0 rounded-xl bg-white/10 p-1 border border-[#ecffb6]/30"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-black tracking-widest bg-[#d6fb00] text-[#00434c] px-2 py-0.5 rounded-full shadow-xs">
                  ADMIN CONSOLE
                </span>
              </div>
              <h2 className="font-serif font-black text-base sm:text-lg tracking-tight text-white leading-tight mt-1">
                Noor Mahal
              </h2>
              <p className="text-xs text-[#ecffb6] font-medium mt-0.5 truncate">
                Noor-ul-Huda Mahallu Jama-ath
              </p>
              <p className="text-[10px] text-[#ecffb6]/70 font-mono mt-0.5">
                Reg: KL-PKD/2024/088
              </p>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#ecffb6] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Options on the Left */}
        <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6 text-xs">
          {/* Core Operations & Treasury */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#ecffb6]/60 mb-2">
              Treasury & Operations
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('OVERVIEW');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#d6fb00]" />
                  <span>KPI Overview</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('FINANCE_ANALYTICS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'FINANCE_ANALYTICS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#d6fb00]" />
                  <span>Masjid & Madrasa Finance</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#d6fb00] text-[#00434c] font-black">
                  ANALYTICS
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('MEMBERS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'MEMBERS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#d6fb00]" />
                  <span>Members Directory</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                  {profiles.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('FAMILIES');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'FAMILIES'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-[#d6fb00]" />
                  <span>Families Ledger</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                  {families.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('PAYMENTS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'PAYMENTS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#d6fb00]" />
                  <span>Member Dues & Receipts</span>
                </div>
              </button>
            </div>
          </div>

          {/* Social & Religious Services */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#ecffb6]/60 mb-2">
              Programs, Projects & Registries
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('PROGRAMS_PROJECTS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'PROGRAMS_PROJECTS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#d6fb00]" />
                  <span>Programs & Projects</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#d6fb00] text-[#00434c] font-black">
                  NEW
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('DEATH_CERTIFICATES');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'DEATH_CERTIFICATES'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#d6fb00]" />
                  <span>Death Certificates</span>
                </div>
                {pendingDeathCertsCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                    {pendingDeathCertsCount}
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                    {(deathCertificateApplications || []).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('NIKAH');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'NIKAH'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-[#d6fb00]" />
                  <span>Nikah Registry</span>
                </div>
                {pendingNikahCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                    {pendingNikahCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('WELFARE');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'WELFARE'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-[#d6fb00]" />
                  <span>Welfare Relief</span>
                </div>
                {pendingWelfareCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                    {pendingWelfareCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('ZAKAH');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'ZAKAH'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-[#d6fb00]" />
                  <span>Zakah Desk</span>
                </div>
                {pendingZakahCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                    {pendingZakahCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Communications */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#ecffb6]/60 mb-2">
              Communications & Media
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('EVENTS_CIRCULARS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'EVENTS_CIRCULARS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#d6fb00]" />
                  <span>Events & Circulars</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ENQUIRIES');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'ENQUIRIES'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#d6fb00]" />
                  <span>Enquiries</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                  {enquiries.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('CREATIVE_STUDIO');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'CREATIVE_STUDIO'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#d6fb00]" />
                  <span>AI Creative Studio</span>
                </div>
              </button>
            </div>
          </div>

          {/* Security & Settings */}
          <div>
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#ecffb6]/60 mb-2">
              Security & Administration
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('ADMIN_GRANTS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'ADMIN_GRANTS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#d6fb00]" />
                  <span>Admin Gmail Access</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-bold">
                  {adminAccessGrants.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('SETTINGS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'SETTINGS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#d6fb00]" />
                  <span>Mahal Settings</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('AUDIT_LOGS');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'AUDIT_LOGS'
                    ? 'bg-[#002f35] text-[#d6fb00] font-bold border border-[#d6fb00]/30 shadow-xs'
                    : 'text-[#ecffb6] hover:bg-[#00363d] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#d6fb00]" />
                  <span>Audit Trail</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Sidebar Bottom: Admin info & quick switch */}
        <div className="p-4 border-t border-[#ecffb6]/15 bg-[#00363d] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d6fb00] text-[#00434c] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#ecffb6]/80 truncate">{currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setGlobalActiveTab('home')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00434c] hover:bg-[#00545f] text-white text-[11px] font-bold transition-colors cursor-pointer border border-[#ecffb6]/20"
            >
              <Globe className="w-3.5 h-3.5 text-[#d6fb00]" />
              <span>Public Site</span>
            </button>
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-900/30 hover:bg-rose-900/50 text-rose-200 hover:text-white text-[11px] font-bold transition-colors cursor-pointer border border-rose-700/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#00545f] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#003a42] text-[#d6fb00] flex items-center gap-2 font-bold text-xs cursor-pointer border border-[#d6fb00]/30"
          >
            <Menu className="w-5 h-5" />
            <span>Admin Menu</span>
          </button>
          <div className="text-center">
            <span className="font-serif font-black text-sm block">Mahal Admin</span>
            <span className="text-[10px] text-[#d6fb00]">{activeTab.replace('_', ' ')}</span>
          </div>
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="text-xs font-bold text-[#ecffb6] hover:text-white cursor-pointer"
          >
            Public Site
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span>Admin Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-[#00545f] uppercase tracking-wider">{activeTab.replace('_', ' ')}</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#00545f] mt-1">
                {activeTab === 'OVERVIEW' && 'Administrative KPI Overview'}
                {activeTab === 'FINANCE_ANALYTICS' && 'Masjid, Madrasa & Mahal Financial Analytics & P&L'}
                {activeTab === 'DEATH_CERTIFICATES' && 'Death & Burial Certificate Applications & Approvals'}
                {activeTab === 'MEMBERS' && 'Mahal Constituent Directory'}
                {activeTab === 'FAMILIES' && 'Family Households Ledger'}
                {activeTab === 'PAYMENTS' && 'Monthly Contribution Collection'}
                {activeTab === 'PROGRAMS_PROJECTS' && 'Social Programs & Community Projects'}
                {activeTab === 'NIKAH' && 'Nikah Marriage Registry & Verification'}
                {activeTab === 'WELFARE' && 'Welfare & Medical Aid Grants'}
                {activeTab === 'ZAKAH' && 'Central Zakah Distribution Desk'}
                {activeTab === 'EVENTS_CIRCULARS' && 'Official Events & Announcements'}
                {activeTab === 'ENQUIRIES' && 'Constituent Inquiries & Feedback'}
                {activeTab === 'CREATIVE_STUDIO' && 'AI Creative Studio & Visual Generation'}
                {activeTab === 'ADMIN_GRANTS' && 'Authorized Admin Gmail Credentials'}
                {activeTab === 'SETTINGS' && 'Mahal Committee Global Settings'}
                {activeTab === 'AUDIT_LOGS' && 'Security Audit Trail & Ledger'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSupabaseSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 border border-[#d6fb00]/30"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#d6fb00] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
              </button>
              <button
                onClick={() => setGlobalActiveTab('home')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-stone-600" />
                <span>View Public Site</span>
              </button>
            </div>
          </div>

          {/* Supabase Status Banner */}
          <div className="bg-[#fcfbf7] border border-[#eadfbf] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/15 border border-[#3ECF8E]/40 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-[#24b47e]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#063d4a]">
                    Supabase PostgreSQL Database
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSupabaseConfigured
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {isSupabaseConfigured ? 'Ready / Connected' : 'Schema & API Ready'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  {supabaseStatus} • All login accounts, member profiles, and family records are prepared for persistent cloud sync.
                </p>
              </div>
            </div>

            <button
              onClick={handleSupabaseSync}
              disabled={isSyncing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#087f87] hover:bg-[#063d4a] text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#d4a329] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {syncFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                syncFeedback.isError
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span>{syncFeedback.text}</span>
              <button
                onClick={() => setSyncFeedback(null)}
                className="text-stone-500 hover:text-stone-800 font-bold ml-2 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

      {/* VIEW: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Families</span>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">{families.length}</p>
              <p className="text-xs text-emerald-700 mt-1">100% Registered & Verified</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Members</span>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">{profiles.length}</p>
              <p className="text-xs text-stone-500 mt-1">Active Constituents</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Paid Collections</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
                ₹{totalPaid.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-stone-500 mt-1">Pending: ₹{totalPending.toLocaleString('en-IN')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active Applications</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
                {pendingNikahCount + pendingWelfareCount + pendingZakahCount}
              </p>
              <p className="text-xs text-stone-500 mt-1">Requiring Committee Review</p>
            </div>
          </div>

          {/* Quick Action Tables for Active Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Nikah Reviews */}
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Nikah Applications Pipeline</span>
                </h3>
                <button
                  onClick={() => setActiveTab('NIKAH')}
                  className="text-xs text-emerald-800 hover:underline font-bold"
                >
                  View All ({nikahApplications.length})
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {nikahApplications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{app.brideName} & {app.groomName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {app.applicationNumber} • Date: {app.proposedDate}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Welfare/Zakah Reviews */}
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  <span>Welfare & Zakah Applications</span>
                </h3>
                <button
                  onClick={() => setActiveTab('WELFARE')}
                  className="text-xs text-emerald-800 hover:underline font-bold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {welfareApplications.slice(0, 2).map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{w.applicantName} ({w.category})</p>
                      <p className="text-[11px] text-stone-500">Requested: ₹{w.amountRequested}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {w.status}
                    </span>
                  </div>
                ))}
                {zakahApplications.slice(0, 2).map((z) => (
                  <div
                    key={z.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-stone-900">{z.applicantName} (Zakah - {z.category})</p>
                      <p className="text-[11px] text-stone-500">Assessed: ₹{z.amountNeeded}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {z.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MEMBERS DIRECTORY */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">Constituent Members Register</h3>
              <p className="text-xs text-stone-500">Official digital directory of registered community members</p>
            </div>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Family ID</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Standing</th>
                  <th className="py-3 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {profiles
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.memberId.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {m.name}
                        {m.nameMalayalam && (
                          <span className="block font-normal text-[11px] text-stone-500 font-malayalam">
                            {m.nameMalayalam}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">{m.memberId}</td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">{m.familyId}</td>
                      <td className="py-3.5 px-4 text-stone-600">{m.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                          {m.familyRole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {m.membershipStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            const c = generateCertificate('MEMBERSHIP', m.memberId);
                            setActiveCertificateModal(c);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold hover:bg-emerald-100"
                        >
                          Issue Cert
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FAMILIES DIRECTORY */}
      {activeTab === 'FAMILIES' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900">Mahal Family Units (കുടുംബ രജിസ്റ്റർ)</h3>
            <p className="text-xs text-stone-500">Official Mahal Census and Residential Registers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">House Name</th>
                  <th className="py-3 px-4">Family ID</th>
                  <th className="py-3 px-4">Head of Family</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {families.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{f.houseName}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">{f.familyId}</td>
                    <td className="py-3.5 px-4 text-stone-800 font-medium">{f.headName}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">{f.memberCount}</td>
                    <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate">{f.address}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          f.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {f.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          const c = generateCertificate('FAMILY', 'MHL-000124');
                          setActiveCertificateModal(c);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold hover:bg-emerald-100"
                      >
                        Family Cert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: PAYMENTS & CONTRIBUTIONS */}
      {activeTab === 'PAYMENTS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Monthly Mahal Contribution Collections
              </h3>
              <p className="text-xs text-stone-500">Live ledger of incoming monthly dues and verified receipts</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-lg border border-stone-300"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Receipt / Txn</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {p.receiptNumber || 'PENDING'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{p.memberId}</td>
                    <td className="py-3.5 px-4 text-stone-700">{p.monthName}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">₹{p.amount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">{p.paymentMethod || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'PAID' && (
                        <button
                          onClick={() => {
                            const r = receipts.find((rec) => rec.paymentId === p.id) || receipts[0];
                            setActiveReceiptModal(r);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-300 hover:bg-emerald-100"
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FINANCIAL ANALYTICS & P&L (MASJID & MADRASA) */}
      {activeTab === 'FINANCE_ANALYTICS' && (
        <AdminFinanceAnalytics />
      )}

      {/* VIEW: DEATH & BURIAL CERTIFICATES */}
      {activeTab === 'DEATH_CERTIFICATES' && (
        <AdminDeathCertificates />
      )}

      {/* VIEW: PROGRAMS & PROJECTS (MARITAL COUNSELLING, EDUCATION GUIDANCE, BLOOD CAMPAIGN) */}
      {activeTab === 'PROGRAMS_PROJECTS' && (
        <AdminProgramsProjects />
      )}

      {/* VIEW: NIKAH DESK */}
      {activeTab === 'NIKAH' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Nikah Solemnization & Document Review Desk
              </h3>
              <p className="text-xs text-stone-500">Review Bride/Groom NOCs, Approve Solemnization, Issue Digital Nikah Certificate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {nikahApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      {app.applicationNumber}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-stone-900 mt-2">
                      {app.brideName} & {app.groomName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                      Status: {app.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-stone-50 p-4 rounded-xl">
                  <div>
                    <span className="text-stone-400 uppercase font-semibold text-[10px]">Wali (Guardian)</span>
                    <p className="font-bold text-stone-800">{app.waliName} ({app.waliRelation})</p>
                    <p className="text-stone-500">{app.waliPhone}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase font-semibold text-[10px]">Proposed Date & Venue</span>
                    <p className="font-bold text-stone-800">{app.proposedDate} at {app.proposedTime}</p>
                    <p className="text-stone-500 truncate">{app.venue}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 uppercase font-semibold text-[10px]">Groom's Native Mahal</span>
                    <p className="font-bold text-stone-800">{app.groomMahal}</p>
                    <p className="text-stone-500">{app.groomPhone}</p>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => updateNikahStatus(app.id, 'DOCUMENTS_RECEIVED', 'All certificates verified with Groom Mahal.')}
                      className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-300 font-bold rounded-lg hover:bg-blue-100"
                    >
                      Verify Documents
                    </button>
                    <button
                      onClick={() => updateNikahStatus(app.id, 'APPROVED', 'Solemnization approved by Chief Qazi.')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-lg hover:bg-emerald-100"
                    >
                      Approve Solemnization
                    </button>
                    <button
                      onClick={() => updateNikahStatus(app.id, 'CERTIFICATE_AVAILABLE', 'Nikah solemnized. Certificate issued.')}
                      className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-lg hover:bg-amber-100"
                    >
                      Issue Official Certificate
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const cert = generateCertificate('NIKAH', app.applicantId);
                      setActiveCertificateModal(cert);
                    }}
                    className="flex items-center gap-1 text-xs px-3.5 py-1.5 bg-[#0B3D2E] text-[#C9A227] font-bold rounded-xl shadow"
                  >
                    <span>View Nikah Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: WELFARE & ZAKAH DESK */}
      {activeTab === 'WELFARE' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900">
            Community Welfare Applications & Medical Grants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfareApplications.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-stone-500 font-bold">{w.applicationNumber}</span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{w.applicantName}</h4>
                    <p className="text-xs text-stone-500">{w.category} Relief Aid</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {w.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl leading-relaxed">
                  {w.description}
                </p>

                <div className="flex justify-between text-xs text-stone-700">
                  <span>Requested: <strong>₹{w.amountRequested}</strong></span>
                  {w.amountApproved && (
                    <span className="text-emerald-800 font-bold">Approved: ₹{w.amountApproved}</span>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => updateWelfareStatus(w.id, 'APPROVED', 'Disbursed via direct medical grant', w.amountRequested)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-lg hover:bg-emerald-100"
                  >
                    Approve Grant (₹{w.amountRequested})
                  </button>
                  <button
                    onClick={() => updateWelfareStatus(w.id, 'REJECTED', 'Eligibility criteria not met')}
                    className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 font-bold rounded-lg hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ZAKAH DESK */}
      {activeTab === 'ZAKAH' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900">
            Shariah Zakah Applications & Disbursement Desk
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zakahApplications.map((z) => (
              <div key={z.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-stone-500 font-bold">{z.applicationNumber}</span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{z.applicantName}</h4>
                    <p className="text-xs text-amber-800 font-semibold">Quranic Category: {z.category}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {z.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl leading-relaxed">
                  {z.financialSituation}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-lg text-stone-600">
                  <div>Monthly Income: ₹{z.monthlyFamilyIncome}</div>
                  <div>Dependents: {z.dependentsCount} members</div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => updateZakahStatus(z.id, 'COMPLETED', 'Disbursed in privacy by Zakah sub-committee', z.amountNeeded)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-lg hover:bg-emerald-100"
                  >
                    Disburse Zakah (₹{z.amountNeeded})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: EVENTS & CIRCULARS */}
      {activeTab === 'EVENTS_CIRCULARS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Community Events & Official Announcements
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#0B3D2E] text-[#C9A227] font-bold text-xs rounded-xl shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Event</span>
              </button>
              <button
                onClick={() => setShowAnnForm(!showAnnForm)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-700 text-white font-bold text-xs rounded-xl shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Circular</span>
              </button>
            </div>
          </div>

          {/* New Event Form */}
          {showEventForm && (
            <form onSubmit={handleCreateEvent} className="bg-stone-50 border border-stone-300 p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-stone-900">Publish New Community Event</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Event Title (English)"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Title (Malayalam - മലയാളം)"
                  value={newEvent.titleMalayalam}
                  onChange={(e) => setNewEvent({ ...newEvent, titleMalayalam: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 7:00 PM)"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue / Auditorium"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg col-span-2"
                  required
                />
              </div>
              <textarea
                placeholder="Detailed event description..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                rows={3}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-1.5 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#0B3D2E] text-[#C9A227] font-bold rounded-xl shadow"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          )}

          {/* New Circular Form */}
          {showAnnForm && (
            <form onSubmit={handleCreateAnn} className="bg-stone-50 border border-stone-300 p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-stone-900">Publish Official Mahal Circular</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Notice Title (English)"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Notice Title (Malayalam - മലയാളം)"
                  value={newAnn.titleMalayalam}
                  onChange={(e) => setNewAnn({ ...newAnn, titleMalayalam: e.target.value })}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <textarea
                placeholder="Official notice body..."
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                rows={3}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnForm(false)}
                  className="px-4 py-1.5 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-700 text-white font-bold rounded-xl shadow"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          )}

          {/* List of Published items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    EVENT • {evt.isRegistrationOpen ? 'REGISTRATION OPEN' : 'CONGREGATION'}
                  </span>
                  <span className="text-xs font-mono text-stone-500">{evt.date}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{evt.title}</h4>
                {evt.titleMalayalam && <p className="text-xs text-stone-500 font-malayalam">{evt.titleMalayalam}</p>}
                <p className="text-xs text-stone-600 leading-relaxed">{evt.description}</p>
                <p className="text-[11px] text-emerald-800 font-medium pt-1">Venue: {evt.venue} at {evt.time}</p>
              </div>
            ))}

            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    CIRCULAR • {ann.priority}
                  </span>
                  <span className="text-xs font-mono text-stone-500">{ann.publishedDate}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{ann.title}</h4>
                {ann.titleMalayalam && <p className="text-xs text-stone-500 font-malayalam">{ann.titleMalayalam}</p>}
                <p className="text-xs text-stone-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ENQUIRIES */}
      {activeTab === 'ENQUIRIES' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Public Enquiries & Grievance Redressal
            </h3>
            <p className="text-xs text-stone-500">Citizen submissions received via website or helpdesk</p>
          </div>

          <div className="divide-y divide-stone-100">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-5 hover:bg-stone-50/60 transition-colors space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {enq.enquiryNumber}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{enq.category} Enquiry</h4>
                    <p className="text-stone-500">
                      From: <strong>{enq.name}</strong> ({enq.phone}) • Category: {enq.category}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-stone-100 text-stone-800">
                    {enq.status}
                  </span>
                </div>

                <p className="text-stone-700 bg-stone-50 p-3 rounded-xl">{enq.message}</p>

                {enq.replyMessage && (
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200">
                    <strong>Mahal Office Reply:</strong> {enq.replyMessage}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      const reply = prompt('Enter official reply message to citizen:');
                      if (reply) updateEnquiryStatus(enq.id, 'RESOLVED', reply);
                    }}
                    className="px-3 py-1 bg-[#0B3D2E] text-[#C9A227] font-bold rounded-lg text-xs"
                  >
                    Reply & Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: CREATIVE STUDIO */}
      {activeTab === 'CREATIVE_STUDIO' && <CreativeStudio />}

      {/* VIEW: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6 text-xs">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">Mahal General Configuration</h3>
              <p className="text-xs text-stone-500">Configure branding, official leadership, UPI VPA, and monthly rate</p>
            </div>
            {settingsSaved && (
              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Mahal Name (English)</label>
              <input
                type="text"
                value={editSettings.mahalName}
                onChange={(e) => setEditSettings({ ...editSettings, mahalName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Mahal Name (Malayalam)</label>
              <input
                type="text"
                value={editSettings.mahalNameMalayalam}
                onChange={(e) => setEditSettings({ ...editSettings, mahalNameMalayalam: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Registration Number</label>
              <input
                type="text"
                value={editSettings.registrationNumber}
                onChange={(e) => setEditSettings({ ...editSettings, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Default Monthly Dues (₹)</label>
              <input
                type="number"
                value={editSettings.monthlyContributionDefault}
                onChange={(e) => setEditSettings({ ...editSettings, monthlyContributionDefault: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Chief Qazi Name</label>
              <input
                type="text"
                value={editSettings.qaziName}
                onChange={(e) => setEditSettings({ ...editSettings, qaziName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">President Name</label>
              <input
                type="text"
                value={editSettings.presidentName}
                onChange={(e) => setEditSettings({ ...editSettings, presidentName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">General Secretary Name</label>
              <input
                type="text"
                value={editSettings.secretaryName}
                onChange={(e) => setEditSettings({ ...editSettings, secretaryName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">WhatsApp Helpline</label>
              <input
                type="text"
                value={editSettings.whatsAppNumber}
                onChange={(e) => setEditSettings({ ...editSettings, whatsAppNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0B3D2E] hover:bg-emerald-950 text-[#C9A227] font-bold rounded-xl shadow"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* VIEW: ADMIN_GRANTS (Authorized Gmail Access Management) */}
      {activeTab === 'ADMIN_GRANTS' && (
        <div className="space-y-6">
          {/* Informational banner */}
          <div className="bg-[#063d4a] text-white p-6 rounded-3xl shadow-lg border border-[#087f87] relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#d4a329] text-stone-950">
                  Access Control
                </span>
                <span className="text-xs text-stone-300">
                  Role-Based Security Policy
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Admin Gmail Accessibility Management
              </h2>
              <p className="text-xs text-stone-200 mt-2 leading-relaxed">
                As per committee security standards, the Central Admin Console is exclusively restricted to authorized Gmail addresses. Add or delegate administrative privileges below. Anyone signing in with a granted Gmail will immediately receive full administrative privileges.
              </p>
            </div>
          </div>

          {grantFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm border ${
                grantFeedback.isError
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span>{grantFeedback.text}</span>
              <button
                onClick={() => setGrantFeedback(null)}
                className="text-stone-400 hover:text-stone-700 ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form to delegate admin accessibility */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Shield className="w-5 h-5 text-[#d4a329]" />
              <h3 className="font-bold text-sm text-[#063d4a]">
                Delegate Admin Accessibility to a New Gmail
              </h3>
            </div>

            <form onSubmit={handleGrantSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
              <div className="sm:col-span-5">
                <label className="block font-semibold text-stone-700 mb-1">
                  Admin Gmail / Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="e.g. new.admin@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087f87]"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-stone-700 mb-1">
                  Administrative Role *
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as Role)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087f87]"
                >
                  <option value="ADMIN">Chief Administrator (Full Access)</option>
                  <option value="NIKAH_STAFF">Nikah Solemnization Desk</option>
                  <option value="WELFARE_STAFF">Baithul Maal Relief Desk</option>
                  <option value="ZAKAH_STAFF">Zakah Assessment Officer</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block font-semibold text-stone-700 mb-1">
                  Designation / Committee Notes
                </label>
                <input
                  type="text"
                  value={newAdminNotes}
                  onChange={(e) => setNewAdminNotes(e.target.value)}
                  placeholder="e.g. Joint Secretary / Baithul Maal Desk"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087f87]"
                />
              </div>

              <div className="sm:col-span-12 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#087f87] hover:bg-[#063d4a] text-white font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4a329]" />
                  <span>Grant Admin Accessibility</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table of current Admin Grants */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#063d4a]">
                  Currently Authorized Committee Admin Accounts ({adminAccessGrants.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Accounts with permission to open the Central Admin Dashboard and manage public records
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                Active Policy Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#fffaf0] text-[#063d4a] font-bold border-b border-[#eadfbf] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Gmail / Account</th>
                    <th className="py-3.5 px-4">Authorized Role</th>
                    <th className="py-3.5 px-4">Designation & Notes</th>
                    <th className="py-3.5 px-4">Granted By</th>
                    <th className="py-3.5 px-4">Granted Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {adminAccessGrants.map((grant) => {
                    const isSuper = grant.email.toLowerCase() === 'rumaispkdr@gmail.com';
                    const isCurrentUser = currentUser?.email.toLowerCase() === grant.email.toLowerCase();

                    return (
                      <tr key={grant.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#063d4a] flex items-center justify-center font-bold">
                              {grant.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                <span>{grant.email}</span>
                                {isSuper && (
                                  <span className="text-[9px] uppercase font-black bg-[#d4a329] text-stone-950 px-1.5 py-0.5 rounded-full">
                                    Primary Owner
                                  </span>
                                )}
                                {isCurrentUser && (
                                  <span className="text-[9px] uppercase font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500">Google Workspace / Gmail</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide ${
                              grant.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {grant.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700">
                          {grant.notes || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {grant.grantedBy}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono">
                          {grant.grantedAt}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {isSuper ? (
                            <span className="text-[11px] text-stone-400 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleRevoke(grant.email)}
                              className="px-2.5 py-1 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                              title="Revoke Admin Access"
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* VIEW: PROGRAMS & PROJECTS */}
      {activeTab === 'PROGRAMS_PROJECTS' && (
        <div className="space-y-6">
          {/* Top KPI Metrics for Programs & Projects */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Marital Counselling</span>
              <p className="text-2xl sm:text-3xl font-black text-[#00545f] mt-1">{counsellingBookings.length}</p>
              <p className="text-xs text-stone-500 mt-1">Pre & Post Marital Sessions</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Education Guidance</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">{educationRegistrations.length}</p>
              <p className="text-xs text-stone-500 mt-1">Career & Academic Mentoring</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Enlisted Blood Donors</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">{bloodDonors.length}</p>
              <p className="text-xs text-rose-600 font-semibold mt-1">Ready for Emergency Dispatch</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Blood Requests</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">{bloodRequests.length}</p>
              <p className="text-xs text-amber-600 font-semibold mt-1">Hospital Emergency Alerts</p>
            </div>
          </div>

          {/* Sub-Tabs: Filter streams */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-xs border border-stone-200 overflow-x-auto gap-1 text-xs font-semibold">
            <button
              onClick={() => setProgramSubTab('ALL')}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                programSubTab === 'ALL' ? 'bg-[#00545f] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => setProgramSubTab('COUNSELLING')}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                programSubTab === 'COUNSELLING' ? 'bg-[#00545f] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Marital Counselling ({counsellingBookings.length})
            </button>
            <button
              onClick={() => setProgramSubTab('EDUCATION')}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                programSubTab === 'EDUCATION' ? 'bg-[#00545f] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Educational Guidance ({educationRegistrations.length})
            </button>
            <button
              onClick={() => setProgramSubTab('BLOOD')}
              className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                programSubTab === 'BLOOD' ? 'bg-[#00545f] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-rose-500" />
              <span>Blood Campaign & Donors ({bloodDonors.length})</span>
            </button>
          </div>

          {/* STREAM 1: MARITAL COUNSELLING */}
          {(programSubTab === 'ALL' || programSubTab === 'COUNSELLING') && (
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
              <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#00545f]">
                    Marital Counselling & Family Dispute Resolution
                  </h3>
                  <p className="text-xs text-stone-500">
                    Confidential bookings handled by qualified Islamic family counselors and senior scholars
                  </p>
                </div>
                <span className="text-xs px-3 py-1 bg-teal-50 text-teal-800 rounded-full font-bold border border-teal-200 self-start">
                  {counsellingBookings.length} Active Bookings
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Booking #</th>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {counsellingBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#00545f]">{b.bookingNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">{b.applicantName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900">
                            {b.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-700">
                          {b.preferredDate} • <span className="text-stone-500 text-[11px]">{b.preferredTimeSlot}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                            {b.mode.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          {b.notes || 'Confidential Guidance'}
                        </td>
                        <td className="py-3.5 px-4">
                          <a href={`tel:${b.phone}`} className="text-[#00545f] font-bold hover:underline">
                            {b.phone}
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STREAM 2: EDUCATIONAL GUIDANCE CAMPAIGN */}
          {(programSubTab === 'ALL' || programSubTab === 'EDUCATION') && (
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
              <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#00545f]">
                    Educational Guidance, Scholarships & Career Mentorship
                  </h3>
                  <p className="text-xs text-stone-500">
                    Free academic counselling and aptitude guidance for Mahal students
                  </p>
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200 self-start">
                  {educationRegistrations.length} Students Registered
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Registration #</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Class & Locality</th>
                      <th className="py-3 px-4">Target Career</th>
                      <th className="py-3 px-4">Parent/Guardian</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {educationRegistrations.map((e) => (
                      <tr key={e.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">{e.regNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">{e.studentName}</td>
                        <td className="py-3.5 px-4 text-stone-700">
                          {e.currentClass} • Ward {e.wardNumber}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-800">{e.targetCareer}</td>
                        <td className="py-3.5 px-4 text-stone-700">{e.parentName}</td>
                        <td className="py-3.5 px-4">
                          <a href={`tel:${e.phone}`} className="text-[#00545f] font-bold hover:underline">
                            {e.phone}
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STREAM 3: BLOOD CAMPAIGN & DONORS DIRECTORY */}
          {(programSubTab === 'ALL' || programSubTab === 'BLOOD') && (
            <div className="space-y-6">
              {/* Emergency Blood Requests */}
              <div className="bg-white rounded-2xl shadow-xs border border-rose-200 overflow-hidden">
                <div className="p-5 border-b border-rose-100 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-rose-600" />
                      <span>Live Emergency Blood Requests</span>
                    </h3>
                    <p className="text-xs text-rose-800">
                      Emergency hospital broadcasts requiring immediate donor matching
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-rose-100 text-rose-900 font-black rounded-full border border-rose-300 self-start">
                    {bloodRequests.length} Active Requests
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-rose-50/70 text-rose-900 font-bold border-b border-rose-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Blood Group</th>
                        <th className="py-3 px-4">Units Needed</th>
                        <th className="py-3 px-4">Hospital</th>
                        <th className="py-3 px-4">Urgency</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {bloodRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-stone-900">{req.patientName}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white shadow-xs">
                              {req.bloodGroup}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-stone-800">{req.unitsNeeded} Units</td>
                          <td className="py-3.5 px-4 text-stone-700">{req.hospital}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                req.urgency === 'CRITICAL'
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : 'bg-amber-100 text-amber-900 font-bold'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-stone-900">{req.contactPerson}</p>
                            <a href={`tel:${req.phone}`} className="text-rose-700 font-bold hover:underline">
                              {req.phone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`tel:${req.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] shadow-xs hover:bg-rose-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call Attendant</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Registered Blood Donors Directory */}
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#00545f]">
                      Mahal Volunteer Blood Donors Registry
                    </h3>
                    <p className="text-xs text-stone-500">
                      Verified volunteer donors ready for urgent calls from Calicut Medical College and local blood banks
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200 self-start">
                    {bloodDonors.length} Verified Donors
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Blood Group</th>
                        <th className="py-3 px-4">Age</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Ward</th>
                        <th className="py-3 px-4">Last Donated</th>
                        <th className="py-3 px-4">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bloodDonors.map((d) => (
                        <tr key={d.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-stone-900">{d.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-600 text-white">
                              {d.bloodGroup}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-700">{d.age} yrs</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{d.phone}</td>
                          <td className="py-3.5 px-4 text-stone-600">Ward {d.wardNumber}</td>
                          <td className="py-3.5 px-4 text-stone-500">{d.lastDonatedDate || 'First Time'}</td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`tel:${d.phone}`}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call Donor</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900">
              System Audit Trail & Security Ledger
            </h3>
            <p className="text-xs text-stone-500">
              Immutable log of administrative operations, certificate issuances, and payments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-stone-800">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-700 font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-900">{log.action}</td>
                    <td className="py-3 px-4 text-stone-600">{log.entity}: {log.entityId}</td>
                    <td className="py-3 px-4 font-sans text-stone-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};
