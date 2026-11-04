'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/pos');
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message.includes('Invalid') ? 'Email atau sandi salah.' : error.message);
      } else {
        router.push('/pos');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Daftar berhasil! Silakan masuk menggunakan akun tersebut.');
        setIsLogin(true); 
        setPassword('');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-yellow-200">
      
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header & Logo */}
        <div className="text-center mb-8">
          <img 
            src="/Logo.png" 
            alt="Logo Aplikasi" 
            className="w-24 h-24 object-contain mx-auto mb-4 drop-shadow-sm"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/eab308/ffffff?text=Logo"; }}
          />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            NotaKilat <span className="text-yellow-500">POS</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {isLogin ? 'Masuk untuk kelola warungmu.' : 'Daftar akun baru warungmu.'}
          </p>
        </div>

        {/* Notif Error */}
        {errorMsg && (
          <div className="bg-red-50 text-red-500 text-sm font-semibold p-3 rounded-xl mb-5 text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Form Login/Register */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
              placeholder="contoh@warung.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm py-4 rounded-full mt-4 transition-all duration-200 active:scale-95 shadow-lg shadow-yellow-500/30 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            {isLoading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang')}
          </button>
        </form>

        {/* Switch Register/Login */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-yellow-600 hover:text-yellow-700 font-bold hover:underline transition-all"
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </div>
      </div>
      
      {/* Footer / Copyright */}
      <p className="mt-8 text-xs text-gray-400 font-medium">
        © 2026 NotaKilat.id — Kasir UMKM Digital
      </p>
    </div>
  );
}