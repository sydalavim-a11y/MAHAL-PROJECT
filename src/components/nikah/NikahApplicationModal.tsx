import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Upload,
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  Heart,
  AlertCircle,
} from 'lucide-react';

interface NikahApplicationModalProps {
  onClose: () => void;
}

export const NikahApplicationModal: React.FC<NikahApplicationModalProps> = ({ onClose }) => {
  const { t, submitNikahApplication, currentProfile, settings } = useApp();
  const [step, setStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    applicantRelation: 'GUARDIAN' as 'GUARDIAN' | 'GROOM' | 'BRIDE',
    applicantName: currentProfile?.name || 'Ahamed Basheer',
    applicantPhone: currentProfile?.phone || '+91 98460 11223',
    // Bride
    brideName: 'Fathima Safa Binte Basheer',
    brideAge: 24,
    brideDob: '2002-06-25',
    brideAddress: currentProfile?.address || 'Baitul Noor, Mosque Lane, West Hill, Kozhikode',
    brideMahal: settings.mahalName,
    brideFatherName: currentProfile?.name || 'Ahamed Basheer',
    brideMotherName: 'Fathima Zeenath',
    brideOccupation: 'Civil Engineer',
    bridePhone: '+91 98460 11228',
    // Groom
    groomName: 'Sayyid Adil Hashim',
    groomAge: 27,
    groomDob: '1999-03-12',
    groomAddress: 'Hashim Villa, Kondotty, Malappuram',
    groomMahal: 'Kondotty Markaz Mahal Jama-ath',
    groomFatherName: 'Sayyid Hashim Thangal',
    groomMotherName: 'Sharifa Ummu Kulsum',
    groomOccupation: 'Software Architect',
    groomPhone: '+91 97451 22334',
    // Wali
    waliName: currentProfile?.name || 'Ahamed Basheer',
    waliRelation: 'Father (പിതാവ്)',
    waliPhone: currentProfile?.phone || '+91 98460 11223',
    // Schedule
    proposedDate: '2026-10-18',
    proposedTime: '11:30 AM (After Dhuhr)',
    venue: 'Noor-ul-Huda Community Auditorium, West Hill',
    // Documents
    uploadedDocs: [
      { name: 'Bride Identity & Mahal NOC', status: 'UPLOADED (PDF)' },
      { name: 'Groom Mahal Clearance Certificate', status: 'UPLOADED (PDF)' },
      { name: 'Aadhaar Cards of Groom & Bride', status: 'UPLOADED (PDF)' },
      { name: 'Pre-Marital Course Completion Certificate', status: 'UPLOADED (PDF)' },
    ],
  });

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitNikahApplication({
      applicantId: currentProfile?.memberId || 'MHL-000124',
      applicantName: formData.applicantName,
      applicantPhone: formData.applicantPhone,
      applicantRelation: formData.applicantRelation,
      groomName: formData.groomName,
      groomAge: Number(formData.groomAge),
      groomDob: formData.groomDob,
      groomAddress: formData.groomAddress,
      groomMahal: formData.groomMahal,
      groomFatherName: formData.groomFatherName,
      groomMotherName: formData.groomMotherName,
      groomOccupation: formData.groomOccupation,
      groomPhone: formData.groomPhone,
      brideName: formData.brideName,
      brideAge: Number(formData.brideAge),
      brideDob: formData.brideDob,
      brideAddress: formData.brideAddress,
      brideMahal: formData.brideMahal,
      brideFatherName: formData.brideFatherName,
      brideMotherName: formData.brideMotherName,
      brideOccupation: formData.brideOccupation,
      bridePhone: formData.bridePhone,
      waliName: formData.waliName,
      waliRelation: formData.waliRelation,
      waliPhone: formData.waliPhone,
      proposedDate: formData.proposedDate,
      proposedTime: formData.proposedTime,
      venue: formData.venue,
      documents: formData.uploadedDocs.map((d) => ({
        name: d.name,
        type: 'PDF',
        verified: false,
      })),
    });
    setSubmittedApp(app);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-[#C9A227]" />
            <div>
              <h3 className="font-bold text-base">{t.nikah.title}</h3>
              <p className="text-xs text-emerald-200">Official Marriage Registration Wizard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (8 Steps) */}
        {!submittedApp && (
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-1.5">
              <span>
                Step {step} of 8:{' '}
                <strong className="text-[#0B3D2E]">
                  {step === 1 && t.nikah.step1}
                  {step === 2 && t.nikah.step2}
                  {step === 3 && t.nikah.step3}
                  {step === 4 && t.nikah.step4}
                  {step === 5 && t.nikah.step5}
                  {step === 6 && t.nikah.step6}
                  {step === 7 && t.nikah.step7}
                  {step === 8 && t.nikah.step8}
                </strong>
              </span>
              <span className="text-amber-700 font-mono font-bold">{Math.round((step / 8) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0B3D2E] to-[#C9A227] h-full transition-all duration-300"
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {submittedApp ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#0B3D2E]">
                Nikah Application Successfully Registered!
              </h3>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl max-w-sm mx-auto font-mono text-center">
                <span className="text-[10px] text-amber-800 uppercase font-bold">Application Tracking ID</span>
                <p className="text-lg font-black text-amber-950 mt-1">{submittedApp.applicationNumber}</p>
                <p className="text-[11px] text-stone-600 font-sans mt-2">
                  Status: <strong className="text-emerald-800 uppercase">{submittedApp.status}</strong>
                </p>
              </div>
              <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
                Your application has entered the Mahal verification pipeline. You can track document review, solemnization schedule, and certificate readiness in your dashboard.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0B3D2E] text-[#C9A227] font-bold rounded-xl shadow-md hover:bg-emerald-950"
              >
                Go to Applications Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: Applicant Details */}
              {step === 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Applicant Credentials</h4>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Applying as:</label>
                    <select
                      value={formData.applicantRelation}
                      onChange={(e) => handleChange('applicantRelation', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="GUARDIAN">Guardian / Father (രക്ഷിതാവ് / പിതാവ്)</option>
                      <option value="GROOM">Groom (വരൻ)</option>
                      <option value="BRIDE">Bride (വധു)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Applicant Full Name</label>
                    <input
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => handleChange('applicantName', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Contact Phone Number</label>
                    <input
                      type="text"
                      value={formData.applicantPhone}
                      onChange={(e) => handleChange('applicantPhone', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Bride Details */}
              {step === 2 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Bride (വധുവിന്റെ വിവരങ്ങൾ)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Full Name of Bride</label>
                      <input
                        type="text"
                        value={formData.brideName}
                        onChange={(e) => handleChange('brideName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.brideAge}
                        onChange={(e) => handleChange('brideAge', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.brideDob}
                        onChange={(e) => handleChange('brideDob', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={formData.brideFatherName}
                        onChange={(e) => handleChange('brideFatherName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={formData.brideMotherName}
                        onChange={(e) => handleChange('brideMotherName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Mahal Name</label>
                      <input
                        type="text"
                        value={formData.brideMahal}
                        onChange={(e) => handleChange('brideMahal', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Groom Details */}
              {step === 3 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Groom (വരന്റെ വിവരങ്ങൾ)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Full Name of Groom</label>
                      <input
                        type="text"
                        value={formData.groomName}
                        onChange={(e) => handleChange('groomName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.groomAge}
                        onChange={(e) => handleChange('groomAge', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={formData.groomOccupation}
                        onChange={(e) => handleChange('groomOccupation', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={formData.groomFatherName}
                        onChange={(e) => handleChange('groomFatherName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={formData.groomMotherName}
                        onChange={(e) => handleChange('groomMotherName', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Groom's Native Mahal</label>
                      <input
                        type="text"
                        value={formData.groomMahal}
                        onChange={(e) => handleChange('groomMahal', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Wali / Guardian */}
              {step === 4 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Wali / Guardian (വലിയ്യ് / രക്ഷാകർത്താവ്)</h4>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Name of Wali</label>
                    <input
                      type="text"
                      value={formData.waliName}
                      onChange={(e) => handleChange('waliName', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Relationship to Bride</label>
                    <input
                      type="text"
                      value={formData.waliRelation}
                      onChange={(e) => handleChange('waliRelation', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Wali Phone</label>
                    <input
                      type="text"
                      value={formData.waliPhone}
                      onChange={(e) => handleChange('waliPhone', e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Date, Time & Venue */}
              {step === 5 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Date, Time & Venue</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Proposed Nikah Date</label>
                      <input
                        type="date"
                        value={formData.proposedDate}
                        onChange={(e) => handleChange('proposedDate', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Proposed Time</label>
                      <input
                        type="text"
                        value={formData.proposedTime}
                        onChange={(e) => handleChange('proposedTime', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Venue / Auditorium</label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => handleChange('venue', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Document Uploads */}
              {step === 6 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Required Supporting Documents</h4>
                  <p className="text-[11px] text-stone-500">
                    Uploaded documents are stored in secure private storage accessible only to the Nikah verification officer.
                  </p>
                  <div className="space-y-2">
                    {formData.uploadedDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0B3D2E]" />
                          <span className="font-semibold text-stone-800">{doc.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Review Information */}
              {step === 7 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0B3D2E]">Review Application Summary</h4>
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2 text-stone-700">
                    <p>
                      <strong>Bride:</strong> {formData.brideName} ({formData.brideAge} yrs)
                    </p>
                    <p>
                      <strong>Groom:</strong> {formData.groomName} ({formData.groomAge} yrs)
                    </p>
                    <p>
                      <strong>Groom's Mahal:</strong> {formData.groomMahal}
                    </p>
                    <p>
                      <strong>Wali:</strong> {formData.waliName} ({formData.waliRelation})
                    </p>
                    <p>
                      <strong>Scheduled:</strong> {formData.proposedDate} at {formData.proposedTime}
                    </p>
                    <p>
                      <strong>Venue:</strong> {formData.venue}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 8: Final Submission */}
              {step === 8 && (
                <div className="space-y-3 text-center py-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#0B3D2E]">
                    Declaration & Final Submission
                  </h4>
                  <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
                    I solemnly declare that all particulars entered above are truthful and comply with Shariah stipulations and the guidelines of {settings.mahalName}.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!submittedApp && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else onClose();
              }}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              {step > 1 ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.common.back}</span>
                </>
              ) : (
                t.common.cancel
              )}
            </button>

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-5 py-2 bg-[#0B3D2E] hover:bg-emerald-950 text-[#C9A227] font-bold text-xs rounded-xl shadow transition-colors"
              >
                <span>{t.common.next}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#C9A227] hover:bg-[#b89321] text-stone-950 font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-102"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Official Application</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
