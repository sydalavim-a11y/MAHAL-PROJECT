import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Search, Users, ShieldCheck, Home, Phone, ArrowRight } from 'lucide-react';

export const PublicMahalBook: React.FC = () => {
  const { t, families, profiles, currentUser, setOpenAuthModal, setActiveTab } = useApp();
  const [search, setSearch] = useState('');

  const filteredFamilies = families.filter(
    (f) =>
      f.houseName.toLowerCase().includes(search.toLowerCase()) ||
      f.familyId.toLowerCase().includes(search.toLowerCase()) ||
      f.headName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header with Spruce & Lime */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#00545f] text-[#d6fb00] border border-[#d6fb00]/40 flex items-center justify-center mx-auto shadow-md">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#00545f] tracking-tight">
          Digital Mahal Book (മഹല്ല് ബുക്ക്)
        </h1>
        <p className="text-xs sm:text-sm text-[#3d686e] leading-relaxed font-medium">
          The official community census repository organizing all constituent households, family lineages, and demographic records with privacy protection.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-[#557277] absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search by House Name, Family ID, or Head of Family..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#ecffb6] rounded-2xl text-xs shadow-xs focus:ring-2 focus:ring-[#00545f] focus:outline-none text-[#00434c] placeholder-[#557277]"
        />
      </div>

      {/* Family Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFamilies.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-3xl border border-[#ecffb6] p-5 shadow-xs hover:border-[#00545f]/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-black bg-[#fafdf2] text-[#00545f] px-2.5 py-1 rounded-full border border-[#ecffb6]">
                  {f.familyId}
                </span>
                <h3 className="font-serif font-bold text-base text-[#00545f] mt-2 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-[#00545f]" />
                  <span>{f.houseName}</span>
                </h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]">
                {f.paymentStatus}
              </span>
            </div>

            <div className="space-y-1 text-xs text-[#3d686e]">
              <p>
                Head of Family: <strong className="text-[#00434c]">{f.headName}</strong>
              </p>
              <p>
                Constituents: <strong className="text-[#00434c]">{f.memberCount} members</strong>
              </p>
              <p className="text-[#557277] truncate">{f.address}</p>
            </div>

            {/* Privacy notice / Member action */}
            <div className="pt-3 border-t border-[#ecffb6]/50 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#557277] font-medium">
                Registered Mahal Unit
              </span>
              {currentUser ? (
                <button
                  onClick={() => setActiveTab('member-dashboard')}
                  className="text-[#00545f] font-black hover:text-[#003a42] flex items-center gap-1 cursor-pointer"
                >
                  <span>Family Tree</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00545f]" />
                </button>
              ) : (
                <button
                  onClick={() => setOpenAuthModal(true)}
                  className="text-[#00545f] hover:underline text-[11px] font-bold cursor-pointer"
                >
                  Sign in to view
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
