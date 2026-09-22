import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import {
  CreditCard,
  Heart,
  HeartHandshake,
  Coins,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  Clock,
  FileText,
} from 'lucide-react';

export const PublicServices: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    setOpenNikahModal,
    setOpenDeathCertModal,
    setOpenVerifyModal,
    setOpenWelfareModal,
    setOpenZakahModal,
    setActivePaymentModal,
    payments,
    setOpenAuthModal,
    families,
  } = useApp();

  const services = [
    {
      id: 'death-cert',
      icon: FileText,
      title: 'Death & Burial Certificate (മരണ & ഖബറടക്ക സർട്ടിഫിക്കറ്റ് അപേക്ഷ)',
      desc: 'Online application for official authenticated Death & Burial Certificate required for municipal records, hospital verification, inheritance settlement, and Qabarstan burial registry.',
      tag: 'Civil & Burial Registry',
      actionText: 'Apply for Death Certificate',
      onClick: () => setOpenDeathCertModal(true),
      featured: true,
    },
    {
      id: 'contributions',
      icon: CreditCard,
      title: 'Monthly Contributions (മാസവരി)',
      desc: 'Seamless UPI, Free Stripe, QR code, and net-banking dues payment with instant digitally verifiable receipt generation.',
      tag: 'UPI / Stripe / Instant Receipt',
      actionText: 'Pay Dues Online',
      onClick: () => {
        if (currentUser) {
          const pending = payments.find((p) => p.status === 'PENDING') || payments[0];
          setActivePaymentModal(pending);
        } else {
          setOpenAuthModal(true);
        }
      },
      featured: true,
    },
    {
      id: 'nikah',
      icon: Heart,
      title: 'Nikah Solemnization (നിക്കാഹ് രജിസ്ട്രേഷൻ)',
      desc: 'Guided application, Shariah verification, solemnization scheduling, and digital Nikah certificates with verification QR codes.',
      tag: 'Shariah Regulated',
      actionText: 'Start Nikah Application',
      onClick: () => setOpenNikahModal(true),
    },
    {
      id: 'welfare',
      icon: HeartHandshake,
      title: 'Welfare Relief Fund (റിലീഫ് സഹായം)',
      desc: 'Discretionary emergency medical aid, chronic illness support, and higher education assistance for registered families.',
      tag: 'Medical & Education Aid',
      actionText: 'Apply for Welfare Relief',
      onClick: () => setOpenWelfareModal(true),
    },
    {
      id: 'zakah',
      icon: Coins,
      title: 'Zakat Management (സകാത്ത് ശേഖരണവും വിതരണവും)',
      desc: 'Confidential assessment, Nisab calculator, and direct disbursement to the Quranic eight categories with strict dignity.',
      tag: 'Confidential & Direct',
      actionText: 'Submit Zakat Request',
      onClick: () => setOpenZakahModal(true),
    },
    {
      id: 'mahal-book',
      icon: BookOpen,
      title: 'Digital Mahal Book (മഹല്ല് രജിസ്റ്റർ)',
      desc: 'Official household registry, family census records, demographic trends, and residential verification records.',
      tag: 'Family Census & Directory',
      actionText: 'Explore Mahal Book',
      onClick: () => setActiveTab('mahal-book'),
    },
    {
      id: 'ai-desk',
      icon: Sparkles,
      title: 'Ask Mahal AI Assistant (എ.ഐ സഹായം)',
      desc: '24/7 bilingual assistant powered by Google Gemini for instant answers on committee procedures, dues, and rules.',
      tag: 'Gemini AI Powered',
      actionText: 'Launch AI Assistant',
      onClick: () => setActiveTab('ask-mahal'),
      featured: true,
    },
  ];

  return (
    <div>
      {/* About Section with Spruce & Lime Palette */}
      <section id="about" className="py-16 bg-[#fafdf2] border-b border-[#ecffb6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-[#00545f] mt-3 tracking-tight">
              Serving with sincerity and purpose
            </h2>
            <p className="text-sm text-[#3d686e] mt-2 font-medium">
              Dedicated to upholding spiritual values and community welfare in accordance with the Quran and Sunnah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl text-center border border-[#ecffb6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] flex items-center justify-center mx-auto mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg font-serif text-[#00545f]">Worship & Guidance</h3>
              <p className="text-xs text-[#3d686e] mt-3 leading-relaxed">
                Daily congregational prayers, Friday sermons, and spiritual guidance based on the Quran and Sunnah for all generations.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl text-center border-2 border-[#d6fb00] shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[#00545f] text-[#d6fb00] flex items-center justify-center mx-auto mb-4 shadow-xs">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg font-serif text-[#00545f]">Community Care</h3>
              <p className="text-xs text-[#3d686e] mt-3 leading-relaxed font-medium">
                Direct welfare assistance, zakat distribution, marriage facilitation, and bereavement support for families in need.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl text-center border border-[#ecffb6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg font-serif text-[#00545f]">Education & Youth</h3>
              <p className="text-xs text-[#3d686e] mt-3 leading-relaxed">
                Madrasa classes for children, adult Quran learning sessions, and career empowerment workshops for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Spruce & Lime Palette */}
      <section id="services" className="py-16 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]">
              What We Provide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-[#00545f] mt-3 tracking-tight">
              Comprehensive Community Services
            </h2>
            <p className="text-xs sm:text-sm text-[#3d686e] mt-2 font-medium">
              Transparent, accountable, and technology-driven governance for all Mahal constituents.
            </p>
          </div>

          {/* Stat Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] rounded-full text-xs font-bold shadow-xs">
              <Clock className="w-4 h-4 text-[#00545f]" />
              <span>5 Daily Congregations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] rounded-full text-xs font-bold shadow-xs">
              <Users className="w-4 h-4 text-[#00545f]" />
              <span>{families.length}+ Registered Households</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#fafdf2] text-[#00545f] border border-[#ecffb6] rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#00545f]" />
              <span>100% Digitally Audited Accounts</span>
            </div>
          </div>

          {/* Quick Certificate Actions Strip */}
          <div className="bg-gradient-to-r from-[#fafdf2] via-white to-[#fafdf2] rounded-3xl border-2 border-[#d6fb00]/60 p-5 sm:p-6 mb-10 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#00545f] text-[#d6fb00] px-2.5 py-0.5 rounded-full">
                    OFFICIAL CIVIL REGISTRY
                  </span>
                  <span className="text-xs font-bold text-[#00545f]">മഹല്ല് സർട്ടിഫിക്കറ്റ് സേവനങ്ങൾ</span>
                </div>
                <h4 className="font-serif font-black text-lg text-[#00545f] mt-1">
                  Need an authenticated Death, Marital, or Membership Certificate?
                </h4>
                <p className="text-xs text-[#3d686e]">
                  Instant digital processing with QR authentication and official committee secretariat stamp.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                <button
                  id="services-apply-death-cert-btn"
                  onClick={() => setOpenDeathCertModal(true)}
                  className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-200" />
                  <span>Apply Death Certificate</span>
                </button>

                <button
                  id="services-apply-marital-cert-btn"
                  onClick={() => setOpenNikahModal(true)}
                  className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-200" />
                  <span>Apply Marital Certificate</span>
                </button>

                <button
                  id="services-verify-cert-btn"
                  onClick={() => setOpenVerifyModal(true)}
                  className="px-4 py-2.5 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d6fb00]" />
                  <span>Verify Certificate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, index) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`bg-white p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    s.featured
                      ? 'border-2 border-[#00545f] shadow-md bg-gradient-to-b from-[#fafdf2] to-white'
                      : 'border-[#ecffb6] shadow-xs'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          s.featured
                            ? 'bg-[#00545f] text-[#d6fb00] shadow-xs'
                            : 'bg-[#fafdf2] text-[#00545f] border border-[#ecffb6]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-[#00545f] bg-[#ecffb6] border border-[#d6fb00] px-2.5 py-1 rounded-full">
                        {s.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base font-serif text-[#00545f]">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#3d686e] mt-2 leading-relaxed font-medium">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={s.onClick}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        s.featured
                          ? 'bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black shadow-xs'
                          : 'bg-[#fafdf2] hover:bg-[#00545f] text-[#00545f] hover:text-[#d6fb00] border border-[#ecffb6]'
                      }`}
                    >
                      <span>{s.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
