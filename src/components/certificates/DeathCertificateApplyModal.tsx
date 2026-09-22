import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeathCertificateApplication } from '../../types';
import { X, Send, ShieldCheck, Heart, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface DeathCertificateApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeathCertificateApplyModal: React.FC<DeathCertificateApplyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    currentProfile,
    settings,
    submitDeathCertificateApplication,
  } = useApp();

  const [applicantName, setApplicantName] = useState(currentProfile?.name || currentUser?.name || '');
  const [applicantPhone, setApplicantPhone] = useState(currentProfile?.phone || currentUser?.phone || '');
  const [applicantRelation, setApplicantRelation] = useState<DeathCertificateApplication['applicantRelation']>('SON');
  
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedGender, setDeceasedGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [deceasedAge, setDeceasedAge] = useState<number | ''>('');
  const [deceasedMemberId, setDeceasedMemberId] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState(new Date().toISOString().split('T')[0]);
  const [timeOfDeath, setTimeOfDeath] = useState('06:30 AM');
  const [placeOfDeath, setPlaceOfDeath] = useState('Residence, West Hill, Kozhikode');
  const [causeOfDeath, setCauseOfDeath] = useState('Natural Age-related Demise');
  
  const [burialQabarstan, setBurialQabarstan] = useState(`${settings.mahalName} Central Qabarstan`);
  const [burialDate, setBurialDate] = useState(new Date().toISOString().split('T')[0]);
  const [burialTime, setBurialTime] = useState('02:00 PM (After Dhuhr Prayers)');
  const [qabrNumber, setQabrNumber] = useState('QBR-2026-B12');
  const [doctorHospitalCertificateNo, setDoctorHospitalCertificateNo] = useState('');
  
  const [confirmedDeclaration, setConfirmedDeclaration] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<DeathCertificateApplication | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName || !deceasedAge || !confirmedDeclaration) return;

    const newApp = submitDeathCertificateApplication({
      applicantId: currentProfile?.memberId || currentUser?.id || 'user-member-1',
      applicantName,
      applicantPhone,
      applicantRelation,
      deceasedName,
      deceasedGender,
      deceasedAge: Number(deceasedAge),
      deceasedMemberId: deceasedMemberId || undefined,
      dateOfDeath,
      timeOfDeath,
      placeOfDeath,
      causeOfDeath,
      burialQabarstan,
      burialDate,
      burialTime,
      qabrNumber,
      doctorHospitalCertificateNo: doctorHospitalCertificateNo || undefined,
    });

    setSubmittedApplication(newApp);
  };

  const handleResetAndClose = () => {
    setSubmittedApplication(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#00545f] text-white p-5 flex items-center justify-between border-b border-[#ecffb6]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#003a42] border border-[#d6fb00]/40 flex items-center justify-center text-[#d6fb00]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Death Certificate Application
              </h3>
              <p className="text-xs text-[#ecffb6]">
                മരണ & ഖബറടക്ക സർട്ടിഫിക്കറ്റ് അപേക്ഷ • Official Mahal Registry
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submittedApplication ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full">
                  Application #{submittedApplication.applicationNumber}
                </span>
                <h4 className="font-serif font-bold text-xl text-stone-900 pt-2">
                  Application Submitted to Mahal Committee
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your death certificate application for late <strong>{submittedApplication.deceasedName}</strong> has been registered. Once verified and approved by the Mahal Committee Secretariat, the official signed and sealed certificate will be available to download directly on your member portal.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Deceased:</span>
                  <span className="font-bold text-stone-800">{submittedApplication.deceasedName} ({submittedApplication.deceasedAge} yrs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Burial Qabarstan:</span>
                  <span className="font-bold text-stone-800">{submittedApplication.burialQabarstan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Burial Date:</span>
                  <span className="font-bold text-stone-800">{submittedApplication.burialDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Current Status:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    PENDING ADMIN APPROVAL
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs shadow cursor-pointer transition-all"
                >
                  Return to Member Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Please provide accurate details regarding the deceased and burial rites. This information will be cross-checked with the Mahal Qabarstan burial register before the official digital certificate is approved and issued.
                </p>
              </div>

              {/* Section 1: Applicant Information */}
              <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00545f]" />
                  <span>Applicant Information (അപേക്ഷകന്റെ വിവരങ്ങൾ)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Applicant Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Relation to Deceased</label>
                    <select
                      value={applicantRelation}
                      onChange={(e) => setApplicantRelation(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    >
                      <option value="SON">Son (മകൻ)</option>
                      <option value="DAUGHTER">Daughter (മകൾ)</option>
                      <option value="SPOUSE">Spouse (ഭാര്യ / ഭർത്താവ്)</option>
                      <option value="BROTHER">Brother (സഹോദരൻ)</option>
                      <option value="SISTER">Sister (സഹോദരി)</option>
                      <option value="PARENT">Father / Mother (മാതാപിതാക്കൾ)</option>
                      <option value="GUARDIAN">Guardian / Relative (രക്ഷാകർത്താവ്)</option>
                      <option value="OTHER">Other Kin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Deceased Information */}
              <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#00545f]" />
                  <span>Deceased Information (മരണപ്പെട്ട വ്യക്തിയുടെ വിവരങ്ങൾ)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-semibold mb-1">Full Name of Deceased *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Late K.P. Alavi Haji"
                      value={deceasedName}
                      onChange={(e) => setDeceasedName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Gender *</label>
                    <select
                      value={deceasedGender}
                      onChange={(e) => setDeceasedGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    >
                      <option value="MALE">Male (പുരുഷൻ)</option>
                      <option value="FEMALE">Female (സ്ത്രീ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Age at Death *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="130"
                      placeholder="e.g. 74"
                      value={deceasedAge}
                      onChange={(e) => setDeceasedAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Date of Demise *</label>
                    <input
                      type="date"
                      required
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Time of Demise</label>
                    <input
                      type="text"
                      placeholder="e.g. 05:45 AM"
                      value={timeOfDeath}
                      onChange={(e) => setTimeOfDeath(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-semibold mb-1">Place of Demise *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kozhikode Medical College Hospital / Residence"
                      value={placeOfDeath}
                      onChange={(e) => setPlaceOfDeath(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Cause of Demise</label>
                    <input
                      type="text"
                      placeholder="e.g. Natural Causes / Cardiac"
                      value={causeOfDeath}
                      onChange={(e) => setCauseOfDeath(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Janazah & Burial Rites Details */}
              <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00545f]" />
                  <span>Burial & Qabarstan Records (ഖബറടക്ക വിവരങ്ങൾ)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-semibold mb-1">Burial Qabarstan *</label>
                    <input
                      type="text"
                      required
                      value={burialQabarstan}
                      onChange={(e) => setBurialQabarstan(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Burial Date *</label>
                    <input
                      type="date"
                      required
                      value={burialDate}
                      onChange={(e) => setBurialDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Burial Time & Janazah</label>
                    <input
                      type="text"
                      placeholder="e.g. 02:00 PM (After Dhuhr)"
                      value={burialTime}
                      onChange={(e) => setBurialTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Qabr Registry / Plot No</label>
                    <input
                      type="text"
                      placeholder="e.g. QBR-2026-B12"
                      value={qabrNumber}
                      onChange={(e) => setQabrNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Hospital / Doctor Certificate No (if any)</label>
                    <input
                      type="text"
                      placeholder="e.g. MED-HSP-2026-8841"
                      value={doctorHospitalCertificateNo}
                      onChange={(e) => setDoctorHospitalCertificateNo(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#00545f]"
                    />
                  </div>
                </div>
              </div>

              {/* Solemn Declaration */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-100/80 border border-stone-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={confirmedDeclaration}
                    onChange={(e) => setConfirmedDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-[#00545f] focus:ring-[#00545f]"
                  />
                  <span className="text-[11px] text-stone-700 leading-relaxed font-medium">
                    I solemnly attest that the deceased was a bonafide resident/member of this Mahal community and that the aforementioned burial records are genuine and true.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmedDeclaration || !deceasedName}
                  className="px-6 py-2.5 rounded-xl bg-[#00545f] hover:bg-[#003a42] disabled:opacity-50 disabled:cursor-not-allowed text-[#d6fb00] font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Committee Verification</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
