import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialLedgerEntry } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  PieChart,
  BarChart3,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminFinanceAnalytics: React.FC = () => {
  const { financialSummary, financialLedger, addLedgerEntry } = useApp();

  const [institutionFilter, setInstitutionFilter] = useState<'ALL' | 'MASJID' | 'MADRASA'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChartTab, setActiveChartTab] = useState<'TREND' | 'INCOME_SPLIT' | 'EXPENSE_SPLIT'>('TREND');

  // Modal for new transaction
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newInstitution, setNewInstitution] = useState<'MASJID' | 'MADRASA'>('MASJID');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [newCategory, setNewCategory] = useState('Friday Juma Collection');
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newMethod, setNewMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE'>('UPI');
  const [newRef, setNewRef] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Financial figures
  const masjidIncome = financialSummary?.masjidIncomeThisMonth || 185400;
  const masjidExpense = financialSummary?.masjidExpensesThisMonth || 112000;
  const masjidProfit = masjidIncome - masjidExpense;

  const madrasaIncome = financialSummary?.madrasaIncomeThisMonth || 94800;
  const madrasaExpense = financialSummary?.madrasaExpensesThisMonth || 71500;
  const madrasaProfit = madrasaIncome - madrasaExpense;

  const totalIncome = masjidIncome + madrasaIncome;
  const totalExpense = masjidExpense + madrasaExpense;
  const totalProfit = totalIncome - totalExpense;
  const profitMargin = Math.round((totalProfit / totalIncome) * 100);

  // Six-month historical trend data for graph
  const trendData = [
    { month: 'Apr', masjidInc: 172000, madrasaInc: 88000, masjidExp: 108000, madrasaExp: 68000 },
    { month: 'May', masjidInc: 195000, madrasaInc: 92000, masjidExp: 115000, madrasaExp: 70000 },
    { month: 'Jun', masjidInc: 180000, madrasaInc: 96000, masjidExp: 110000, madrasaExp: 72000 },
    { month: 'Jul', masjidInc: 184000, madrasaInc: 90000, masjidExp: 114000, madrasaExp: 69000 },
    { month: 'Aug', masjidInc: 188000, madrasaInc: 93500, masjidExp: 111000, madrasaExp: 71000 },
    { month: 'Sep', masjidInc: masjidIncome, madrasaInc: madrasaIncome, masjidExp: masjidExpense, madrasaExp: madrasaExpense },
  ];

  // Filtered ledger entries
  const filteredLedger = (financialLedger || []).filter((item) => {
    if (institutionFilter !== 'ALL' && item.institution !== institutionFilter) return false;
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.referenceNo && item.referenceNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newTitle) return;

    addLedgerEntry({
      date: newDate,
      institution: newInstitution,
      type: newType,
      category: newCategory,
      title: newTitle,
      amount: Number(newAmount),
      paymentMethod: newMethod,
      referenceNo: newRef || `VCH-${Date.now().toString().slice(-6)}`,
      recordedBy: 'Admin Treasury Desk',
      notes: newNotes,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setNewRef('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Financial Management & Treasury
            </span>
            <span className="text-xs text-stone-500 font-medium font-mono">
              Month: {financialSummary?.currentMonthName || 'September 2026'}
            </span>
          </div>
          <h2 className="text-2xl font-black font-serif text-stone-900 mt-1">
            Mahal Masjid & Madrasa Financial Analytics
          </h2>
          <p className="text-xs text-stone-500">
            Comprehensive revenue analysis, expenditure audits, net surplus calculations, and interactive ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00545f] hover:bg-[#00434c] text-[#d6fb00] font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Masjid, Madrasa, and Consolidated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. MAHAL MASJID CARD */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Mahal Masjid Accounts</h3>
                <p className="text-[11px] text-stone-500">ജുമാ മസ്ജിദ് കണക്കുകൾ</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Masjid
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-500 font-semibold uppercase flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> Income
              </span>
              <p className="text-lg font-black text-stone-900 font-mono mt-0.5">
                ₹{masjidIncome.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-500 font-semibold uppercase flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" /> Expenses
              </span>
              <p className="text-lg font-black text-stone-900 font-mono mt-0.5">
                ₹{masjidExpense.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/70 border border-teal-200/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
                Masjid Net Profit / Surplus
              </span>
              <p className="text-[10px] text-teal-700">Operating surplus for reserve fund</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-teal-900 font-mono">
                +₹{masjidProfit.toLocaleString('en-IN')}
              </span>
              <span className="block text-[10px] font-bold text-emerald-700">
                +{Math.round((masjidProfit / masjidIncome) * 100)}% margin
              </span>
            </div>
          </div>
        </div>

        {/* 2. MADRASA ACCOUNTS CARD */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Madrasa Accounts</h3>
                <p className="text-[11px] text-stone-500">നൂറുൽ ഇസ്ലാം മദ്രസ കണക്കുകൾ</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Madrasa
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-500 font-semibold uppercase flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> Income
              </span>
              <p className="text-lg font-black text-stone-900 font-mono mt-0.5">
                ₹{madrasaIncome.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-500 font-semibold uppercase flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" /> Expenses
              </span>
              <p className="text-lg font-black text-stone-900 font-mono mt-0.5">
                ₹{madrasaExpense.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                Madrasa Net Profit / Surplus
              </span>
              <p className="text-[10px] text-emerald-700">Surplus allocated to Talib endowment</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-900 font-mono">
                +₹{madrasaProfit.toLocaleString('en-IN')}
              </span>
              <span className="block text-[10px] font-bold text-emerald-700">
                +{Math.round((madrasaProfit / madrasaIncome) * 100)}% margin
              </span>
            </div>
          </div>
        </div>

        {/* 3. CONSOLIDATED MAHAL CARD */}
        <div className="bg-gradient-to-br from-[#00545f] via-[#00434c] to-[#00343b] text-white rounded-3xl p-6 shadow-sm border border-[#ecffb6]/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d6fb00] text-[#00545f] px-2.5 py-0.5 rounded-full">
                Consolidated Treasury
              </span>
              <span className="text-xs text-[#ecffb6] font-mono">Reconciled</span>
            </div>

            <div>
              <p className="text-xs text-[#ecffb6] font-medium">Net Operating Surplus (Profit) This Month</p>
              <h3 className="text-3xl font-black tracking-tight text-white font-mono mt-1">
                +₹{totalProfit.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#ecffb6]/80 mt-0.5">
                Consolidated profit margin of {profitMargin}% across all operations
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-[#ecffb6]">
              <span>Combined Total Income:</span>
              <strong className="text-white font-mono">₹{totalIncome.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-[#ecffb6]">
              <span>Combined Total Expenses:</span>
              <strong className="text-white font-mono">₹{totalExpense.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-[#d6fb00] font-bold pt-1 border-t border-white/10">
              <span>Mahal Treasury Reserve Fund:</span>
              <span className="font-mono">₹14,85,600</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Graphs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Visual Financial Graphs & Trend Analytics
            </h3>
            <p className="text-xs text-stone-500">
              Six-month historical trajectory of revenue, operational expenses, and profit margins.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveChartTab('TREND')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'TREND'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Income vs Expenses Trend
            </button>
            <button
              onClick={() => setActiveChartTab('INCOME_SPLIT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'INCOME_SPLIT'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Income Streams
            </button>
            <button
              onClick={() => setActiveChartTab('EXPENSE_SPLIT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'EXPENSE_SPLIT'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Expense Categories
            </button>
          </div>
        </div>

        {/* Tab 1: 6-Month Income vs Expenses Trend Chart */}
        {activeChartTab === 'TREND' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600" /> Total Income (Masjid + Madrasa)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                  <span className="w-3.5 h-3.5 rounded bg-rose-500" /> Total Expenses
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                  <span className="w-3.5 h-3.5 rounded bg-teal-500" /> Net Profit / Surplus
                </span>
              </div>
              <span className="text-[11px] text-stone-400">All figures in INR (₹)</span>
            </div>

            {/* Responsive SVG Bar & Metric Chart */}
            <div className="grid grid-cols-6 gap-3 sm:gap-6 pt-4 h-64 border-b border-stone-200 pb-4 items-end">
              {trendData.map((d, idx) => {
                const inc = d.masjidInc + d.madrasaInc;
                const exp = d.masjidExp + d.madrasaExp;
                const profit = inc - exp;
                const maxVal = 320000;
                const incHeight = Math.round((inc / maxVal) * 100);
                const expHeight = Math.round((exp / maxVal) * 100);
                const profitHeight = Math.round((profit / maxVal) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] p-2 rounded-xl pointer-events-none z-20 whitespace-nowrap shadow-xl">
                      <p className="font-bold">{d.month} 2026</p>
                      <p className="text-emerald-400">Income: ₹{inc.toLocaleString('en-IN')}</p>
                      <p className="text-rose-400">Expense: ₹{exp.toLocaleString('en-IN')}</p>
                      <p className="text-[#d6fb00]">Profit: ₹{profit.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Bars */}
                    <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center h-48">
                      {/* Income Bar */}
                      <div
                        className="w-3 sm:w-5 bg-emerald-600 rounded-t-md hover:bg-emerald-700 transition-all"
                        style={{ height: `${incHeight}%` }}
                        title={`Income: ₹${inc}`}
                      />
                      {/* Expense Bar */}
                      <div
                        className="w-3 sm:w-5 bg-rose-500 rounded-t-md hover:bg-rose-600 transition-all"
                        style={{ height: `${expHeight}%` }}
                        title={`Expenses: ₹${exp}`}
                      />
                      {/* Profit Bar */}
                      <div
                        className="w-2.5 sm:w-4 bg-teal-500 rounded-t-md hover:bg-teal-600 transition-all"
                        style={{ height: `${profitHeight}%` }}
                        title={`Profit: ₹${profit}`}
                      />
                    </div>

                    {/* X-axis Label */}
                    <div className="mt-2 text-center">
                      <span className="text-xs font-bold text-stone-800">{d.month}</span>
                      <span className="block text-[10px] text-emerald-700 font-mono">
                        +₹{Math.round(profit / 1000)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Income Streams Breakdown */}
        {activeChartTab === 'INCOME_SPLIT' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Itemized Revenue Streams for Current Month (Total: ₹{totalIncome.toLocaleString('en-IN')})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Masjid Income Streams */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-teal-700" /> Mahal Masjid Sources
                  </span>
                  <span className="font-mono font-bold text-xs text-teal-900">
                    ₹{masjidIncome.toLocaleString('en-IN')} (66.2%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Monthly Household Masavari (മാസവരി)</span>
                      <strong className="font-mono">₹1,18,000 (63.6%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-700 rounded-full" style={{ width: '63.6%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Friday Juma Prayer Collections (വെള്ളിയാഴ്ച പിരിവ്)</span>
                      <strong className="font-mono">₹34,200 (18.4%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: '18.4%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Mosque Donation Boxes & Haris (ഖജനാവ്)</span>
                      <strong className="font-mono">₹21,200 (11.4%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '11.4%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Waqf Commercial Building & Shop Rent</span>
                      <strong className="font-mono">₹12,000 (6.5%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: '6.5%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Madrasa Income Streams */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-700" /> Madrasa Sources
                  </span>
                  <span className="font-mono font-bold text-xs text-emerald-900">
                    ₹{madrasaIncome.toLocaleString('en-IN')} (33.8%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Madrasa Student Monthly Fees (വിദ്യാർത്ഥി ഫീസ്)</span>
                      <strong className="font-mono">₹58,400 (61.6%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-700 rounded-full" style={{ width: '61.6%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Sponsor-a-Talib & Needy Student Support</span>
                      <strong className="font-mono">₹24,000 (25.3%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '25.3%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-700 mb-1">
                      <span>Kitab, Syllabus & Exam Enrollment Fund</span>
                      <strong className="font-mono">₹12,400 (13.1%)</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '13.1%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Expense Categories Breakdown */}
        {activeChartTab === 'EXPENSE_SPLIT' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Operating Expenditure Categories for Current Month (Total: ₹{totalExpense.toLocaleString('en-IN')})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="font-bold text-stone-900 block border-b border-stone-200 pb-1">
                  Masjid Expenses (₹{masjidExpense.toLocaleString('en-IN')})
                </span>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Imam & Muezzin Monthly Honorarium</span>
                    <strong className="font-mono">₹55,000 (49.1%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '49.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Electricity, Water & Utility Bills</span>
                    <strong className="font-mono">₹28,500 (25.4%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '25.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Mosque Sanitization & Cleaning Supplies</span>
                    <strong className="font-mono">₹14,500 (12.9%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '12.9%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Sound System & Generator Maintenance</span>
                    <strong className="font-mono">₹14,000 (12.5%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="font-bold text-stone-900 block border-b border-stone-200 pb-1">
                  Madrasa Expenses (₹{madrasaExpense.toLocaleString('en-IN')})
                </span>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Mudarris (Teacher) Salaries & Allowance</span>
                    <strong className="font-mono">₹48,000 (67.1%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '67.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Textbooks, Examination & Printing</span>
                    <strong className="font-mono">₹12,500 (17.5%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '17.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Madrasa Classroom Power & Water</span>
                    <strong className="font-mono">₹6,000 (8.4%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '8.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-700 mb-1">
                    <span>Student Welfare & Refreshments</span>
                    <strong className="font-mono">₹5,000 (7.0%)</strong>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '7.0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reconciled Transaction Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Master Financial Ledger Entries
            </h3>
            <p className="text-xs text-stone-500">
              Audit-ready records of all Masjid & Madrasa incomes, disbursements, and vouchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Institution */}
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value as any)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="ALL">All Institutions</option>
              <option value="MASJID">Masjid Only</option>
              <option value="MADRASA">Madrasa Only</option>
            </select>

            {/* Filter by Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="ALL">All Types (Income & Expenses)</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expenses Only</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none w-40 sm:w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Voucher Ref</th>
                <th className="py-3 px-3">Institution</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Description / Title</th>
                <th className="py-3 px-3">Payment Mode</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-stone-600">{item.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-700">
                      {item.referenceNo || 'VCH-GEN'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.institution === 'MASJID'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.institution === 'MASJID' ? 'Masjid' : 'Madrasa'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-stone-800">{item.category}</td>
                    <td className="py-3 px-3 text-stone-600 max-w-xs truncate">{item.title}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-stone-500">{item.paymentMethod}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {item.type === 'INCOME' ? (
                        <span className="text-emerald-700">+₹{item.amount.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-rose-600">-₹{item.amount.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#00545f] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-white">Record Financial Transaction</h3>
                <p className="text-xs text-[#ecffb6]">Enter verified voucher for Masjid or Madrasa accounts</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Institution *</label>
                  <select
                    value={newInstitution}
                    onChange={(e) => {
                      const inst = e.target.value as any;
                      setNewInstitution(inst);
                      setNewCategory(inst === 'MASJID' ? 'Friday Juma Collection' : 'Madrasa Monthly Fee');
                    }}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-semibold focus:outline-none"
                  >
                    <option value="MASJID">Mahal Masjid</option>
                    <option value="MADRASA">Madrasa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Transaction Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-semibold focus:outline-none"
                  >
                    <option value="INCOME">Income (Revenue / വരവ്)</option>
                    <option value="EXPENSE">Expense (Disbursement / ചിലവ്)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                >
                  {newType === 'INCOME' ? (
                    newInstitution === 'MASJID' ? (
                      <>
                        <option value="Household Monthly Masavari">Household Monthly Masavari</option>
                        <option value="Friday Juma Collection">Friday Juma Collection</option>
                        <option value="Mosque Donation Box (Haris)">Mosque Donation Box (Haris)</option>
                        <option value="Waqf Building Rent">Waqf Building Rent</option>
                        <option value="Special Community Haris">Special Community Haris</option>
                      </>
                    ) : (
                      <>
                        <option value="Madrasa Monthly Fee">Madrasa Monthly Student Fee</option>
                        <option value="Sponsor-a-Talib Donation">Sponsor-a-Talib Donation</option>
                        <option value="Kitab & Library Fund">Kitab & Library Fund</option>
                        <option value="Madrasa Development Fund">Madrasa Development Fund</option>
                      </>
                    )
                  ) : newInstitution === 'MASJID' ? (
                    <>
                      <option value="Imam & Khatib Honorarium">Imam & Khatib Honorarium</option>
                      <option value="Muezzin Salary">Muezzin Salary</option>
                      <option value="Electricity & KSEB Bill">Electricity & KSEB Bill</option>
                      <option value="Water Utility & Plumbing">Water Utility & Plumbing</option>
                      <option value="Sanitization & Cleaning">Sanitization & Cleaning</option>
                      <option value="Sound System Maintenance">Sound System Maintenance</option>
                    </>
                  ) : (
                    <>
                      <option value="Mudarris / Teacher Salary">Mudarris / Teacher Salary</option>
                      <option value="Textbooks & Syllabus Printing">Textbooks & Syllabus Printing</option>
                      <option value="Classroom Utilities">Classroom Utilities</option>
                      <option value="Student Refreshments & Programs">Student Refreshments & Programs</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Description / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. September Juma Inflow from Gate 1 & 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Payment Method</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                    <option value="CASH">Cash in Hand</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Voucher / Txn Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. VCH-2026-SEP-012"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00545f] hover:bg-[#00434c] text-[#d6fb00] font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
