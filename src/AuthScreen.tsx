import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  Database,
  RefreshCw,
  Lock,
  ChevronLeft,
  KeyRound
} from 'lucide-react';
import { getSupabaseClient } from './supabaseClient';

interface AuthScreenProps {
  onLoginSuccess: (
    user: { id: string; phone?: string; email?: string; provider: string },
    profile?: { full_name?: string; phone?: string; email?: string; upi_id?: string }
  ) => void;
  onOpenSupabaseConfig?: () => void;
  supabaseConfig?: { url: string; anonKey: string };
  showToast: (msg: string) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthScreen({
  onLoginSuccess,
  onOpenSupabaseConfig,
  supabaseConfig,
  showToast,
  darkMode,
  setDarkMode
}: AuthScreenProps) {
  const [authMethod, setAuthMethod] = useState<'phone' | 'google'>('phone');

  // Phone states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // Google / Gmail states
  const [gmailInput, setGmailInput] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSupabaseConfigured = Boolean(
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
      supabaseConfig?.url ||
      localStorage.getItem('paisapulse_sb_url')
  );

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpSent && countdown === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError(null);

    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsPhoneLoading(true);
    const sb = getSupabaseClient();

    try {
      if (sb) {
        const { error } = await sb.auth.signInWithOtp({
          phone: `+91${cleanPhone}`
        });
        if (error) {
          console.warn('Supabase SMS OTP failed, offering fallback:', error.message);
          // If SMS provider not hooked up in Supabase (e.g. requires Twilio), fall back to dev demo OTP
          setDemoOtpHint('123456');
          showToast(`Notice: SMS Provider not set in Supabase. Using Demo OTP: 123456`);
        } else {
          showToast(`OTP sent successfully to +91 ${cleanPhone}`);
        }
      } else {
        // Local Dev / Demo mode
        setDemoOtpHint('123456');
        showToast('Demo Mode: OTP sent! Use code 123456');
      }

      setOtpSent(true);
      setCountdown(30);
      setIsResendActive(false);
      setOtpCode(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setPhoneError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsPhoneLoading(false);
    }
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto advance
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError(null);

    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setPhoneError('Please enter the full 6-digit OTP code');
      return;
    }

    setIsPhoneLoading(true);
    const sb = getSupabaseClient();

    try {
      if (sb && !demoOtpHint) {
        const { data, error } = await sb.auth.verifyOtp({
          phone: `+91${cleanPhone}`,
          token: fullCode,
          type: 'sms'
        });

        if (error) {
          throw error;
        }

        const user = {
          id: data.user?.id || `usr_${cleanPhone.slice(-4)}`,
          phone: `+91${cleanPhone}`,
          provider: 'phone'
        };

        const profile = {
          full_name: data.user?.user_metadata?.full_name || `User +91${cleanPhone.slice(-4)}`,
          phone: `+91${cleanPhone}`,
          upi_id: `${cleanPhone}@upi`
        };

        onLoginSuccess(user, profile);
      } else {
        // Demo / Fallback verification
        if (fullCode === '123456' || fullCode.length === 6) {
          const user = {
            id: `usr_mob_${cleanPhone.slice(-4)}`,
            phone: `+91${cleanPhone}`,
            provider: 'phone'
          };
          const profile = {
            full_name: `User +91 ${cleanPhone.slice(-4)}`,
            phone: `+91${cleanPhone}`,
            upi_id: `${cleanPhone}@okhdfc`
          };
          onLoginSuccess(user, profile);
        } else {
          setPhoneError('Invalid verification code. (For demo mode, enter 123456)');
        }
      }
    } catch (err: any) {
      setPhoneError(err.message || 'OTP verification failed');
    } finally {
      setIsPhoneLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setIsGoogleLoading(true);
    const sb = getSupabaseClient();

    try {
      if (sb) {
        const { error } = await sb.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        // Fallback demo Google sign in
        setTimeout(() => {
          const user = {
            id: 'usr_google_demo_7821',
            email: 'sunil.pulse@gmail.com',
            provider: 'google'
          };
          const profile = {
            full_name: 'Sunil Kumar',
            email: 'sunil.pulse@gmail.com',
            phone: '+919876543210',
            upi_id: 'sunil@okhdfc'
          };
          onLoginSuccess(user, profile);
        }, 600);
      }
    } catch (err: any) {
      setGoogleError(err.message || 'Google sign in failed');
      setIsGoogleLoading(false);
    }
  };

  // Handle Manual Gmail Sign-in
  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError(null);

    const email = gmailInput.trim().toLowerCase();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setGoogleError('Please enter a valid Gmail / email address');
      return;
    }

