'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SalesPage() {
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');

    // Mengambil transaksi sekaligus menggabungkannya dengan tabel detail barang (JOIN)
    const { data, error } = await supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data);
      // Menghitung total omzet dari semua transaksi
      const total = data.reduce((sum, trx) => sum + Number(trx.total_amount), 0);
      setTotalRevenue(total);
    }
    setIsLoading(false);
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-yellow-600">Memuat Laporan...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 selection:bg-yellow-200">
      
      {/* HEADER */}
      <div className="bg-white/85 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Laporan <span className="text-yellow-500">Penjualan</span></h1>
          <Link href="/pos" className="bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold transition border border-transparent hover:border-yellow-200">
            Ke Kasir
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        
        {/* KARTU TOTAL OMZET */}
        <div className="bg-yellow-400 rounded-3xl p-6 mb-6 shadow-lg shadow-yellow-400/20 text-gray-900">
          <p className="font-bold text-yellow-800 text-sm mb-1">Total Omzet Keseluruhan</p>
          <h2 className="text-3xl font-black truncate">Rp {totalRevenue.toLocaleString('id-ID')}</h2>
          <p className="text-xs font-semibold mt-2 opacity-80">Berdasarkan {transactions.length} struk transaksi</p>
        </div>

        <h3 className="font-bold text-gray-900 mb-4">Riwayat Transaksi Terakhir</h3>

        {/* DAFTAR TRANSAKSI */}
        <div className="flex flex-col gap-3">
          {transactions.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 text-gray-400 text-sm">
              Belum ada transaksi penjualan.
            </div>
          ) : (
            transactions.map((trx) => (
              <div key={trx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-300 transition-colors">
                
                {/* Info Struk Atas */}
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {new Date(trx.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB • Nota: #{trx.id.split('-')[0]}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="font-black text-gray-900 text-sm">Rp {Number(trx.total_amount).toLocaleString('id-ID')}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-md">LUNAS</span>
                  </div>
                </div>
                
                {/* Rincian Barang yang Dibeli */}
                <div className="flex flex-col gap-1.5">
                  {trx.transaction_items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-gray-600 font-medium">
                      <span><span className="font-bold text-gray-800">{item.quantity}x</span> {item.product_name}</span>
                      <span>Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}