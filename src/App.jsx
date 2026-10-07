import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Heart, 
  Camera, 
  Volume2, 
  VolumeX,
  Upload,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const initialPages = [
  {
    id: 1,
    title: "Kyoto · Fushimi Inari",
    country: "Japonya",
    date: "14 Ekim",
    photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    acrylicUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    note: "Binlerce kırmızı torii kapısının altından tepeye doğru sabah sisiyle tırmandık. Renkler bir tuval gibi parlıyordu.",
    stamp: "⛩️ 伏見稲荷",
    locationCode: "34.9671° N, 135.7727° E",
    likes: 124
  },
  {
    id: 2,
    title: "Kapadokya · Göreme Vadisi",
    country: "Türkiye",
    date: "28 Eylül",
    photoUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80",
    acrylicUrl: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1000&q=80",
    note: "Gündoğumunda peribacalarının üzerinden süzülen onlarca balon... Gökyüzü pastel turuncu ve pembe bir rüyaydı.",
    stamp: "🎈 CAPPADOCIA",
    locationCode: "38.6431° N, 34.8289° E",
    likes: 312
  }
];

const marketplaceThemes = [
  {
    id: 'kyoto-acrylic',
    name: "Kyoto Pastel Akrilik",
    style: "Japon Washi Kağıdı & Kalın Fırça",
    price: "₺149",
    tag: "En Popüler",
    previewColor: "from-amber-100 to-rose-100",
    features: ["Dokulu pirinç kağıdı dokusu", "Kanji & Torii mühür kütüphanesi", "Yumuşak pastel kenarlıklar"]
  },
  {
    id: 'aegean-watercolor',
    name: "Ege & Akdeniz Suluboya",
    style: "Ham Keten Dokusu & Canlı Su Efekti",
    price: "₺129",
    tag: "Yeni",
    previewColor: "from-sky-100 to-teal-100",
    features: ["Deniz kenarı tuz lekesi efekti", "İtalyan/Ege seramik damgaları", "Antik el yazısı fontları"]
  }
];

