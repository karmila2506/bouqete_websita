import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCurrentTotp, getRemainingSeconds, validateTotpCode } from '../../utils/totp';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  QrCode,
  Copy,
  CheckCircle2,
  Lock,
  RefreshCw,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';

export const TwoFactorSecurityPanel: React.FC = () => {
  const { twoFactorConfig, toggle2FA, showToast } = useApp();

  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Live rotating TOTP clock
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds());
  const [currentLiveCode, setCurrentLiveCode] = useState(generateCurrentTotp(twoFactorConfig.secret));

  useEffect(() => {
    const timer = setInterval(() => {
      const sec = getRemainingSeconds();
      setRemainingSeconds(sec);
      setCurrentLiveCode(generateCurrentTotp(twoFactorConfig.secret));
    }, 1000);
    return () => clearInterval(timer);
  }, [twoFactorConfig.secret]);

  const copySecret = () => {
    navigator.clipboard.writeText(twoFactorConfig.secret);
    setCopiedSecret(true);
    showToast('Tersalin!', 'Kunci rahasia 2FA telah disalin.', 'success');
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(twoFactorConfig.backupCodes.join('\n'));
    setCopiedCodes(true);
    showToast('Tersalin!', 'Kode pemulihan cadangan telah disalin.', 'success');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleTestVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateTotpCode(testCode, twoFactorConfig.secret, twoFactorConfig.backupCodes);
    setTestResult({ isValid: res.isValid, message: res.message });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#7B351B]" />
            <span>Autentikasi Dua Faktor (2FA - Two-Factor Authentication)</span>
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Tingkatkan keamanan data sensitif toko, penentuan HPP, laporan keuangan, dan akses kasir dengan token berbasis waktu (TOTP).
          </p>
        </div>

        {/* 2FA Toggle Switch */}
        <div className="flex items-center gap-3 bg-[#FAF6F2] p-2.5 rounded-xl border border-[#DAC4AF] self-start sm:self-auto">
          <span className="text-xs font-bold text-[#3E180A]">
            Status 2FA:
          </span>
          <button
            onClick={() => toggle2FA(!twoFactorConfig.isEnabled)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              twoFactorConfig.isEnabled
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {twoFactorConfig.isEnabled ? 'AKTIF (PROTECTED)' : 'NONAKTIF'}
          </button>
        </div>
      </div>

      {/* Main Content Grid: Setup Authenticator App + Backup Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code & Authenticator Configuration (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
                Integrasi Aplikasi Authenticator
              </h4>
              <p className="text-xs text-[#7A4B38]">
                Kompatibel dengan Google Authenticator, Microsoft Authenticator & 1Password
              </p>
            </div>
            <span className="text-[10px] font-mono bg-[#FAF0E6] text-[#7B351B] px-2.5 py-1 rounded font-bold">
              RFC 6238 TOTP
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#FAF6F2] border border-[#EBDCCF]">
            {/* SVG QR Code */}
            <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-[#DAC4AF] shadow-xs flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <rect x="0" y="0" width="28" height="28" fill="currentColor" />
                <rect x="4" y="4" width="20" height="20" fill="white" />
                <rect x="8" y="8" width="12" height="12" fill="currentColor" />

                <rect x="72" y="0" width="28" height="28" fill="currentColor" />
                <rect x="76" y="4" width="20" height="20" fill="white" />
                <rect x="80" y="8" width="12" height="12" fill="currentColor" />

                <rect x="0" y="72" width="28" height="28" fill="currentColor" />
                <rect x="4" y="76" width="20" height="20" fill="white" />
                <rect x="8" y="80" width="12" height="12" fill="currentColor" />

                <rect x="36" y="10" width="8" height="14" fill="currentColor" />
                <rect x="50" y="10" width="12" height="8" fill="currentColor" />
                <rect x="36" y="36" width="28" height="28" fill="#7B351B" />
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="46" y="46" width="8" height="8" fill="#7B351B" />
                <rect x="72" y="40" width="14" height="14" fill="currentColor" />
                <rect x="10" y="40" width="14" height="14" fill="currentColor" />
                <rect x="40" y="72" width="12" height="14" fill="currentColor" />
                <rect x="60" y="76" width="16" height="8" fill="currentColor" />
                <rect x="82" y="72" width="10" height="18" fill="currentColor" />
              </svg>
            </div>

            {/* Secret Key & Instructions */}
            <div className="space-y-2 text-xs flex-1 min-w-0">
              <p className="font-semibold text-[#4A1F10]">Petunjuk Pemasangan:</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#7A4B38] text-[11px]">
                <li>Buka aplikasi Google Authenticator di ponsel Anda.</li>
                <li>Pilih <strong>Pindai Kode QR</strong> atau masukkan kunci rahasia manual di bawah.</li>
                <li>Akun Hasfarm Florist Admin akan otomatis tersinkronisasi.</li>
              </ol>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-[#8C3E1E] block">
                  Kunci Rahasia Manual (Secret Key):
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-[#3E180A] bg-white px-2.5 py-1 rounded-lg border border-[#DAC4AF] tracking-widest">
                    {twoFactorConfig.secret}
                  </span>
                  <button
                    onClick={copySecret}
                    className="p-1.5 rounded-lg border border-[#DAC4AF] bg-white hover:bg-[#FAF4EE] text-[#552310] transition-colors"
                    title="Salin Kunci"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulator & Countdown Box */}
          <div className="p-4 rounded-xl bg-white border border-[#EBDCCF] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#4A1F10] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#7B351B]" />
                <span>Simulasi Real-Time Token Authenticator Saat Ini:</span>
              </span>
              <span className="font-mono text-[#8C3E1E] text-xs font-semibold tabular-nums">
                Berputar dalam: {remainingSeconds} detik
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F2] border border-[#DAC4AF]">
              <div>
                <span className="text-[10px] text-[#8C5D49] block">KODE 6-DIGIT BERJALAN:</span>
                <span className="font-mono text-2xl font-bold tracking-[0.25em] text-[#7B351B]">
                  {currentLiveCode}
                </span>
              </div>
              <button
                onClick={() => setTestCode(currentLiveCode)}
                className="px-3 py-1.5 bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Gunakan untuk Uji Coba
              </button>
            </div>
          </div>

          {/* Test Verification Input Sandbox */}
          <form onSubmit={handleTestVerify} className="space-y-2 pt-2 border-t border-[#EDE1D5]">
            <label className="text-xs font-bold text-[#4A1F10] block">
              Uji Validasi Kode 2FA (Test Sandbox):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={14}
                placeholder="Masukkan 6-digit kode atau kode cadangan..."
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold focus:outline-none focus:border-[#7B351B]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Verifikasi Token
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.isValid
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Backup Recovery Codes (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
                Kode Pemulihan Cadangan
              </h4>
              <button
                onClick={copyBackupCodes}
                className="text-xs font-semibold text-[#7B351B] hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCodes ? 'Tersalin' : 'Salin Semua'}</span>
              </button>
            </div>

            <p className="text-xs text-[#7A4B38] leading-relaxed">
              Jika Anda kehilangan akses ke ponsel atau aplikasi authenticator, gunakan salah satu kode cadangan 12-karakter berikut untuk membuka sesi admin.
            </p>

            <div className="space-y-2 p-4 rounded-xl bg-[#FAF6F2] border border-[#DAC4AF] font-mono text-xs">
              {twoFactorConfig.backupCodes.map((code, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-[#EBDCCF] last:border-none">
                  <span className="font-bold text-[#3E180A] tracking-wider">{code}</span>
                  <span className="text-[10px] text-emerald-700 font-sans font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    Tersedia
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Simpan kode pemulihan di tempat yang aman. Setiap kode cadangan hanya dapat digunakan satu kali.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 rounded-xl border border-[#DAC4AF] bg-[#FAF6F2] hover:bg-[#F2E8DC] text-xs font-semibold text-[#552310] transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Kode Cadangan 2FA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