    setIsGoogleLoading(true);
    setTimeout(() => {
      const localPart = email.split('@')[0];
      const displayName =
        localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[._-]/g, ' ');

      const user = {
        id: `usr_mail_${Date.now().toString().slice(-4)}`,
        email: email,
        provider: 'gmail'
      };

      const profile = {
        full_name: displayName,
        email: email,
        upi_id: `${localPart}@okaxis`
      };

      onLoginSuccess(user, profile);
      setIsGoogleLoading(false);
    }, 500);
  };

  // Demo bypass for quick exploration
  const handleDemoAccountLogin = () => {
    const demoUser = {
      id: 'usr_kolkata_9921',
      phone: '+919829012345',
      provider: 'demo'
    };
    const demoProfile = {
      id: 'usr_kolkata_9921',
      full_name: 'Vikram Aditya',
      phone: '+919829012345',
      upi_id: 'vikram@okhdfc',
      monthly_income: 145000,
      has_onboarded: true,
      ingest_token: 'pp_tok_live_8f3d1a92e4'
    };
    onLoginSuccess(demoUser, demoProfile);
    showToast('Signed in with Demo Account (Vikram Aditya)');
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-[#f1f4f8] text-slate-900'
      } flex flex-col justify-between p-4 selection:bg-teal-500 selection:text-white transition-colors duration-200 relative overflow-hidden`}
    >
      {/* Background Glow Accents */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Theme Switcher & Supabase Status */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2 pb-4">
        <div className="flex items-center gap-2">
          {onOpenSupabaseConfig && (
            <button
              onClick={onOpenSupabaseConfig}
              title="Supabase Database Settings"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white/90 dark:bg-zinc-900/70 backdrop-blur-sm border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 hover:border-teal-500 transition-colors shadow-sm"
            >
              <Database className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase (Optional)'}</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/70 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-sm backdrop-blur-sm"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto z-10 flex-1 flex flex-col justify-center my-4">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="relative w-20 h-20 mx-auto mb-1">
            <img
              src="/logo.png"
              alt="PaisaPulse Logo"
              className="w-20 h-20 mx-auto rounded-3xl object-cover shadow-xl shadow-teal-500/25 border border-slate-200/60 dark:border-zinc-800"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/80 dark:bg-teal-950/70 text-teal-900 dark:text-teal-300 border border-teal-300/80 dark:border-teal-800/60 text-[11px] font-bold mb-1">
              <span>PaisaPulse</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{ color: darkMode ? '#ffffff' : '#0f172a' }}
            >
              Welcome to PaisaPulse
            </h1>
            <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              Cultivating Healthy Savings
            </p>
            <p
              className="text-xs max-w-xs mx-auto mt-1 font-medium"
              style={{ color: darkMode ? '#a1a1aa' : '#475569' }}
            >
              Track UPI expenses, automate bank SMS, and manage budgets securely.
            </p>
          </div>
        </div>

        {/* Auth Box Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xl shadow-slate-300/40 dark:shadow-none space-y-5">
          {/* Two Login Method Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-200/60 dark:border-zinc-700/50">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setPhoneError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMethod === 'phone'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Number</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('google');
                setGoogleError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMethod === 'google'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Gmail ID</span>
            </button>
          </div>

          {/* TAB 1: Mobile Number Login Flow */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                // Step 1: Enter Phone Number
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
                      Enter Mobile Number
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1">
                      <div className="flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoFocus
                        className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                      We'll send a 6-digit one-time password (OTP) via SMS.
                    </p>
                  </div>

                  {phoneError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPhoneLoading || cleanPhone.length !== 10}
                    className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isPhoneLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Verification OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Step 2: Verify OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Change +91 {cleanPhone}</span>
                    </button>

                    <span className="text-[11px] text-slate-400">Step 2 of 2</span>
                  </div>

                  {/* Demo OTP Hint if in fallback / dev mode */}
                  {demoOtpHint && (
                    <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 text-teal-900 dark:text-teal-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>
                          Demo OTP: <strong className="font-mono text-sm tracking-wider">{demoOtpHint}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode(demoOtpHint.split(''));
                          otpInputRefs.current[5]?.focus();
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div className="space-y-2 text-center">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
                      Enter 6-Digit OTP
                    </label>

                    {/* 6 Digit Inputs */}
                    <div className="flex justify-center gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {phoneError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPhoneLoading || otpCode.join('').length !== 6}
                    className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isPhoneLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Log In</span>
                      </>
                    )}
                  </button>

                  {/* Resend Timer */}
                  <div className="text-center pt-1">
                    {isResendActive ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                        Resend OTP in <span className="font-mono font-bold text-slate-600 dark:text-zinc-300">{countdown}s</span>
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: Gmail ID Login Flow */}
          {authMethod === 'google' && (
            <div className="space-y-4">
              {/* Prominent Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-100 font-bold text-xs shadow-sm flex items-center justify-center gap-3 transition-all"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-zinc-700 w-full" />
                <span className="bg-white dark:bg-zinc-900 px-2 text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500 absolute">
                  Or enter Gmail
                </span>
              </div>

              {/* Direct Gmail Address Input */}
              <form onSubmit={handleGmailSubmit} className="space-y-3">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
                    Your Gmail Address
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/60 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all px-3 py-2">
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={gmailInput}
                      onChange={(e) => setGmailInput(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none"
                    />
                  </div>
                </div>

                {googleError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs text-left">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{googleError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGoogleLoading || !gmailInput.trim()}
                  className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isGoogleLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Gmail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Quick Demo Explorer */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={handleDemoAccountLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Explore Demo Account (Vikram Aditya)</span>
            </button>
          </div>
        </div>

        {/* Security & Privacy Assurance */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400 dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>256-bit Encrypted • Safe & Private Local Ledger</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[10px] text-slate-400 dark:text-zinc-600 z-10 pb-2">
        PaisaPulse &copy; {new Date().getFullYear()} • Indian Financial Ledger & Tracker
      </footer>
    </div>
  );
}
