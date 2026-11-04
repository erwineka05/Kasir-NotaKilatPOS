'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  async function checkAuthAndFetch() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
      
    if (!error && data) setProducts(data);
    setIsLoading(false);
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = '';

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (uploadError) {
        alert('Gagal mengunggah gambar: ' + uploadError.message);
        setIsUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .insert([{ name, price: parseInt(price), image_url: imageUrl }]);

    if (error) {
      alert('Gagal menyimpan menu: ' + error.message);
    } else {
      setName('');
      setPrice('');
      setImage(null);
      setIsFormOpen(false); 
      checkAuthAndFetch();
    }
    setIsUploading(false);
  };

  const handleDeleteProduct = async (id, imageUrl) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
    await supabase.from('products').delete().eq('id', id);
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('product-images').remove([fileName]);
    }
    checkAuthAndFetch();
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-yellow-600">Memuat Menu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 selection:bg-yellow-200">
      {/* --- HEADER --- */}
      <div className="bg-white/85 backdrop-blur-md sticky top-0 z-20 shadow-sm print:hidden border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Atur <span className="text-yellow-500">Menu</span></h1>
          <Link href="/pos" className="bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold transition border border-transparent hover:border-yellow-200">
            Ke Kasir
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        
        {/* --- TOMBOL BUKA FORM --- */}
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold py-3 rounded-2xl border border-yellow-300 border-dashed mb-4 transition flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Menu Baru
          </button>
        )}

        {/* --- FORM TAMBAH MENU --- */}
        {isFormOpen && (
          <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-3xl shadow-sm mb-6 flex flex-col gap-4 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-gray-800">Detail Menu Baru</h2>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 text-sm font-semibold">Batal</button>
            </div>
            
            <div>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white transition outline-none text-sm font-medium" placeholder="Nama Menu (misal: Burger Bangor)" />
            </div>
            <div>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white transition outline-none text-sm font-medium" placeholder="Harga (misal: 25000)" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Foto Menu (Opsional)</label>
              {/* tombol input file */}
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer transition-colors" />
            </div>
            
            {/* Tombol submit  */}
            <button type="submit" disabled={isUploading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-2xl mt-2 disabled:bg-gray-300 disabled:text-gray-500 transition shadow-sm active:scale-95">
              {isUploading ? 'Menyimpan...' : 'Simpan Menu'}
            </button>
          </form>
        )}

        {/* --- DAFTAR MENU  --- */}
        <div className="flex flex-col gap-3">
          {products.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 text-gray-400 text-sm">
              Daftar menu masih kosong.
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-yellow-300 transition-colors">
                {/* Gambar Menu */}
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                ) : (
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">🍲</div>
                )}
                
                {/* Info Menu */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{p.name}</h3>
                  <div className="font-extrabold text-gray-800 text-sm mt-1.5">Rp {p.price.toLocaleString('id-ID')}</div>
                </div>

                {/* Tombol Hapus*/}
                <button 
                  onClick={() => handleDeleteProduct(p.id, p.image_url)}
                  className="mr-1 p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition active:scale-95"
                  title="Hapus Menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}