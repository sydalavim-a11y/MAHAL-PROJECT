import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Shield,
  FileCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    currentUser,
    currentRole,
    logout,
    setOpenAuthModal,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setOpenVerifyModal,
    isUserAdmin,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const userIsAdmin = isUserAdmin(currentUser?.email);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchorClick = (id: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#00545f] text-white border-b border-[#ecffb6]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name Matching User Template */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick(currentUser ? (userIsAdmin ? 'admin-dashboard' : 'member-dashboard') : 'home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <img
              src="https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6aaddefb454100171fe8c7ff/6ab21b514d7fa8af16e72fd0/d695192d-image-qgxv.png"
              alt="Noor Mahal Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow transition-transform group-hover:scale-105 shrink-0"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-serif whitespace-nowrap">
                  Noor Mahal
                </span>
                {userIsAdmin && activeTab === 'admin-dashboard' && (
                  <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-widest bg-[#d6fb00] text-[#00545f] px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    CENTRAL ADMIN CONSOLE
                  </span>
                )}
                {userIsAdmin && activeTab !== 'admin-dashboard' && (
                  <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-widest bg-[#d6fb00] text-[#00545f] px-2 py-0.5 rounded-full shadow-xs">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#ecffb6] font-medium hidden md:block whitespace-nowrap">
                {language === 'ml' ? 'നൂറുൽ ഹുദാ ജുമാ മസ്ജിദ് & മഹല്ല് ഭരണസമിതി' : 'Noor-ul-Huda Mahallu Jama-ath Committee'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-[#003a42] text-[#d6fb00] font-bold border border-[#d6fb00]/30' : 'text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white'
              }`}
            >
              {t.nav.home}
            </button>

            <button
              id="nav-about-anchor"
              onClick={() => handleAnchorClick('about')}
              className="px-3 py-2 text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              About
            </button>

            <button
              id="nav-services-anchor"
              onClick={() => handleAnchorClick('services')}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'services' ? 'bg-[#003a42] text-[#d6fb00] font-bold border border-[#d6fb00]/30' : 'text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white'
              }`}
            >
              Services
            </button>

            <button
              id="nav-programs-anchor"
              onClick={() => handleAnchorClick('programs-projects')}
              className="px-3 py-2 text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Programs & Projects
            </button>

            <button
              id="nav-contact-anchor"
              onClick={() => handleAnchorClick('contact')}
              className="px-3 py-2 text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Contact
            </button>

            <button
              id="nav-faq-anchor"
              onClick={() => handleAnchorClick('faq')}
              className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'faq' ? 'bg-[#003a42] text-[#d6fb00] font-bold border border-[#d6fb00]/30' : 'text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white'
              }`}
            >
              {language === 'ml' ? 'ചോദ്യങ്ങൾ (FAQ)' : 'FAQ'}
            </button>

            {/* Live Document Verification with Automatic Holder Sync - STRICTLY WHEN LOGGED IN */}
            {currentUser && (
              <button
                id="nav-verify-modal"
                onClick={() => setOpenVerifyModal(true)}
                className="px-3 py-2 text-[#d6fb00] hover:bg-[#003a42] rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs border border-[#d6fb00]/30 shadow-xs cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-[#d6fb00]" />
                <span>Verify Document</span>
              </button>
            )}

            {/* Admin Console Tab - STRICTLY FOR ADMIN ONLY */}
            {userIsAdmin && (
              <button
                id="nav-admin-console"
                onClick={() => handleNavClick('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-[#d6fb00] text-[#00545f] font-black shadow-md'
                    : 'bg-[#003a42] text-[#d6fb00] hover:bg-[#003a42]/80 border border-[#d6fb00]/40 font-bold'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Member Portal Tab - If logged in and NOT admin */}
            {currentUser && !userIsAdmin && (
              <button
                id="nav-member-portal"
                onClick={() => handleNavClick('member-dashboard')}
                className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'member-dashboard'
                    ? 'bg-[#003a42] text-[#d6fb00] font-bold border border-[#d6fb00]/30'
                    : 'text-[#ecffb6] hover:bg-[#003a42]/70 hover:text-white'
                }`}
              >
                Member Portal
              </button>
            )}

            <button
              id="nav-ask-mahal"
              onClick={() => handleNavClick('ask-mahal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'ask-mahal'
                  ? 'bg-[#d6fb00] text-[#00545f] font-black shadow'
                  : 'text-[#d6fb00] hover:bg-[#003a42]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#d6fb00]" />
              <span className="font-bold">{t.nav.askMahal}</span>
            </button>
          </nav>

          {/* Right Controls: Language Switcher, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher EN | മലയാളം */}
            <div id="language-switcher" className="flex items-center bg-[#003a42] p-1 rounded-xl border border-[#ecffb6]/30 text-xs font-semibold">
              <button
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#d6fb00] text-[#00545f] font-black shadow-xs'
                    : 'text-[#ecffb6] hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-[#ecffb6]/40 mx-0.5">|</span>
              <button
                id="lang-btn-ml"
                onClick={() => setLanguage('ml')}
                className={`px-2 py-1 rounded-lg font-malayalam transition-all cursor-pointer ${
                  language === 'ml'
                    ? 'bg-[#d6fb00] text-[#00545f] font-black shadow-xs'
                    : 'text-[#ecffb6] hover:text-white'
                }`}
              >
                മലയാളം
              </button>
            </div>

            {/* Notification Bell (if logged in) */}
            {currentUser && (
              <div className="relative">
                <button
                  id="notifications-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-[#ecffb6] hover:text-white hover:bg-[#003a42] transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#d6fb00] text-[#00545f] font-black text-[10px] rounded-full flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#00434c] rounded-2xl shadow-2xl border border-[#ecffb6] p-3 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-[#ecffb6]">
                      <span className="font-extrabold text-sm text-[#00545f]">Notifications ({unreadCount} unread)</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-[#00545f] font-bold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#ecffb6]/50 mt-1">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-[#3d686e]">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 transition-colors rounded-xl cursor-pointer ${
                              n.read ? 'hover:bg-[#fafdf2]' : 'bg-[#ecffb6]/40 hover:bg-[#ecffb6]/70'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#00545f]">{n.title}</span>
                              <span className="text-[10px] text-[#3d686e]">{n.date}</span>
                            </div>
                            <p className="text-[#3d686e] mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Portal Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="user-dashboard-btn"
                  onClick={() => handleNavClick(userIsAdmin ? 'admin-dashboard' : 'member-dashboard')}
                  className="flex items-center gap-1.5 bg-[#d6fb00] hover:bg-[#c5e800] text-[#00545f] font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">
                    {userIsAdmin ? 'Admin Desk' : currentUser.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  id="user-logout-btn"
                  onClick={logout}
                  className="p-2 text-[#ecffb6] hover:text-white hover:bg-[#003a42] rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-modal-btn"
                onClick={() => setOpenAuthModal(true)}
                className="flex items-center gap-1.5 bg-[#d6fb00] hover:bg-[#c5e800] text-[#00545f] font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / ലോഗിൻ</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#ecffb6] hover:text-white rounded-xl hover:bg-[#003a42] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#003a42] border-b border-[#ecffb6]/30 px-4 pt-3 pb-5 space-y-2 text-sm animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#ecffb6]/20">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-xl text-left cursor-pointer ${activeTab === 'home' ? 'bg-[#00545f] text-[#d6fb00] font-bold' : 'text-[#ecffb6]'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleAnchorClick('about')}
              className="p-2.5 rounded-xl text-left text-[#ecffb6] hover:bg-white/5 cursor-pointer"
            >
              About Mahal
            </button>
            <button
              onClick={() => handleAnchorClick('services')}
              className="p-2.5 rounded-xl text-left text-[#ecffb6] hover:bg-white/5 cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => handleAnchorClick('programs-projects')}
              className="p-2.5 rounded-xl text-left text-[#ecffb6] hover:bg-white/5 cursor-pointer"
            >
              Programs & Projects (പദ്ധതികൾ)
            </button>
            <button
              onClick={() => handleAnchorClick('contact')}
              className="p-2.5 rounded-xl text-left text-[#ecffb6] hover:bg-white/5 cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => handleAnchorClick('faq')}
              className="p-2.5 rounded-xl text-left text-[#ecffb6] hover:bg-white/5 cursor-pointer"
            >
              FAQ (ചോദ്യോത്തരങ്ങൾ)
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenVerifyModal(true);
                }}
                className="p-2.5 rounded-xl text-left text-[#d6fb00] font-bold cursor-pointer flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-[#d6fb00]" />
                <span>Verify Document</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('ask-mahal')}
              className="p-2.5 rounded-xl text-left text-[#d6fb00] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Ask Mahal AI
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-[#ecffb6] truncate">
                  Logged in: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-300 hover:text-white underline font-bold cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenAuthModal(true);
                }}
                className="w-full py-2.5 bg-[#d6fb00] text-[#00545f] font-black rounded-xl text-center text-xs cursor-pointer shadow-sm"
              >
                Sign In to Portal / ലോഗിൻ
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
