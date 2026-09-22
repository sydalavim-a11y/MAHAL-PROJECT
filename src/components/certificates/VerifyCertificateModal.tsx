import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';
import {
  X,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  UserCheck,
  Building,
  Calendar,
  Hash,
  ArrowRight,
} from 'lucide-react';

interface VerifyCertificateModalProps {
  onClose: () => void;
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({ onClose }) => {
  const {
    t,
    verifyCertificate,
    setActiveCertificateModal,
    certificates,
    currentProfile,
    profiles,
    families,
  } = useApp();

  // Pick initial certificate: If user is logged in as a member with certificate, use that.
  // Otherwise use the first available certificate in the registry.
  const defaultCert =
    (currentProfile && certificates.find((c) => c.memberId === currentProfile.memberId)) ||
    certificates[0];

  const [certInput, setCertInput] = useState<string>(
    defaultCert ? defaultCert.certificateNumber : 'CERT-MEM-2026-00124'
  );
  const [result, setResult] = useState<Certificate | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // AUTOMATIC LIVE VERIFICATION: Runs immediately whenever certInput, certificates, or profiles change!
  useEffect(() => {
    if (!certInput.trim()) {
      setResult(null);
      return;
    }

    setIsTyping(true);
    const timer = setTimeout(() => {
      const found = verifyCertificate(certInput);
      setResult(found);
      setIsTyping(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [certInput, certificates, profiles, currentProfile]);

  const handleSelectCert = (cert: Certificate) => {
    setCertInput(cert.certificateNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#fafdf2] rounded-3xl shadow-2xl border border-[#ecffb6]/80 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Deep spruce with luminous lime accents */}
        <div className="bg-[#00545f] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#ecffb6]/20 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#d6fb00]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#ecffb6]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-[#003a42] border border-[#d6fb00]/40 flex items-center justify-center text-[#d6fb00] shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  {t.certificates.verifyTitle}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#d6fb00] text-[#00545f] px-2 py-0.5 rounded-full shadow-sm">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#ecffb6] font-medium mt-0.5">
                Official Real-Time Digital Authentication Register
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] transition-colors relative z-10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form & Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Quick Certificate Switcher Chips */}
          <div className="bg-white/80 border border-[#ecffb6] rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#00545f] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d6fb00] fill-[#d6fb00]" />
                <span>Select Issued Certificate (Holder Name Updates Automatically)</span>
              </span>
              <span className="text-[10px] text-[#3d686e] font-semibold">
                {certificates.length} Registered
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-0.5">
              {certificates.map((c) => {
                const liveP = profiles.find((p) => p.memberId === c.memberId);
                const holderName = liveP?.name || c.memberName;
                const isSelected =
                  result?.certificateNumber === c.certificateNumber ||
                  certInput.trim().toUpperCase() === c.certificateNumber.toUpperCase();

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCert(c)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#00545f] text-[#d6fb00] border border-[#d6fb00] shadow-xs font-bold'
                        : 'bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] hover:border-[#d6fb00] hover:bg-[#ecffb6]/30'
                    }`}
                  >
                    <UserCheck className="w-3 h-3 text-[#00545f] shrink-0" />
                    <span className="font-semibold">{holderName}</span>
                    <span className="text-[10px] opacity-75 font-mono">({c.certificateNumber.split('-')[1]})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input with Instant Automatic Look-up */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#00545f] uppercase tracking-wider">
              Search by Certificate No, Holder Name, or Member ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="e.g. CERT-MEM-2026-00124, Ahamed Basheer, or MHL-000124"
                className="w-full pl-4 pr-12 py-3 bg-white border-2 border-[#ecffb6] rounded-2xl text-xs sm:text-sm font-mono font-bold text-[#00545f] placeholder:text-[#3d686e]/60 focus:outline-none focus:border-[#00545f] focus:ring-2 focus:ring-[#d6fb00]/40 transition-all shadow-xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#00545f]">
                {isTyping ? (
                  <div className="w-4 h-4 border-2 border-[#00545f] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-[#00545f]" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-[#3d686e]">
              💡 Typing a certificate number, member name, or ID automatically looks up and displays the certificate holder's name.
            </p>
          </div>

          {/* Automatic Live Verification Result */}
          {result ? (
            <div className="bg-white border-2 border-[#d6fb00] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Status banner */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ecffb6]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ecffb6] text-[#00545f] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5 text-[#00545f]" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#00545f]">
                      Authentic Digital Document Verified
                    </h4>
                    <p className="text-[10px] font-bold text-emerald-800">
                      Cryptographically Validated & Registered in Mahal Jama-ath
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]">
                  ACTIVE & VALID
                </span>
              </div>

              {/* Prominent Certificate Holder Name Card (Changes Automatically) */}
              <div className="bg-[#fafdf2] border border-[#ecffb6] rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d686e]">
                    Certificate Holder / Recipient
                  </span>
                  <span className="text-[9px] font-bold bg-[#d6fb00] text-[#00545f] px-2 py-0.5 rounded-md">
                    Auto-Synced with Civil Registry
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-[#00545f] mt-1 tracking-tight">
                  {result.memberName}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#00545f] font-semibold">
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-[#ecffb6] flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3 h-3 text-[#00545f]" />
                    <span>Member ID: {result.memberId}</span>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-[#ecffb6] flex items-center gap-1 text-[11px]">
                    <Building className="w-3 h-3 text-[#00545f]" />
                    <span>Family ID: {result.familyId}</span>
                  </span>
                  {result.details?.HouseName && (
                    <span className="bg-white px-2 py-0.5 rounded-lg border border-[#ecffb6] text-[11px]">
                      House: {result.details.HouseName}
                    </span>
                  )}
                </div>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#fafdf2] p-3 rounded-xl border border-[#ecffb6]">
                  <span className="text-[10px] text-[#3d686e] font-bold uppercase tracking-wider block">
                    Certificate Type & Title
                  </span>
                  <p className="font-bold text-[#00545f] mt-0.5">{result.title}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold text-[#00545f] bg-white px-2 py-0.5 rounded border border-[#ecffb6]">
                    {result.certificateNumber}
                  </span>
                </div>

                <div className="bg-[#fafdf2] p-3 rounded-xl border border-[#ecffb6]">
                  <span className="text-[10px] text-[#3d686e] font-bold uppercase tracking-wider block">
                    Issuance & Validity
                  </span>
                  <p className="font-bold text-[#00545f] mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#00545f]" />
                    <span>Issued: {result.issueDate}</span>
                  </p>
                  <p className="text-[11px] text-[#3d686e] mt-0.5">
                    Valid Until: {result.validUntil || 'Lifetime / Active Record'}
                  </p>
                </div>

                <div className="sm:col-span-2 bg-[#00545f] text-white p-3 rounded-xl border border-[#ecffb6]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#ecffb6] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Hash className="w-3 h-3 text-[#d6fb00]" />
                      Cryptographic Hash
                    </span>
                    <p className="font-mono text-xs text-white break-all font-semibold mt-0.5">
                      {result.verificationHash}
                    </p>
                  </div>
                  <div className="text-right sm:shrink-0 text-[10px] text-[#ecffb6]">
                    <span>Authority: {result.issuedBy.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* View Full Document Action Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveCertificateModal(result);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#d6fb00]" />
                <span>View & Print Official Digital Certificate</span>
                <ArrowRight className="w-4 h-4 text-[#ecffb6]" />
              </button>
            </div>
          ) : certInput.trim() ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Certificate Not Found</p>
                <p className="text-stone-600 mt-1 leading-relaxed">
                  No registered certificate matching <strong>"{certInput}"</strong> was found in the official records.
                  You can select one of the registered certificates from the quick list above or verify the spelling.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#ecffb6] flex items-center justify-between">
          <div className="text-[11px] text-[#3d686e]">
            Official Registry • Noor-ul-Huda Mahal
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#00545f] bg-[#fafdf2] border border-[#ecffb6] rounded-xl hover:bg-[#ecffb6]/40 cursor-pointer transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
