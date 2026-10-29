import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCurrentTotp, getRemainingSeconds } from '../../utils/totp';
import { ShieldCheck, Lock, KeyRound, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    adminLogin,
    verify2FA,
    twoFactorConfig,
    isAdminAuthenticated,
    is2FAVerified,
  } = useApp();

  const [password, setPassword] = useState('hasfarm2026');
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState<'password' | 'totp'>(() => {
    return isAdminAuthenticated && !is2FAVerified && twoFactorConfig.isEnabled ? 'totp' : 'password';
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentLiveCode = generateCurrentTotp(twoFactorConfig.secret);
  const remainingSec = getRemainingSeconds();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = adminLogin(password);
    if (!res.success) {
      setErrorMsg(res.error || 'Password salah');
      return;
    }

    if (res.requires2FA) {
      setStep('totp');
    } else {
      onSuccess();
      onClose();
    }
  };

  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!totpCode.trim()) {
      setErrorMsg('Masukkan 6 digit kode dari aplikasi authenticator');
      return;
    }

    const res = verify2FA(totpCode);
    if (res.isValid) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F2] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#EADCCF]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between border-b border-[#692C15]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E8A882]" />
            <h3 className="font-serif-display text-lg font-bold tracking-tight">
              Portal Keamanan Manajemen Hasfarm
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-[#3E180A]">
          {step === 'password' ? (
            /* STEP 1: Admin Password */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4E9DF] flex items-center justify-center mx-auto text-[#7B351B] border border-[#E0CFBF]">
                <Lock className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h4 className="font-serif-display text-xl font-bold text-[#3E180A]">
                  Autentikasi Akses Admin
                </h4>
                <p className="text-xs text-[#7A4B38] mt-1">
                  Masukkan kata sandi manajemen untuk mengakses stok, HPP & keuangan.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Kata Sandi Admin:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password admin..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                />
                <p className="text-[10px] text-[#A0705B] mt-1">
                  Default sandi pengujian: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#DAC4AF]">hasfarm2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjutkan ke Verifikasi 2FA</span>
              </button>
            </form>
          ) : (
            /* STEP 2: Two-Factor Authentication TOTP */
            <form onSubmit={handleTotpSubmit} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center mx-auto text-emerald-700 border border-[#C8E6C9]">
                <KeyRound className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h4 className="font-serif-display text-xl font-bold text-[#3E180A]">
                  Verifikasi Dua Faktor (2FA)
                </h4>
                <p className="text-xs text-[#7A4B38] mt-1">
                  Buka aplikasi Authenticator Anda (Google / Microsoft Authenticator) dan masukkan 6 digit token keamanan.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Kode 6-Digit Authenticator:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full text-center tracking-[0.3em] font-mono text-lg font-bold py-2.5 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              {/* Helper for immediate testing */}
              <div className="p-3.5 bg-white rounded-xl border border-[#EBDCCF] text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#7A4B38]">
                  <span className="font-semibold flex items-center gap-1 text-[#4A1F10]">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C3E1E]" />
                    <span>Live Authenticator TOTP:</span>
                  </span>
                  <span className="font-mono text-[#8C3E1E] tabular-nums">
                    Berputar dlm {remainingSec}s
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#F8F1EB] p-2 rounded-lg">
                  <span className="font-mono text-base font-bold text-[#3E180A] tracking-wider">
                    {currentLiveCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTotpCode(currentLiveCode)}
                    className="px-2.5 py-1 bg-[#7B351B] text-white text-[11px] font-medium rounded hover:bg-[#602712] transition-colors"
                  >
                    Gunakan Kode Ini
                  </button>
                </div>
                <p className="text-[10px] text-[#A0705B]">
                  Atau gunakan kode master demo: <code className="font-mono">123456</code> atau salah satu kode cadangan pemulihan.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="w-1/3 py-2.5 rounded-xl border border-[#DAC4AF] bg-white text-xs font-semibold text-[#552310] hover:bg-[#FAF4EE]"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Verifikasi & Masuk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
