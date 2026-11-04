// 1. Memanggil Tailwind CSS agar berlaku di semua halaman
import './globals.css';

// 2. Metadata untuk SEO dan Nama Tab Browser
export const metadata = {
  title: 'NotaKilat POS ⚡',
  description: 'Aplikasi Kasir Digital untuk UMKM',
};

// 3. Fungsi Kerangka Utama
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* className di body ini akan membuat latar belakang bawaan seluruh web menjadi abu-abu terang */}
      <body className="bg-gray-100 text-gray-900 antialiased">
        {/* 'children' di bawah ini otomatis akan diganti dengan isi dari file page.js (seperti halaman login atau kasir) */}
        {children}
      </body>
    </html>
  );
}