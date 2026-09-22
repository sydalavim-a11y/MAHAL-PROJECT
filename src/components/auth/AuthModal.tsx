import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Home,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Building2,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { language, login, register } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'RESET'>('LOGIN');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regHouse, setRegHouse] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password entries.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Please confirm that you agree to the Mahal Constituent Charter & Data Terms.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        houseName: regHouse,
      });

      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please provide your registered email or phone.');
      return;
    }
    setSuccessMsg('A password reset instruction link & SMS token has been dispatched to your contact.');
    setTimeout(() => {
      setMode('LOGIN');
      setSuccessMsg('');
    }, 2800);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#00171b]/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 w-full max-w-4xl overflow-hidden my-auto flex flex-col md:grid md:grid-cols-12 relative"
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-700 bg-stone-100/80 hover:bg-stone-200 rounded-full transition-all cursor-pointer shadow-xs"
          aria-label="Close"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT BRAND PANEL (Showcase & Trust) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#00545f] via-[#003a42] to-[#00242a] text-white p-8 flex-col justify-between relative overflow-hidden">
          {/* Subtle background geometric glowing circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#d6fb00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#087f87]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6aaddefb454100171fe8c7ff/6ab21b514d7fa8af16e72fd0/d695192d-image-qgxv.png"
                alt="Noor Mahal Logo"
                className="w-12 h-12 object-contain drop-shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xl text-white font-serif tracking-tight">
                    Noor Mahal
                  </h3>
                  <span className="text-[9px] uppercase font-black tracking-widest bg-[#d6fb00] text-[#00434c] px-2 py-0.5 rounded-full">
                    PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-[#ecffb6] font-medium">
                  {language === 'ml' ? 'നൂറുൽ ഹുദാ മഹല്ല് ജമാഅത്ത്' : 'Noor-ul-Huda Mahallu Jama-ath'}
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h2 className="text-2xl font-bold font-serif leading-snug tracking-tight text-white">
                {mode === 'LOGIN' && (language === 'ml' ? 'സ്വാഗതം, പ്രിയ മഹല്ല് അംഗമേ' : 'Welcome to Noor Mahal Gateway')}
                {mode === 'REGISTER' && (language === 'ml' ? 'ഡിജിറ്റൽ കുടുംബ രജിസ്ട്രേഷൻ' : 'Join Your Digital Mahal Community')}
                {mode === 'RESET' && (language === 'ml' ? 'പാസ്‌വേഡ് പുനഃക്രമീകരിക്കാം' : 'Reset Your Password')}
              </h2>
              <p className="text-xs text-[#ecffb6]/85 leading-relaxed font-normal">
                {language === 'ml'
                  ? 'മാസവരി ഡിജിറ്റലായി അടയ്ക്കാനും നിക്കാഹ്/മരണ സർട്ടിഫിക്കറ്റുകൾ, കുടുംബ വിവരങ്ങൾ എന്നിവ സുരക്ഷിതമായി കൈകാര്യം ചെയ്യാനും പ്രവേശിക്കുക.'
                  : 'Pay monthly dues, track household records, apply for authenticated Nikah & Death certificates, and access 24/7 community welfare.'}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3.5 text-xs text-[#eaf7f3]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#d6fb00]">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span>Instant QR-verified digital certificates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#d6fb00]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Direct UPI / Card monthly dues receipts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#d6fb00]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span>Role-based admin & member separation</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Waqf Info */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15">
            <div className="flex items-center gap-2 text-[11px] text-[#ecffb6]">
              <ShieldCheck className="w-4 h-4 text-[#d6fb00] shrink-0" />
              <span>SSL 256-Bit Encrypted • Kerala Waqf Reg: KL-PKD/2024/088</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL (Interactive Modern Web UI) */}
        <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-between bg-white">
          <div>
            {/* Mobile Header Branding */}
            <div className="flex items-center gap-3 mb-5 md:hidden">
              <img
                src="https://d3p662obnq9uz2.cloudfront.net/chat-uploads/chat/user/6aaddefb454100171fe8c7ff/6ab21b514d7fa8af16e72fd0/d695192d-image-qgxv.png"
                alt="Noor Mahal Logo"
                className="w-10 h-10 object-contain drop-shadow"
              />
              <div>
                <h3 className="font-extrabold text-lg text-[#00545f] font-serif leading-tight">
                  Noor Mahal
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  {language === 'ml' ? 'ഡിജിറ്റൽ പോർട്ടൽ' : 'Official Portal'}
                </p>
              </div>
            </div>

            {/* Segmented Tab Bar (Sign In / Register) */}
            <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center text-xs font-bold mb-5 shadow-inner">
              <button
                type="button"
                id="tab-btn-signin"
                onClick={() => {
                  setMode('LOGIN');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'LOGIN'
                    ? 'bg-[#00545f] text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'ലോഗിൻ' : 'Sign In'}</span>
              </button>

              <button
                type="button"
                id="tab-btn-register"
                onClick={() => {
                  setMode('REGISTER');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'REGISTER'
                    ? 'bg-[#00545f] text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'പുതിയ അംഗത്വം' : 'Register Member'}</span>
              </button>
            </div>

            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="leading-snug">
                  <strong className="block font-bold">Authentication Notice:</strong>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {language === 'ml' ? 'ഇമെയിൽ അല്ലെങ്കിൽ ജിമെയിൽ വിലാസം' : 'Email Address / Gmail'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. member@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 hover:border-stone-300 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs sm:text-sm text-stone-900 transition-all outline-none"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {language === 'ml' ? 'പാസ്‌വേഡ്' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('RESET');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-[#00545f] hover:text-[#003a42] font-semibold hover:underline cursor-pointer"
                    >
                      {language === 'ml' ? 'പാസ്‌വേഡ് മറന്നോ?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full pl-10 pr-11 py-2.5 bg-stone-50/70 border border-stone-200 hover:border-stone-300 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs sm:text-sm text-stone-900 transition-all outline-none"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#00545f] border-stone-300 rounded focus:ring-[#00545f] cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#00545f] hover:bg-[#003a42] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm group"
                >
                  <span>
                    {loading
                      ? (language === 'ml' ? 'പരിശോധിക്കുന്നു...' : 'Authenticating Credentials...')
                      : (language === 'ml' ? 'പോർട്ടലിൽ പ്രവേശിക്കുക' : 'Sign In to Noor Mahal Portal')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#d6fb00] transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-name-input"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Mohammed Farooq"
                      className="w-full pl-10 pr-3.5 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email / Gmail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email-input"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="farooq@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-phone-input"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="98460 12345"
                        className="w-full pl-10 pr-3.5 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    House Name / Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Home className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-house-input"
                      type="text"
                      value={regHouse}
                      onChange={(e) => setRegHouse(e.target.value)}
                      placeholder="e.g. Baitul Aman, West Hill"
                      className="w-full pl-10 pr-3.5 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Create Password (Min 6) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full pl-10 pr-9 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-confirm-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-3.5 py-2 bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs text-stone-900 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-stone-600">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-[#00545f] border-stone-300 rounded focus:ring-[#00545f] cursor-pointer shrink-0"
                    />
                    <span>
                      I affirm that I am a resident/constituent of Noor-ul-Huda Mahallu and agree to the Digital Registry Charter & Privacy Terms.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#00545f] hover:bg-[#003a42] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm group"
                >
                  <span>{loading ? 'Registering Account...' : 'Complete Registration & Digital ID'}</span>
                  <ArrowRight className="w-4 h-4 text-[#d6fb00] transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}

            {/* 3. RESET PASSWORD FORM */}
            {mode === 'RESET' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  <p className="font-semibold text-stone-900">Forgot your credentials?</p>
                  <p>
                    Enter your registered email address or mobile phone number. Our system will generate a secure verification token to restore your account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Registered Email or Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. farooq@gmail.com or 9846012345"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#00545f] focus:ring-4 focus:ring-[#00545f]/10 rounded-xl text-xs sm:text-sm text-stone-900 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('LOGIN');
                      setErrorMsg('');
                    }}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00545f] hover:bg-[#003a42] text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer"
                  >
                    Send Reset Token
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card Footer: Need Help & Return */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#00545f]" />
              <span>Need help? Contact Noor Mahal Office:</span>
              <a href="tel:+919846012345" className="font-bold text-[#00545f] hover:underline">
                +91 98460 12345
              </a>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 cursor-pointer font-medium"
            >
              Cancel and return to site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

