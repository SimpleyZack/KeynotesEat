export default function HomePage() {
  return (
    <div className="min-h-screen flex">

      {/* Navbar Kiri */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col px-4 py-6 gap-2 sticky top-0 h-screen">
        <div className="px-3 mb-6">
          <h1 className="text-xl font-bold text-orange-500">Keynotes Eat</h1>
          <p className="text-xs text-gray-400">Temukan resepmu</p>
        </div>
        <NavItem icon="🏠" label="Beranda" active />
        <NavItem icon="🍴" label="Resep" />
        <NavItem icon="🔖" label="Tersimpan" />
        <NavItem icon="👤" label="Profil" />
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen mt-5">
      <div> </div>
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-24 sticky top-0 z-20 mt-4">
          <input
            type="text"
            placeholder="🔍  Cari berdasarkan bahan... contoh: ayam, telur, bawang"
            className="w-full border border-gray-200 h-10 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
          />
        </div>
        

        {/* Grid Resep */}
        <div className="p-8 flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resep Populer</h2>
          <div className="grid grid-cols-3 gap-6">
            <ResepCard nama="Ayam Goreng" waktu="30 menit" img="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400" />
            <ResepCard nama="Nasi Goreng" waktu="20 menit" img="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" />
            <ResepCard nama="Gado-Gado" waktu="25 menit" img="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400" />
            <ResepCard nama="Soto Ayam" waktu="45 menit" img="https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400" />
            <ResepCard nama="Rendang" waktu="120 menit" img="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" />
            <ResepCard nama="Mie Goreng" waktu="15 menit" img="https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400" />
          </div>
        </div>

      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
      ${active 
        ? 'bg-orange-50 text-orange-500' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ResepCard({ nama, waktu, img }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <img src={img} alt={nama} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{nama}</h3>
        <p className="text-xs text-gray-400 mt-1">⏱ {waktu}</p>
      </div>
    </div>
  );
}