export default function App() {
  const [pages, setPages] = useState(initialPages);
  const [activeTab, setActiveTab] = useState('sketchbook');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [purchasedThemes, setPurchasedThemes] = useState(['kyoto-acrylic']);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [themeToBuy, setThemeToBuy] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // Yeni Sayfa Yükleme State'leri
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Zengin Akrilik');
  const fileInputRef = useRef(null);

  // Kağıt Hışırtısı Ses Efekti
  const playPageSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'pink' || 'sine';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {}
  };

  // Fotoğraf Seçildiğinde Çalışır
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Yeni Sayfayı Deftere Ekle
  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!uploadedImage) {
      alert("Lütfen önce bir fotoğraf seçin!");
      return;
    }

    const newPage = {
      id: Date.now(),
      title: newTitle || "Yeni Anı",
      country: newCountry || "Seyahat",
      date: "Bugün",
      photoUrl: uploadedImage,
      // Gerçek AI API bağlanana kadar CSS/filtre ile akrilik etkisi verilir
      acrylicUrl: uploadedImage,
      note: newNote || "Unutulmaz bir gün...",
      stamp: "✨ MEMORY",
      locationCode: "Kişisel Seyahat Notu",
      likes: 1
    };

    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
    setActiveTab('sketchbook');
    setUploadedImage(null);
    setNewTitle('');
    setNewCountry('');
    setNewNote('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      playPageSound();
      setCurrentPageIndex(prev => prev + 1);
      setSliderPosition(50);
      setIsLiked(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playPageSound();
      setCurrentPageIndex(prev => prev - 1);
      setSliderPosition(50);
      setIsLiked(false);
    }
  };

  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-800 flex justify-center items-center p-0 sm:p-4 font-sans-ui select-none">
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] bg-stone-100 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-stone-700/30">
        
        {/* Üst Bar */}
        <header className="px-5 pt-4 pb-3 bg-stone-100/90 backdrop-blur border-b border-stone-200/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-700/10 text-amber-800 flex items-center justify-center font-serif-title font-bold text-lg shadow-inner">
              S
            </div>
            <div>
              <h1 className="text-base font-serif-title font-bold text-stone-900 leading-tight">SketchTrip</h1>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide">Dijital Gezi Eskiz Defteri</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={() => confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } })}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1 overflow-y-auto relative">
          
          {/* TAB 1: DEFTER GÖRÜNTÜLEYİCİ */}
          {activeTab === 'sketchbook' && (
            <div className="h-full flex flex-col justify-between p-4 pb-20">
              <div className="relative flex-1 bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 shadow-md flex flex-col justify-between overflow-hidden">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/70 backdrop-blur-sm -rotate-1 shadow-sm border border-amber-300/40 z-10 rounded-sm"></div>

                <div className="pt-2 flex justify-between items-start border-b border-stone-200/60 pb-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold block">
                      {currentPage.country} · {currentPage.date}
                    </span>
                    <h2 className="text-xl font-serif-title font-bold text-stone-900">
                      {currentPage.title}
                    </h2>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-amber-200/50 text-amber-900 text-xs rounded font-handwriting font-bold border border-amber-300/40">
                      {currentPage.stamp}
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] shadow-inner border border-stone-300/60">
                  <img 
                    src={currentPage.acrylicUrl} 
                    alt="Sanat Eseri" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none filter saturate-150 contrast-125 sepia-[0.15]"
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full z-0 font-medium">
                    🎨 Akrilik Stili
                  </div>

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
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium">
                      📷 Fotoğraf
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10 flex items-center justify-center"
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

                {/* Not ve Beğeni */}
                <div className="space-y-2">
                  <p className="font-handwriting text-xl text-stone-700 leading-tight italic">
                    "{currentPage.note}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs text-stone-500">
                    <span className="font-mono text-[10px] text-stone-400">
                      {currentPage.locationCode}
                    </span>
                    <button 
                      onClick={() => setIsLiked(!isLiked)} 
                      className={`flex items-center gap-1 transition ${isLiked ? 'text-rose-600 font-semibold' : 'text-stone-400'}`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                      <span>{currentPage.likes + (isLiked ? 1 : 0)}</span>
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

                  <span className="text-xs font-medium text-stone-500">
                    {currentPageIndex + 1} / {pages.length}
                  </span>

                  <button 
                    onClick={handleNextPage}
                    disabled={currentPageIndex === pages.length - 1}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      currentPageIndex === pages.length - 1 ? 'text-stone-300 border-stone-200' : 'text-stone-700 bg-white shadow-sm'
                    }`}
                  >
                    Sonraki <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STÜDYO (FOTOĞRAF YÜKLEME ALANI) */}
          {activeTab === 'studio' && (
            <div className="p-4 pb-24 space-y-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Yaratıcı Stüdyo</span>
                <h2 className="text-2xl font-serif-title font-bold text-stone-900 mt-0.5">Yeni Sayfa Ekle</h2>
                <p className="text-xs text-stone-500">Galerinden fotoğraf seç, notunu yaz ve deftere kaydet.</p>
              </div>

              {/* Gizli Dosya Seçici */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />

              {/* Tıklanabilir Fotoğraf Alanı */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-800/30 rounded-2xl p-5 text-center bg-white/70 hover:bg-amber-50/50 transition cursor-pointer relative overflow-hidden"
              >
                {uploadedImage ? (
                  <div className="space-y-2">
                    <img 
                      src={uploadedImage} 
                      alt="Seçilen Fotoğraf" 
                      className="w-full h-44 object-cover rounded-xl shadow-sm border border-stone-200"
                    />
                    <p className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1">
                      <Camera size={14} /> Fotoğrafı Değiştir
                    </p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-stone-800">Galeriden Fotoğraf Seçmek İçin Dokun</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">JPG, PNG veya iPhone Fotoğrafı</p>
                  </div>
                )}
              </div>

              {/* Bilgi Giriş Formu */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Mekan / Başlık</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Alaçatı Sokakları"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Ülke / Şehir</label>
                  <input 
                    type="text" 
                    placeholder="Örn: İzmir, Türkiye"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">El Yazısı Gezi Notu</label>
                  <textarea 
                    rows={2} 
                    placeholder="O an ne hissettin? Havası, kokusu, renkleri nasıldı?"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-800 font-handwriting text-base"
                  />
                </div>

                {/* Stil Seçimi */}
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Sanat Stili</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Hafif Eskiz', 'Zengin Akrilik', 'Vahşi Guaj'].map((st) => (
                      <button 
                        key={st}
                        type="button"
                        onClick={() => setSelectedStyle(st)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          selectedStyle === st ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-700 border-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deftere Ekle Butonu */}
                <button 
                  onClick={handleCreatePage}
                  className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  <Plus size={16} /> Sayfayı Deftere Ekle
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MAĞAZA */}
          {activeTab === 'store' && (
            <div className="p-4 pb-24 space-y-4">
              <div className="text-center py-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Tasarım Mağazası</span>
                <h2 className="text-2xl font-serif-title font-bold text-stone-900 mt-1">Eskiz Defteri Temaları</h2>
              </div>

              <div className="space-y-4">
                {marketplaceThemes.map((theme) => {
                  const isOwned = purchasedThemes.includes(theme.id);
                  return (
                    <div key={theme.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif-title font-bold text-base text-stone-900">{theme.name}</h3>
                          <p className="text-xs text-stone-500">{theme.style}</p>
                        </div>
                        <span className="text-base font-bold text-stone-900">{theme.price}</span>
                      </div>

                      <button 
                        onClick={() => {
                          if (!isOwned) {
                            setThemeToBuy(theme);
                            setShowCheckoutModal(true);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 ${
                          isOwned ? 'bg-stone-100 text-stone-600' : 'bg-amber-800 text-white'
                        }`}
                      >
                        {isOwned ? <><Check size={16} /> Satın Alındı</> : <><ShoppingBag size={16} /> Satın Al ({theme.price})</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>

        {/* Alt Menü */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-stone-200 px-6 py-2.5 flex justify-around items-center z-30">
          <button 
            onClick={() => setActiveTab('sketchbook')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'sketchbook' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
          >
            <BookOpen size={20} />
            <span className="text-[10px]">Defter</span>
          </button>

          <button 
            onClick={() => setActiveTab('studio')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'studio' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
          >
            <Sparkles size={20} />
            <span className="text-[10px]">Stüdyo</span>
          </button>

          <button 
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'store' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px]">Mağaza</span>
          </button>
        </nav>

        {/* Satın Alma Modalı */}
        {showCheckoutModal && themeToBuy && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-stone-900">{themeToBuy.name}</h3>
                <button onClick={() => setShowCheckoutModal(false)}>✕</button>
              </div>
              <p className="text-xs text-stone-500">Tutar: <strong className="text-amber-800">{themeToBuy.price}</strong></p>
              <button 
                onClick={() => {
                  setPurchasedThemes([...purchasedThemes, themeToBuy.id]);
                  setShowCheckoutModal(false);
                  confetti({ particleCount: 50, spread: 50 });
                }}
                className="w-full py-2.5 bg-amber-800 text-white font-bold text-xs rounded-xl"
              >
                Onayla & Aç
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
