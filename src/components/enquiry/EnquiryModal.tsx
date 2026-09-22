import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, HelpCircle, CheckCircle2 } from 'lucide-react';

interface EnquiryModalProps {
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ onClose }) => {
  const { t, language, submitEnquiry, currentProfile, settings } = useApp();
  const [submitted, setSubmitted] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: currentProfile?.name || 'Ahamed Basheer',
    phone: currentProfile?.phone || '+91 98460 11223',
    email: currentProfile?.email || 'member@mahalconnect.org',
    category: 'GENERAL' as const,
    subject: 'Clarification regarding Madrasa schedule',
    message: 'We would like to request clarification on the revised evening Madrasa transportation schedule.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage = formData.subject ? `[${formData.subject}]\n${formData.message}` : formData.message;
    const enq = submitEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      message: finalMessage,
    });
    setSubmitted(enq);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B3D2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-[#C9A227]" />
            <div>
              <h3 className="font-bold text-base">
                {language === 'ml' ? 'അന്വേഷണം സമർപ്പിക്കുക' : 'Submit Official Enquiry'}
              </h3>
              <p className="text-xs text-emerald-200">{settings.mahalName} Helpdesk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D2E]">
                Enquiry Logged in Mahal Desk
              </h3>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl max-w-xs mx-auto font-mono">
                <p className="text-[10px] text-stone-500 uppercase">Docket Number</p>
                <p className="text-base font-bold text-stone-900">{submitted.enquiryNumber}</p>
              </div>
              <p className="text-stone-600 leading-relaxed">
                The Mahal Office has received your submission. An official response will be delivered via SMS/WhatsApp or viewable in your dashboard.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {language === 'ml' ? 'മുഴുവൻ പേര്' : 'Full Legal Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {language === 'ml' ? 'ഫോൺ നമ്പർ' : 'Contact Phone'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ml' ? 'വിഭാഗം' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="GENERAL">General Information (പൊതുവിവരം)</option>
                  <option value="MEMBERSHIP">Membership (അംഗത്വം)</option>
                  <option value="PAYMENT">Contributions & Dues (മാസവരി)</option>
                  <option value="NIKAH">Nikah Registration (നിക്കാഹ്)</option>
                  <option value="WELFARE">Welfare Aid (ക്ഷേമനിധി)</option>
                  <option value="ZAKAH">Zakah Assistance (സകാത്ത്)</option>
                  <option value="EVENTS">Events & Facilities (പരിപാടികൾ)</option>
                  <option value="OTHER">Other Query (മറ്റു കാര്യങ്ങൾ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ml' ? 'സന്ദേശം' : 'Detailed Message / Grievance'}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3D2E] hover:bg-emerald-950 text-[#C9A227] font-bold rounded-lg shadow"
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
