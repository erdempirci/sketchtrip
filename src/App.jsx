import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  ShoppingBag, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Image as ImageIcon,
  Edit3, 
  Trash2, 
  Check, 
  MoveLeft, 
  MoveRight, 
  SlidersHorizontal, 
  X,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Sanat Stilleri Tanımları ve CSS Filtre Kodları
const ART_STYLES = [
  {
    id: 'acrylic',
    name: 'Akrilik Tablo',
    emoji: '🎨',
    badge: 'Akrilik Sanat',
    style: {
      filter: 'contrast(140%) saturate(165%) brightness(105%) sepia(10%) drop-shadow(0px 0px 2px rgba(0,0,0,0.3))'
    }
  },
  {
    id: 'watercolor',
    name: 'Ege Suluboya',
    emoji: '🌊',
    badge: 'Suluboya Efekti',
    style: {
      filter: 'contrast(115%) saturate(135%) brightness(112%) hue-rotate(5deg) blur(0.3px)'
    }
  },
  {
    id: 'pencil',
    name: 'Karakalem',
    emoji: '✏️',
    badge: 'Karakalem Eskiz',
    style: {
      filter: 'grayscale(100%) contrast(180%) brightness(95%)'
    }
  },
  {
    id: 'vintage',
    name: 'Retro Polaroid',
    emoji: '🎞️',
    badge: 'Vintage 1970',
    style: {
      filter: 'sepia(55%) contrast(120%) brightness(95%) saturate(130%)'
    }
  },
  {
    id: 'gouache',
    name: 'Washi Guaj',
    emoji: '🪻',
    badge: 'Pastel Guaj',
    style: {
      filter: 'contrast(125%) saturate(190%) brightness(102%) hue-rotate(-15deg)'
    }
  }
];

const initialAlbums = [
  {
    id: 'kyoto-2024',
    title: "Kyoto & Tokyo Baharı",
    location: "Japonya",
    date: "Ekim 2024",
    coverUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    stamp: "⛩️ NIPPON",
    pages: [
      {
        id: 101,
        title: "Fushimi Inari Torii Yolu",
        note: "Sabahın erken saatlerinde sessiz bir tırmanış. Tapınak kırmızıları puslu havada parlıyordu.",
        photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
        artStyleId: 'acrylic'
      },
      {
        id: 102,
        title: "Gion Geleneksel Sokakları",
        note: "Ahşap çay evleri ve yağmur sonrası taş kaldırımlardaki yansımalar büyüleyiciydi.",
        photoUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
        artStyleId: 'watercolor'
      }
    ]
  },
  {
    id: 'cappadocia-2024',
    title: "Kapadokya Balon Turu",
    location: "Göreme, Türkiye",
    date: "Eylül 2024",
    coverUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80",
    stamp: "🎈 GÖREME",
    pages: [
      {
        id: 201,
        title: "Gündoğumu Balonları",
        note: "Gökyüzü pastel turuncu ve pembe bir rüyaya dönüştü.",
        photoUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80",
        artStyleId: 'vintage'
      }
    ]
  }
];

