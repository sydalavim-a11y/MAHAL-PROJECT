import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  GraduationCap,
  Droplet,
  Users,
  Home,
  Waves,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  X,
  Send,
  Filter,
} from 'lucide-react';
import { BloodDonor, CounsellingBooking, EducationGuidanceRegistration, BloodRequest } from '../../types';

export const PublicProgramsProjects: React.FC = () => {
  const {
    language,
    currentUser,
    setOpenAuthModal,
    counsellingBookings,
    bookCounselling,
    educationRegistrations,
    registerEducationGuidance,
    bloodDonors,
    registerBloodDonor,
    bloodRequests,
    submitBloodRequest,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PROGRAMS' | 'PROJECTS'>('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [donorSearchTerm, setDonorSearchTerm] = useState('');

  // Modals state
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [counsellingForm, setCounsellingForm] = useState({
    applicantName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    type: 'PRE_MARITAL' as CounsellingBooking['type'],
    preferredDate: '',
    preferredTimeSlot: '10:30 AM - 11:30 AM',
    mode: 'IN_PERSON' as CounsellingBooking['mode'],
    notes: '',
  });
  const [counsellingSuccess, setCounsellingSuccess] = useState<string | null>(null);

  const [showEducationModal, setShowEducationModal] = useState(false);
  const [educationForm, setEducationForm] = useState({
    studentName: '',
    parentName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    currentClass: 'Plus Two Science',
    targetCareer: 'NEET / Medicine',
    address: 'West Hill, Kozhikode',
    wardNumber: 'Ward 3',
  });
  const [educationSuccess, setEducationSuccess] = useState<string | null>(null);

  const [showDonorModal, setShowDonorModal] = useState(false);
  const [donorForm, setDonorForm] = useState({
    name: currentUser?.name || '',
    bloodGroup: 'B+' as BloodDonor['bloodGroup'],
    phone: currentUser?.phone || '',
    age: 25,
    wardNumber: 'Ward 3',
    lastDonatedDate: '',
    isAvailable: true,
    notes: '',
  });
  const [donorSuccess, setDonorSuccess] = useState<string | null>(null);

  const [showBloodReqModal, setShowBloodReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({
    patientName: '',
    hospital: 'Government Medical College Hospital, Kozhikode',
    bloodGroup: 'O+',
    unitsNeeded: 2,
    contactPerson: currentUser?.name || '',
    phone: currentUser?.phone || '',
    requiredDate: new Date().toISOString().split('T')[0],
    urgency: 'URGENT' as BloodRequest['urgency'],
  });
  const [reqSuccess, setReqSuccess] = useState<string | null>(null);

  // Filtered blood donors
  const filteredDonors = bloodDonors.filter((d) => {
    const matchesGroup = selectedBloodGroup === 'ALL' || d.bloodGroup === selectedBloodGroup;
    const matchesSearch =
      donorSearchTerm === '' ||
      d.name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      d.wardNumber.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(donorSearchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleCounsellingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counsellingForm.applicantName || !counsellingForm.phone) return;
    const result = bookCounselling(counsellingForm);
    setCounsellingSuccess(`Your counselling appointment has been registered with ID: ${result.bookingNumber}. Our secretary desk will contact you with slot confirmation.`);
    setTimeout(() => {
      setShowCounsellingModal(false);
      setCounsellingSuccess(null);
    }, 3500);
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!educationForm.studentName || !educationForm.phone) return;
    const result = registerEducationGuidance(educationForm);
    setEducationSuccess(`Student registration confirmed! Reference No: ${result.regNumber}. You will receive camp schedule updates on WhatsApp.`);
    setTimeout(() => {
      setShowEducationModal(false);
      setEducationSuccess(null);
    }, 3500);
  };

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorForm.name || !donorForm.phone) return;
    registerBloodDonor(donorForm);
    setDonorSuccess(`May Allah reward you! You are now enrolled in the Noor-ul-Huda Live Blood Donor Army.`);
    setTimeout(() => {
      setShowDonorModal(false);
      setDonorSuccess(null);
    }, 3000);
  };

  const handleReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.patientName || !reqForm.phone) return;
    submitBloodRequest(reqForm);
    setReqSuccess(`Emergency blood request broadcasted to matching donors in the Mahal network.`);
    setTimeout(() => {
      setShowBloodReqModal(false);
      setReqSuccess(null);
    }, 3500);
  };

  return (
    <div id="programs-projects" className="py-20 sm:py-28 bg-[#fafdf2] text-[#00434c] selection:bg-[#d6fb00] selection:text-[#00545f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Section Header with Generous Spacing */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00545f]" />
            <span>Mahal Social & Community Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-serif text-[#00545f] tracking-tight">
            Programs & Social Projects
          </h2>

          <p className="arabic-text text-xl sm:text-2xl text-[#00545f] font-serif font-bold">
            خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
          </p>

          <p className="text-[#3d686e] text-sm sm:text-base leading-relaxed font-medium">
            Dedicated welfare campaigns and social initiatives designed to uplift families, empower youth, support students, and provide critical community healthcare support.
          </p>

          {/* Filter Pills with clear breathing room */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
                activeFilter === 'ALL'
                  ? 'bg-[#00545f] text-[#d6fb00] border-2 border-[#d6fb00]'
                  : 'bg-white text-[#00434c] hover:bg-[#ecffb6]/50 border border-[#ecffb6]'
              }`}
            >
              All Initiatives (എല്ലാം)
            </button>
            <button
              onClick={() => setActiveFilter('PROGRAMS')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                activeFilter === 'PROGRAMS'
                  ? 'bg-[#00545f] text-[#d6fb00] border-2 border-[#d6fb00]'
                  : 'bg-white text-[#00434c] hover:bg-[#ecffb6]/50 border border-[#ecffb6]'
              }`}
            >
              <Droplet className="w-4 h-4 text-red-500" />
              <span>Programs (കർമ്മപരിപാടികൾ)</span>
            </button>
            <button
              onClick={() => setActiveFilter('PROJECTS')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                activeFilter === 'PROJECTS'
                  ? 'bg-[#00545f] text-[#d6fb00] border-2 border-[#d6fb00]'
                  : 'bg-white text-[#00434c] hover:bg-[#ecffb6]/50 border border-[#ecffb6]'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Projects (വികസന പദ്ധതികൾ)</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: PROGRAMS (COMMUNITY HEALTHCARE, HOUSING & WATER RELIEF) */}
        {(activeFilter === 'ALL' || activeFilter === 'PROGRAMS') && (
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ecffb6]/80 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#00707e]">Category A</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#00545f]">
                  Community Welfare, Healthcare & Relief Programs (മഹല്ല് കർമ്മപരിപാടികൾ)
                </h3>
              </div>
              <p className="text-xs text-[#3d686e] max-w-md">
                Life-saving 24/7 blood donor network program, emergency medical assistance, destitute housing relief, and clean drinking water distribution.
              </p>
            </div>

            {/* PROGRAM 1: Blood Donation Mission & Live Donor Bank Program */}
            <div className="bg-gradient-to-br from-[#00545f] via-[#004752] to-[#003a42] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-[#ecffb6]/30 relative overflow-hidden space-y-8 sm:space-y-10">
              <div className="absolute right-0 top-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                    <Droplet className="w-3.5 h-3.5 fill-current" />
                    <span>Emergency Life-Saving Program</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white tracking-tight">
                    Mahal Blood Donation & Healthcare Program (ലൈവ് രക്തദാന കർമ്മപദ്ധതി)
                  </h4>
                  <p className="text-xs sm:text-sm text-[#ecffb6] leading-relaxed">
                    നൂറുൽ ഹുദാ മഹല്ല് രക്തദാന കർമ്മപരിപാടി — A 24/7 dedicated volunteer network linking verified blood donors across all wards with emergency patients at Calicut Medical College and regional hospitals.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    id="register-blood-donor-btn"
                    onClick={() => setShowDonorModal(true)}
                    className="px-5 sm:px-6 py-3 sm:py-3.5 bg-[#d6fb00] hover:bg-[#c5ea00] text-[#00545f] font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register as Blood Donor</span>
                  </button>

                  <button
                    id="request-blood-btn"
                    onClick={() => setShowBloodReqModal(true)}
                    className="px-5 sm:px-6 py-3 sm:py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Droplet className="w-4 h-4" />
                    <span>Emergency Blood Request</span>
                  </button>
                </div>
              </div>

              {/* Live Donors Filter and Grid */}
              <div className="space-y-6 pt-4 border-t border-[#ecffb6]/20 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d6fb00]">
                      Filter Blood Group:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['ALL', 'A+', 'B+', 'O+', 'AB+', 'O-', 'A-', 'B-'].map((bg) => (
                        <button
                          key={bg}
                          onClick={() => setSelectedBloodGroup(bg)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedBloodGroup === bg
                              ? 'bg-[#d6fb00] text-[#00545f] shadow'
                              : 'bg-[#003a42] text-[#ecffb6] hover:bg-white/10'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-[#ecffb6]/60 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search donor or ward..."
                      value={donorSearchTerm}
                      onChange={(e) => setDonorSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-[#003a42] text-white placeholder-[#ecffb6]/50 rounded-xl text-xs border border-[#ecffb6]/30 focus:outline-none focus:border-[#d6fb00]"
                    />
                  </div>
                </div>

                {/* Donor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDonors.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-[#ecffb6]/80 text-xs">
                      No registered donors matching the selected group. Be the first to register!
                    </div>
                  ) : (
                    filteredDonors.map((donor) => (
                      <div
                        key={donor.id}
                        className="bg-[#003a42]/90 border border-[#ecffb6]/30 p-4 rounded-2xl flex items-center justify-between gap-3 shadow"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-sm shrink-0">
                            {donor.bloodGroup}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-white text-xs truncate">{donor.name}</h5>
                            <p className="text-[11px] text-[#ecffb6]/80 truncate">{donor.wardNumber}</p>
                            <span className="text-[10px] text-emerald-300 font-medium">
                              ● Ready for emergency
                            </span>
                          </div>
                        </div>

                        <a
                          href={`tel:${donor.phone}`}
                          className="p-2.5 bg-[#d6fb00] hover:bg-[#c5ea00] text-[#00545f] rounded-xl font-bold text-xs shadow shrink-0"
                          title="Call Donor"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    ))
                  )}
                </div>

                {/* Active Emergency Requests Strip */}
                {bloodRequests.length > 0 && (
                  <div className="mt-4 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <strong className="text-red-400 uppercase tracking-wider">
                        Active Emergency Alert:
                      </strong>
                      <span className="text-white">
                        {bloodRequests[0].bloodGroup} Needed ({bloodRequests[0].unitsNeeded} Units) for{' '}
                        {bloodRequests[0].patientName} at {bloodRequests[0].hospital}
                      </span>
                    </div>
                    <a
                      href={`tel:${bloodRequests[0].phone}`}
                      className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 shadow"
                    >
                      Call Attendant: {bloodRequests[0].phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Programs Grid (Housing & Clean Water) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Program 2: Housing & Sanitation Program */}
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-md border border-[#ecffb6] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#00545f]/10 border border-[#00545f]/20 text-[#00545f] flex items-center justify-center">
                    <Home className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#00545f] bg-[#ecffb6] px-3 py-0.5 rounded-full">
                      Shelter & Dignity Program
                    </span>
                    <h4 className="text-xl font-bold font-serif text-[#00545f]">
                      Relief Housing & Sanitation Program
                    </h4>
                    <p className="text-xs font-semibold text-[#00707e]">
                      ബൈത്തുർറഹ്മ ഭവന നിർമ്മാണ & നവീകരണ കർമ്മപദ്ധതി
                    </p>
                  </div>
                  <p className="text-xs text-[#3d686e] leading-relaxed">
                    Constructing concrete houses and installing sanitary hygiene facilities for destitute widows, orphaned families, and financially distressed Mahal constituents.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-[#fafdf2] border border-[#ecffb6] text-center">
                      <div className="font-extrabold text-[#00545f] text-base">14 Homes</div>
                      <div className="text-[10px] text-[#3d686e]">Completed & Handed Over</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#fafdf2] border border-[#ecffb6] text-center">
                      <div className="font-extrabold text-[#00545f] text-base">₹28 Lakhs+</div>
                      <div className="text-[10px] text-[#3d686e]">Sanctioned from Baithul Maal</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program 3: Clean Drinking Water Program */}
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-md border border-[#ecffb6] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                    <Waves className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-0.5 rounded-full border border-cyan-200">
                      Public Utility Program
                    </span>
                    <h4 className="text-xl font-bold font-serif text-[#00545f]">
                      Community Clean Drinking Water Program
                    </h4>
                    <p className="text-xs font-semibold text-[#00707e]">
                      മഹല്ല് കുടിവെള്ള വിതരണ കർമ്മപദ്ധതി
                    </p>
                  </div>
                  <p className="text-xs text-[#3d686e] leading-relaxed">
                    Providing deep borewells and reverse-osmosis purified water stations across water-scarce sectors of the Mahal, ensuring safe drinking water for all households regardless of faith.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-[#fafdf2] border border-[#ecffb6] text-center">
                      <div className="font-extrabold text-[#00545f] text-base">6 Wards</div>
                      <div className="text-[10px] text-[#3d686e]">Connected with Water Grid</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#fafdf2] border border-[#ecffb6] text-center">
                      <div className="font-extrabold text-[#00545f] text-base">10,000+ L/Day</div>
                      <div className="text-[10px] text-[#3d686e]">Pure Drinking Water Capacity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PROJECTS (NOW MARITAL COUNSELLING, EDUCATION & YOUTH EMPOWERMENT PROJECTS) */}
        {(activeFilter === 'ALL' || activeFilter === 'PROJECTS') && (
          <div className="space-y-10 sm:space-y-14 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ecffb6]/80 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#00707e]">Category B</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#00545f]">
                  Social, Educational & Guidance Projects (മഹല്ല് വികസന പദ്ധതികൾ)
                </h3>
              </div>
              <p className="text-xs text-[#3d686e] max-w-md">
                Certified marital counseling projects, career guidance academies, scholarship mentoring, and youth character-building projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Project 1: Marital Counselling Project */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#ecffb6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      Family Harmony Project
                    </span>
                    <h4 className="text-xl font-bold font-serif text-[#00545f]">
                      Marital Counselling Project
                    </h4>
                    <p className="text-xs font-semibold text-[#00707e]">
                      വിവാഹ പൂർവ്വ & കുടുംബ കൗൺസിലിംഗ് വികസന പദ്ധതി
                    </p>
                  </div>
                  <p className="text-xs text-[#3d686e] leading-relaxed">
                    Certified pre-marital workshops for prospective couples, marital dispute reconciliation, and confidential family wellness sessions led by experienced Islamic scholars and certified psychologists.
                  </p>
                  
                  <div className="space-y-2 pt-2 text-xs text-[#00434c]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Pre-marital Certificate Course</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Confidential Couple Mediation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Private Online / In-person Options</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ecffb6]/60">
                  <button
                    id="book-counselling-btn"
                    onClick={() => setShowCounsellingModal(true)}
                    className="w-full py-3.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-101"
                  >
                    <span>Book Counselling Session</span>
                    <ArrowRight className="w-4 h-4 text-[#d6fb00]" />
                  </button>
                </div>
              </div>

              {/* Project 2: Educational Guidance Project */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#ecffb6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#00545f] flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-7 h-7 text-[#00545f]" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#00545f] bg-[#ecffb6] px-3 py-1 rounded-full border border-[#d6fb00]">
                      Academic Mentorship Project
                    </span>
                    <h4 className="text-xl font-bold font-serif text-[#00545f]">
                      Educational Guidance Project
                    </h4>
                    <p className="text-xs font-semibold text-[#00707e]">
                      വിദ്യാഭ്യാസ മാർഗ്ഗനിർദ്ദേശ & സ്കോളർഷിപ്പ് പദ്ധതി
                    </p>
                  </div>
                  <p className="text-xs text-[#3d686e] leading-relaxed">
                    Higher education roadmaps, entrance coaching orientation (NEET, JEE, KEAM, Civil Services), Central & State minority scholarship assistance (MOMA, NSP), and career psychometric profiling.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-[#00434c]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Free Scholarship Verification Helpdesk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>One-on-One Career Mentorship</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Talent Awards for 10th & Plus Two Top Scorers</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ecffb6]/60">
                  <button
                    id="register-edu-camp-btn"
                    onClick={() => setShowEducationModal(true)}
                    className="w-full py-3.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-101"
                  >
                    <span>Register for Guidance Camp</span>
                    <ArrowRight className="w-4 h-4 text-[#d6fb00]" />
                  </button>
                </div>
              </div>

              {/* Project 3: Youth Moral & Leadership Project */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#ecffb6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group">
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
                    <Users className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Youth Leadership Project
                    </span>
                    <h4 className="text-xl font-bold font-serif text-[#00545f]">
                      Youth Moral & Leadership Project
                    </h4>
                    <p className="text-xs font-semibold text-[#00707e]">
                      യുവജന നൈപുണ്യ & നേതൃത്വ വികസന പദ്ധതി
                    </p>
                  </div>
                  <p className="text-xs text-[#3d686e] leading-relaxed">
                    Anti-substance abuse awareness campaigns, moral character building, public speaking forums, sports tournaments, and community volunteering opportunities for Mahal youth.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-[#00434c]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Anti-Drug Awareness Drives in Schools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Public Speaking & Soft-Skills Circles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                      <span>Volunteering in Relief Operations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ecffb6]/60">
                  <div className="p-3 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl text-center text-xs font-bold text-[#00545f]">
                    Next Youth Assembly: 1st Sunday of Every Month
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Book Marital Counselling */}
      <AnimatePresence>
        {showCounsellingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-[#00434c] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ecffb6] max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#ecffb6] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-[#00545f]">Book Counselling Session</h3>
                    <p className="text-xs text-[#3d686e]">Confidential family & pre-marital advisory</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCounsellingModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {counsellingSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Appointment Booked Successfully!</p>
                  <p>{counsellingSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleCounsellingSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#00545f]">Applicant / Couple Name(s) *</label>
                    <input
                      type="text"
                      required
                      value={counsellingForm.applicantName}
                      onChange={(e) => setCounsellingForm({ ...counsellingForm, applicantName: e.target.value })}
                      placeholder="e.g. Faisal & Nasreen"
                      className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={counsellingForm.phone}
                        onChange={(e) => setCounsellingForm({ ...counsellingForm, phone: e.target.value })}
                        placeholder="+91 98470 00000"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Counselling Type</label>
                      <select
                        value={counsellingForm.type}
                        onChange={(e) => setCounsellingForm({ ...counsellingForm, type: e.target.value as any })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="PRE_MARITAL">Pre-Marital Orientation</option>
                        <option value="FAMILY_HARMONY">Family Dispute & Harmony</option>
                        <option value="YOUTH_GUIDANCE">Youth Personal Guidance</option>
                        <option value="GENERAL">General Welfare Advisory</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={counsellingForm.preferredDate}
                        onChange={(e) => setCounsellingForm({ ...counsellingForm, preferredDate: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Preferred Slot</label>
                      <select
                        value={counsellingForm.preferredTimeSlot}
                        onChange={(e) => setCounsellingForm({ ...counsellingForm, preferredTimeSlot: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="10:30 AM - 11:30 AM">Morning (10:30 AM - 11:30 AM)</option>
                        <option value="02:30 PM - 03:30 PM">Afternoon (02:30 PM - 03:30 PM)</option>
                        <option value="04:30 PM - 05:30 PM">Evening (04:30 PM - 05:30 PM)</option>
                        <option value="07:30 PM - 08:30 PM">Night Slot (Online Only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#00545f]">Session Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCounsellingForm({ ...counsellingForm, mode: 'IN_PERSON' })}
                        className={`p-2.5 rounded-xl border font-bold text-center cursor-pointer ${
                          counsellingForm.mode === 'IN_PERSON'
                            ? 'bg-[#00545f] text-[#d6fb00] border-[#00545f]'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        In-Person at Mahal Desk
                      </button>
                      <button
                        type="button"
                        onClick={() => setCounsellingForm({ ...counsellingForm, mode: 'ONLINE_CONFIDENTIAL' })}
                        className={`p-2.5 rounded-xl border font-bold text-center cursor-pointer ${
                          counsellingForm.mode === 'ONLINE_CONFIDENTIAL'
                            ? 'bg-[#00545f] text-[#d6fb00] border-[#00545f]'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        Online Video / Phone
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#00545f]">Confidential Note / Issue Summary (Optional)</label>
                    <textarea
                      rows={2}
                      value={counsellingForm.notes}
                      onChange={(e) => setCounsellingForm({ ...counsellingForm, notes: e.target.value })}
                      placeholder="Brief note to help the counselor prepare..."
                      className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black rounded-xl text-xs shadow cursor-pointer transition-all"
                    >
                      Confirm Confidential Booking
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Register for Education Guidance Campaign */}
      <AnimatePresence>
        {showEducationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-[#00434c] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ecffb6] max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#ecffb6] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00545f] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#00545f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-[#00545f]">Education Guidance Camp</h3>
                    <p className="text-xs text-[#3d686e]">Career mentoring & scholarship assistance</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEducationModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {educationSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Registration Successful!</p>
                  <p>{educationSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleEducationSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#00545f]">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={educationForm.studentName}
                      onChange={(e) => setEducationForm({ ...educationForm, studentName: e.target.value })}
                      placeholder="e.g. Zayan Mohammed"
                      className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={educationForm.parentName}
                        onChange={(e) => setEducationForm({ ...educationForm, parentName: e.target.value })}
                        placeholder="e.g. Mohammed Shafi"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={educationForm.phone}
                        onChange={(e) => setEducationForm({ ...educationForm, phone: e.target.value })}
                        placeholder="+91 98460 00000"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Current Class / Course</label>
                      <select
                        value={educationForm.currentClass}
                        onChange={(e) => setEducationForm({ ...educationForm, currentClass: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="10th Standard (SSLC / CBSE)">10th Standard (SSLC / CBSE)</option>
                        <option value="Plus One (Science / Commerce / Arts)">Plus One</option>
                        <option value="Plus Two Science">Plus Two Science</option>
                        <option value="Plus Two Commerce / Humanities">Plus Two Commerce / Humanities</option>
                        <option value="Degree Undergraduate">Degree Undergraduate</option>
                        <option value="Post Graduate / Professional">Post Graduate / Professional</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Target Career / Aspiration</label>
                      <select
                        value={educationForm.targetCareer}
                        onChange={(e) => setEducationForm({ ...educationForm, targetCareer: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="NEET / Medicine & Allied Health">NEET / Medicine & Allied Health</option>
                        <option value="JEE / Engineering & Technology">JEE / Engineering & Tech</option>
                        <option value="Civil Services / UPSC & State PSC">Civil Services / UPSC & PSC</option>
                        <option value="Chartered Accountancy (CA) / Finance">Chartered Accountancy / Finance</option>
                        <option value="Law & Judiciary">Law & Judiciary</option>
                        <option value="Scholarship Guidance Desk (MOMA / E-Grantz)">Scholarship Guidance Desk</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Address / House Name</label>
                      <input
                        type="text"
                        value={educationForm.address}
                        onChange={(e) => setEducationForm({ ...educationForm, address: e.target.value })}
                        placeholder="House name, street"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Mahal Ward Number</label>
                      <select
                        value={educationForm.wardNumber}
                        onChange={(e) => setEducationForm({ ...educationForm, wardNumber: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="Ward 1 (Beach Road)">Ward 1 (Beach Road)</option>
                        <option value="Ward 2 (Post Office Road)">Ward 2 (Post Office Road)</option>
                        <option value="Ward 3 (Juma Masjid Ward)">Ward 3 (Juma Masjid Ward)</option>
                        <option value="Ward 4 (Bypass Junction)">Ward 4 (Bypass Junction)</option>
                        <option value="Ward 5 (North Hill)">Ward 5 (North Hill)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black rounded-xl text-xs shadow cursor-pointer transition-all"
                    >
                      Submit Student Enrollment
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Register as Blood Donor */}
      <AnimatePresence>
        {showDonorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-[#00434c] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ecffb6] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#ecffb6] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                    <Droplet className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-[#00545f]">Register as Blood Donor</h3>
                    <p className="text-xs text-[#3d686e]">Join the Noor-ul-Huda Live Donor Army</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDonorModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {donorSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Registration Successful!</p>
                  <p>{donorSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleDonorSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={donorForm.name}
                        onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                        placeholder="e.g. Suhail P.K."
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Blood Group *</label>
                      <select
                        value={donorForm.bloodGroup}
                        onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value as any })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f] font-bold"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={donorForm.phone}
                        onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                        placeholder="+91 98471 00000"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Age (18 - 60)</label>
                      <input
                        type="number"
                        min={18}
                        max={65}
                        required
                        value={donorForm.age}
                        onChange={(e) => setDonorForm({ ...donorForm, age: parseInt(e.target.value, 10) || 20 })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Mahal Ward</label>
                      <select
                        value={donorForm.wardNumber}
                        onChange={(e) => setDonorForm({ ...donorForm, wardNumber: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      >
                        <option value="Ward 1 (Beach Road)">Ward 1 (Beach Road)</option>
                        <option value="Ward 2 (Post Office Road)">Ward 2 (Post Office Road)</option>
                        <option value="Ward 3 (Juma Masjid Ward)">Ward 3 (Juma Masjid Ward)</option>
                        <option value="Ward 4 (Bypass Junction)">Ward 4 (Bypass Junction)</option>
                        <option value="Ward 5 (North Hill)">Ward 5 (North Hill)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Last Donated Date (if any)</label>
                      <input
                        type="date"
                        value={donorForm.lastDonatedDate}
                        onChange={(e) => setDonorForm({ ...donorForm, lastDonatedDate: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow cursor-pointer transition-all"
                    >
                      Enroll in Blood Donor Army
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Emergency Blood Request */}
      <AnimatePresence>
        {showBloodReqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-[#00434c] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-red-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <Droplet className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif text-red-800">Emergency Blood Request</h3>
                    <p className="text-xs text-stone-600">Immediate broadcast to registered volunteers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBloodReqModal(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reqSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Emergency Request Broadcasted!</p>
                  <p>{reqSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReqSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Patient Name *</label>
                      <input
                        type="text"
                        required
                        value={reqForm.patientName}
                        onChange={(e) => setReqForm({ ...reqForm, patientName: e.target.value })}
                        placeholder="e.g. Kadeejabi (Age 64)"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Blood Group Required *</label>
                      <select
                        value={reqForm.bloodGroup}
                        onChange={(e) => setReqForm({ ...reqForm, bloodGroup: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600 font-bold"
                      >
                        <option value="O+">O+ Positive</option>
                        <option value="A+">A+ Positive</option>
                        <option value="B+">B+ Positive</option>
                        <option value="AB+">AB+ Positive</option>
                        <option value="O-">O- Negative</option>
                        <option value="A-">A- Negative</option>
                        <option value="B-">B- Negative</option>
                        <option value="AB-">AB- Negative</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#00545f]">Hospital / Medical Facility *</label>
                    <input
                      type="text"
                      required
                      value={reqForm.hospital}
                      onChange={(e) => setReqForm({ ...reqForm, hospital: e.target.value })}
                      placeholder="e.g. Kozhikode Medical College / MIMS"
                      className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Units Needed</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={reqForm.unitsNeeded}
                        onChange={(e) => setReqForm({ ...reqForm, unitsNeeded: parseInt(e.target.value, 10) || 1 })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Required By Date</label>
                      <input
                        type="date"
                        required
                        value={reqForm.requiredDate}
                        onChange={(e) => setReqForm({ ...reqForm, requiredDate: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Urgency Level</label>
                      <select
                        value={reqForm.urgency}
                        onChange={(e) => setReqForm({ ...reqForm, urgency: e.target.value as any })}
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      >
                        <option value="CRITICAL">Critical (Immediate)</option>
                        <option value="URGENT">Urgent (Within 24 hrs)</option>
                        <option value="STANDARD">Standard (Scheduled)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Attendant Name *</label>
                      <input
                        type="text"
                        required
                        value={reqForm.contactPerson}
                        onChange={(e) => setReqForm({ ...reqForm, contactPerson: e.target.value })}
                        placeholder="Relative / Attendant name"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#00545f]">Attendant Phone *</label>
                      <input
                        type="tel"
                        required
                        value={reqForm.phone}
                        onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })}
                        placeholder="+91 98460 00000"
                        className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow cursor-pointer transition-all"
                    >
                      Broadcast Urgent Blood Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
