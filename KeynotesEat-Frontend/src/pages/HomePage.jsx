import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');

  // State baru untuk mengatur mode gambar dan menyimpan file
  const [imageMode, setImageMode] = useState('url'); // 'url' atau 'upload'
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '', name: '', description: '',
    ingredients: '', steps: '', image_url: '', waktu: '', level: 'Mudah'
  });

  const fetchRecipes = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/recipes')
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kita gunakan FormData karena sekarang ada kemungkinan upload file
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('ingredients', formData.ingredients);
      submitData.append('steps', formData.steps);
      submitData.append('waktu', formData.waktu);
      submitData.append('level', formData.level);

      // Cek mode gambar apa yang sedang dipilih
      if (imageMode === 'url') {
        submitData.append('image_url', formData.image_url);
      } else if (imageMode === 'upload' && imageFile) {
        submitData.append('image_file', imageFile);
      }

      // Axios akan otomatis mendeteksi FormData dan mengatur header 'Content-Type': 'multipart/form-data'
      const response = await axios.post('http://127.0.0.1:8000/api/recipes', submitData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
      
      alert(response.data.message || 'Resep berhasil ditambahkan!');
      setPage('home');
      fetchRecipes();
      
      // Reset form
      setFormData({ title: '', name: '', description: '', ingredients: '', steps: '', image_url: '', waktu: '', level: 'Mudah' });
      setImageFile(null);
      setImageMode('url');
    } catch (error) {
      console.error("Gagal nambah resep:", error);
      alert("Gagal menambahkan resep, cek console untuk detailnya.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Top Search Bar */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-30 gap-4">
        <div className="flex items-center gap-2 w-44 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-sm">K</div>
          <span className="font-bold text-gray-800">Keynotes Eats</span>
        </div>
        <div className="flex flex-1 items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 h-11">
          <span className="text-gray-400 text-base">&#128269;</span>
          <input
            type="text"
            placeholder="Search hidden-gem recipes, ingredients, vibes..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button className="bg-gray-900 text-white text-sm font-semibold px-5 py-1.5 rounded-xl hover:bg-gray-700 transition-colors">
            Search
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Kiri */}
        <aside className="w-52 hidden lg:flex flex-col py-6 px-3 sticky top-16 h-[calc(100vh-64px)] border-r border-gray-100 bg-white justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 px-3 mb-4 tracking-widest">MENU</p>
            <SidebarItem icon="&#127968;" label="Home" active={page === 'home'} onClick={() => setPage('home')} />
            <SidebarItem icon="&#43;" label="Add Recipe" active={page === 'add'} onClick={() => setPage('add')} />
            <SidebarItem icon="&#128278;" label="Saved Recipes" active={page === 'saved'} onClick={() => setPage('saved')} />
            <SidebarItem icon="&#8505;" label="About Us" active={page === 'about'} onClick={() => setPage('about')} />
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 mx-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">&#128081;</span>
              <span className="text-xs font-bold text-orange-600">Chef tip</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Toast your spices for 30 seconds — flavor unlocks instantly.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {page === 'home' ? (
              <>
                {/* Hero Banner */}
                <div className="bg-orange-100 rounded-3xl p-10 mb-8 relative overflow-hidden min-h-52 flex items-center">
                  <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-orange-500">&#128293;</span>
                      <span className="text-orange-500 text-xs font-semibold tracking-wide">Discover new recipes everyday</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 leading-snug mb-3">
                      Hidden-gem dishes,{' '}
                      <span className="text-orange-500">made simple at home.</span>
                    </h1>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm">
                      Hand-picked recipes — quick to cook, impossible to forget.
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-700 transition-colors">
                        Explore recipes
                      </button>
                      <button className="bg-white text-gray-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-colors border border-gray-200">
                        Today's pick
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-6 -top-6 w-56 h-56 bg-orange-200 rounded-full opacity-50"></div>
                  <div className="absolute right-24 -bottom-8 w-40 h-40 bg-orange-300 rounded-full opacity-30"></div>
                  <div className="absolute right-4 top-4 w-20 h-20 bg-orange-200 rounded-full opacity-40"></div>
                </div>

                {/* Recipe Grid */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-lg font-black text-gray-800">Trending hidden gems</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Fresh picks from the Keynotes Eats kitchen.</p>
                  </div>
                  <button className="text-orange-500 text-sm font-bold hover:underline">View all</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {loading ? (
                    <div className="col-span-full text-center py-20">
                      <span className="text-4xl">&#127859;</span>
                      <p className="mt-2 text-gray-400 text-sm animate-pulse">Lagi manasin kuali...</p>
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
            ) : page === 'add' ? (
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-6 text-gray-800">Tambah Resep Baru &#128221;</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 ml-1">JUDUL RESEP</label>
                      <input name="title" placeholder="ex: Mie Goreng Aceh" className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 ml-1">NAMA MENU</label>
                      <input name="name" placeholder="ex: Mie Aceh" className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1">DESKRIPSI</label>
                    <textarea name="description" placeholder="Ceritakan sedikit tentang resep ini..." className="w-full bg-gray-50 rounded-xl p-3 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange}></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1">BAHAN-BAHAN</label>
                    <textarea name="ingredients" placeholder="1. Mie telor&#10;2. Bumbu dapur..." className="w-full bg-gray-50 rounded-xl p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange}></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 ml-1">WAKTU (MENIT)</label>
                      <input name="waktu" type="number" placeholder="30" className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 ml-1">TINGKAT KESULITAN</label>
                      <select name="level" className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange}>
                        <option value="Mudah">Mudah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Sulit">Sulit</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* UPDATE BAGIAN UPLOAD GAMBAR DI SINI */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-xs font-bold text-gray-400">GAMBAR RESEP</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="radio" name="imageMode" value="url" checked={imageMode === 'url'} onChange={() => setImageMode('url')} className="accent-orange-500 w-4 h-4" />
                        Gunakan URL Link
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="radio" name="imageMode" value="upload" checked={imageMode === 'upload'} onChange={() => setImageMode('upload')} className="accent-orange-500 w-4 h-4" />
                        Upload Foto
                      </label>
                    </div>

                    {imageMode === 'url' ? (
                      <input name="image_url" placeholder="Paste link gambar di sini..." value={formData.image_url} className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200" onChange={handleChange} />
                    ) : (
                      <input type="file" accept="image/*" className="w-full bg-white rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-orange-500 text-white p-4 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">Simpan Resep</button>
                    <button type="button" onClick={() => setPage('home')} className="px-6 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Batal</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <span className="text-4xl">&#127959;</span>
                <p className="mt-2 text-sm">Halaman ini coming soon!</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-lg border border-gray-200 h-16 rounded-2xl shadow-2xl flex justify-around items-center z-40 px-4">
        <button onClick={() => setPage('home')} className={`p-2 rounded-xl ${page === 'home' ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}>&#127968;</button>
        <button onClick={() => setPage('add')} className={`p-2 rounded-xl ${page === 'add' ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`}>&#43;</button>
        <button className="text-gray-400">&#128278;</button>
        <button className="text-gray-400">&#128100;</button>
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${
        active ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-500'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all ${
        active ? 'bg-orange-100' : 'bg-gray-100'
      }`}>
        {icon}
      </div>
      <span className="font-semibold text-sm">{label}</span>
    </div>
  );
}

function ResepCard({ nama, waktu, img, level }) {
  const levelColor = {
    'Mudah': 'bg-green-100 text-green-600',
    'Sedang': 'bg-yellow-100 text-yellow-600',
    'Sulit': 'bg-red-100 text-red-600',
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${levelColor[level] || 'bg-gray-100 text-gray-500'}`}>
            {level || 'Mudah'}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-[10px] font-black">
          &#11088; 4.9
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-1">{nama}</h3>
        <p className="text-xs text-gray-400 mt-1.5">&#9201; {waktu}</p>
      </div>
    </div>
  );
}