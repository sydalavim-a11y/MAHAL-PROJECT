import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, FileText, CheckCircle2, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

export const PublicNikahInfo: React.FC = () => {
  const { t, setOpenNikahModal, settings } = useApp();

  const requirements = [
    {
      title: 'Mahal Clearance Certificate (NOC)',
      desc: 'Both Bride and Groom must produce an active clearance certificate from their respective Mahal Jama-aths verifying good standing.',
    },
    {
      title: 'Identity & Age Proof',
      desc: 'Official government identification (Aadhaar / Passport / Voter ID) establishing legal marriage age (Groom 21+, Bride 18+).',
    },
    {
      title: 'Wali (Guardian) Consent',
      desc: 'Written or physical presence of the Shariah Wali (Father, Paternal Grandfather, or legitimate blood relative) along with phone verification.',
    },
    {
      title: 'Pre-Marital Counseling Certificate',
      desc: 'Certificate of completion from recognized State/District Islamic Pre-marital counseling programs.',
    },
    {
      title: 'Two Trustworthy Witnesses',
      desc: 'Names, contact details, and identities of two reliable adult Muslim male witnesses (ശാഹീദുകൾ).',
    },
    {
      title: 'Notice Period',
      desc: 'Notice of intended marriage must be submitted at least 14 days prior to solemnization for Mahal register publication.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner with Spruce & Lime */}
      <div className="bg-[#00545f] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#ecffb6]/30 text-center space-y-4">
        <div className="w-16 h-16 bg-[#d6fb00] text-[#00545f] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Heart className="w-8 h-8 fill-[#00545f]" />
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight">
          {t.nikah.title}
        </h1>
        <p className="text-xs sm:text-sm font-malayalam font-bold text-[#d6fb00]">
          വിവാഹ രജിസ്ട്രേഷൻ മാർഗ്ഗനിർദ്ദേശങ്ങൾ & ഓൺലൈൻ അപേക്ഷ
        </p>
        <p className="text-xs sm:text-sm text-[#ecffb6] max-w-2xl mx-auto leading-relaxed font-medium">
          {settings.mahalName} facilitates seamless, dignified, and Shariah-compliant Nikah registration with digital archival and immediate bilingual certification.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setOpenNikahModal(true)}
            className="px-8 py-3.5 bg-[#d6fb00] hover:bg-[#c2e400] text-[#00545f] font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-transform hover:scale-105 cursor-pointer"
          >
            Start 8-Step Nikah Application Online
          </button>
        </div>
      </div>

      {/* 8-Step Procedure Overview */}
      <div className="bg-white rounded-3xl border border-[#ecffb6] p-8 shadow-xs space-y-6">
        <div className="border-b border-[#ecffb6] pb-4">
          <h2 className="font-serif font-black text-xl text-[#00545f]">
            Nikah Registration Process (ഘട്ടങ്ങൾ)
          </h2>
          <p className="text-xs text-[#557277] mt-1 font-medium">
            Complete digital progression from online application to official certificate issuance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#00545f] text-[#d6fb00] font-black flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-bold text-[#00545f]">Online Submission</h4>
            <p className="text-[#3d686e] leading-snug">Fill applicant, bride, groom, wali credentials and proposed date.</p>
          </div>

          <div className="p-5 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#00545f] text-[#d6fb00] font-black flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-[#00545f]">Document Verification</h4>
            <p className="text-[#3d686e] leading-snug">Mahal desk verifies NOCs and Aadhaar credentials.</p>
          </div>

          <div className="p-5 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#00545f] text-[#d6fb00] font-black flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-[#00545f]">Chief Qazi Approval</h4>
            <p className="text-[#3d686e] leading-snug">Chief Qazi sanctions solemnization and registers notice in Mahal bulletin.</p>
          </div>

          <div className="p-5 bg-[#fafdf2] border border-[#ecffb6] rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#00545f] text-[#d6fb00] font-black flex items-center justify-center text-xs">
              4
            </span>
            <h4 className="font-bold text-[#00545f]">Solemnization & Cert</h4>
            <p className="text-[#3d686e] leading-snug">Solemnization at Masjid. Digital Certificate instantly available with live holder sync.</p>
          </div>
        </div>
      </div>

      {/* Mandatory Requirements Checklist */}
      <div className="bg-white rounded-3xl border border-[#ecffb6] p-8 shadow-xs space-y-6">
        <h2 className="font-serif font-black text-xl text-[#00545f]">
          Checklist of Mandatory Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#ecffb6] bg-[#fafdf2] space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <h4 className="font-bold text-sm text-[#00545f]">{req.title}</h4>
              </div>
              <p className="text-xs text-[#3d686e] leading-relaxed pl-6 font-medium">
                {req.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
