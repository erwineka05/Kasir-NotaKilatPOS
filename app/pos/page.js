'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from '../../components/ProductCard';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [clientTime, setClientTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setClientTime(new Date());

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      setUser(session.user);
      fetchProducts();
    }
    checkAuth();
  }, [router]);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*'); 
    if (!error) setProducts(data);
    setIsLoading(false);
  }

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      await supabase.auth.signOut();
      router.push('/login');
    }
  };

  const addToCart = (product) => setCart([...cart, product]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const groupedCart = Object.values(cart.reduce((acc, product) => {
    if (!acc[product.id]) acc[product.id] = { ...product, quantity: 0 };
    acc[product.id].quantity += 1;
    return acc;
  }, {}));

  const handleCheckout = async (printMethod = 'web') => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    setIsLoading(true);

    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions').insert([{ customer_name: 'Pelanggan Umum', total_amount: total, is_paid: true }]).select().single();

    if (transactionError) {
      alert('Gagal mencatat transaksi: ' + transactionError.message);
      setIsLoading(false); return;
    }

    const itemsToInsert = groupedCart.map(item => ({
      transaction_id: transactionData.id, product_id: item.id, product_name: item.name, quantity: item.quantity, price: item.price
    }));

    await supabase.from('transaction_items').insert(itemsToInsert);
    setIsLoading(false);

    if (printMethod === 'bluetooth') {
      await printViaBluetooth(transactionData.id);
    } else {
      window.print(); 
    }
    
    setCart([]); 
  };

  const printViaBluetooth = async (transactionId) => {
    if (!navigator.bluetooth) {
      alert('Browser Anda tidak mendukung Bluetooth Web. Gunakan Chrome di HP Android/PC.');
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2']
      });

      const server = await device.gatt.connect();
      const services = await server.getPrimaryServices();
      let printChar = null;
      
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            printChar = char; break;
          }
        }
        if (printChar) break;
      }

      if (!printChar) throw new Error('Tidak menemukan port printer yang cocok.');

      let receipt = "\x1B\x40"; 
      receipt += "       NOTAKILAT POS\n";
      receipt += "   Jl. Kebahagiaan No. 123\n";
      receipt += "--------------------------------\n";
      receipt += `Tgl: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}\n`;
      receipt += `No : #NK-${transactionId || Date.now().toString().slice(-5)}\n`;
      receipt += "--------------------------------\n";
      groupedCart.forEach(item => {
        receipt += `${item.name.toUpperCase()}\n`;
        receipt += `${item.quantity} x ${item.price.toLocaleString('id-ID')} = ${(item.quantity * item.price).toLocaleString('id-ID')}\n`;
      });
      receipt += "--------------------------------\n";
      receipt += `TOTAL: Rp ${total.toLocaleString('id-ID')}\n`;
      receipt += "STATUS: LUNAS\n\n";
      receipt += "         TERIMA KASIH\n\n\n\n"; 

      const encoder = new TextEncoder();
      const data = encoder.encode(receipt);
      const chunkSize = 256; 
      
      for (let i = 0; i < data.length; i += chunkSize) {
        await printChar.writeValue(data.slice(i, i + chunkSize));
      }

      alert('Struk berhasil terkirim ke printer Bluetooth!');

    } catch (error) {
      console.error(error);
      alert('Batal/Gagal cetak Bluetooth: ' + error.message);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-28">
      
      {/* HEADER/hamburger*/}
      <div className="bg-white/85 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 print:hidden transition-all duration-300">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center relative">
          
          <div className="flex items-center gap-3">
            <img 
              src="/Logo.png" alt="Logo NotaKilat" 
              className="w-11 h-11 object-contain cursor-pointer hover:scale-105 transition-transform duration-200 drop-shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/eab308/ffffff?text=POS"; }}
            />
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">NotaKilat <span className="text-yellow-500">POS</span></h1>
              <p className="text-xs text-gray-500 mt-0.5 truncate w-24 sm:w-40 md:w-full">Kasir: {user?.email || 'Memuat...'}</p>
            </div>
          </div>

          {/* MENU HAMBURGER */}
          <div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-gray-50 hover:bg-yellow-50 text-gray-700 rounded-xl transition-colors border border-transparent hover:border-yellow-300 active:scale-95"
              title="Menu"
            >
              {/* Ikon Hamburger */}
              {isMenuOpen ? (
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>

            {/* DROPDOWN MENU*/}
            {isMenuOpen && (
              <>
                {/* Latar Belakang Transparan untuk menutup menu jika diklik sembarang tempat */}
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
                
                {/* Kotak Menu Dropdown */}
                <div className="absolute right-4 top-14 mt-1 w-48 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 flex flex-col gap-1">
                    
                    <button onClick={() => router.push('/sales')} className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 rounded-xl transition-colors text-sm font-bold text-left">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Laporan Penjualan
                    </button>
                    
                    <button onClick={() => router.push('/products')} className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 rounded-xl transition-colors text-sm font-bold text-left">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      Atur Menu Baru
                    </button>
                    
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition-colors text-sm font-bold text-left">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Keluar Akun
                    </button>
                    
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* DAFTAR PRODUK */}
      <div className="max-w-2xl mx-auto p-4 print:hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pilihan Menu</h2>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Belum ada menu. Silakan klik garis tiga di kanan atas untuk menambah menu.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
          </div>
        )}
      </div>

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-30 print:hidden flex justify-center gap-2 max-w-2xl mx-auto">
          
          <button 
            onClick={() => handleCheckout('web')}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-2xl px-5 py-4 flex justify-between items-center shadow-lg active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-600/30 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm">{cart.length}</div>
              <div className="flex flex-col items-start">
                <span className="font-extrabold text-sm">Simpan & Cetak</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </button>

          <button 
            onClick={() => handleCheckout('bluetooth')}
            className="w-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-blue-500"
            title="Bayar & Cetak via Bluetooth"
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            <span className="text-[9px] font-bold">BT Print</span>
          </button>

        </div>
      )}

      {/* STRUK CADANGAN WEB */}
      <div className="hidden print:block w-[58mm] mx-auto text-black font-mono p-0 m-0">
        <div className="text-center mb-3">
          <h2 className="font-extrabold text-sm uppercase tracking-widest">NotaKilat POS</h2>
          <p className="text-[10px] mt-0.5">Jl. Kebahagiaan No. 123, YK</p>
          <p className="text-[10px]">Telp: 0812-3456-7890</p>
        </div>
        <div className="border-b border-black border-dashed mb-2"></div>
        <div className="mb-2 text-[10px] flex flex-col gap-0.5">
          <div className="flex justify-between">
            <span>Tgl:</span>
            <span>{clientTime ? `${clientTime.toLocaleDateString('id-ID')} ${clientTime.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}` : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span className="truncate max-w-[100px] text-right uppercase">{user?.email?.split('@')[0] || 'Admin'}</span>
          </div>
          <div className="flex justify-between">
            <span>No:</span>
            <span>#NK-{clientTime ? clientTime.getTime().toString().slice(-5) : '00000'}</span>
          </div>
        </div>
        <div className="border-b border-black border-dashed mb-2"></div>
        <div className="mb-2">
          {Object.values(
            cart.reduce((acc, product) => {
              if (!acc[product.id]) acc[product.id] = { ...product, qty: 0 };
              acc[product.id].qty += 1;
              return acc;
            }, {})
          ).map((item, index) => (
            <div key={index} className="mb-1 text-[10px]">
              <div className="font-bold uppercase">{item.name}</div>
              <div className="flex justify-between">
                <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
                <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-b border-black border-dashed mb-2"></div>
        <div className="flex justify-between font-extrabold text-xs mb-1">
          <span>TOTAL</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold">
          <span>STATUS</span>
          <span>LUNAS</span>
        </div>
        <div className="border-b border-black border-dashed my-2"></div>
        <div className="text-center text-[10px] mt-3 space-y-0.5">
          <p>Terima Kasih!</p>
          <p>Layanan Kritik & Saran:</p>
          <p>IG: @notakilat.id</p>
          <p className="mt-3 text-[8px] text-gray-500">== Powered by NotaKilat ==</p>
        </div>
      </div>
    </div>
  );
}
