import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FamilyView } from './FamilyView';
import { MemberIncomeTransparency } from './MemberIncomeTransparency';
import { DeathCertificateApplyModal } from '../certificates/DeathCertificateApplyModal';
import {
  User,
  CreditCard,
  Heart,
  HeartHandshake,
  Award,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Download,
  Eye,
  ShieldCheck,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const {
    t,
    currentUser,
    currentProfile,
    currentFamily,
    payments,
    receipts,
    nikahApplications,
    welfareApplications,
    zakahApplications,
    certificates,
    setActivePaymentModal,
    setActiveReceiptModal,
    setActiveCertificateModal,
    generateCertificate,
    setOpenNikahModal,
    setOpenWelfareModal,
    setOpenZakahModal,
    setOpenEnquiryModal,
    setActiveTab,
    settings,
    deathCertificateApplications,
    openDeathCertModal,
    setOpenDeathCertModal,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'CONTRIBUTIONS' | 'FAMILY' | 'NIKAH' | 'WELFARE_ZAKAH' | 'CERTIFICATES'
  >('CONTRIBUTIONS');

  // Filter items for current member strictly
  const memberId = currentProfile?.memberId || currentUser?.memberId || 'MHL-000124';
  const memberName = currentProfile?.name || currentUser?.name || 'Mahal Member';
  const memberPayments = payments.filter((p) => p.memberId === memberId);
  const pendingPayments = memberPayments.filter((p) => p.status === 'PENDING');
  const memberReceipts = receipts.filter((r) => r.memberId === memberId);
  const memberNikah = nikahApplications.filter((n) => n.applicantId === memberId);
  const memberWelfare = welfareApplications.filter((w) => w.memberId === memberId);
  const memberZakah = zakahApplications.filter((z) => z.memberId === memberId);
  const memberCertificates = certificates.filter((c) => c.memberId === memberId);
  const memberDeathApps = (deathCertificateApplications || []).filter(
    (d) => d.applicantId === memberId || d.applicantPhone === currentUser?.phone
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
      {/* 1. Member Profile & Community Identity Card */}
      <div className="bg-gradient-to-r from-[#00545f] via-[#004752] to-[#003a42] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#ecffb6]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#d6fb00]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start sm:items-center gap-5 sm:gap-7">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#d6fb00] text-[#00545f] flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-xl border-2 border-white/40 shrink-0">
              {memberName.charAt(0) || 'M'}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                  {memberName}
                </h1>
                <span className="bg-[#ecffb6] text-[#00545f] border border-[#d6fb00] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Verified Mahal Constituent
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#ecffb6] font-medium pt-0.5">
                <span>
                  Member ID: <strong className="text-white font-mono">{memberId}</strong>
                </span>
                <span>•</span>
                <span>
                  Family ID: <strong className="text-white font-mono">{currentProfile?.familyId || 'FAM-00042'}</strong>
                </span>
                <span>•</span>
                <span>
                  House: <strong className="text-white">{currentFamily?.houseName || 'Baitul Aman'}</strong>
                </span>
              </div>

              <p className="text-xs text-[#ecffb6]/80 pt-0.5">
                {settings.mahalName} • Member since {currentProfile?.membershipDate?.substring(0, 4) || '2022'}
              </p>
            </div>
          </div>

          {/* Dues & Standing Card */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#003a42]/90 border border-[#ecffb6]/30 px-5 py-4 rounded-2xl text-xs space-y-1 shadow-md">
              <span className="text-[#d6fb00] text-[11px] uppercase font-bold tracking-wider">
                Monthly Contribution Standing
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                {pendingPayments.length > 0 ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d6fb00] animate-pulse" />
                    <span className="font-bold text-[#ecffb6] text-sm">
                      ₹{pendingPayments[0].amount} Pending ({pendingPayments[0].monthName})
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#d6fb00]" />
                    <span className="font-bold text-[#ecffb6] text-sm">All Dues Settled (PAID)</span>
                  </>
                )}
              </div>
            </div>

            {pendingPayments.length > 0 && (
              <button
                id="member-quick-pay-btn"
                onClick={() => setActivePaymentModal(pendingPayments[0])}
                className="px-6 py-4 bg-[#d6fb00] hover:bg-[#c5ea00] text-[#00545f] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#00545f]" />
                <span>Pay ₹{pendingPayments[0].amount}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Pills Strip */}
        <div className="mt-8 pt-6 border-t border-[#ecffb6]/20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => setOpenNikahModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <Heart className="w-4 h-4 text-rose-300" />
            <span>Apply Nikah</span>
          </button>

          <button
            onClick={() => setOpenWelfareModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <HeartHandshake className="w-4 h-4 text-[#d6fb00]" />
            <span>Welfare Aid</span>
          </button>

          <button
            onClick={() => setOpenZakahModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <ShieldCheck className="w-4 h-4 text-[#ecffb6]" />
            <span>Zakah Fund</span>
          </button>

          <button
            onClick={() => {
              const cert = generateCertificate('MEMBERSHIP', memberId);
              setActiveCertificateModal(cert);
            }}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <Award className="w-4 h-4 text-[#d6fb00]" />
            <span>Get Certificate</span>
          </button>

          <button
            onClick={() => setOpenEnquiryModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <FileText className="w-4 h-4 text-blue-200" />
            <span>Submit Enquiry</span>
          </button>

          <button
            onClick={() => setOpenDeathCertModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold cursor-pointer hover:shadow"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Death Cert</span>
          </button>

          <button
            onClick={() => setActiveTab('ask-mahal')}
            className="flex items-center justify-center gap-2 p-3 bg-[#d6fb00] text-[#00545f] hover:bg-[#c5ea00] rounded-xl transition-all font-black shadow-md cursor-pointer hover:scale-102"
          >
            <Sparkles className="w-4 h-4 text-[#00545f]" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. Monthly Financial Inflows & Outflows Transparency (Masjid & Madrasa) */}
      <MemberIncomeTransparency />

      {/* 2b. High-Visibility Official Applications & Certificates Desk */}
      <div className="bg-gradient-to-r from-[#00434c] to-[#00545f] rounded-3xl p-6 text-white shadow-md border border-[#ecffb6]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#d6fb00] text-[#00434c] px-2.5 py-0.5 rounded-full">
                CIVIL & REGISTRATION DESK
              </span>
              <span className="text-xs text-[#ecffb6]">Mahal Official Services</span>
            </div>
            <h3 className="text-xl font-serif font-black text-white mt-1">
              Official Certificates & Applications Desk
            </h3>
            <p className="text-xs text-[#ecffb6]/90 max-w-xl">
              Submit authenticated applications for Death & Burial certificates, Marital (Nikah) registration, or download previously approved digital certificates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Death Certificate Card */}
          <div className="bg-[#00363d]/80 rounded-2xl p-5 border border-amber-300/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">
                  BURIAL & DEATH REGISTRY
                </span>
                <span className="text-xs text-[#ecffb6] font-mono">
                  {memberDeathApps.length} Application{memberDeathApps.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-white mt-2">
                Death & Burial Certificate (മരണ സർട്ടിഫിക്കറ്റ്)
              </h4>
              <p className="text-xs text-[#ecffb6]/80 mt-1 leading-relaxed">
                Apply for official death & burial register authentication signed by the Mahal Secretary. Used for hospital, legal, and inheritance matters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setOpenDeathCertModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Death Certificate</span>
              </button>

              {memberDeathApps.some((a) => a.status === 'APPROVED' || a.status === 'CERTIFICATE_ISSUED') ? (
                <button
                  onClick={() => {
                    const approved = memberDeathApps.find((a) => a.status === 'APPROVED' || a.status === 'CERTIFICATE_ISSUED');
                    if (approved) {
                      const issuedCert = certificates.find((c) => c.certificateNumber === approved.certificateNumber) || {
                        id: `cert-${approved.id}`,
                        certificateNumber: approved.certificateNumber || `DTH-${new Date().getFullYear()}-001`,
                        type: 'DEATH' as const,
                        memberName: approved.deceasedName,
                        memberId: approved.deceasedMemberId || memberId,
                        familyId: currentProfile?.familyId || 'FAM-00042',
                        issueDate: new Date().toISOString().split('T')[0],
                        verificationHash: `VRF-DTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                        title: 'Official Death & Burial Register Certificate',
                        details: {
                          DeceasedName: approved.deceasedName,
                          DateOfDeath: approved.dateOfDeath,
                          BurialQabarstan: approved.burialQabarstan,
                          BurialDate: approved.burialDate,
                          ApplicantKin: `${approved.applicantName} (${approved.applicantRelation})`,
                        },
                      };
                      setActiveCertificateModal(issuedCert as any);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Death Certificate</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveSubTab('CERTIFICATES')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#ecffb6] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  View Status
                </button>
              )}
            </div>
          </div>

          {/* Marital Certificate Card */}
          <div className="bg-[#00363d]/80 rounded-2xl p-5 border border-rose-300/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-400/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-400/30">
                  SHARIAH MARITAL REGISTRY
                </span>
                <span className="text-xs text-[#ecffb6] font-mono">
                  {memberNikah.length} Application{memberNikah.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-white mt-2">
                Marital & Nikah Certificate (വിവാഹ സർട്ടിഫിക്കറ്റ്)
              </h4>
              <p className="text-xs text-[#ecffb6]/80 mt-1 leading-relaxed">
                Apply for official Nikah registration or download authenticated marriage certificate authenticated by Chief Qazi & Mahal Secretariat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setOpenNikahModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Marital Certificate</span>
              </button>

              <button
                onClick={() => {
                  const cert = generateCertificate('NIKAH', memberId);
                  setActiveCertificateModal(cert);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Marital Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-tab Navigation */}
      <div className="flex border-b border-[#00545f]/15 overflow-x-auto space-x-2 sm:space-x-6 text-xs sm:text-sm font-semibold pb-1">
        <button
          onClick={() => setActiveSubTab('CONTRIBUTIONS')}
          className={`pb-4 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'CONTRIBUTIONS'
              ? 'border-[#00545f] text-[#00545f] font-black'
              : 'border-transparent text-stone-500 hover:text-[#00545f]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Contributions & Receipts ({memberPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('FAMILY')}
          className={`pb-4 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'FAMILY'
              ? 'border-[#00545f] text-[#00545f] font-black'
              : 'border-transparent text-stone-500 hover:text-[#00545f]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Family Register</span>
        </button>

        <button
          onClick={() => setActiveSubTab('NIKAH')}
          className={`pb-4 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'NIKAH'
              ? 'border-[#00545f] text-[#00545f] font-black'
              : 'border-transparent text-stone-500 hover:text-[#00545f]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Nikah Applications ({memberNikah.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('WELFARE_ZAKAH')}
          className={`pb-4 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'WELFARE_ZAKAH'
              ? 'border-[#00545f] text-[#00545f] font-black'
              : 'border-transparent text-stone-500 hover:text-[#00545f]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Welfare & Zakah ({memberWelfare.length + memberZakah.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('CERTIFICATES')}
          className={`pb-4 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'CERTIFICATES'
              ? 'border-[#00545f] text-[#00545f] font-black'
              : 'border-transparent text-stone-500 hover:text-[#00545f]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Digital Certificates ({memberCertificates.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents with Spacious Cards & Padding */}

      {/* TAB 1: CONTRIBUTIONS & RECEIPTS */}
      {activeSubTab === 'CONTRIBUTIONS' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Monthly Mahal Contribution Ledger (മാസവരി ചരിത്രം)
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Member: <strong className="text-[#00545f]">{memberName}</strong> ({memberId}) • Standard fixed monthly contribution: ₹{currentProfile?.monthlyContribution || 1000}/month
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-[#fafdf2] text-[#00545f] font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6">Period</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Due Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Receipt / Transaction</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {memberPayments.map((p) => {
                    const matchedReceipt = memberReceipts.find(
                      (r) => r.paymentId === p.id || r.receiptNumber === p.receiptNumber
                    );

                    return (
                      <tr key={p.id} className="hover:bg-[#fafdf2]/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-stone-900">{p.monthName}</td>
                        <td className="py-4 px-6 font-semibold text-stone-800">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 text-stone-500">{p.dueDate}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              p.status === 'PAID'
                                ? 'bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-stone-600">
                          {p.receiptNumber || '—'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {p.status === 'PAID' ? (
                            <button
                              onClick={() => {
                                if (matchedReceipt) {
                                  setActiveReceiptModal(matchedReceipt);
                                } else {
                                  setActiveReceiptModal({
                                    receiptNumber: p.receiptNumber || `RCT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                                    paymentId: p.id,
                                    memberId: p.memberId,
                                    memberName: memberName,
                                    familyId: p.familyId,
                                    mahalName: settings.mahalName,
                                    monthName: p.monthName,
                                    amount: p.amount,
                                    paymentDate: p.paidDate || '2026-08-04',
                                    paymentMethod: p.paymentMethod || 'UPI',
                                    transactionId: p.transactionId || 'TXN-UPI-8849102',
                                    status: 'VERIFIED',
                                    signatureOfficer: `${settings.secretaryName} (General Secretary)`,
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-[#00545f] hover:text-black font-bold bg-[#ecffb6] hover:bg-[#d6fb00] px-4 py-2 rounded-xl border border-[#d6fb00] transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setActivePaymentModal(p)}
                              className="inline-flex items-center gap-1.5 text-xs text-[#00545f] font-black bg-[#d6fb00] hover:bg-[#c5ea00] px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
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

      {/* TAB 2: FAMILY REGISTER */}
      {activeSubTab === 'FAMILY' && <FamilyView />}

      {/* TAB 3: NIKAH APPLICATIONS */}
      {activeSubTab === 'NIKAH' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Marriage Registration Registry (നിക്കാഹ് അപേക്ഷകൾ)
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Track verification pipeline, solemnization certificate, and schedule
              </p>
            </div>
            <button
              onClick={() => setOpenNikahModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs sm:text-sm rounded-2xl shadow transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Nikah</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberNikah.length === 0 ? (
              <div className="col-span-2 p-10 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-stone-500">
                No active Nikah applications registered for {memberName}.
              </div>
            ) : (
              memberNikah.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-[#00545f] font-bold bg-[#ecffb6] px-2.5 py-1 rounded border border-[#d6fb00]">
                        {app.applicationNumber}
                      </span>
                      <h4 className="font-bold text-stone-900 text-base mt-2">
                        {app.brideName} & {app.groomName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] px-3 py-1 rounded-full border border-[#d6fb00]">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 bg-[#fafdf2] p-4 rounded-2xl border border-stone-100">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase">Scheduled Date</span>
                      <p className="font-semibold text-stone-800">{app.proposedDate}</p>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase">Time & Venue</span>
                      <p className="font-semibold text-stone-800 truncate">{app.proposedTime}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 text-[10px] uppercase">Venue</span>
                      <p className="font-medium text-stone-800">{app.venue}</p>
                    </div>
                  </div>

                  {app.adminNotes && (
                    <div className="text-[11px] text-stone-600 bg-amber-50 p-3 rounded-xl border border-amber-200/60">
                      <strong>Admin Note:</strong> {app.adminNotes}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        const cert = generateCertificate('NIKAH', memberId);
                        setActiveCertificateModal(cert);
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#00545f] hover:text-black font-bold bg-[#ecffb6] hover:bg-[#d6fb00] px-4 py-2 rounded-xl border border-[#d6fb00] cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Nikah Certificate</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WELFARE & ZAKAH */}
      {activeSubTab === 'WELFARE_ZAKAH' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Welfare & Zakah Submissions (റിലീഫ് & സകാത്ത്)
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Discretionary assistance, medical grants, and Shariah Zakah distribution
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenWelfareModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply Welfare</span>
              </button>
              <button
                onClick={() => setOpenZakahModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#003a42] hover:bg-[#00272c] text-[#ecffb6] font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply Zakah</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberWelfare.length === 0 && memberZakah.length === 0 && (
              <div className="col-span-2 p-10 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-stone-500">
                No active relief or zakah submissions recorded for {memberName}.
              </div>
            )}

            {memberWelfare.map((w) => (
              <div key={w.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-stone-500 font-semibold">{w.applicationNumber}</span>
                    <h4 className="font-bold text-base text-stone-900 mt-1">{w.category} Relief Aid</h4>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#ecffb6] text-[#00545f] uppercase border border-[#d6fb00]">
                    {w.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-[#fafdf2] p-3.5 rounded-2xl border border-stone-100">
                  {w.description}
                </p>
                <div className="flex justify-between text-xs sm:text-sm text-stone-700 pt-1">
                  <span>Requested: <strong>₹{w.amountRequested}</strong></span>
                  {w.amountApproved && (
                    <span className="text-[#00545f] font-bold">Approved: ₹{w.amountApproved}</span>
                  )}
                </div>
              </div>
            ))}

            {memberZakah.map((z) => (
              <div key={z.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-stone-500 font-semibold">{z.applicationNumber}</span>
                    <h4 className="font-bold text-base text-stone-900 mt-1">Zakah Support ({z.category})</h4>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 uppercase border border-amber-300">
                    {z.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-[#fafdf2] p-3.5 rounded-2xl border border-stone-100">
                  {z.financialSituation}
                </p>
                <div className="flex justify-between text-xs sm:text-sm text-stone-700 pt-1">
                  <span>Assessed Need: <strong>₹{z.amountNeeded}</strong></span>
                  {z.amountDistributed && (
                    <span className="text-[#00545f] font-bold">Disbursed: ₹{z.amountDistributed}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DIGITAL CERTIFICATES */}
      {activeSubTab === 'CERTIFICATES' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Official Digital Certificates Repository
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Instantly generate and download signed & QR-verified credentials for <strong className="text-[#00545f]">{memberName}</strong>
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  const c = generateCertificate('MEMBERSHIP', memberId);
                  setActiveCertificateModal(c);
                }}
                className="px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                + Membership Cert
              </button>
              <button
                onClick={() => {
                  const c = generateCertificate('FAMILY', memberId);
                  setActiveCertificateModal(c);
                }}
                className="px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                + Family Cert
              </button>
              <button
                onClick={() => {
                  const c = generateCertificate('RESIDENCE', memberId);
                  setActiveCertificateModal(c);
                }}
                className="px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                + Residence Cert
              </button>
              <button
                onClick={() => setOpenDeathCertModal(true)}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-200" />
                <span>+ Apply Death Cert</span>
              </button>
              <button
                onClick={() => setOpenNikahModal(true)}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-rose-200" />
                <span>+ Apply Marital Cert</span>
              </button>
              <button
                onClick={() => {
                  const c = generateCertificate('NIKAH', memberId);
                  setActiveCertificateModal(c);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span>Download Marital Cert</span>
              </button>
            </div>
          </div>

          {/* Dedicated Death & Burial Certificates Flow */}
          <div className="bg-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Civil & Burial Registry
                </span>
                <h4 className="font-serif font-bold text-lg text-amber-950 mt-1">
                  Death & Burial Certificates (മരണ & ഖബറടക്ക സർട്ടിഫിക്കറ്റ്)
                </h4>
                <p className="text-xs text-amber-800/80">
                  Official certificates issued by Mahal Committee for hospital records, legal affairs, insurance, and family archives.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setOpenDeathCertModal(true)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-amber-100 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Death Certificate Application</span>
                </button>
                <button
                  onClick={() => setOpenNikahModal(true)}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Apply for Marital / Nikah Certificate"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-200" />
                  <span>Apply Marital Cert</span>
                </button>
              </div>
            </div>

            {memberDeathApps.length === 0 ? (
              <div className="bg-white/80 rounded-2xl border border-amber-200/60 p-6 text-center text-xs text-amber-800 space-y-1">
                <p className="font-semibold">No death certificate applications submitted under this account.</p>
                <p className="text-amber-600 text-[11px]">
                  In the event of a demise in the family, submit details here to request an official authenticated certificate.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberDeathApps.map((app) => {
                  const issuedCert = app.certificateNumber
                    ? certificates.find((c) => c.certificateNumber === app.certificateNumber || c.details.certificateNumber === app.certificateNumber)
                    : null;

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {app.applicationNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED'
                              ? 'APPROVED & ISSUED'
                              : app.status === 'REJECTED'
                              ? 'REJECTED'
                              : 'UNDER COMMITTEE VERIFICATION'}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-serif font-bold text-base text-stone-900">
                            Late {app.deceasedName}
                          </h5>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Age: {app.deceasedAge} • Demise Date: <strong>{app.dateOfDeath}</strong>
                          </p>
                          <p className="text-xs text-stone-600 mt-1">
                            Burial: <strong>{app.burialQabarstan}</strong> ({app.burialDate})
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        {app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED' ? (
                          <div className="w-full flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[11px] font-mono text-emerald-700 font-bold">
                              #{app.certificateNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setOpenNikahModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] border border-[#d6fb00]/40 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                                title="Apply for Marital / Nikah Certificate"
                              >
                                <Heart className="w-3.5 h-3.5 text-[#d6fb00]" />
                                <span>Apply Marital Cert</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (issuedCert) {
                                    setActiveCertificateModal(issuedCert);
                                  } else {
                                    // Fallback: Generate certificate representation
                                    const fallbackCert = {
                                      id: `cert-${app.id}`,
                                      certificateNumber: app.certificateNumber || `CERT-DTH-2026-${app.id}`,
                                      type: 'DEATH' as const,
                                      title: 'OFFICIAL MAHAL DEATH & BURIAL CERTIFICATE',
                                      memberId: app.applicantId,
                                      memberName: app.applicantName,
                                      familyId: currentProfile?.familyId || 'FAM-00042',
                                      mahalName: settings.mahalName,
                                      issueDate: app.approvedAt ? app.approvedAt.split('T')[0] : '2026-09-20',
                                      issuedBy: `${settings.secretaryName} (General Secretary)`,
                                      verificationHash: `DTH-VER-${app.applicationNumber}`,
                                      details: {
                                        DeceasedName: `Late ${app.deceasedName}`,
                                        AgeAtDeath: app.deceasedAge,
                                        DateOfDeath: app.dateOfDeath,
                                        BurialQabarstan: app.burialQabarstan,
                                        BurialDate: app.burialDate,
                                        ApplicantKin: `${app.applicantName} (${app.applicantRelation})`,
                                      },
                                    };
                                    setActiveCertificateModal(fallbackCert);
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Download Certificate</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 flex-wrap w-full">
                            <p className="text-[11px] text-stone-500 italic">
                              {app.status === 'REJECTED'
                                ? `Note: ${app.adminNotes || 'Contact office for clarification.'}`
                                : 'Pending committee verification with Qabarstan registry.'}
                            </p>
                            <button
                              onClick={() => setOpenNikahModal(true)}
                              className="flex items-center gap-1 px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                              title="Apply for Marital / Nikah Certificate"
                            >
                              <Heart className="w-3 h-3 text-rose-500" />
                              <span>Apply Marital Cert</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dedicated Marital (Nikah) Certificates Flow */}
          <div className="bg-rose-50/50 rounded-3xl border border-rose-200/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                  Matrimonial & Civil Shariah Register
                </span>
                <h4 className="font-serif font-bold text-lg text-rose-950 mt-1">
                  Marital & Nikah Certificates (വിവാഹ സർട്ടിഫിക്കറ്റ്)
                </h4>
                <p className="text-xs text-rose-800/80">
                  Official authenticated marriage certificates signed by Mahal Chief Qazi & General Secretary for passport, visa, family visa, and government registration.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setOpenNikahModal(true)}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-rose-100 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Marital Certificate Application</span>
                </button>
                <button
                  onClick={() => {
                    const c = generateCertificate('NIKAH', memberId);
                    setActiveCertificateModal(c);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Marital Certificate</span>
                </button>
              </div>
            </div>

            {memberNikah.length === 0 ? (
              <div className="bg-white/80 rounded-2xl border border-rose-200/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-800">
                <div className="space-y-1">
                  <p className="font-semibold">Ready to apply or download your Mahal Marital Certificate?</p>
                  <p className="text-rose-600 text-[11px]">
                    Submit your Nikah details for committee seal or instantly download your verified certificate.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenNikahModal(true)}
                    className="px-3.5 py-2 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => {
                      const c = generateCertificate('NIKAH', memberId);
                      setActiveCertificateModal(c);
                    }}
                    className="px-3.5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberNikah.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-rose-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {app.applicationNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            app.status === 'COMPLETED' || app.status === 'CERTIFICATE_AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-serif font-bold text-base text-stone-900">
                          {app.brideName} & {app.groomName}
                        </h5>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Date: <strong>{app.proposedDate}</strong> • Time: {app.proposedTime}
                        </p>
                        <p className="text-xs text-stone-600 mt-1 truncate">
                          Venue: <strong>{app.venue}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const cert = generateCertificate('NIKAH', memberId);
                          setActiveCertificateModal(cert);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Download Marital Certificate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] px-2.5 py-1 rounded border border-[#d6fb00]">
                      {cert.type}
                    </span>
                    <span className="font-mono text-[11px] text-stone-400">{cert.issueDate}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-stone-900">{cert.title}</h4>
                  <p className="font-mono text-xs text-[#00545f] font-bold mt-1.5">
                    {cert.certificateNumber}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    Holder: <strong className="text-stone-900">{memberName}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono truncate max-w-[120px]">
                    {cert.verificationHash}
                  </span>
                  <button
                    onClick={() => setActiveCertificateModal(cert)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View & Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Death Certificate Application Modal */}
      <DeathCertificateApplyModal
        isOpen={openDeathCertModal}
        onClose={() => setOpenDeathCertModal(false)}
      />
    </div>
  );
};
