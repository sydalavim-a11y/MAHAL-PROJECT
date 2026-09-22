import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, Coins, Calculator, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const PublicWelfareZakah: React.FC = () => {
  const { t, setOpenWelfareModal, setOpenZakahModal, settings } = useApp();

  // Zakah Calculator State
  const [cashSavings, setCashSavings] = useState(250000);
  const [goldGrams, setGoldGrams] = useState(85);
  const [goldRatePerGram, setGoldRatePerGram] = useState(6800);
  const [debtsOwed, setDebtsOwed] = useState(30000);

  // Nisab threshold: 85 grams of gold
  const nisabThreshold = 85 * goldRatePerGram;
  const totalGoldValue = goldGrams * goldRatePerGram;
  const netWealth = Math.max(0, cashSavings + totalGoldValue - debtsOwed);
  const isZakahEligible = netWealth >= nisabThreshold;
  const zakahPayable = isZakahEligible ? Math.round(netWealth * 0.025) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header with Spruce & Lime */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#00545f] bg-[#ecffb6] px-3.5 py-1 rounded-full border border-[#d6fb00]">
          Community Care & Compassion
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#00545f] tracking-tight">
          Mahal Welfare Fund & Shariah Zakah Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#3d686e] leading-relaxed font-medium">
          Upholding Islamic mutual solidarity through transparent medical aid, educational scholarships, emergency assistance, and dignified Zakah distribution.
        </p>
      </div>

      {/* Welfare vs Zakah Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Welfare Relief Fund Card */}
        <div className="bg-white rounded-3xl border border-[#ecffb6] p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] flex items-center justify-center font-bold">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#00545f]">
              Community Welfare Relief Fund
            </h3>
            <p className="text-xs text-[#3d686e] leading-relaxed font-medium">
              Open to all registered constituents facing unforeseen hardship, medical surgery expenses, chronic illness treatments, education fees, or family crises.
            </p>

            <ul className="space-y-2 text-xs text-[#00434c]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Immediate emergency medical sanction up to ₹50,000</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Annual higher education & professional course scholarships</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Monthly food kits for destitute elderly widows and disabled</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setOpenWelfareModal(true)}
            className="w-full py-3.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply for Welfare Relief</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shariah Zakah Desk Card */}
        <div className="bg-white rounded-3xl border-2 border-[#d6fb00] p-8 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00545f] text-[#d6fb00] flex items-center justify-center font-bold shadow-xs">
              <Coins className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#00545f]">
              Official Shariah Zakah Desk
            </h3>
            <p className="text-xs text-[#3d686e] leading-relaxed font-medium">
              Collects Zakah-ul-Maal from prosperous constituents and distributes directly to the eight Quranic categories with strict privacy and zero public disclosure.
            </p>

            <ul className="space-y-2 text-xs text-[#00434c]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Direct disbursement to Fuqara (The Poor) & Masakeen (Destitute)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Relief for debt-burdened individuals (Gharimeen)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00545f] shrink-0" />
                <span>Complete personal dignity: Recipient names are never published</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setOpenZakahModal(true)}
            className="w-full py-3.5 bg-[#d6fb00] hover:bg-[#c2e400] text-[#00545f] font-black text-xs rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply for Zakah Assistance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Zakah Calculator Tool */}
      <div className="bg-[#fafdf2] rounded-3xl border border-[#ecffb6] p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#ecffb6] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00545f] text-[#d6fb00] flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#00545f]">
              Interactive Zakah-ul-Maal Calculator (സകാത്ത് കാൽക്കുലേറ്റർ)
            </h3>
            <p className="text-xs text-[#557277] font-medium">
              Calculate your annual 2.5% Zakah obligation based on prevailing Kerala gold rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs">
          {/* Inputs */}
          <div className="space-y-3.5">
            <div>
              <label className="block font-bold text-[#00545f] mb-1">
                Cash in Bank & Hand (₹):
              </label>
              <input
                type="number"
                value={cashSavings}
                onChange={(e) => setCashSavings(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#ecffb6] rounded-xl text-[#00545f] font-bold focus:ring-2 focus:ring-[#00545f] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-[#00545f] mb-1">Gold Owned (Grams):</label>
                <input
                  type="number"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#ecffb6] rounded-xl text-[#00545f] font-bold focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#00545f] mb-1">Gold Rate/Gram (₹):</label>
                <input
                  type="number"
                  value={goldRatePerGram}
                  onChange={(e) => setGoldRatePerGram(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#ecffb6] rounded-xl text-[#00545f] font-bold focus:ring-2 focus:ring-[#00545f] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#00545f] mb-1">
                Short-term Deductible Debts (₹):
              </label>
              <input
                type="number"
                value={debtsOwed}
                onChange={(e) => setDebtsOwed(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#ecffb6] rounded-xl text-[#00545f] font-bold focus:ring-2 focus:ring-[#00545f] focus:outline-none"
              />
            </div>
          </div>

          {/* Assessment Output Card */}
          <div className="bg-white rounded-2xl border border-[#ecffb6] p-6 space-y-4 shadow-xs text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#557277]">
              Annual Zakah Assessment Summary
            </span>

            <div className="space-y-1">
              <span className="text-xs text-[#557277]">Net Zakatable Wealth:</span>
              <p className="text-xl font-black text-[#00545f]">₹{netWealth.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-[#557277]">
                Gold Nisab Threshold (85g): ₹{nisabThreshold.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fafdf2] border border-[#ecffb6]">
              <span className="text-xs font-black text-[#00545f] uppercase">
                {isZakahEligible ? 'Zakah is Mandatory (2.5%)' : 'Below Nisab Threshold'}
              </span>
              <p className="text-3xl font-black text-[#00545f] mt-1">
                ₹{zakahPayable.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#3d686e] mt-1">
                Payable annually to the Mahal Zakah fund or directly to eligible individuals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
