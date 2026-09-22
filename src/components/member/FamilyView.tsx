import React from 'react';
import { useApp } from '../../context/AppContext';
import { Profile } from '../../types';
import { Users, User, Heart, Shield, Phone, Briefcase, GraduationCap } from 'lucide-react';

export const FamilyView: React.FC = () => {
  const { currentFamily, currentProfile, profiles } = useApp();

  if (!currentFamily) {
    return (
      <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
        No family record linked to this account.
      </div>
    );
  }

  const familyMembers = profiles.filter((p) => p.familyId === currentFamily.familyId);

  return (
    <div className="space-y-6">
      {/* Family Summary Header */}
      <div className="bg-gradient-to-r from-[#0B3D2E] to-[#145742] text-white p-6 rounded-2xl shadow-lg border border-emerald-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A227] text-stone-950 flex items-center justify-center font-bold text-xl shadow">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif">{currentFamily.houseName}</h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  {currentFamily.familyId}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Head of Family: <strong className="text-white">{currentFamily.headName}</strong> • {currentFamily.memberCount} Registered Members
              </p>
            </div>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/80 px-4 py-2.5 rounded-xl text-xs space-y-1">
            <p className="text-stone-300">
              Address: <span className="text-white">{currentFamily.address}</span>
            </p>
            <p className="text-stone-300">
              Contribution Standing:{' '}
              <span className="font-bold text-amber-300 uppercase">{currentFamily.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div>
        <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Registered Family Constituents</span>
          <span className="text-xs text-stone-500 font-normal">({familyMembers.length} individuals)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member: Profile) => {
            const isHead = member.familyRole === 'HEAD';
            const isCurrent = currentProfile?.id === member.id;

            return (
              <div
                key={member.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative ${
                  isCurrent
                    ? 'border-[#C9A227] ring-2 ring-[#C9A227]/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {isHead && (
                  <span className="absolute top-4 right-4 bg-emerald-100 text-[#0B3D2E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-300">
                    Family Head
                  </span>
                )}
                {isCurrent && !isHead && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-300">
                    You
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm">
                    {member.gender === 'MALE' ? '👨' : '👩'}
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">{member.name}</h5>
                    <p className="text-xs text-stone-500">{member.familyRole}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Gender / DOB:</span>
                    <span className="font-semibold text-stone-800">
                      {member.gender} • {member.dateOfBirth}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Blood Group:</span>
                    <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                      {member.bloodGroup}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Phone:</span>
                    <span className="font-semibold text-stone-800">{member.phone}</span>
                  </div>

                  {member.occupation && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Occupation:</span>
                      <span className="font-semibold text-stone-800 truncate max-w-[140px] text-right">
                        {member.occupation}
                      </span>
                    </div>
                  )}

                  {member.education && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Education:</span>
                      <span className="font-semibold text-stone-800 truncate max-w-[140px] text-right">
                        {member.education}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
