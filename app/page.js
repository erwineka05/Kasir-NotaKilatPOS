'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-yellow-200 text-gray-900 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="bg-white/85 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img 
              src="/Logo.png" 
              alt="Logo NotaKilat" 
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <span className="text-xl font-extrabold tracking-tight">
              NotaKilat <span className="text-yellow-500">POS</span>
            </span>
          </div>
          <Link 
            href="/login" 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2 rounded-full text-sm font-bold transition-all border border-yellow-200 active:scale-95"
          >
            Masuk Kasir
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100/50 border border-yellow-200 text-yellow-800 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Rilis Versi 1.0 - Siap Digunakan!
        </div>
        
        <h1 className="max-w-3xl text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          Kasir Digital Pintar untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">UMKM Modern</span>
        </h1>
        
        <p className="max-w-xl text-lg text-gray-500 font-medium mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Tinggalkan nota kertas yang ribet. Catat penjualan, kelola menu, pantau omzet, dan cetak struk langsung ke printer Bluetooth dari HP Anda tanpa perlu instal aplikasi tambahan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-200">
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-full text-base font-bold transition-all shadow-lg shadow-yellow-400/30 active:scale-95"
          >
            Mulai Jualan Sekarang
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </main>

      {/* FITUR UNGGULAN*/}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Mengapa Memilih NotaKilat?</h2>
            <p className="text-gray-500 mt-2 font-medium">Didesain khusus untuk kecepatan dan kemudahan kasir warung.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-yellow-300 transition-colors">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4 text-yellow-700 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Berbasis Web Modern</h3>
              <p className="text-sm text-gray-600 font-medium">Buka langsung dari browser HP atau PC. Tidak perlu repot mengunduh aplikasi berat dari Play Store.</p>
            </div>
            
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-yellow-300 transition-colors">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4 text-yellow-700 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cetak Bluetooth Langsung</h3>
              <p className="text-sm text-gray-600 font-medium">Terintegrasi dengan Web Bluetooth API. Tembak struk langsung ke mesin Printer Thermal 58mm.</p>
            </div>
            
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-yellow-300 transition-colors">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4 text-yellow-700 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Laporan Omzet Otomatis</h3>
              <p className="text-sm text-gray-600 font-medium">Setiap transaksi tersimpan aman di Cloud. Pantau total pendapatan harian secara real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 opacity-50 grayscale">
            <span className="text-lg font-extrabold tracking-tight text-white">NotaKilat POS</span>
          </div>
          <p className="text-sm font-medium">© 2026 NotaKilat.id — Memberdayakan UMKM Indonesia.</p>
        </div>
      </footer>

    </div>
  );
}