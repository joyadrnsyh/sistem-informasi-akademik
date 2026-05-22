import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { InputForm } from '../../components/ui/InputForm';
import { Button } from '../../components/ui/Button';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-terracotta-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-terracotta-600/5 blur-[120px] pointer-events-none" />

      {/* Main card wrapper */}
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-terracotta-600 to-terracotta-400 text-white font-bold text-2xl shadow-lg shadow-terracotta-500/15 mb-3">
            U
          </div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wide">Lupa Kata Sandi</h2>
          <p className="text-sm text-stone-500 mt-1">Atur ulang sandi portal akademik Anda</p>
        </div>

        {submitted ? (
          // Success State
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250/50 mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-stone-800">Email Terkirim!</h3>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              Tautan atur ulang kata sandi telah kami kirimkan ke email <strong>{email}</strong> jika alamat tersebut terdaftar.
            </p>
            <Button
              variant="secondary"
              className="mt-6 w-full py-2 flex items-center justify-center gap-2"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Login
            </Button>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit}>
            <p className="text-xs text-stone-550 mb-5 leading-relaxed">
              Masukkan alamat email institusi Anda. Kami akan mengirimkan tautan verifikasi untuk membuat kata sandi baru.
            </p>
            
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

            <Button
              type="submit"
              className="w-full py-2.5 mt-2"
              loading={loading}
            >
              Kirim Tautan Atur Ulang
            </Button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-5 w-full flex items-center justify-center gap-2 text-xs text-stone-500 hover:text-stone-800 transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Halaman Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
