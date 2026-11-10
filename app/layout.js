
import './globals.css';


export const metadata = {
  title: 'NotaKilat POS ⚡',
  description: 'Aplikasi Kasir Digital untuk UMKM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7498743762675444"
     crossorigin="anonymous"></script>
      </head>
      
      <body className="bg-gray-100 text-gray-900 antialiased">
        
        {children}
      </body>
    </html>
  );
}