import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { PublicServices } from './components/public/PublicServices';
import { PublicProgramsProjects } from './components/public/PublicProgramsProjects';
import { PublicNikahInfo } from './components/public/PublicNikahInfo';
import { PublicWelfareZakah } from './components/public/PublicWelfareZakah';
import { PublicMahalBook } from './components/public/PublicMahalBook';
import { PublicEventsAnnouncements } from './components/public/PublicEventsAnnouncements';
import { PublicContact } from './components/public/PublicContact';
import { FaqSection } from './components/public/FaqSection';
import { MemberDashboard } from './components/member/MemberDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AskMahalAssistant } from './components/ai/AskMahalAssistant';

// Modals
import { PaymentModal } from './components/payments/PaymentModal';
import { ReceiptModal } from './components/payments/ReceiptModal';
import { CertificateModal } from './components/certificates/CertificateModal';
import { VerifyCertificateModal } from './components/certificates/VerifyCertificateModal';
import { NikahApplicationModal } from './components/nikah/NikahApplicationModal';
import { WelfareApplicationModal } from './components/welfare/WelfareApplicationModal';
import { ZakahApplicationModal } from './components/zakah/ZakahApplicationModal';
import { EnquiryModal } from './components/enquiry/EnquiryModal';
import { AuthModal } from './components/auth/AuthModal';
import { DeathCertificateApplyModal } from './components/certificates/DeathCertificateApplyModal';

