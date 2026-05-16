import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageMode, setImageMode] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '', name: '', description: '',
    ingredients: [''], steps: [''],
    image_url: '', waktu: '', level: 'Mudah'
  });

  const handleArrayChange = (index, value, type) => {
    const newArray = [...formData[type]];
    newArray[index] = value;
    setFormData({ ...formData, [type]: newArray });
  };

  const handleAddField = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  const handleRemoveField = (index, type) => {
    if (formData[type].length > 1) {
      const newArray = formData[type].filter((_, i) => i !== index);
      setFormData({ ...formData, [type]: newArray });
    }
  };

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
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('ingredients', JSON.stringify(formData.ingredients));
      submitData.append('steps', JSON.stringify(formData.steps));
      submitData.append('waktu', formData.waktu);
      submitData.append('level', formData.level);
      if (imageMode === 'url') {
        submitData.append('image_url', formData.image_url);
      } else if (imageMode === 'upload' && imageFile) {
        submitData.append('image_file', imageFile);
      }
      const response = await axios.post('http://127.0.0.1:8000/api/recipes', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data.message || 'Resep berhasil ditambahkan!');
      setPage('home');
      fetchRecipes();
      setFormData({ title: '', name: '', description: '', ingredients: [''], steps: [''], image_url: '', waktu: '', level: 'Mudah' });
      setImageFile(null);
      setPreviewImage(null);
      setImageMode('url');
    } catch (error) {
      console.error("Gagal nambah resep:", error);
      alert("Gagal menambahkan resep.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const filteredRecipes = recipes.filter((resep) => {
    const query = searchQuery.toLowerCase();
    const judulCocok = resep.title.toLowerCase().includes(query);
    let bahanCocok = false;
    try {
      const parsed = JSON.parse(resep.ingredients || "[]");
      const bahan = Array.isArray(parsed) ? parsed.join(" ").toLowerCase() : String(parsed).toLowerCase();
      bahanCocok = bahan.includes(query);
    } catch {
      bahanCocok = String(resep.ingredients || "").toLowerCase().includes(query);
    }
    return judulCocok || bahanCocok;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      
      {/* INJEKSI CSS UNTUK ANIMASI HALUS */}
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.4s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 sticky top-0 z-30 gap-6 shadow-sm">
        <div className="flex items-center gap-3 w-52 shrink-0">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-200">K</div>
          <div>
            <h1 className="font-black text-gray-800 text-lg leading-none">Keynotes<span className="text-orange-500">Eats</span></h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-1">HIDDEN GEM RECIPES</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 bg-gray-50/80 border border-gray-200 rounded-full px-5 h-12 max-w-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300">
          <span className="text-gray-400">&#128269;</span>
          <input
            type="text"
            placeholder="Search hidden-gem recipes, ingredients, vibes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
          />
          <button className="bg-gray-900 text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-gray-700 transition-colors shadow-md">
            Search
          </button>
        </div>
      </header>

      <div className="flex flex-1">

        {/* Sidebar (Diperlebar dan Menu di-Center vertikal) */}
        <aside className="w-64 hidden lg:flex flex-col py-8 px-5 sticky top-20 h-[calc(100vh-80px)] border-r border-gray-100 bg-white">
          
          {/* Wrapper Flex-1 dengan justify-center agar posisi di tengah */}
          <div className="flex-1 flex flex-col justify-center space-y-1.5 -mt-10">
            <p className="text-[10px] font-black text-gray-400 px-4 mb-4 tracking-widest uppercase">Menu Utama</p>
            <SidebarItem icon="&#127968;" label="Home" active={page === 'home' && !selectedRecipe} onClick={() => { setPage('home'); setSelectedRecipe(null); }} />
            <SidebarItem icon="&#43;" label="Add Recipe" active={page === 'add'} onClick={() => { setPage('add'); setSelectedRecipe(null); }} />
            <SidebarItem icon="&#128278;" label="Saved Recipes" active={page === 'saved'} onClick={() => setPage('saved')} />
            <SidebarItem icon="&#8505;" label="About Us" active={page === 'about'} onClick={() => setPage('about')} />
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white p-1.5 rounded-lg shadow-sm">&#128081;</span>
              <span className="text-xs font-black text-orange-600 tracking-wide uppercase">Chef tip</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Baca seluruh resep sekali sebelum mulai memasak — alur jadi lebih lancar.
            </p>
          </div>
        </aside>

        {/* Main Content (Max-width diperbesar) */}
        <main className="flex-1 p-8 md:p-10 overflow-y-auto">
          {/* Ganti max-w-5xl jadi max-w-7xl agar lebih full screen di desktop */}
          <div className="max-w-7xl mx-auto">

            {/* HOME */}
            {page === 'home' && !selectedRecipe && (
              <div className="animate-slide-up">
                {/* Hero Banner (Diperbesar dan tulisan lebih besar) */}
                <div className="bg-[#FFEFE5] rounded-[40px] p-12 lg:p-16 mb-12 relative overflow-hidden flex items-center min-h-[320px]">
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/60 text-orange-600 text-xs font-black px-4 py-2 rounded-full mb-6 tracking-wide shadow-sm">
                      <span>&#128293;</span> Discover new recipes everyday
                    </div>
                    {/* Teks diubah jadi text-5xl/6xl agar tidak terlihat terlalu rame */}
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-5 tracking-tight">
                      Hidden-gem dishes,<br/>
                      <span className="text-orange-500">made simple at home.</span>
                    </h1>
                    <p className="text-gray-500 text-base mb-8 max-w-md leading-relaxed font-medium">
                      Hand-picked recipes you won't find on the front page — quick to cook, impossible to forget.
                    </p>
                    <div className="flex gap-4">
                      <button className="bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-95">
                        Explore recipes
                      </button>
                      <button className="bg-white text-gray-700 px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-50 transition-all shadow-sm border border-white hover:border-gray-200 active:scale-95">
                        Today's pick
                      </button>
                    </div>
                  </div>
                  {/* Ornamen Banner */}
                  <div className="absolute -right-12 -top-12 w-80 h-80 bg-orange-200 rounded-full opacity-40 blur-3xl"></div>
                  <div className="absolute right-32 -bottom-20 w-64 h-64 bg-orange-300 rounded-full opacity-20 blur-2xl"></div>
                </div>

                {/* Section Header */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending hidden gems</h2>
                    <p className="text-gray-500 text-sm mt-1.5 font-medium">Fresh picks from the Keynotes Eats kitchen.</p>
                  </div>
                  <button className="text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors">View all &#8594;</button>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center py-32">
                      <span className="text-6xl animate-bounce inline-block">&#127859;</span>
                      <p className="mt-5 text-gray-400 font-bold tracking-wide">Lagi manasin kuali...</p>
                    </div>
                  ) : filteredRecipes.length === 0 ? (
                    <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                      <span className="text-6xl">&#128269;</span>
                      <p className="mt-4 text-gray-500 font-bold text-lg">Waduh, resepnya nggak ketemu nih.</p>
                      <p className="text-gray-400 text-sm mt-1">Coba cari pakai bahan lain ya.</p>
                    </div>
                  ) : (
                    filteredRecipes.map((resep) => (
                      <ResepCard
                        key={resep.id}
                        nama={resep.title}
                        waktu={`${resep.waktu || 0} min`}
                        level={resep.level}
                        img={resep.image_url || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"}
                        onClick={() => setSelectedRecipe(resep)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* DETAIL RESEP (Dengan Animasi Slide-Up) */}
            {page === 'home' && selectedRecipe && (
              <div className="max-w-5xl mx-auto animate-slide-up">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 text-sm mb-8 hover:text-orange-500 transition-colors flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm w-fit"
                >
                  &#8592; Kembali ke semua resep
                </button>

                {/* Hero Detail */}
                <div className="bg-[#FFEFE5] rounded-[40px] p-8 lg:p-12 flex flex-col md:flex-row gap-10 items-center mb-10 relative overflow-hidden">
                  <div className="flex-1 z-10">
                    <div className="inline-flex items-center gap-1.5 bg-white/60 text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
                      <span>&#128293;</span> Hidden-gem recipe
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{selectedRecipe.title}</h1>
                    <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-lg font-medium">{selectedRecipe.description}</p>
                    <div className="flex gap-3 flex-wrap">
                      <span className="bg-white px-5 py-2.5 rounded-full text-sm font-bold text-gray-700 shadow-sm flex items-center gap-2">
                        <span className="text-orange-500">&#9201;</span> {selectedRecipe.waktu} min
                      </span>
                      <span className="bg-white px-5 py-2.5 rounded-full text-sm font-bold text-gray-700 shadow-sm flex items-center gap-2">
                        <span className="text-orange-500">&#128202;</span> {selectedRecipe.level}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-[45%] w-full h-80 z-10">
                    <img
                      src={selectedRecipe.image_url || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500"}
                      className="w-full h-full object-cover rounded-[32px] shadow-2xl border-4 border-white/50"
                      alt={selectedRecipe.title}
                    />
                  </div>
                   {/* Ornamen */}
                   <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-orange-100/50 to-transparent pointer-events-none"></div>
                </div>

                {/* Bahan & Langkah */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Bahan (Kiri, lebih kecil) */}
                  <div className="md:col-span-5 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm h-fit">
                    <h3 className="font-black text-2xl text-gray-900 mb-2 tracking-tight">Bahan-bahan</h3>
                    <p className="text-sm text-gray-400 font-medium mb-8">Yang perlu disiapkan di meja dapur.</p>
                    <div className="space-y-4">
                      {JSON.parse(selectedRecipe.ingredients || '[]').map((item, index) => (
                        <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <span className="text-orange-200 font-black text-lg w-6 shrink-0">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-gray-700 font-medium text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Langkah (Kanan, lebih lebar) */}
                  <div className="md:col-span-7 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                    <h3 className="font-black text-2xl text-gray-900 mb-2 tracking-tight">Langkah pembuatan</h3>
                    <p className="text-sm text-gray-400 font-medium mb-8">Ikuti urutan ini untuk hasil paling sempurna.</p>
                    <div className="space-y-6">
                      {JSON.parse(selectedRecipe.steps || '[]').map((step, index) => (
                        <div key={index} className="flex gap-5">
                          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-black shrink-0 text-sm mt-1">
                            {index + 1}
                          </div>
                          <p className="text-gray-600 text-base leading-relaxed font-medium pt-2">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADD RECIPE (Card Dipisah & Rapih) */}
            {page === 'add' && (
              <div className="max-w-6xl mx-auto animate-slide-up">
                
                {/* Banner Add */}
                <div className="bg-[#FFF2E6] rounded-[28px] p-8 lg:p-10 mb-8 relative overflow-hidden flex flex-col lg:flex-row items-start gap-8">
                  <div className="relative z-10 max-w-full lg:max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/70 text-orange-600 text-[11px] font-black px-4 py-2 rounded-full mb-4 tracking-wide shadow-sm">
                      &#128203; Share your kitchen secret
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-snug tracking-tight">
                      Add a new recipe,
                      <br />
                      <span className="text-orange-500">make someone's day better.</span>
                    </h2>
                    <p className="text-gray-600 font-medium mt-4 text-base leading-relaxed max-w-xl">
                      Drop the ingredients, the steps, and a photo — we'll handle the rest.
                    </p>
                  </div>
                  <div className="absolute -right-8 -top-8 w-60 h-60 bg-orange-200 rounded-full opacity-25 blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* KOLOM KIRI (Detail, Bahan, Langkah) */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Card 1: Recipe Details */}
                    <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm">
                      <h3 className="font-black text-xl text-gray-900 mb-2">Recipe details</h3>
                      <p className="text-sm text-gray-400 font-medium mb-8">Tell us what makes this dish special.</p>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 tracking-wider">JUDUL RESEP</label>
                            <input name="title" placeholder="e.g. Miso Butter Pasta" className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all" onChange={handleChange} required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 tracking-wider">NAMA MENU</label>
                            <input name="name" placeholder="e.g. Pasta" className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all" onChange={handleChange} required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 tracking-wider">SHORT DESCRIPTION</label>
                          <textarea name="description" placeholder="A creamy, umami-packed pasta ready in 20 minutes..." className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium h-24 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all resize-none" onChange={handleChange}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 tracking-wider">COOK TIME (MINUTES)</label>
                            <input name="waktu" type="number" placeholder="20" className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all" onChange={handleChange} required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 tracking-wider">DIFFICULTY</label>
                            <select name="level" className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all cursor-pointer" onChange={handleChange}>
                              <option value="Mudah">Mudah (Easy)</option>
                              <option value="Sedang">Sedang (Medium)</option>
                              <option value="Sulit">Sulit (Hard)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Ingredients */}
                    <div className="bg-white rounded-[28px] p-8 lg:p-10 border border-gray-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                        <h3 className="font-black text-xl text-gray-900">Ingredients</h3>
                        <button type="button" onClick={() => handleAddField('ingredients')} className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1">
                          + Add
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 font-medium mb-8">List each item on its own line.</p>
                      
                      <div className="space-y-4">
                        {formData.ingredients.map((item, index) => (
                          <div key={`ingredient-${index}`} className="flex flex-col gap-3 sm:flex-row sm:items-center bg-gray-50/80 border border-gray-100 rounded-2xl p-3">
                            <span className="text-orange-400 font-black text-sm w-6 text-right shrink-0">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <input
                              type="text"
                              placeholder={`e.g. 200g spaghetti`}
                              value={item}
                              className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-50 transition-all"
                              onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                              required
                            />
                            {formData.ingredients.length > 1 ? (
                              <button type="button" onClick={() => handleRemoveField(index, 'ingredients')} className="w-10 h-10 flex justify-center items-center text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors font-black text-sm shrink-0">
                                &#10005;
                              </button>
                            ) : <div className="w-10"></div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 3: Cooking Steps */}
                    <div className="bg-white rounded-[28px] p-8 lg:p-10 border border-gray-100 shadow-sm">
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                        <h3 className="font-black text-xl text-gray-900">Cooking steps</h3>
                        <button type="button" onClick={() => handleAddField('steps')} className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1">
                          + Add step
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 font-medium mb-8">Walk us through it, step by step.</p>

                      <div className="space-y-4">
                        {formData.steps.map((item, index) => (
                          <div key={`step-${index}`} className="flex flex-col gap-4 sm:flex-row sm:items-start bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 mt-1 shadow-md shadow-orange-200">
                              {index + 1}
                            </div>
                            <textarea
                              placeholder={`Describe what to do in this step...`}
                              value={item}
                              className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium min-h-[100px] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-50 transition-all resize-none"
                              onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                              required
                            />
                             {formData.steps.length > 1 ? (
                              <button type="button" onClick={() => handleRemoveField(index, 'steps')} className="w-10 h-10 mt-1 flex justify-center items-center text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors font-black text-sm shrink-0">
                                &#10005;
                              </button>
                            ) : <div className="w-10"></div>}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* KOLOM KANAN (Foto & Tombol Submit) */}
                  <div className="space-y-8">
                    
                    {/* Card Cover Photo */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                      <h3 className="font-black text-xl text-gray-900 mb-2">Cover photo</h3>
                      <p className="text-sm text-gray-400 font-medium mb-6">Make it mouth-watering.</p>
                      
                      <div className="bg-[#FFF8F4] border-2 border-dashed border-orange-200 rounded-3xl p-6 text-center transition-all hover:bg-orange-50 mb-6">
                        {/* Pilihan Upload/URL */}
                        <div className="flex justify-center gap-6 mb-6">
                          <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                            <input type="radio" name="imageMode" value="url" checked={imageMode === 'url'} onChange={() => {
                              setImageMode('url');
                              setImageFile(null);
                              setPreviewImage(null);
                            }} className="accent-orange-500 w-4 h-4 scale-125" />
                            URL Link
                          </label>
                          <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                            <input type="radio" name="imageMode" value="upload" checked={imageMode === 'upload'} onChange={() => setImageMode('upload')} className="accent-orange-500 w-4 h-4 scale-125" />
                            Upload
                          </label>
                        </div>
                        
                        {imageMode === 'url' ? (
                          <input name="image_url" placeholder="Paste link gambar..." value={formData.image_url} className="w-full bg-white rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-orange-400 border border-orange-100 shadow-sm text-center" onChange={handleChange} />
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={handleImageChange}
                            />
                            <div className="bg-white py-4 rounded-xl border border-orange-100 shadow-sm text-orange-600 font-bold text-sm">
                              {imageFile ? imageFile.name : "🖼️ Browse Image"}
                            </div>
                            {previewImage && (
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="mx-auto mt-4 w-24 h-24 object-cover rounded-2xl"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Info tip di kanan bawah seperti Figma */}
                      <div className="bg-orange-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-orange-500">&#128081;</span>
                           <span className="text-xs font-black text-orange-600">Pro tip</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                          Recipes with a clear cover photo and 6+ steps get 3× more saves on Keynotes Eats.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Card */}
                    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-3 sticky top-28">
                       <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-full font-black hover:bg-gray-800 shadow-xl shadow-gray-900/20 transition-all active:scale-95 text-sm">
                         Publish Recipe
                       </button>
                       <button type="button" onClick={() => setPage('home')} className="w-full py-4 bg-gray-50 text-gray-600 rounded-full font-bold hover:bg-gray-100 transition-all text-sm border border-gray-200">
                         Save as draft (Cancel)
                       </button>
                    </div>

                  </div>
                </form>
              </div>
            )}

            {/* OTHER PAGES */}
            {(page === 'saved' || page === 'about') && (
              <div className="text-center py-40 text-gray-400 animate-slide-up">
                <span className="text-6xl">&#127959;</span>
                <h3 className="font-black text-2xl text-gray-800 mt-6 mb-2">Coming Soon</h3>
                <p className="text-sm font-medium">Halaman ini lagi dibangun sama tukang. Balik lagi besok ya!</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Mobile Nav (Tetap sama) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-gray-200 h-16 rounded-2xl shadow-2xl flex justify-around items-center z-40 px-4">
        <button onClick={() => { setPage('home'); setSelectedRecipe(null); }} className={`p-2.5 rounded-xl transition-colors ${page === 'home' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}>&#127968;</button>
        <button onClick={() => setPage('add')} className={`p-2.5 rounded-xl transition-colors ${page === 'add' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}>&#43;</button>
        <button onClick={() => setPage('saved')} className={`p-2.5 rounded-xl transition-colors ${page === 'saved' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}>&#128278;</button>
        <button onClick={() => setPage('about')} className={`p-2.5 rounded-xl transition-colors ${page === 'about' ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-50'}`}>&#128100;</button>
      </nav>
    </div>
  );
}

// Komponen Sidebar
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-[#FFEFE5] text-orange-600' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}`}>
      <div className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </div>
  );
}

// Komponen Card Resep
function ResepCard({ nama, waktu, img, level, onClick }) {
  const levelColor = {
    'Mudah': 'bg-green-100 text-green-700',
    'Sedang': 'bg-yellow-100 text-yellow-700',
    'Sulit': 'bg-red-100 text-red-700',
  };

  return (
    <div onClick={onClick} className="group bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full active:scale-[0.98]">
      <div className="relative h-48 overflow-hidden p-2">
        <img src={img} alt={nama} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl tracking-wide uppercase shadow-sm ${levelColor[level] || 'bg-gray-100 text-gray-500'}`}>
            {level || 'Mudah'}
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-center">
        <h3 className="font-black text-gray-900 text-lg group-hover:text-orange-500 transition-colors line-clamp-1 mb-1 tracking-tight">{nama}</h3>
        <p className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
          <span className="text-orange-400">&#9201;</span> {waktu}
        </p>
      </div>
    </div>
  );
}