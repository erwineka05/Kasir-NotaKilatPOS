export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Gambar Produk */}
      <div className="relative w-full aspect-square mb-3">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍲</span>
          </div>
        )}
      </div>
      
      {/* Nama & Harga */}
      <div className="flex-grow">
        <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
      </div>
      
      {/* Harga & Tombol Tambah */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
        <span className="font-bold text-gray-900 text-sm">
          Rp {product.price.toLocaleString('id-ID')}
        </span>
        
        {/* Tombol Tambah */}
        <button 
          onClick={() => onAdd(product)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}