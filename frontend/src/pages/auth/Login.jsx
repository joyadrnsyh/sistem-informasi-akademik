import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Shield, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';
import { InputForm } from '../../components/ui/InputForm';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Show session expired notification if redirected
  const showExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Semua kolom wajib diisi!');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      // Redirect based on role
      const { role } = result.user;
      if (role === 'admin') navigate('/admin');
      else if (role === 'dosen') navigate('/dosen');
      else if (role === 'mahasiswa') navigate('/mahasiswa');
    } else {
      setError(result.error || 'Terjadi kesalahan login.');
    }
  };

  // Autofill mock credentials for demonstration
  const handleQuickLogin = (mockEmail, mockPass) => {
    setEmail(mockEmail);
    setPassword(mockPass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070a13] px-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      {/* Main card wrapper */}
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-bold text-2xl shadow-lg shadow-indigo-500/20 mb-3">
            U
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">Portal Akademik</h2>
          <p className="text-sm text-slate-400 mt-1">Silakan masuk ke akun SIA Anda</p>
        </div>

        {/* Notifications */}
        {showExpired && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Sesi Anda telah berakhir, silakan masuk kembali.</span>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs animate-fade-in">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <InputForm
            label="Alamat Email"
            name="email"
            type="email"
            placeholder="nama@sia.ac.id"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <InputForm
            label="Kata Sandi"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500" />
              <span>Ingat saya</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Lupa Password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full py-2.5"
            loading={loading}
          >
            Masuk Sekarang
          </Button>
        </form>

        {/* Quick Demo Logins section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3 text-center">
            Pilih Role Demonstrasi (Klik untuk isi otomatis)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@sia.ac.id', 'admin123')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-[10px] text-rose-400 transition-all cursor-pointer"
            >
              <Shield className="h-4.5 w-4.5 mb-1" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => handleQuickLogin('dosen@sia.ac.id', 'dosen123')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-[10px] text-amber-400 transition-all cursor-pointer"
            >
              <BookOpen className="h-4.5 w-4.5 mb-1" />
              <span>Dosen</span>
            </button>
            <button
              onClick={() => handleQuickLogin('mhs@sia.ac.id', 'mhs123')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-[10px] text-indigo-400 transition-all cursor-pointer"
            >
              <GraduationCap className="h-4.5 w-4.5 mb-1" />
              <span>Mahasiswa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
