import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ArrowLeft,
  Plus, 
  MapPin, 
  Calendar,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Başlangıç Albümleri Verisi (Mock)
const initialAlbums = [
  {
    id: 'kyoto-2024',
    title: "Kyoto & Tokyo Baharı",
    location: "Japonya",
    date: "Ekim 2024",
    coverUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    themeColor: "from-amber-700 to-rose-900",
    stamp: "⛩️ NIPPON",
    pages: [
      {
        id: 101,
        title: "Fushimi Inari Torii Yolu",
        note: "Sabahın erken saatlerinde sessiz bir tırmanış. Tapınak kırmızıları puslu havada parlıyordu.",
        photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: 102,
        title: "Gion Geleneksel Sokakları",
        note: "Ahşap çay evleri ve yağmur sonrası taş kaldırımlardaki yansımalar büyüleyiciydi.",
        photoUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    id: 'cappadocia-2024',
    title: "Kapadokya Balon Turu",
    location: "Göreme, Türkiye",
    date: "Eylül 2024",
    coverUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80",
    themeColor: "from-amber-600 to-orange-800",
    stamp: "🎈 GÖREME",
    pages: [
      {
        id: 201,
        title: "Gündoğumu Balonları",
        note: "Gökyüzü pastel turuncu ve pembe bir rüyaya dönüştü.",
        photoUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  }
];

export default function App() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [activeAlbumId, setActiveAlbumId] = useState(null); // null = Ana Sayfa (Kitaplık), id = Defter İçi
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'create' | 'store'
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLiked, setIsLiked] = useState(false);

  // Yeni Albüm Oluşturma Form State'leri
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Albüm Seçip Defteri Açma
  const openAlbum = (albumId) => {
    setActiveAlbumId(albumId);
    setCurrentPageIndex(0);
    setSliderPosition(50);
    setIsLiked(false);
  };

  // Ana Sayfaya Geri Dönme
  const closeAlbum = () => {
    setActiveAlbumId(null);
  };

  // Toplu Fotoğraf Yükleme (Yeni Albüm İçin)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotos(prev => [
          ...prev, 
          {
            id: Date.now() + index,
            title: file.name.replace(/\.[^/.]+$/, "").substring(0, 16) || `Anı #${prev.length + 1}`,
            note: "Bu anın özel hatırası.",
            photoUrl: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Yeni Albümü Kaydet
  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!uploadedPhotos.length) {
      alert("Lütfen en az 1 fotoğraf seçin!");
      return;
    }

    const createdAlbum = {
      id: `album-${Date.now()}`,
      title: newTitle || "Yeni Gezi Albümü",
      location: newLocation || "Bilinmeyen Rota",
      date: "Yeni",
      coverUrl: uploadedPhotos[0].photoUrl,
      themeColor: "from-amber-700 to-stone-900",
      stamp: "✨ TRAVEL",
      pages: uploadedPhotos
    };

    setAlbums([createdAlbum, ...albums]);
    setNewTitle('');
    setNewLocation('');
    setUploadedPhotos([]);
    setActiveTab('library');
    openAlbum(createdAlbum.id);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Aktif Defter ve Aktif Sayfa
  const activeAlbum = albums.find(a => a.id === activeAlbumId);
  const currentPage = activeAlbum ? activeAlbum.pages[currentPageIndex] : null;

  const handleNextPage = () => {
    if (activeAlbum && currentPageIndex < activeAlbum.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setSliderPosition(50);
      setIsLiked(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setSliderPosition(50);
      setIsLiked(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-800 flex justify-center items-center p-0 sm:p-4 font-sans select-none">
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] bg-stone-100 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-stone-700/30">
        
        {/* Üst Bar */}
        <header className="px-5 pt-4 pb-3 bg-stone-100/90 backdrop-blur border-b border-stone-200/80 flex items-center justify-between z-20">
          {activeAlbumId ? (
            <button 
              onClick={closeAlbum}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 transition bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-sm"
            >
              <ArrowLeft size={16} /> Kitaplık
            </button>
          ) : (
            <div>
              <h1 className="text-base font-bold text-stone-900 leading-tight">SketchTrip</h1>
              <p className="text-[10px] text-stone-500 font-medium">Seyahat Günlükleri & Eskiz Defterleri</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button 
              onClick={() => confetti({ particleCount: 30, spread: 50 })}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1 overflow-y-auto relative">
          
          {/* DURUM 1: ALBÜMÜN İÇİ AÇIKSA (DEFTER & SPLIT-SLIDER) */}
          {activeAlbum && currentPage ? (
            <div className="h-full flex flex-col justify-between p-4 pb-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative flex-1 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-md flex flex-col justify-between overflow-hidden">
                
                {/* Washi Tape */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-amber-200/80 backdrop-blur-sm -rotate-1 shadow-sm border border-amber-300/40 z-10 rounded-sm"></div>

                {/* Başlık ve Damga */}
                <div className="pt-2 flex justify-between items-start border-b border-stone-200/70 pb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block flex items-center gap-1">
                      <MapPin size={10} /> {activeAlbum.location}
                    </span>
                    <h2 className="text-lg font-bold text-stone-900 leading-tight">
                      {currentPage.title}
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200/60 text-amber-900 text-[11px] font-bold rounded border border-amber-300/50">
                    {activeAlbum.stamp}
                  </span>
                </div>

                {/* Birebir Karşılaştırmalı Slider */}
                <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] shadow-inner border border-stone-300">
                  {/* Akrilik Sanat Çizimi */}
                  <img 
                    src={currentPage.photoUrl} 
                    alt="Akrilik Çizim" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      filter: "contrast(135%) saturate(160%) brightness(105%) sepia(10%) drop-shadow(0px 0px 2px rgba(0,0,0,0.3))"
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium z-10">
                    🎨 Akrilik Sanat
                  </div>

                  {/* Orijinal Fotoğraf */}
                  <div 
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img 
                      src={currentPage.photoUrl} 
                      alt="Orijinal Fotoğraf" 
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium">
                      📷 Orijinal
                    </div>
                  </div>

                  {/* Kaydırıcı Çizgi */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none z-10 flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-7 h-7 -ml-3.5 bg-white text-stone-800 rounded-full shadow-lg border border-stone-300 flex items-center justify-center text-[10px] font-bold">
                      ↔
                    </div>
                  </div>

                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                  />
                </div>

                {/* Not ve Detaylar */}
                <div className="space-y-2">
                  <p className="text-stone-700 italic text-sm leading-relaxed">
                    "{currentPage.note}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs text-stone-500">
                    <span className="text-[11px] text-stone-400">
                      Sayfa {currentPageIndex + 1} / {activeAlbum.pages.length}
                    </span>
                    <button 
                      onClick={() => setIsLiked(!isLiked)} 
                      className={`flex items-center gap-1 transition ${isLiked ? 'text-rose-600 font-semibold' : 'text-stone-400'}`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Sayfa Butonları */}
                <div className="flex items-center justify-between mt-3 pt-2">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      currentPageIndex === 0 ? 'text-stone-300 border-stone-200' : 'text-stone-700 bg-white shadow-sm'
                    }`}
                  >
                    <ChevronLeft size={16} /> Önceki
                  </button>

                  <button 
                    onClick={handleNextPage}
                    disabled={currentPageIndex === activeAlbum.pages.length - 1}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      currentPageIndex === activeAlbum.pages.length - 1 ? 'text-stone-300 border-stone-200' : 'text-stone-700 bg-white shadow-sm'
                    }`}
                  >
                    Sonraki <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* DURUM 2: ANA SAYFA (KİTAPLIK / ALBÜMLER LİSTESİ) */}
          {!activeAlbumId && activeTab === 'library' && (
            <div className="p-4 pb-24 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Koleksiyon</span>
                  <h2 className="text-2xl font-bold text-stone-900">Gezi Albümlerim</h2>
                </div>
                <span className="text-xs text-stone-500 font-medium">{albums.length} Defter</span>
              </div>

              {/* Albüm Kartları (Kitaplık) */}
              <div className="grid grid-cols-2 gap-3.5">
                {albums.map((album) => (
                  <div 
                    key={album.id}
                    onClick={() => openAlbum(album.id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col active:scale-95"
                  >
                    {/* Albüm Kapağı */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img 
                        src={album.coverUrl} 
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-bold text-white flex items-center gap-1">
                        <ImageIcon size={10} /> {album.pages.length}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-200/90 text-amber-950 font-bold text-[9px] rounded shadow-sm">
                        {album.stamp}
                      </div>
                    </div>

                    {/* Albüm Başlık & Şehir */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-stone-900 text-xs leading-snug line-clamp-1">
                          {album.title}
                        </h3>
                        <p className="text-[10px] text-stone-500 flex items-center gap-0.5 mt-0.5">
                          <MapPin size={10} /> {album.location}
                        </p>
                      </div>
                      <p className="text-[9px] text-stone-400 mt-2 font-medium">
                        {album.date}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Yeni Albüm Ekleme Kartı */}
                <div 
                  onClick={() => setActiveTab('create')}
                  className="rounded-2xl border-2 border-dashed border-amber-800/30 bg-amber-50/40 hover:bg-amber-100/40 transition flex flex-col items-center justify-center p-4 cursor-pointer text-center min-h-[160px]"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center mb-2 shadow-sm">
                    <Plus size={20} />
                  </div>
                  <span className="text-xs font-bold text-stone-800">Yeni Albüm</span>
                  <span className="text-[10px] text-stone-500">Fotoğraflar Ekle</span>
                </div>
              </div>
            </div>
          )}

          {/* DURUM 3: YENİ ALBÜM OLUŞTURMA SEKMESİ */}
          {!activeAlbumId && activeTab === 'create' && (
            <div className="p-4 pb-24 space-y-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Yeni Defter</span>
                <h2 className="text-2xl font-bold text-stone-900">Gezi Albümü Oluştur</h2>
                <p className="text-xs text-stone-500">Rotanı yaz ve fotoğraflarını topluca yükle.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateAlbum} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Albüm Başlığı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Roma & Floransa Gezisi"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Şehir / Ülke</label>
                  <input 
                    type="text" 
                    placeholder="Örn: İtalya"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                    required
                  />
                </div>

                {/* Toplu Fotoğraf Yükleme */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Fotoğraflar</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-800/30 rounded-2xl p-6 text-center bg-white cursor-pointer hover:bg-amber-50/50 transition"
                  >
                    <Plus size={24} className="mx-auto text-amber-800 mb-1" />
                    <p className="text-xs font-bold text-stone-800">Galeriden Fotoğrafları Seç</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Tek seferde dilediğin kadar fotoğraf seçebilirsin</p>
                  </div>
                </div>
