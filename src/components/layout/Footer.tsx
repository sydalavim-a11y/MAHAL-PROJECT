import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, setOpenVerifyModal } = useApp();

  return (
    <footer className="footer bg-[#003a42] text-[#ecffb6] pt-14 pb-8 border-t-4 border-[#d6fb00]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Contact */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#d6fb00] flex items-center justify-center text-[#00545f] font-serif font-black text-lg shadow-md">
                N
              </div>
              <span className="font-black text-xl text-white font-serif tracking-tight">
                Noor Mahal
              </span>
            </div>
            <p className="text-xs text-[#ecffb6] leading-relaxed mb-2 font-medium">
              {settings.mahalName}
            </p>
            <p className="text-xs text-[#d6fb00] font-malayalam font-bold mb-4">
              {settings.mahalNameMalayalam}
            </p>
            <div className="space-y-2 text-xs text-[#ecffb6]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d6fb00] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d6fb00] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d6fb00] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services & Portals */}
          <div>
            <h4 className="text-xs font-black text-[#d6fb00] uppercase tracking-wider mb-4 border-b border-[#ecffb6]/20 pb-2">
              Community Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Monthly Contributions (മാസവരി)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('nikah')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nikah Registration & Certificates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('welfare')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Welfare Relief & Medical Aid
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('zakah')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Zakat Assessment & Disbursement
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mahal-book')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mahal Book Household Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-black text-[#d6fb00] uppercase tracking-wider mb-4 border-b border-[#ecffb6]/20 pb-2">
              Information & Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Announcements & Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ask-mahal')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ask Mahal AI Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Public Enquiries & Grievances
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpenVerifyModal(true)}
                  className="text-[#d6fb00] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Digital Certificate</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Committee Hours & Bank */}
          <div>
            <h4 className="text-xs font-black text-[#d6fb00] uppercase tracking-wider mb-4 border-b border-[#ecffb6]/20 pb-2">
              Secretariat Hours
            </h4>
            <p className="text-xs text-[#ecffb6]/90 leading-relaxed mb-3 font-medium">
              Office open Daily: 9:00 AM – 1:00 PM & 4:30 PM – 8:00 PM (Except Friday Prayer Times).
            </p>
            <div className="bg-[#00262b] p-3 rounded-2xl border border-[#ecffb6]/20 space-y-1 text-[11px]">
              <div className="font-bold text-white">Mahal Committee Office:</div>
              <div className="text-[#ecffb6]">Reg No: {settings.registrationNumber}</div>
              <div className="text-[#ecffb6]">Secretary: {settings.secretaryName}</div>
              <div className="text-[#ecffb6]">President: {settings.presidentName}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#ecffb6]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#ecffb6]/60">
          <div>
            © {new Date().getFullYear()} {settings.mahalName}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Authenticated Digital Governance Platform</span>
            <span>•</span>
            <span className="text-[#ecffb6]">Admin Gmail Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
