import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ZakahCategory } from '../../types';
import { X, Coins, CheckCircle2, AlertCircle } from 'lucide-react';

interface ZakahApplicationModalProps {
  onClose: () => void;
}

export const ZakahApplicationModal: React.FC<ZakahApplicationModalProps> = ({ onClose }) => {
  const { t, submitZakahApplication, currentProfile } = useApp();
  const [submitted, setSubmitted] = useState<any>(null);

  const [formData, setFormData] = useState({
    category: 'POOR' as ZakahCategory,
    applicantName: currentProfile?.name || 'Ahamed Basheer',
    phone: currentProfile?.phone || '+91 98460 11223',
    dependentsCount: 4,
    monthlyIncome: 6500,
    amountNeeded: 18000,
    justification: 'Sole breadwinner unable to meet basic subsistence due to seasonal lack of manual employment.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitZakahApplication({
      memberId: currentProfile?.memberId || 'MHL-000124',
      applicantName: formData.applicantName,
      familyId: currentProfile?.familyId || 'FAM-00042',
      category: formData.category,
      dependentsCount: Number(formData.dependentsCount),
      monthlyFamilyIncome: Number(formData.monthlyIncome),
      amountNeeded: Number(formData.amountNeeded),
      financialSituation: formData.justification,
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
            <Coins className="w-6 h-6 text-[#C9A227]" />
            <div>
              <h3 className="font-bold text-base">{t.zakah.applyButton}</h3>
              <p className="text-xs text-emerald-200">Shariah-Compliant Zakah Disbursement Desk</p>
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
                Zakah Application Submitted Confidentially
              </h3>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl max-w-xs mx-auto font-mono">
                <p className="text-[10px] text-stone-500 uppercase">Tracking Number</p>
                <p className="text-base font-bold text-stone-900">{submitted.applicationNumber}</p>
              </div>
              <p className="text-stone-600 leading-relaxed">
                The Mahal Zakah Committee will review the eligibility according to Quranic categories and schedule an assessment with complete confidentiality.
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
                <label className="block font-semibold text-stone-700 mb-1">Eligible Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ZakahCategory })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="POOR">Fuqara (The Poor / ഫഖീർ)</option>
                  <option value="NEEDIEST">Masakeen (The Destitute / മിസ്കീൻ)</option>
                  <option value="DEBTOR">Gharimeen (Debtors Burdened / കടബാധിതർ)</option>
                  <option value="WAYFARER">Ibnus-Sabeel (Stranded Traveler / വഴിപോക്കർ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Family Dependents</label>
                  <input
                    type="number"
                    value={formData.dependentsCount}
                    onChange={(e) => setFormData({ ...formData, dependentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Required Zakah Support Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amountNeeded}
                  onChange={(e) => setFormData({ ...formData, amountNeeded: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Circumstances / Justification
                </label>
                <textarea
                  rows={3}
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  The dignity of recipient families is protected. Zakah disbursements are made in private without public announcement.
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