export default function App() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [activeTab, setActiveTab] = useState('library');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLiked, setIsLiked] = useState(false);
  
  // Düzenleme State'leri
  const [isEditingCurrentPage, setIsEditingCurrentPage] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showPagesDrawer, setShowPagesDrawer] = useState(false);

  // Yeni Albüm Ekleme
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedInitialStyle, setSelectedInitialStyle] = useState('acrylic');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const activeAlbum = albums.find(a => a.id === activeAlbumId);
  const currentPage = activeAlbum ? activeAlbum.pages[currentPageIndex] : null;

  // Geçerli sayfanın seçili stili
  const currentArtStyle = ART_STYLES.find(s => s.id === (currentPage?.artStyleId || 'acrylic')) || ART_STYLES[0];

  const openAlbum = (albumId) => {
    setActiveAlbumId(albumId);
    setCurrentPageIndex(0);
    setSliderPosition(50);
    setIsLiked(false);
    setIsEditingCurrentPage(false);
  };

  const closeAlbum = () => {
    setActiveAlbumId(null);
    setShowPagesDrawer(false);
    setIsEditingCurrentPage(false);
  };

  // Mevcut Sayfanın Sanat Stilini Değiştir
  const changePageArtStyle = (styleId) => {
    if (!activeAlbum || !currentPage) return;
    setAlbums(prevAlbums => prevAlbums.map(album => {
      if (album.id !== activeAlbum.id) return album;
      const updatedPages = [...album.pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        artStyleId: styleId
      };
      return { ...album, pages: updatedPages };
    }));
  };

  const startEditing = () => {
    if (!currentPage) return;
    setEditTitle(currentPage.title);
    setEditNote(currentPage.note);
    setIsEditingCurrentPage(true);
  };

  const savePageEdit = () => {
    if (!activeAlbum || !currentPage) return;
    setAlbums(prevAlbums => prevAlbums.map(album => {
      if (album.id !== activeAlbum.id) return album;
      const updatedPages = [...album.pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        title: editTitle.trim() || currentPage.title,
        note: editNote.trim() || currentPage.note
      };
      return { ...album, pages: updatedPages };
    }));
    setIsEditingCurrentPage(false);
  };

  const deleteCurrentPage = (pageIdxToDelete = currentPageIndex) => {
    if (!activeAlbum) return;
    if (activeAlbum.pages.length <= 1) {
      alert("Albümde en az 1 sayfa bulunmalıdır.");
      return;
    }
    if (!confirm("Bu sayfayı silmek istediğinize emin misiniz?")) return;

    setAlbums(prevAlbums => prevAlbums.map(album => {
      if (album.id !== activeAlbum.id) return album;
      const filtered = album.pages.filter((_, idx) => idx !== pageIdxToDelete);
      return { 
        ...album, 
        pages: filtered,
        coverUrl: filtered[0]?.photoUrl || album.coverUrl
      };
    }));

    if (currentPageIndex >= activeAlbum.pages.length - 1) {
      setCurrentPageIndex(Math.max(0, activeAlbum.pages.length - 2));
    }
  };

  const movePage = (fromIndex, direction) => {
    if (!activeAlbum) return;
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= activeAlbum.pages.length) return;

    setAlbums(prevAlbums => prevAlbums.map(album => {
      if (album.id !== activeAlbum.id) return album;
      const newPages = [...album.pages];
      const temp = newPages[fromIndex];
      newPages[fromIndex] = newPages[toIndex];
      newPages[toIndex] = temp;
      return { ...album, pages: newPages, coverUrl: newPages[0].photoUrl };
    }));

    setCurrentPageIndex(toIndex);
  };

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
            photoUrl: reader.result,
            artStyleId: selectedInitialStyle
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

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
      stamp: "✨ TRAVEL",
      pages: uploadedPhotos
    };

    setAlbums([createdAlbum, ...albums]);
    setNewTitle('');
    setNewLocation('');
    setUploadedPhotos([]);
    setActiveTab('library');
    openAlbum(createdAlbum.id);

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const handleNextPage = () => {
    if (activeAlbum && currentPageIndex < activeAlbum.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setSliderPosition(50);
      setIsLiked(false);
      setIsEditingCurrentPage(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setSliderPosition(50);
      setIsLiked(false);
      setIsEditingCurrentPage(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-800 flex justify-center items-center p-0 sm:p-4 font-sans select-none">
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] bg-stone-100 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-stone-700/30">
        
        {/* Üst Bar */}
        <header className="px-4 pt-4 pb-3 bg-stone-100/90 backdrop-blur border-b border-stone-200/80 flex items-center justify-between z-20">
          {activeAlbumId ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={closeAlbum}
                className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 transition bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-sm"
              >
                <ArrowLeft size={16} /> Kitaplık
              </button>
              <button 
                onClick={() => setShowPagesDrawer(!showPagesDrawer)}
                className="flex items-center gap-1 text-xs font-semibold text-stone-600 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-sm"
              >
                <SlidersHorizontal size={14} /> Sayfalar ({activeAlbum?.pages.length})
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-base font-bold text-stone-900 leading-tight">SketchTrip</h1>
              <p className="text-[10px] text-stone-500 font-medium">Seyahat Günlükleri & Sanat Defteri</p>
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
          
          {/* DURUM 1: DEFTER İÇİ */}
          {activeAlbum && currentPage ? (
            <div className="h-full flex flex-col justify-between p-4 pb-20 animate-in fade-in duration-200">
              <div className="relative flex-1 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-md flex flex-col justify-between overflow-hidden">
                
                {/* Washi Tape */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-amber-200/80 backdrop-blur-sm -rotate-1 shadow-sm border border-amber-300/40 z-10 rounded-sm"></div>

                {/* Üst Başlık & Araçlar */}
                <div className="pt-2 border-b border-stone-200/70 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1">
                        <MapPin size={10} /> {activeAlbum.location}
                      </span>
                      {isEditingCurrentPage ? (
                        <input 
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full text-base font-bold text-stone-900 bg-white border border-amber-400 rounded-lg px-2 py-0.5 mt-0.5 focus:outline-none"
                        />
                      ) : (
                        <h2 className="text-lg font-bold text-stone-900 leading-tight">
                          {currentPage.title}
                        </h2>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-1.5 py-1 rounded-xl border border-stone-200 shadow-sm">
                      {isEditingCurrentPage ? (
                        <button onClick={savePageEdit} className="p-1 text-emerald-600">
                          <Check size={16} />
                        </button>
                      ) : (
                        <button onClick={startEditing} className="p-1 text-stone-500 hover:text-stone-800">
                          <Edit3 size={15} />
                        </button>
                      )}
                      <button onClick={() => deleteCurrentPage()} className="p-1 text-rose-500 hover:text-rose-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Sıra Değiştirme */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-amber-200/40 text-[11px] text-stone-500">
                    <span className="font-medium">
                      Sayfa: {currentPageIndex + 1} / {activeAlbum.pages.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => movePage(currentPageIndex, -1)}
                        disabled={currentPageIndex === 0}
                        className={`px-2 py-0.5 rounded border text-[10px] font-semibold flex items-center gap-1 ${
                          currentPageIndex === 0 ? 'text-stone-300 border-stone-200' : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300'
                        }`}
                      >
                        <MoveLeft size={11} /> Öne Al
                      </button>
                      <button 
                        onClick={() => movePage(currentPageIndex, 1)}
                        disabled={currentPageIndex === activeAlbum.pages.length - 1}
                        className={`px-2 py-0.5 rounded border text-[10px] font-semibold flex items-center gap-1 ${
                          currentPageIndex === activeAlbum.pages.length - 1 ? 'text-stone-300 border-stone-200' : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300'
                        }`}
                      >
                        Arkaya Al <MoveRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative my-2 rounded-xl overflow-hidden aspect-[4/3] shadow-inner border border-stone-300">
                  {/* Dinamik Sanat Filtresi Uygulanmış Katman */}
                  <img 
                    src={currentPage.photoUrl} 
                    alt="Sanat Eseri" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-300"
                    style={currentArtStyle.style}
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/75 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium z-10 flex items-center gap-1">
                    <span>{currentArtStyle.emoji}</span>
                    <span>{currentArtStyle.badge}</span>
                  </div>

                  {/* Orijinal Fotoğraf Katmanı */}
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

                  {/* Kaydırıcı */}
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

                {/* YENİ: SANAT STİLİ SEÇİCİ BAR (DOKUNUNCA ANINDA DEĞİŞİR) */}
                <div className="bg-white/60 p-1.5 rounded-xl border border-stone-200/80 mb-2">
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    {ART_STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => changePageArtStyle(st.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition shrink-0 ${
                          currentArtStyle.id === st.id 
                            ? 'bg-amber-800 text-white shadow-sm' 
                            : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                        }`}
                      >
                        <span>{st.emoji}</span>
                        <span>{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gezi Notu & Düzenleme */}
                <div className="space-y-1">
                  {isEditingCurrentPage ? (
                    <div className="space-y-1">
                      <textarea 
                        rows={2}
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-amber-400 bg-white focus:outline-none"
                      />
                      <button 
                        onClick={savePageEdit}
                        className="w-full py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Check size={14} /> Değişiklikleri Kaydet
                      </button>
                    </div>
                  ) : (
                    <p className="text-stone-700 italic text-xs leading-relaxed min-h-[30px]">
                      "{currentPage.note}"
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-xs text-stone-500">
                    <span className="text-[10px] text-stone-400">
                      Stil: {currentArtStyle.name}
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
                <div className="flex items-center justify-between mt-1 pt-1.5">
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

              {/* Sayfa Yönetim Paneli */}
              {showPagesDrawer && (
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-stone-200 p-4 shadow-2xl z-40 max-h-[60%] flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Albüm Sayfaları ({activeAlbum.pages.length})
                    </h3>
                    <button onClick={() => setShowPagesDrawer(false)} className="p-1 text-stone-400">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 overflow-y-auto p-1">
                    {activeAlbum.pages.map((p, idx) => (
                      <div 
                        key={p.id}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer shadow-sm ${
                          currentPageIndex === idx ? 'border-amber-800 scale-95' : 'border-stone-200'
                        }`}
                        onClick={() => {
                          setCurrentPageIndex(idx);
                          setShowPagesDrawer(false);
                        }}
                      >
                        <img src={p.photoUrl} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-1.5">
                          <span className="text-[10px] text-white font-bold">#{idx + 1}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCurrentPage(idx);
                            }}
                            className="p-1 bg-black/60 hover:bg-rose-600 rounded text-white"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* DURUM 2: KİTAPLIK */}
          {!activeAlbumId && activeTab === 'library' && (
            <div className="p-4 pb-24 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Koleksiyon</span>
                  <h2 className="text-2xl font-bold text-stone-900">Gezi Albümlerim</h2>
                </div>
                <span className="text-xs text-stone-500 font-medium">{albums.length} Defter</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {albums.map((album) => (
                  <div 
                    key={album.id}
                    onClick={() => openAlbum(album.id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col active:scale-95"
                  >
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

          {/* DURUM 3: YENİ ALBÜM OLUŞTURMA */}
          {!activeAlbumId && activeTab === 'create' && (
            <div className="p-4 pb-24 space-y-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Yeni Defter</span>
                <h2 className="text-2xl font-bold text-stone-900">Gezi Albümü Oluştur</h2>
                <p className="text-xs text-stone-500">Rotanı yaz, tarzını seç ve fotoğraflarını yükle.</p>
              </div>

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

                {/* YENİ: ALBÜMÜN SANAT TARZI SEÇİMİ */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Varsayılan Sanat Tarzı</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ART_STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedInitialStyle(style.id)}
                        className={`p-2 rounded-xl text-center border transition text-xs flex flex-col items-center gap-0.5 ${
                          selectedInitialStyle === style.id
                            ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-sm">{style.emoji}</span>
                        <span className="text-[10px] font-semibold">{style.name}</span>
                      </button>
                    ))}
                  </div>
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
                    <p className="text-[10px] text-stone-400 mt-0.5">Toplu fotoğraf seçebilirsiniz</p>
                  </div>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-600">Seçilen Fotoğraflar ({uploadedPhotos.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedPhotos.map((p) => (
                        <div key={p.id} className="aspect-square rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                          <img src={p.photoUrl} alt="Seçilen" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <BookOpen size={16} /> Albümü Oluştur ve Aç
                </button>
              </form>
            </div>
          )}

          {/* DURUM 4: MAĞAZA */}
          {!activeAlbumId && activeTab === 'store' && (
            <div className="p-4 pb-24 space-y-4 text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Tasarım Mağazası</span>
              <h2 className="text-2xl font-bold text-stone-900">Defter Şablonları</h2>
              <p className="text-xs text-stone-500">Premium suluboya ve akrilik defter temaları.</p>
              
              <div className="bg-white p-4 rounded-2xl border border-stone-200 text-left space-y-2">
                <h3 className="font-bold text-stone-800">Tokyo Sakura Teması</h3>
                <p className="text-xs text-stone-500">Pirinç kağıdı dokusu, sakura yaprakları ve mühür seti.</p>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-amber-800">₺149</span>
                  <button className="px-3 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-bold">
                    Satın Al
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Alt Menü Barı */}
        {!activeAlbumId && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-2.5 flex justify-around items-center z-30">
            <button 
              onClick={() => setActiveTab('library')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'library' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
            >
              <BookOpen size={20} />
              <span className="text-[10px]">Albümler</span>
            </button>

            <button 
              onClick={() => setActiveTab('create')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'create' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
            >
              <Plus size={20} />
              <span className="text-[10px]">Yeni Albüm</span>
            </button>

            <button 
              onClick={() => setActiveTab('store')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'store' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
            >
              <ShoppingBag size={20} />
              <span className="text-[10px]">Mağaza</span>
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
