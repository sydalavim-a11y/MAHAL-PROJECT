import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import {
  CreditCard,
  Heart,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Radio,
  FileText,
} from 'lucide-react';
import { fetchLivePrayerTimes, PrayerSchedule } from '../../lib/prayerService';

export const Hero: React.FC = () => {
  const {
    language,
    currentUser,
    setActiveTab,
    setOpenNikahModal,
    setOpenDeathCertModal,
    setOpenVerifyModal,
    setActivePaymentModal,
    payments,
    setOpenAuthModal,
  } = useApp();

  const [prayerSchedule, setPrayerSchedule] = useState<PrayerSchedule>({
    prayers: [
      { name: 'Fajr', nameMalayalam: 'സുബ്ഹി', time: '05:08 AM' },
      { name: 'Dhuhr', nameMalayalam: 'ളുഹ്ര്', time: '12:28 PM' },
      { name: 'Asr', nameMalayalam: 'അസ്വർ', time: '04:42 PM' },
      { name: 'Maghrib', nameMalayalam: 'മഗ്‌രിബ്', time: '06:31 PM' },
      { name: 'Isha', nameMalayalam: 'ഇശാഅ്', time: '07:44 PM' },
      { name: "Juma'h", nameMalayalam: 'ജുമുഅ', time: '12:45 PM' },
    ],
    hijriDate: 'Hijri Calendar Active',
    source: 'Live Public Feed (Aladhan / Kerala Auqaf)',
    location: 'West Hill Juma Masjid, Kozhikode',
    lastUpdated: 'Live',
  });

  useEffect(() => {
    fetchLivePrayerTimes().then((data) => {
      setPrayerSchedule(data);
    });
  }, []);

  const handlePayDues = () => {
    if (currentUser) {
      const pending = payments.find((p) => p.status === 'PENDING') || payments[0];
      setActivePaymentModal(pending);
    } else {
      setOpenAuthModal(true);
    }
  };

  return (
    <header className="hero relative overflow-hidden text-[#00434c] bg-[#fafdf2]">
      {/* Decorative Traditional Hanging Lanterns with Lime Glow */}
      <div className="lantern left-[8%] [animation-delay:0s]" />
      <div className="lantern left-[22%] [animation-delay:1.2s]" />
      <div className="lantern right-[10%] [animation-delay:0.6s]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28 relative z-10">
        {/* Today's Congregation Prayer Timings Strip - Public Source Feed */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#00545f] text-white rounded-3xl p-5 sm:p-6 mb-14 sm:mb-16 max-w-4xl mx-auto shadow-xl border border-[#ecffb6]/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 mb-3.5 border-b border-[#ecffb6]/20 pb-3 text-xs">
            <div className="flex items-center gap-2 font-black text-[#d6fb00]">
              <Clock className="w-4 h-4 text-[#d6fb00]" />
              <span className="text-sm">Today's Congregation Prayer Timings (നമസ്കാര സമയം)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#ecffb6] font-mono">
              <span className="inline-flex items-center gap-1 bg-[#003a42] px-2.5 py-0.5 rounded-full text-[#d6fb00] text-[10px] font-bold">
                <Radio className="w-2.5 h-2.5 text-[#d6fb00] animate-pulse" />
                <span>{prayerSchedule.source}</span>
              </span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">{prayerSchedule.hijriDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-xs">
            {prayerSchedule.prayers.map((p) => (
              <div
                key={p.name}
                className={`py-2.5 px-3 rounded-2xl transition-all ${
                  p.name === "Juma'h"
                    ? 'bg-[#d6fb00] text-[#00545f] font-black shadow-md scale-102 border border-[#d6fb00]'
                    : 'bg-[#003a42] text-[#ecffb6] hover:bg-[#004752]'
                }`}
              >
                <div
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    p.name === "Juma'h" ? 'text-[#00545f]' : 'text-[#ecffb6]/80'
                  }`}
                >
                  {p.name}
                </div>
                {p.nameMalayalam && (
                  <div className="text-[9px] opacity-75 font-malayalam leading-none mt-0.5">
                    {p.nameMalayalam}
                  </div>
                )}
                <div className="font-mono font-bold text-xs sm:text-sm mt-1">{p.time}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Grid: Spacious Content on Left, 3D Character on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ecffb6] text-[#00545f] border border-[#d6fb00]">
              <Sparkles className="w-4 h-4 text-[#00545f]" />
              <span>Together for Faith, Family & Future</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] font-serif text-[#00545f] tracking-tight">
              Building a connected, <br />
              <span className="text-[#00707e]">caring community</span>
            </h1>

            <p className="arabic-text text-2xl sm:text-3xl text-[#00545f] font-serif font-bold pt-1">
              أَهْلاً وَسَهْلاً بِكُمْ
            </p>

            <p className="text-[#3d686e] text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Welcome to the official portal of Noor Mahal. We strive to nurture faith, support families in need, and provide transparent services for our community members.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black text-sm transition-all shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-pay-dues-btn"
                onClick={handlePayDues}
                className="px-6 py-4 rounded-2xl font-bold text-xs sm:text-sm bg-white hover:bg-[#fafdf2] text-[#00545f] border-2 border-[#00545f] shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
              >
                <CreditCard className="w-4 h-4 text-[#00545f]" />
                <span>Pay Monthly Dues (മാസവരി)</span>
              </button>

              <button
                id="hero-ask-ai-btn"
                onClick={() => setActiveTab('ask-mahal')}
                className="px-5 py-4 rounded-2xl font-bold text-xs bg-[#ecffb6] hover:bg-[#d6fb00] text-[#00545f] border border-[#d6fb00] shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:shadow hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-[#00545f]" />
                <span>Ask Mahal AI</span>
              </button>
            </div>

            {/* Civil Certificate Registry Quick Links */}
            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#3d686e]">
              <button
                id="hero-death-cert-apply-btn"
                onClick={() => setOpenDeathCertModal(true)}
                className="hover:text-amber-900 transition-colors flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>Apply Death Certificate</span>
              </button>

              <button
                id="hero-marital-cert-apply-btn"
                onClick={() => setOpenNikahModal(true)}
                className="hover:text-rose-900 transition-colors flex items-center gap-1.5 font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 cursor-pointer shadow-2xs"
              >
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Apply Marital Certificate</span>
              </button>

              <button
                id="hero-verify-cert-btn"
                onClick={() => setOpenVerifyModal(true)}
                className="hover:text-[#00545f] transition-colors flex items-center gap-1.5 font-bold text-[#00545f] underline decoration-[#d6fb00] cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00545f]" />
                <span>Verify Issued Certificate</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3D Welcoming Character Illustration & Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Glowing Ambient Radial Backdrop with Lime & Spruce */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#00545f]/20 via-[#d6fb00]/25 to-transparent blur-2xl pointer-events-none -z-10" />

            <div className="relative w-full max-w-[380px] flex flex-col items-center">
              {/* Welcoming Floating Speech Bubble with Staggered Motion */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                transition={{
                  y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                  opacity: { duration: 0.6, delay: 0.5 },
                }}
                className="absolute -top-3 right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border-2 border-[#ecffb6] px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span className="text-base">🤝</span>
                <div className="text-left">
                  <p className="text-[11px] font-extrabold text-[#00545f] font-serif">
                    Assalamu Alaikum!
                  </p>
                  <p className="text-[9px] text-[#00707e] font-malayalam font-bold">
                    അസ്സലാമു അലൈക്കും
                  </p>
                </div>
              </motion.div>

              {/* 3D Animated Character Container with Smooth Floating & Tilt */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotateZ: [-1, 1, -1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.03,
                  rotateY: 6,
                  transition: { duration: 0.3 },
                }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#ecffb6] bg-gradient-to-b from-[#fafdf2] to-white p-3"
                style={{ perspective: 1000 }}
              >
                <img
                  src="/assets/welcoming_boy.jpg"
                  alt="Islamic Mahal Welcoming Representative"
                  className="max-h-[380px] w-auto object-contain rounded-2xl filter drop-shadow-md select-none pointer-events-none"
                />

                {/* Inner Highlight Tag with Lime Accent */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#00545f]/95 backdrop-blur-sm text-[#d6fb00] px-4 py-2 rounded-full text-[10px] font-black tracking-wide border border-[#d6fb00]/40 shadow-md flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#d6fb00] animate-ping" />
                  <span>Mahal Digital Portal • 24/7 Service</span>
                </div>
              </motion.div>

              {/* Character Soft Ground Shadow */}
              <motion.div
                animate={{
                  scaleX: [0.85, 1, 0.85],
                  opacity: [0.35, 0.5, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                }}
                className="w-52 h-4 bg-[#00545f]/20 rounded-full blur-sm mt-4"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
