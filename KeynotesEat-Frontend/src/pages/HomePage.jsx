import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    ingredients: '',
    steps: '',
    image_url: '',
    waktu: '',
    level:'Mudah'

  });

  const fetchRecipes = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/recipes')
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recipes', formData);
      alert(response.data.message);
      setPage('home');
      fetchRecipes();
      // Reset form setelah sukses
      setFormData({ title: '', name: '', description: '', ingredients: '', steps: '', image_url: '', waktu: '', level: 'Mudah' });
    } catch (error) {
      console.error("Gagal nambah resep:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white shadow-sm flex items-center px-6 sticky top-0 z-30 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black">K</div>
          <span className="font-bold text-gray-800 hidden md:block">KeynotesEat</span>
        </div>
        <div className="relative flex-1 max-w-md mx-4">
          <input type="text" placeholder="Cari resep rahasia..." className="bg-gray-100 rounded-xl h-9 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-sm transition-all" />
          <span className="absolute left-3 top-2">🔍</span>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all">👤</div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col p-4 sticky top-14 h-[calc(100vh-56px)] border-r border-gray-100 bg-white">
          <div className="space-y-1">
            <SidebarItem icon="🏠" label="Beranda" active={page === 'home'} onClick={() => setPage('home')} />
            <SidebarItem icon="➕" label="Tambah Resep" active={page === 'add'} onClick={() => setPage('add')} />
            <SidebarItem icon="🔖" label="Tersimpan" active={page === 'saved'} onClick={() => setPage('saved')} />
          </div>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <SidebarItem icon="⚙️" label="Pengaturan" active={page === 'settings'} onClick={() => setPage('settings')} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {page === 'home' ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">Explore Resep</h2>
                    <p className="text-gray-500 text-sm">Temukan inspirasi masak hari ini</p>
                  </div>
                  <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-200 transition-colors">
                    Lihat Semua
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center py-20">
                      <span className="text-4xl">🍳</span>
                      <p className="mt-2 text-gray-500 animate-pulse">Lagi manasin kuali...</p>
                    </div>
                  ) : (
                    recipes.map((resep) => (
                      <ResepCard 
                        key={resep.id} 
                        nama={resep.title} 
                        waktu={`${resep.waktu || 0} menit`} 
                        level={resep.level} 
                          img={resep.image_url || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"}
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-6 text-gray-800">Tambah Resep Baru 📝</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 ml-1">JUDUL RESEP</label>
                      <input name="title" placeholder="ex: Mie Goreng Aceh" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 ml-1">NAMA MENU</label>
                      <input name="name" placeholder="ex: Mie Aceh" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">DESKRIPSI</label>
                    <textarea name="description" placeholder="Ceritakan sedikit tentang resep ini..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm h-20 focus:ring-2 focus:ring-orange-400" onChange={handleChange}></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">BAHAN-BAHAN</label>
                    <textarea name="ingredients" placeholder="1. Mie telor&#10;2. Bumbu dapur..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm h-32 focus:ring-2 focus:ring-orange-400" onChange={handleChange}></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">WAKTU (MENIT)</label>
                    <input name="waktu" type="number" placeholder="Contoh: 30" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1">TINGKAT KESULITAN</label>
                    <select name="level" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400" onChange={handleChange}>
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Sulit">Sulit</option>
                    </select>
                  </div>
                  <div className="space-y-1"> 
                    <label className="text-xs font-bold text-gray-500 ml-1">URL GAMBAR</label>
                    <input name="image_url" placeholder="Paste link gambar di sini..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400" onChange={handleChange} />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-orange-500 text-white p-4 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">Simpan Resep</button>
                    <button type="button" onClick={() => setPage('home')} className="px-6 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Batal</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-lg border border-gray-200 h-16 rounded-2xl shadow-2xl flex justify-around items-center z-40 px-4">
        <button onClick={() => setPage('home')} className={`p-2 rounded-xl ${page === 'home' ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}>🏠</button>
        <button onClick={() => setPage('add')} className={`p-2 rounded-xl ${page === 'add' ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}>➕</button>
        <button className="text-gray-400">🔖</button>
        <button className="text-gray-400">👤</button>
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-orange-50 text-orange-600 shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
    </div>
  );
}

function ResepCard({ nama, waktu, img, level }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={nama} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-[10px] font-black shadow-sm">
          ⭐ 4.9
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg group-hover:text-orange-500 transition-colors line-clamp-1">{nama}</h3>
        <div className="flex items-center gap-3 mt-3 text-gray-400">
          {/* Menampilkan waktu asli dari database */}
          <span className="text-xs flex items-center gap-1 font-medium">⏱ {waktu}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          {/* Menampilkan tingkat kesulitan asli dari database */}
          <span className="text-xs font-medium">{level || 'Mudah'}</span>
        </div>
      </div>
    </div>
  );
}