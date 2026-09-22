import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Receipt,
  Coins,
  ArrowUpRight,
} from 'lucide-react';

export const MemberIncomeTransparency: React.FC = () => {
  const { financialSummary, financialLedger } = useApp();
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Calculate current month's items
  const currentMonthName = financialSummary?.currentMonthName || 'September 2026';
  const masjidIncome = financialSummary?.masjidIncomeThisMonth || 185400;
  const madrasaIncome = financialSummary?.madrasaIncomeThisMonth || 94800;
  const totalIncome = financialSummary?.totalIncomeThisMonth || 280200;

  // Monthly target estimation (e.g. ₹3,00,000)
  const monthlyTarget = 300000;
  const progressPercent = Math.min(100, Math.round((totalIncome / monthlyTarget) * 100));

  // Get recent income items from ledger
  const recentIncomes = financialLedger
    ?.filter((item) => item.type === 'INCOME')
    .slice(0, 6) || [];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Live Community Financial Transparency
            </span>
            <span className="text-xs text-stone-500 font-medium">({currentMonthName})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif text-[#00545f]">
            Mahal Masjid & Madrasa Monthly Collections
          </h2>
          <p className="text-xs text-stone-600">
            മഹല്ല് ജുമാ മസ്ജിദ് & നൂറുൽ ഇസ്ലാം മദ്രസ ഈ മാസത്തെ വരുമാന കണക്കുകൾ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-[#00545f]" />
          <div className="text-left">
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Audit Status</p>
            <p className="text-xs font-bold text-stone-900">Verified & Reconciled</p>
          </div>
        </div>
      </div>

      {/* Main Income KPI Cards: Masjid vs Madrasa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Mahal Masjid Income */}
        <div className="bg-gradient-to-br from-[#00545f] to-[#003a42] text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#ecffb6]/20 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#d6fb00] flex items-center justify-center border border-white/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#d6fb00] text-[#00545f] px-2.5 py-0.5 rounded-full shadow-xs">
                MASJID ACCOUNT
              </span>
            </div>

            <div>
              <p className="text-xs text-[#ecffb6] font-medium">Masjid Income This Month</p>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white font-mono">
                ₹{masjidIncome.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#ecffb6]/80 font-malayalam mt-0.5">
                ജുമാ മസ്ജിദ് മാസ വരുമാനം
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-[#ecffb6]/90 space-y-1 relative z-10">
            <div className="flex justify-between">
              <span>Household Masavari:</span>
              <span className="font-bold text-white">₹1,18,000</span>
            </div>
            <div className="flex justify-between">
              <span>Friday Juma & Boxes:</span>
              <span className="font-bold text-white">₹55,400</span>
            </div>
            <div className="flex justify-between">
              <span>Waqf Building Rent:</span>
              <span className="font-bold text-white">₹12,000</span>
            </div>
          </div>
        </div>

        {/* Card 2: Madrasa Income */}
        <div className="bg-gradient-to-br from-[#006a77] to-[#004752] text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#ecffb6]/20 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#d6fb00] flex items-center justify-center border border-white/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#ecffb6] text-[#00545f] px-2.5 py-0.5 rounded-full shadow-xs">
                MADRASA ACCOUNT
              </span>
            </div>

            <div>
              <p className="text-xs text-[#ecffb6] font-medium">Madrasa Income This Month</p>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white font-mono">
                ₹{madrasaIncome.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#ecffb6]/80 font-malayalam mt-0.5">
                മദ്രസ മാസ വരുമാനം
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-[11px] text-[#ecffb6]/90 space-y-1 relative z-10">
            <div className="flex justify-between">
              <span>Student Tuition Fees:</span>
              <span className="font-bold text-white">₹58,400</span>
            </div>
            <div className="flex justify-between">
              <span>Sponsor-a-Talib Fund:</span>
              <span className="font-bold text-white">₹24,000</span>
            </div>
            <div className="flex justify-between">
              <span>Kitab & Academic Fund:</span>
              <span className="font-bold text-white">₹12,400</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Consolidated Income & Target */}
        <div className="bg-stone-50 border-2 border-[#00545f]/20 p-5 sm:p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Consolidated Community Inflow
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>

            <p className="text-xs text-stone-500">Total Mahal Income ({currentMonthName})</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00545f] font-mono">
              ₹{totalIncome.toLocaleString('en-IN')}
            </h3>

            {/* Target Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-stone-700">
                <span>Monthly Budget Target</span>
                <span>{progressPercent}% (₹{monthlyTarget.toLocaleString('en-IN')})</span>
              </div>
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-[#00545f] font-bold text-xs rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{showDetailedBreakdown ? 'Hide Detailed Itemization' : 'View Itemized Income Breakdown'}</span>
            {showDetailedBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Itemized Ledger Breakdown */}
      {showDetailedBreakdown && (
        <div className="pt-4 border-t border-stone-200 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-[#00545f]" />
              <span>Verified Ledger Entries for {currentMonthName}</span>
            </h4>
            <span className="text-[11px] text-stone-500">
              Open to all registered Mahal constituents for transparency
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Institution</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Payment Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentIncomes.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-stone-600">{item.date}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.institution === 'MASJID'
                            ? 'bg-teal-100 text-teal-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {item.institution === 'MASJID' ? 'Mahal Masjid' : 'Madrasa'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{item.category}</td>
                    <td className="py-2.5 px-3 text-stone-600">{item.title}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500">{item.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                      +₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