import { Sparkles, MessageSquare, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    currentRole,
    switchPersona,
    setOpenAuthModal,
    activePaymentModal,
    setActivePaymentModal,
    activeReceiptModal,
    setActiveReceiptModal,
    activeCertificateModal,
    setActiveCertificateModal,
    openVerifyModal,
    setOpenVerifyModal,
    openNikahModal,
    setOpenNikahModal,
    openWelfareModal,
    setOpenWelfareModal,
    openZakahModal,
    setOpenZakahModal,
    openEnquiryModal,
    setOpenEnquiryModal,
    openAuthModal,
    openDeathCertModal,
    setOpenDeathCertModal,
    isUserAdmin,
  } = useApp();

  const [isAiFloatingOpen, setIsAiFloatingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#0B3D2E] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-20 sm:space-y-32 pb-24">
            <Hero />
            <PublicServices />
            <PublicProgramsProjects />
            <PublicEventsAnnouncements />
            <FaqSection />
            <PublicContact />
          </div>
        )}

        {activeTab === 'services' && <PublicServices />}

        {activeTab === 'programs-projects' && <PublicProgramsProjects />}

        {activeTab === 'nikah' && <PublicNikahInfo />}

        {activeTab === 'welfare' && <PublicWelfareZakah />}

        {activeTab === 'mahal-book' && <PublicMahalBook />}

        {activeTab === 'events' && <PublicEventsAnnouncements />}

        {activeTab === 'faq' && (
          <div className="py-12 pb-24">
            <FaqSection />
          </div>
        )}

        {activeTab === 'contact' && <PublicContact />}

        {activeTab === 'ask-mahal' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <AskMahalAssistant />
          </div>
        )}

        {/* Member Dashboard Route */}
        {activeTab === 'member-dashboard' && (
          <div>
            {!currentUser ? (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-[#eadfbf] text-center shadow-xl space-y-4">
                <div className="w-14 h-14 bg-[#087f87]/15 text-[#063d4a] rounded-2xl flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7 text-[#087f87]" />
                </div>
                <h2 className="font-serif font-bold text-xl text-[#063d4a]">Member Portal Access</h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Please sign in with your registered email or phone number to view your household directory, family records, and monthly contribution dues.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setOpenAuthModal(true)}
                    className="w-full py-3 bg-[#087f87] hover:bg-[#063d4a] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    Sign In or Register
                  </button>
                </div>
              </div>
            ) : (
              <MemberDashboard />
            )}
          </div>
        )}

        {/* Admin Dashboard Route - Strictly for Authorized Admin Gmails Only */}
        {activeTab === 'admin-dashboard' && (
          <div>
            {!currentUser ? (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-[#eadfbf] text-center shadow-xl space-y-4">
                <div className="w-14 h-14 bg-[#d4a329]/20 text-[#063d4a] rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-7 h-7 text-[#d4a329]" />
                </div>
                <h2 className="font-serif font-bold text-xl text-[#063d4a]">
                  Admin Authentication Required
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The Central Administration Console is strictly restricted to committee-authorized Gmails (e.g. <strong>rumaispkdr@gmail.com</strong>).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setOpenAuthModal(true)}
                    className="w-full py-3 bg-[#063d4a] hover:bg-[#087f87] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In with Admin Gmail</span>
                    <ArrowRight className="w-4 h-4 text-[#d4a329]" />
                  </button>
                </div>
              </div>
            ) : !isUserAdmin(currentUser?.email) ? (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 text-center shadow-xl space-y-4">
                <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Access Restricted to Admin Only
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You are logged in as <strong>{currentUser.email}</strong> with <strong>Member</strong> privileges. The Admin Dashboard is only accessible to authorized committee Gmails.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200 text-left">
                  💡 If you need admin access, an existing administrator (such as <strong>rumaispkdr@gmail.com</strong>) must add your Gmail in the Admin Access Grants panel.
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('member-dashboard')}
                    className="w-full py-3 bg-[#087f87] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    Go to Your Member Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <AdminDashboard />
            )}
          </div>
        )}
      </main>

      {/* Floating AI Assistant Widget for anywhere on the platform */}
      {activeTab !== 'ask-mahal' && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-2rem)]">
          {isAiFloatingOpen ? (
            <div className="w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] shadow-2xl rounded-3xl overflow-hidden border border-[#ecffb6] bg-white animate-in slide-in-from-bottom-4">
              <AskMahalAssistant onClose={() => setIsAiFloatingOpen(false)} />
            </div>
          ) : (
            <button
              id="floating-ai-button"
              onClick={() => setIsAiFloatingOpen(true)}
              className="group flex items-center gap-2.5 px-4 py-3 sm:px-4.5 sm:py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] border-2 border-[#d6fb00]/60 font-black text-xs rounded-full shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_25px_rgba(214,251,0,0.55)] hover:border-[#d6fb00] cursor-pointer"
              title="Open Mahal AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-[#d6fb00] transition-transform duration-300 group-hover:rotate-12" />
              <span className="tracking-wide font-extrabold text-white group-hover:text-[#d6fb00] transition-colors">Ask Mahal AI</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d6fb00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d6fb00]"></span>
              </span>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Root Modals Mount */}
      {activePaymentModal && (
        <PaymentModal
          payment={activePaymentModal}
          onClose={() => setActivePaymentModal(null)}
        />
      )}

      {activeReceiptModal && (
        <ReceiptModal
          receipt={activeReceiptModal}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}

      {activeCertificateModal && (
        <CertificateModal
          certificate={activeCertificateModal}
          onClose={() => setActiveCertificateModal(null)}
        />
      )}

      {openVerifyModal && (
        <VerifyCertificateModal onClose={() => setOpenVerifyModal(false)} />
      )}

      {openNikahModal && (
        <NikahApplicationModal onClose={() => setOpenNikahModal(false)} />
      )}

      {openWelfareModal && (
        <WelfareApplicationModal onClose={() => setOpenWelfareModal(false)} />
      )}

      {openZakahModal && (
        <ZakahApplicationModal onClose={() => setOpenZakahModal(false)} />
      )}

      {openEnquiryModal && (
        <EnquiryModal onClose={() => setOpenEnquiryModal(false)} />
      )}

      {openAuthModal && (
        <AuthModal onClose={() => setOpenAuthModal(false)} />
      )}

      {openDeathCertModal && (
        <DeathCertificateApplyModal
          isOpen={openDeathCertModal}
          onClose={() => setOpenDeathCertModal(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
