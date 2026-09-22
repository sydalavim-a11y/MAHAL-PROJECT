import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WelfareCategory } from '../../types';
import { X, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';

interface WelfareApplicationModalProps {
  onClose: () => void;
}

export const WelfareApplicationModal: React.FC<WelfareApplicationModalProps> = ({ onClose }) => {
  const { t, submitWelfareApplication, currentProfile } = useApp();
  const [submitted, setSubmitted] = useState<any>(null);

  const [formData, setFormData] = useState({
    category: 'MEDICAL' as WelfareCategory,
    applicantName: currentProfile?.name || 'Ahamed Basheer',
    phone: currentProfile?.phone || '+91 98460 11223',
    amountRequested: 25000,
    purpose: 'Cardiac treatment and post-operative medications assistance',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitWelfareApplication({
      memberId: currentProfile?.memberId || 'MHL-000124',
      applicantName: formData.applicantName,
      familyId: currentProfile?.familyId || 'FAM-00042',
      category: formData.category,
      amountRequested: Number(formData.amountRequested),
      description: formData.purpose,
      phone: formData.phone,
    });
    setSubmitted(app);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-[#C9A227]" />
            <div>
              <h3 className="font-bold text-base">{t.welfare.applyButton}</h3>
              <p className="text-xs text-emerald-200">Mahal Community Welfare Fund</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D2E]">
                Welfare Application Submitted
              </h3>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl max-w-xs mx-auto font-mono">
                <p className="text-[10px] text-stone-500 uppercase">Application ID</p>
                <p className="text-base font-bold text-stone-900">{submitted.applicationNumber}</p>
              </div>
              <p className="text-stone-600 leading-relaxed">
                The Welfare Committee will conduct a confidential review. You will receive updates directly on your registered phone and dashboard.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#0B3D2E] text-[#C9A227] font-bold rounded-xl"
              >
                {t.common.close}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Aid Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as WelfareCategory })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="MEDICAL">Medical Aid (ചികിത്സാ സഹായം)</option>
                  <option value="EDUCATION">Education & Scholarship (വിദ്യാഭ്യാസ സഹായം)</option>
                  <option value="HOUSING">Housing & Repair (ഭവന നിർമ്മാണം / അറ്റകുറ്റപ്പണി)</option>
                  <option value="EMERGENCY">Emergency Crisis (അടിയന്തര സഹായം)</option>
                  <option value="FOOD_RATION">Monthly Food Ration (ഭക്ഷ്യധാന്യ വിതരണം)</option>
                  <option value="FINANCIAL">General Financial Relief (സാമ്പത്തിക സഹായം)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Required Amount (INR / ₹)
                </label>
                <input
                  type="number"
                  value={formData.amountRequested}
                  onChange={(e) => setFormData({ ...formData, amountRequested: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Detailed Purpose & Circumstances
                </label>
                <textarea
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  All requests remain strictly confidential under the direct oversight of the Chief Qazi and Welfare Officer.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-stone-600 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B3D2E] hover:bg-emerald-950 text-[#C9A227] font-bold rounded-xl shadow"
                >
                  {t.common.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
