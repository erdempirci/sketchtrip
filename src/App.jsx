import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  Check, 
  Heart, 
  Compass, 
  Camera, 
  Layers, 
  Palette, 
  Volume2, 
  VolumeX,
  ExternalLink,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Mock Seyahat Sayfaları Verisi
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
  },
  {
    id: 3,
    title: "Santorini · Oia Günbatımı",
    country: "Yunanistan",
    date: "05 Eylül",
    photoUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
    acrylicUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
    note: "Ege'nin derin mavisiyle beyaz kireç badanalı kubbeli evler birleştiğinde zaman durdu.",
    stamp: "🌊 OIA SUNSET",
    locationCode: "36.4618° N, 25.3753° E",
    likes: 189
  }
];

// Satılık Temalar & Şablonlar
const marketplaceThemes = [
  {
    id: 'kyoto-acrylic',
    name: "Kyoto Pastel Akrilik",
    style: "Japon Washi Kağıdı & Kalın Fırça",
    price: "₺149",
    tag: "En Popüler",
    bgPattern: "bg-amber-50/90",
    previewColor: "from-amber-100 to-rose-100",
    rating: "4.9 (420+ yorum)",
    features: ["Dokulu pirinç kağıdı dokusu", "Kanji & Torii mühür kütüphanesi", "Yumuşak pastel akrilik kenarlıklar"]
  },
  {
    id: 'aegean-watercolor',
    name: "Ege & Akdeniz Suluboya",
    style: "Ham Keten Dokusu & Canlı Su Efekti",
    price: "₺129",
    tag: "Yeni",
    bgPattern: "bg-sky-50/90",
    previewColor: "from-sky-100 to-teal-100",
    rating: "4.8 (190+ yorum)",
    features: ["Deniz kenarı tuz lekesi efekti", "İtalyan/Ege seramik damgaları", "Antik el yazısı font koleksiyonu"]
  },
  {
    id: 'vintage-explorer',
    name: "1970 Vintage Gezgin",
    style: "Eski Deri Defter & Sepya Vurgular",
    price: "₺179",
    tag: "Premium",
    bgPattern: "bg-stone-100",
    previewColor: "from-stone-200 to-amber-200",
    rating: "5.0 (98 yorum)",
    features: ["Eski pul ve pasaport damgası seti", "Daktilo ve tükenmez kalem stili", "Deri cilt kenar dikişleri"]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('sketchbook'); // 'sketchbook' | 'store' | 'studio'
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // Split slider %
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(marketplaceThemes[0]);
  const [purchasedThemes, setPurchasedThemes] = useState(['kyoto-acrylic']);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [themeToBuy, setThemeToBuy] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // Kağıt Hışırtısı Ses Efekti (Web Audio API)
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
    } catch (e) {
      // Audio context policy fallback
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < initialPages.length - 1) {
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

  const triggerBuyTheme = (theme) => {
    if (purchasedThemes.includes(theme.id)) {
      setSelectedTheme(theme);
      setActiveTab('sketchbook');
      return;
    }
    setThemeToBuy(theme);
    setShowCheckoutModal(true);
  };

  const completePurchase = () => {
    if (themeToBuy) {
      setPurchasedThemes([...purchasedThemes, themeToBuy.id]);
      setSelectedTheme(themeToBuy);
      setShowCheckoutModal(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setActiveTab('sketchbook');
    }
  };

  const currentPage = initialPages[currentPageIndex];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-800 flex justify-center items-center p-0 sm:p-4 font-sans-ui select-none">
      {/* Mobile Shell Frame */}
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] bg-stone-100 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-stone-700/30">
        
        {/* Top App Bar */}
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
              title="Kağıt Sesi"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={() => {
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
              }}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition"
              title="Paylaş"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto relative">
          
          {/* TAB 1: SKETCHBOOK VIEWER */}
          {activeTab === 'sketchbook' && (
            <div className="h-full flex flex-col justify-between p-4 pb-20">
              
              {/* Defter Sayfası Kapsayıcısı */}
              <div className="relative flex-1 bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 shadow-md flex flex-col justify-between overflow-hidden">
                
                {/* Washi Tape Görseli (Bant) */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/70 backdrop-blur-sm -rotate-1 shadow-sm border border-amber-300/40 z-10 rounded-sm"></div>

                {/* Sayfa Üst Bilgileri & Başlık */}
                <div className="pt-2 flex justify-between items-start border-b border-stone-200/60 pb-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold block">
                      {currentPage.country} · {currentPage.date}
                    </span>
                    <h2 className="text-xl font-serif-title font-bold text-stone-900">
                      {currentPage.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-amber-200/50 text-amber-900 text-xs rounded font-handwriting text-sm font-bold border border-amber-300/40">
                      {currentPage.stamp}
                    </span>
                  </div>
                </div>

                {/* Split Slider: Orijinal Fotoğraf vs Akrilik Çizim */}
                <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] shadow-inner border border-stone-300/60 group">
                  {/* Akrilik AI Katmanı (Altta) */}
                  <img 
                    src={currentPage.acrylicUrl} 
                    alt="Akrilik Çizim" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none filter contrast-105"
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full z-0 font-medium">
                    🎨 Akrilik AI
                  </div>

                  {/* Orijinal Fotoğraf Katmanı (Üstte, clip-path ile kesilmiş) */}
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
                      📷 Orijinal
                    </div>
                  </div>

                  {/* Ayırıcı Çizgi & Tutamaç */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10 flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-7 h-7 -ml-3.5 bg-white text-stone-800 rounded-full shadow-lg border border-stone-300 flex items-center justify-center text-[10px] font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Range Input (Etkileşim) */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                    aria-label="Karşılaştırma Kaydırıcısı"
                  />
                </div>

                {/* El Yazısı Gezi Notu & Detaylar */}
                <div className="space-y-2">
                  <p className="font-handwriting text-xl text-stone-700 leading-tight tracking-wide italic">
                    "{currentPage.note}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs text-stone-500">
                    <span className="font-mono text-[10px] text-stone-400">
                      {currentPage.locationCode}
                    </span>
                    <button 
                      onClick={() => setIsLiked(!isLiked)} 
                      className={`flex items-center gap-1 transition ${isLiked ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                      <span>{currentPage.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>

                {/* Sayfa Çevirme Kontrolleri */}
                <div className="flex items-center justify-between mt-3 pt-2">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      currentPageIndex === 0 
                        ? 'text-stone-300 border-stone-200 cursor-not-allowed' 
                        : 'text-stone-700 border-stone-300 bg-white shadow-sm active:scale-95'
                    }`}
                  >
                    <ChevronLeft size={16} /> Önceki
                  </button>

                  <span className="text-xs font-medium text-stone-500">
                    {currentPageIndex + 1} / {initialPages.length}
                  </span>

                  <button 
                    onClick={handleNextPage}
                    disabled={currentPageIndex === initialPages.length - 1}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      currentPageIndex === initialPages.length - 1 
                        ? 'text-stone-300 border-stone-200 cursor-not-allowed' 
                        : 'text-stone-700 border-stone-300 bg-white shadow-sm active:scale-95'
                    }`}
                  >
                    Sonraki <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TEMPLATE MARKETPLACE (ARAYÜZ SATIŞ MODÜLÜ) */}
          {activeTab === 'store' && (
            <div className="p-4 pb-24 space-y-4">
              <div className="text-center py-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Tasarım Mağazası</span>
                <h2 className="text-2xl font-serif-title font-bold text-stone-900 mt-1">Eskiz Defteri Temaları</h2>
                <p className="text-xs text-stone-500 mt-1">Gezilerinizi benzersiz sanatsal şablonlarla ölümsüzleştirin.</p>
              </div>

              <div className="space-y-4">
                {marketplaceThemes.map((theme) => {
                  const isOwned = purchasedThemes.includes(theme.id);
                  return (
                    <div 
                      key={theme.id}
                      className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif-title font-bold text-lg text-stone-900">{theme.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {theme.tag}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">{theme.style}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-stone-900">{theme.price}</span>
                          <p className="text-[10px] text-stone-400">Tek Seferlik</p>
                        </div>
                      </div>

                      {/* Mini Önizleme Kartı */}
                      <div className={`h-20 rounded-xl bg-gradient-to-r ${theme.previewColor} border border-stone-200 flex items-center justify-around px-4 shadow-inner`}>
                        <div className="w-12 h-14 bg-white/80 rounded shadow-sm border border-white rotate-2 flex items-center justify-center text-xs">
                          🖼️
                        </div>
                        <div className="w-14 h-14 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-lg">
                          🖌️
                        </div>
                        <div className="w-12 h-14 bg-white/80 rounded shadow-sm border border-white -rotate-3 flex items-center justify-center text-xs">
                          📝
                        </div>
                      </div>

                      {/* Özellikler */}
                      <ul className="text-xs text-stone-600 space-y-1">
                        {theme.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Satın Al / Uygula Butonu */}
                      <button 
                        onClick={() => triggerBuyTheme(theme)}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                          isOwned 
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300' 
                            : 'bg-amber-800 hover:bg-amber-900 text-white'
                        }`}
                      >
                        {isOwned ? (
                          <>
                            <Check size={16} /> Aktif Olarak Kullan
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} /> Şablonu Satın Al ({theme.price})
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STUDIO & AI FILTER BUILDER */}
          {activeTab === 'studio' && (
            <div className="p-4 pb-24 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Yaratıcı Stüdyo</span>
                <h2 className="text-2xl font-serif-title font-bold text-stone-900 mt-1">Kendi Sayfanı Yarat</h2>
                <p className="text-xs text-stone-500 mt-1">Tatil fotoğrafını yükle, akrilik eskiz stili seç ve defterine ekle.</p>
              </div>

              {/* Fotoğraf Yükleme Alanı */}
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center bg-white/60 hover:bg-white transition cursor-pointer">
                <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <Camera size={24} />
                </div>
                <p className="text-xs font-semibold text-stone-800">Fotoğraf Seç veya Buraya Bırak</p>
                <p className="text-[11px] text-stone-400 mt-0.5">JPG, PNG veya HEIC (Maks. 15MB)</p>
              </div>

              {/* Sanat Stili Seçimi */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700">Akrilik Çizim Yoğunluğu</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Hafif Eskiz', 'Zengin Akrilik', 'Vahşi Guaj'].map((style, i) => (
                    <button 
                      key={style}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                        i === 1 ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gezi Notu Girişi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">El Yazısı Gezi Notu</label>
                <textarea 
                  rows={3} 
                  placeholder="Bugün gördüğüm manzara hayatım boyunca unutamayacağım anlardan biriydi..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                ></textarea>
              </div>

              {/* Dışa Aktarma Seçenekleri */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Baskıya Hazır PDF İndir</h4>
                  <p className="text-[10px] text-stone-500">300 DPI fiziksel defter çıktısı</p>
                </div>
                <button 
                  onClick={() => confetti({ particleCount: 40, spread: 45 })}
                  className="p-2 bg-stone-900 text-white rounded-lg text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                >
                  <Download size={14} /> İndir
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-stone-200 px-6 py-2.5 flex justify-around items-center z-30">
          <button 
            onClick={() => setActiveTab('sketchbook')}
            className={`flex flex-col items-center gap-0.5 transition ${activeTab === 'sketchbook' ? 'text-amber-800 font-bold' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <BookOpen size={20} />
            <span className="text-[10px]">Defter</span>
          </button>

          <button 
            onClick={() => setActiveTab('studio')}
            className={`flex flex-col items-center gap-0.5 transition ${activeTab === 'studio' ? 'text-amber-800 font-bold' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Sparkles size={20} />
            <span className="text-[10px]">Stüdyo</span>
          </button>

          <button 
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center gap-0.5 transition ${activeTab === 'store' ? 'text-amber-800 font-bold' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px]">Mağaza</span>
          </button>
        </nav>

        {/* Satın Alma / Checkout Modal */}
        {showCheckoutModal && themeToBuy && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-xs rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Hızlı Satın Alma</span>
                  <h3 className="font-serif-title font-bold text-lg text-stone-900">{themeToBuy.name}</h3>
                </div>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Şablon Lisansı:</span>
                  <span className="font-medium text-stone-800">Sınırsız Kullanım</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-stone-200">
                  <span>Toplam Tutar:</span>
                  <span className="text-amber-800">{themeToBuy.price}</span>
                </div>
              </div>

              <button 
                onClick={completePurchase}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Ödemeyi Tamamla ve Aç
              </button>
              
              <p className="text-[10px] text-center text-stone-400">
                🔒 Apple Pay & Güvenli Ödeme Desteklenir
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
