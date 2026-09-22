import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  GraduationCap,
  Droplet,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Calendar,
  User,
  Filter,
  ArrowRight,
  AlertCircle,
  Plus,
  Hospital,
  Sparkles,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { CounsellingBooking, EducationGuidanceRegistration, BloodRequest, BloodDonor } from '../../types';

export const AdminProgramsProjects: React.FC = () => {
  const {
    counsellingBookings,
    updateCounsellingStatus,
    educationRegistrations,
    updateEducationStatus,
    bloodRequests,
    updateBloodRequestStatus,
    bloodDonors,
    registerBloodDonor,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'ALL' | 'COUNSELLING' | 'EDUCATION' | 'BLOOD' | 'OTHER'>('ALL');
  const [bloodFilterGroup, setBloodFilterGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick donor modal/form state
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: '',
    bloodGroup: 'O+' as BloodDonor['bloodGroup'],
    phone: '',
    age: 26,
    wardNumber: 'Ward 4',
    isAvailable: true,
    notes: 'Volunteered in Mahal Blood Drive',
  });

  const handleAddDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonor.name || !newDonor.phone) return;
    registerBloodDonor(newDonor);
    setShowAddDonor(false);
    setNewDonor({
      name: '',
      bloodGroup: 'O+',
      phone: '',
      age: 26,
      wardNumber: 'Ward 4',
      isAvailable: true,
      notes: 'Volunteered in Mahal Blood Drive',
    });
  };

  const filteredCounselling = counsellingBookings.filter((b) =>
    b.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery)
  );

  const filteredEducation = educationRegistrations.filter((e) =>
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.targetCareer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBloodDonors = bloodDonors.filter((d) => {
    const matchesGroup = bloodFilterGroup === 'ALL' || d.bloodGroup === bloodFilterGroup;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.phone.includes(searchQuery);
    return matchesGroup && matchesSearch;
  });

  const otherCommunityProjects = [
    {
      id: 'proj-water',
      title: 'Clean Drinking Water RO Plant Project',
      category: 'Community Health Infrastructure',
      targetAmount: '₹4,50,000',
      collectedAmount: '₹3,85,000',
      beneficiaries: '350+ Households & Travelers',
      status: 'Commissioning Phase (85% Done)',
      lead: 'Water Works Committee',
      description: 'High capacity 1,000 LPH reverse osmosis purification unit installed adjacent to Masjid compound to provide clean mineral-rich drinking water free of charge.',
    },
    {
      id: 'proj-ramadan',
      title: 'Annual Ramadan Ration & Nutrition Kit Drive',
      category: 'Welfare & Seasonal Relief',
      targetAmount: '₹6,00,000',
      collectedAmount: '₹5,20,000',
      beneficiaries: '220 Needy Families',
      status: 'Annual Recurring Drive',
      lead: 'Relief & Social Welfare Wing',
      description: 'Distribution of premium grocery kits (Rice, Sugar, Dates, Oil, Cereals) ensuring zero hunger across the Mahal during the blessed month.',
    },
    {
      id: 'proj-solar',
      title: '15kW Green Solar Energy Initiative for Masjid & Madrasa',
      category: 'Renewable Sustainability',
      targetAmount: '₹7,50,000',
      collectedAmount: '₹6,90,000',
      beneficiaries: 'Masjid & 8 Madrasa Classrooms',
      status: 'Active Generation (Supplying Grid)',
      lead: 'Masjid Maintenance Trust',
      description: 'On-grid rooftop solar plant slashing monthly electricity bills to zero, powering air cooling and audio systems with clean energy.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Counters */}
      <div className="bg-[#00434c] text-white p-6 rounded-3xl border border-[#ecffb6]/20 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#d6fb00] text-[#00434c] px-2.5 py-0.5 rounded-full">
                ADMIN SOCIAL SERVICES DESK
              </span>
              <span className="text-xs text-[#ecffb6] font-mono">Real-time Coordination</span>
            </div>
            <h2 className="text-2xl font-serif font-black tracking-tight text-white">
              Social Programs & Community Projects
            </h2>
            <p className="text-xs text-[#ecffb6]/90 mt-1 max-w-2xl leading-relaxed">
              Supervise Pre-Marital & Family Counselling requests, Educational Guidance & Career mentorship enrollments, emergency blood donor registries, and public community welfare campaigns.
            </p>
          </div>

          {/* Quick Sub-tab selector buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#00363d] p-1.5 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveSubTab('ALL')}
              className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeSubTab === 'ALL'
                  ? 'bg-[#d6fb00] text-[#00434c] shadow-xs'
                  : 'text-[#ecffb6] hover:text-white'
              }`}
            >
              All Overview
            </button>
            <button
              onClick={() => setActiveSubTab('COUNSELLING')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'COUNSELLING'
                  ? 'bg-[#d6fb00] text-[#00434c] shadow-xs'
                  : 'text-[#ecffb6] hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Marital Counselling ({counsellingBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('EDUCATION')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'EDUCATION'
                  ? 'bg-[#d6fb00] text-[#00434c] shadow-xs'
                  : 'text-[#ecffb6] hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Edu Guidance ({educationRegistrations.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('BLOOD')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'BLOOD'
                  ? 'bg-[#d6fb00] text-[#00434c] shadow-xs'
                  : 'text-[#ecffb6] hover:text-white'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-rose-300" />
              <span>Blood Campaign ({bloodDonors.length} Donors)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('OTHER')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'OTHER'
                  ? 'bg-[#d6fb00] text-[#00434c] shadow-xs'
                  : 'text-[#ecffb6] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Other Projects</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#ecffb6] uppercase font-bold tracking-wider">Counselling Sessions</span>
            <p className="text-2xl font-black text-[#d6fb00] mt-1">{counsellingBookings.length}</p>
            <span className="text-[10px] text-white/70">Pre-Marital & Family</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#ecffb6] uppercase font-bold tracking-wider">Students Enrolled</span>
            <p className="text-2xl font-black text-white mt-1">{educationRegistrations.length}</p>
            <span className="text-[10px] text-white/70">Career Guidance Drive</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#ecffb6] uppercase font-bold tracking-wider">Active Blood Donors</span>
            <p className="text-2xl font-black text-rose-300 mt-1">{bloodDonors.filter(d => d.isAvailable).length}</p>
            <span className="text-[10px] text-white/70">Ready for emergency call</span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-[#ecffb6] uppercase font-bold tracking-wider">Community Projects</span>
            <p className="text-2xl font-black text-white mt-1">{otherCommunityProjects.length}</p>
            <span className="text-[10px] text-white/70">RO Plant, Solar & Kits</span>
          </div>
        </div>
      </div>

      {/* Global Search & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, donor, applicant, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#00545f]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeSubTab === 'BLOOD' && (
            <button
              onClick={() => setShowAddDonor(true)}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enlist New Donor</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-SECTION 1: MARITAL & FAMILY COUNSELLING */}
      {(activeSubTab === 'ALL' || activeSubTab === 'COUNSELLING') && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Pre-Marital & Family Counselling Appointments
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Admin review desk for confidential marital guidance conducted by certified Islamic counselors & Mahal Qazi.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-500 bg-stone-200/60 px-2.5 py-1 rounded-full">
              {filteredCounselling.length} Bookings
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredCounselling.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No counselling bookings found matching query.
              </div>
            ) : (
              filteredCounselling.map((booking) => (
                <div key={booking.id} className="p-5 hover:bg-stone-50/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        {booking.bookingNumber}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900">{booking.applicantName}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {booking.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          booking.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Contact Info</span>
                      <p className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                      </p>
                      {booking.email && <p className="text-stone-500 truncate">{booking.email}</p>}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Appointment Slot</span>
                      <p className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{booking.preferredDate}</span>
                      </p>
                      <p className="text-stone-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{booking.preferredTimeSlot}</span>
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Consultation Mode</span>
                      <p className="font-bold text-stone-800">
                        {booking.mode === 'ONLINE_CONFIDENTIAL' ? 'Online / Secure Video' : 'In-Person at Mahal Office'}
                      </p>
                      {booking.notes && <p className="text-stone-500 text-[11px] truncate">"{booking.notes}"</p>}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                    {booking.status !== 'CONFIRMED' && (
                      <button
                        onClick={() => updateCounsellingStatus(booking.id, 'CONFIRMED')}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl border border-blue-200 cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                    )}
                    {booking.status !== 'COMPLETED' && (
                      <button
                        onClick={() => updateCounsellingStatus(booking.id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-xl border border-emerald-300 cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Session Completed</span>
                      </button>
                    )}
                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                      <button
                        onClick={() => updateCounsellingStatus(booking.id, 'CANCELLED')}
                        className="px-3 py-1.5 bg-stone-100 text-stone-600 hover:bg-stone-200 font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: EDUCATIONAL GUIDANCE CAMPAIGN */}
      {(activeSubTab === 'ALL' || activeSubTab === 'EDUCATION') && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Educational Guidance & Career Mentorship Campaign
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Students registered from Mahal households for higher secondary stream advice, entrance coaching, and scholarships.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-500 bg-stone-200/60 px-2.5 py-1 rounded-full">
              {filteredEducation.length} Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Student & Parent</th>
                  <th className="py-3 px-4">Class / Current Study</th>
                  <th className="py-3 px-4">Target Career Stream</th>
                  <th className="py-3 px-4">Ward / Area</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEducation.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No educational registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredEducation.map((student) => (
                    <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-700">
                        {student.regNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-stone-900">{student.studentName}</p>
                        <p className="text-stone-500 text-[11px]">Father: {student.parentName} • {student.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-800">
                        {student.currentClass}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          {student.targetCareer}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {student.wardNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            student.status === 'COUNSELLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.status === 'BATCH_ALLOCATED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {student.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {student.status !== 'COUNSELLED' && (
                            <button
                              onClick={() => updateEducationStatus(student.id, 'COUNSELLED')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-lg border border-emerald-300 text-[11px] cursor-pointer"
                            >
                              Mark Counselled
                            </button>
                          )}
                          {student.status !== 'BATCH_ALLOCATED' && (
                            <button
                              onClick={() => updateEducationStatus(student.id, 'BATCH_ALLOCATED')}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-bold rounded-lg border border-indigo-200 text-[11px] cursor-pointer"
                            >
                              Assign Cohort
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: EMERGENCY BLOOD CAMPAIGN & DONOR REGISTRY */}
      {(activeSubTab === 'ALL' || activeSubTab === 'BLOOD') && (
        <div className="space-y-6">
          {/* Blood Requests Queue */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-rose-50/40">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                    <Hospital className="w-4 h-4 text-rose-700" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-rose-950">
                    Emergency Blood Requests Broadcast
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Critical patient requirements coordinated with local hospitals and verified donors.
                </p>
              </div>
              <span className="text-xs font-bold bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-200">
                {bloodRequests.length} Active Requests
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {bloodRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  No active blood requests at this moment.
                </div>
              ) : (
                bloodRequests.map((req) => (
                  <div key={req.id} className="p-5 hover:bg-stone-50/50 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-black bg-rose-600 text-white px-3 py-1 rounded-xl shadow-xs font-mono">
                          {req.bloodGroup}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">
                            {req.patientName} ({req.unitsNeeded} Units Required)
                          </h4>
                          <p className="text-xs text-stone-500">{req.hospital} • Needed by: {req.requiredDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            req.urgency === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300'
                              : req.urgency === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            req.status === 'FULFILLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'DONORS_ARRANGED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-stone-700">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>Attendant: <strong>{req.contactPerson}</strong></span>
                        <span className="text-stone-300">|</span>
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <a href={`tel:${req.phone}`} className="font-bold text-stone-900 hover:underline">{req.phone}</a>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status !== 'DONORS_ARRANGED' && (
                          <button
                            onClick={() => updateBloodRequestStatus(req.id, 'DONORS_ARRANGED')}
                            className="px-3 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold rounded-lg border border-blue-200 cursor-pointer"
                          >
                            Donors Dispatched
                          </button>
                        )}
                        {req.status !== 'FULFILLED' && (
                          <button
                            onClick={() => updateBloodRequestStatus(req.id, 'FULFILLED')}
                            className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-lg border border-emerald-300 cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Fulfilled</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Blood Donors Directory */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                    <Droplet className="w-4 h-4 text-rose-700" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Mahal Verified Blood Donor Pool ({bloodDonors.length} Registered)
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Volunteers from Mahal families categorized by blood type ready for emergency dispatch.
                </p>
              </div>

              {/* Blood group selector pills */}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {['ALL', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setBloodFilterGroup(grp)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      bloodFilterGroup === grp
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
              {filteredBloodDonors.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-stone-500">
                  No blood donors found for selected blood group.
                </div>
              ) : (
                filteredBloodDonors.map((donor) => (
                  <div key={donor.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:shadow-xs transition-all space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{donor.name}</h4>
                        <p className="text-xs text-stone-500">Age: {donor.age} • {donor.wardNumber}</p>
                      </div>
                      <span className="font-black text-sm bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-1 rounded-xl">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <a
                        href={`tel:${donor.phone}`}
                        className="font-bold text-stone-800 flex items-center gap-1.5 hover:text-emerald-800"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{donor.phone}</span>
                      </a>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                        {donor.isAvailable ? 'AVAILABLE' : 'DEFERRED'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: OTHER COMMUNITY PROJECTS */}
      {(activeSubTab === 'ALL' || activeSubTab === 'OTHER') && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#00434c] text-[#d6fb00] rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Other Mahal Infrastructure & Community Projects
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Strategic capital welfare works undertaken by the Noor-ul-Huda committee.
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherCommunityProjects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl border border-stone-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-stone-400 mb-1">
                    <span>{proj.category}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{proj.status}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-base leading-snug">{proj.title}</h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{proj.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Raised: <strong className="text-emerald-800">{proj.collectedAmount}</strong></span>
                    <span>Target: <strong>{proj.targetAmount}</strong></span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Lead: {proj.lead}</span>
                    <span>{proj.beneficiaries}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Blood Donor Modal */}
      {showAddDonor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-800 rounded-xl">
                  <Droplet className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">Enlist Emergency Blood Donor</h3>
              </div>
              <button
                onClick={() => setShowAddDonor(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDonorSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Donor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shafeeq Rahiman"
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Blood Group</label>
                  <select
                    value={newDonor.bloodGroup}
                    onChange={(e) => setNewDonor({ ...newDonor, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={newDonor.age}
                    onChange={(e) => setNewDonor({ ...newDonor, age: parseInt(e.target.value) || 25 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98470 XXXXX"
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ward / Mahallu Area</label>
                  <input
                    type="text"
                    value={newDonor.wardNumber}
                    onChange={(e) => setNewDonor({ ...newDonor, wardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDonor(false)}
                  className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
