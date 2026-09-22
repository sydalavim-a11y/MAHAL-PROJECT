import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  Shield,
  User,
  CreditCard,
  Building,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface MahalAuthority {
  id: string;
  name: string;
  role: string;
  roleMl: string;
  accountNumber: string;
  phone: string;
  email: string;
  initials: string;
  badge: string;
  avatarBg: string;
  responsibilities: string;
  officeHours: string;
}

export const PublicContact: React.FC = () => {
  const { t, settings, submitEnquiry } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'GENERAL' as const,
    subject: '',
    message: '',
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const authorities: MahalAuthority[] = [
    {
      id: 'auth-1',
      name: settings.presidentName || 'C.M. Abdul Azeez Master',
      role: 'President (പ്രസിഡന്റ്)',
      roleMl: 'മഹല്ല് ജമാഅത്ത് പ്രസിഡന്റ്',
      accountNumber: 'ACC-MHL-0019',
      phone: '+91 94471 23401',
      email: 'president@noorulhudamahal.org',
      initials: 'AA',
      badge: 'Executive Head',
      avatarBg: 'bg-emerald-700',
      responsibilities: 'General executive governance, Baithul Maal fund authorization & General body leadership',
      officeHours: 'Mon - Thu: 10:00 AM - 01:00 PM',
    },
    {
      id: 'auth-2',
      name: settings.secretaryName || 'K.V. Usman Faizy',
      role: 'General Secretary (ജനറൽ സെക്രട്ടറി)',
      roleMl: 'ജനറൽ സെക്രട്ടറി & കാര്യദർശി',
      accountNumber: 'ACC-MHL-0024',
      phone: '+91 98460 78912',
      email: 'secretary@noorulhudamahal.org',
      initials: 'UF',
      badge: 'Chief Administrator',
      avatarBg: 'bg-[#00545f]',
      responsibilities: 'Official certificate issuance, registry approvals, Nikah documentation & Government liaison',
      officeHours: 'Mon - Sat: 09:30 AM - 01:30 PM & 05:00 PM - 08:00 PM',
    },
    {
      id: 'auth-3',
      name: settings.qaziName || 'Sayyid Hyderali Shihab Thangal',
      role: 'Chief Qazi (മുഖ്യ ഖാസി)',
      roleMl: 'മഹല്ല് മുഖ്യ ഖാസി & മതകാര്യ ഉപദേശകൻ',
      accountNumber: 'ACC-MHL-0001',
      phone: '+91 94470 11223',
      email: 'qazi@noorulhudamahal.org',
      initials: 'ST',
      badge: 'Religious Authority',
      avatarBg: 'bg-teal-800',
      responsibilities: 'Nikah solemnization, religious decrees, marital mediation & Islamic cultural guidance',
      officeHours: 'Friday: Post-Juma’h & By Appointment',
    },
    {
      id: 'auth-4',
      name: 'P. T. Mohammed Haji (ബാപ്പുട്ടി ഹാജി)',
      role: 'Treasurer / Khazanji (ഖജാൻജി)',
      roleMl: 'ഫൈനാൻസ് & ബൈത്തുൽമാൽ ട്രഷറർ',
      accountNumber: 'ACC-MHL-0038',
      phone: '+91 98472 55667',
      email: 'treasurer@noorulhudamahal.org',
      initials: 'MH',
      badge: 'Finance & Baithul Maal',
      avatarBg: 'bg-amber-700',
      responsibilities: 'Mahal subscriptions, Varavu-Chelavu accounts, annual auditing & welfare disbursements',
      officeHours: 'Sat & Sun: 10:00 AM - 01:00 PM',
    },
    {
      id: 'auth-5',
      name: 'Janab T. P. Kunhalavi Musliyar',
      role: 'Vice President (വൈസ് പ്രസിഡന്റ്)',
      roleMl: 'വൈസ് പ്രസിഡന്റ് & മസ്ജിദ് കാര്യദർശി',
      accountNumber: 'ACC-MHL-0012',
      phone: '+91 94463 88990',
      email: 'vp@noorulhudamahal.org',
      initials: 'KM',
      badge: 'Mosque Affairs',
      avatarBg: 'bg-slate-700',
      responsibilities: 'Masjid complex maintenance, cemetery (Qabarstan) upkeep & Waqf asset protection',
      officeHours: 'Daily: 04:30 PM - 07:30 PM',
    },
    {
      id: 'auth-6',
      name: 'Dr. Shareef Parakkal (കൺവീനർ)',
      role: 'Social Welfare & Relief Secretary',
      roleMl: 'ജനക്ഷേമ & സന്നദ്ധസേവന കൺവീനർ',
      accountNumber: 'ACC-MHL-0056',
      phone: '+91 97455 33441',
      email: 'welfare@noorulhudamahal.org',
      initials: 'SP',
      badge: 'Healthcare & 24/7 Relief',
      avatarBg: 'bg-rose-700',
      responsibilities: '24/7 Blood Donor Network, Janaza ambulance coordination & medical emergency aid',
      officeHours: '24/7 Emergency Helpline Active',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enq = submitEnquiry(form);
    setSubmittedId(enq.enquiryNumber);
    setForm({
      name: '',
      phone: '',
      email: '',
      category: 'GENERAL',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00545f] bg-[#ecffb6] px-3.5 py-1 rounded-full border border-[#d6fb00]/40">
          Citizen Helpdesk & Official Directorate
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#003a42]">
          Contact Secretariat & Mahal Authorities
        </h1>
        <p className="text-xs sm:text-sm text-[#3d686e] leading-relaxed">
          Reach out directly to executive authorities, council office-bearers, or submit a formal grievance for prompt redressal.
        </p>
      </div>

      {/* Emergency Strip */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-rose-950 text-sm sm:text-base">
              24/7 Janaza & Emergency Ambulance Assistance
            </h4>
            <p className="text-rose-700">
              Immediate round-the-clock help for funeral rites, shroud arrangements, cemetery burial preparation, and blood bank coordination.
            </p>
          </div>
        </div>
        <a
          href={`tel:${settings.phone}`}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow shrink-0 flex items-center gap-2 text-xs sm:text-sm transition-transform active:scale-95"
        >
          <Phone className="w-4 h-4" />
          <span>Call Emergency: {settings.phone}</span>
        </a>
      </div>

      {/* MAHAL AUTHORITIES DIRECTORY SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#ecffb6] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00545f]">
              Executive Directorate
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#003a42]">
              Mahal Working Committee Authorities & Contact Info
            </h2>
            <p className="text-xs text-[#3d686e]">
              മഹല്ല് ഭരണസമിതി ഭാരവാഹികൾ — Verified committee members, office account IDs, and contact lines.
            </p>
          </div>
          <span className="text-xs bg-[#fafdf2] border border-[#ecffb6] text-[#00545f] px-3 py-1 rounded-xl font-mono font-bold self-start sm:self-auto">
            Session: 2024–2027
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {authorities.map((auth) => (
            <div
              key={auth.id}
              className="bg-white rounded-3xl border border-[#ecffb6] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Profile Card Header with Normal Avatar */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Normal Avatar Circle */}
                    <div
                      className={`w-12 h-12 rounded-full ${auth.avatarBg} text-white flex items-center justify-center font-serif font-black text-base shadow-sm ring-3 ring-[#ecffb6] shrink-0`}
                    >
                      <span>{auth.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#003a42] leading-snug truncate" title={auth.name}>
                        {auth.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#00545f] leading-tight">
                        {auth.role}
                      </p>
                      <p className="text-[10px] text-[#3d686e]/80 truncate">
                        {auth.roleMl}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#00545f] bg-[#ecffb6] px-2 py-0.5 rounded-full border border-[#d6fb00]/50 shrink-0">
                    {auth.badge}
                  </span>
                </div>

                {/* Account details & Responsibility */}
                <div className="p-3 bg-[#fafdf2] rounded-2xl border border-[#ecffb6]/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#00545f]" /> Account ID:
                    </span>
                    <span className="font-mono font-bold text-[#00545f] text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#ecffb6]">
                      {auth.accountNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3d686e] leading-relaxed pt-1 border-t border-[#ecffb6]/50">
                    <span className="font-semibold text-[#003a42]">Portfolio:</span> {auth.responsibilities}
                  </p>
                  <p className="text-[10px] text-stone-400 italic">
                    <span className="font-medium text-stone-500">Available:</span> {auth.officeHours}
                  </p>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${auth.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  title={`Call ${auth.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {auth.phone.split(' ')[1] || 'Direct'}</span>
                </a>

                <a
                  href={`mailto:${auth.email}`}
                  className="flex items-center justify-center p-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl transition-colors cursor-pointer"
                  title={`Email ${auth.email}`}
                >
                  <Mail className="w-4 h-4 text-[#00545f]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Office Details & Timings */}
        <div className="space-y-6 text-xs">
          <div className="bg-white rounded-3xl border border-[#ecffb6] p-6 sm:p-7 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#003a42] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#00545f]" />
              <span>Mahal Central Secretariat & Office</span>
            </h3>

            <div className="space-y-3.5 text-[#3d686e]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00545f] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#003a42]">{settings.mahalName}</strong>
                  <p>{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Office Landline: <strong className="text-[#003a42]">{settings.phone}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Secretariat Email: <strong className="text-[#003a42]">{settings.email}</strong></span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#00545f] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#003a42]">Counter Timings:</p>
                  <p>Morning Session: 09:00 AM – 01:00 PM</p>
                  <p>Evening Session: 04:30 PM – 08:30 PM</p>
                  <p className="text-amber-700 font-medium mt-1">Closed on Fridays during Juma'h prayer hours</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ecffb6] flex items-center justify-between text-[11px] text-[#00545f]">
              <span className="flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ISO 9001:2015 Registered Secretariat
              </span>
              <span className="font-mono">Reg. No: KL-MLP-2026/884</span>
            </div>
          </div>
        </div>

        {/* Public Grievance Form */}
        <div className="bg-white rounded-3xl border border-[#ecffb6] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#003a42]">
            Submit a Public Enquiry or Grievance
          </h3>
          <p className="text-xs text-[#3d686e]">
            Your message will be logged directly into the executive secretariat queue with an instant tracking number.
          </p>

          {submittedId ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-base">Enquiry Successfully Logged</h4>
              <p className="text-xs text-emerald-800">
                Your tracking number is <strong className="font-mono">{submittedId}</strong>. The executive committee will respond within 48 working hours.
              </p>
              <button
                onClick={() => setSubmittedId(null)}
                className="px-5 py-2 bg-[#00545f] text-[#d6fb00] font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-[#003a42]"
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#003a42] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#003a42] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#003a42] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#003a42] mb-1">Department / Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                  >
                    <option value="GENERAL">General Information</option>
                    <option value="CERTIFICATE">Death & Marriage Certificate Query</option>
                    <option value="WELFARE">Baithul Maal & Welfare Relief</option>
                    <option value="MADRASA">Madrasa Education & Mentorship</option>
                    <option value="GRIEVANCE">Executive Grievance / Dispute</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#003a42] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                  placeholder="Summary of your query"
                />
              </div>

              <div>
                <label className="block font-bold text-[#003a42] mb-1">Your Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fafdf2] border border-[#ecffb6] rounded-xl focus:outline-none focus:border-[#00545f]"
                  placeholder="Provide complete details so the concerned committee member can address it..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance / Enquiry to Secretariat</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
