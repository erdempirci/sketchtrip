import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Camera, 
  Volume2, 
  VolumeX,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Başlangıç için tek bir gerçek örnek (Aynı fotoğrafın orijinali ve çizim efekti)
const initialPages = [
  {
    id: 1,
    title: "Kyoto Tapınak Yolu",
    country: "Japonya",
    date: "14 Ekim",
    photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    note: "Sabahın erken saatlerinde sessiz bir yürüyüş. Renkler bir tuval gibi parlıyordu.",
    stamp: "⛩️ KYOTO",
    likes: 124
  }
];

export default function App() {
  const [pages, setPages] = useState(initialPages);
  const [activeTab, setActiveTab] = useState('sketchbook');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const fileInputRef = useRef(null);

  // Toplu Fotoğraf Yükleme Fonksiyonu
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPagesList = [];
    let processedCount = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPagesList.push({
          id: Date.now() + index,
          title: file.name.replace(/\.[^/.]+$/, "").substring(0, 18) || `Anı #${pages.length + index + 1}`,
          country: "Tatil Günlüğü",
          date: "Yeni Sayfa",
          photoUrl: reader.result,
          note: "Bu anın hatırası defterimize eklendi.",
          stamp: "✨ MEMORY",
          likes: 0
        });

        processedCount++;
        // Tüm seçilen fotoğraflar okunduğunda deftere ekle
        if (processedCount === files.length) {
          setPages(prev => [...prev, ...newPagesList]);
          setCurrentPageIndex(pages.length); // Yeni eklenen ilk sayfaya git
          setActiveTab('sketchbook');
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
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

  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-800 flex justify-center items-center p-0 sm:p-4 font-sans select-none">
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[860px] bg-stone-100 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-stone-700/30">
        
        {/* Üst Bar */}
        <header className="px-5 pt-4 pb-3 bg-stone-100/90 backdrop-blur border-b border-stone-200 flex items-center justify-between z-20">
          <div>
            <h1 className="text-base font-bold text-stone-900 leading-tight">SketchTrip</h1>
            <p className="text-[10px] text-stone-500 font-medium">Dijital Gezi Eskiz Defteri</p>
          </div>

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
          
          {/* TAB 1: DEFTER GÖRÜNTÜLEYİCİ */}
          {activeTab === 'sketchbook' && currentPage && (
            <div className="h-full flex flex-col justify-between p-4 pb-20">
              <div className="relative flex-1 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-md flex flex-col justify-between overflow-hidden">
                
                {/* Washi Bant Süsü */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-amber-200/80 backdrop-blur-sm -rotate-1 shadow-sm border border-amber-300/40 z-10 rounded-sm"></div>

                {/* Üst Başlık & Damga */}
                <div className="pt-2 flex justify-between items-start border-b border-stone-200/70 pb-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold block">
                      {currentPage.country} · {currentPage.date}
                    </span>
                    <h2 className="text-xl font-bold text-stone-900">
                      {currentPage.title}
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200/60 text-amber-900 text-xs font-bold rounded border border-amber-300/50">
                    {currentPage.stamp}
                  </span>
                </div>

                {/* BİREBİR AYNI FOTOĞRAFIN KARŞILAŞTIRMASI (SLIDER) */}
                <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] shadow-inner border border-stone-300">
                  
                  {/* ALT KATMAN: Akrilik Fırça Darbeli Çizim Efekti (Birebir Aynı Fotoğraf) */}
                  <img 
                    src={currentPage.photoUrl} 
                    alt="Akrilik Çizim" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none filter contrast-125 saturate-150 sepia-[0.2] hue-rotate-[-10deg]"
                    style={{
                      // Yağlı boya / akrilik fırça ve tuval dokusu hissi veren filtre
                      filter: "contrast(140%) saturate(160%) brightness(105%) drop-shadow(0px 0px 2px rgba(0,0,0,0.3))"
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium z-10">
                    🎨 Akrilik Sanat
                  </div>

                  {/* ÜST KATMAN: Orijinal Ham Fotoğraf (Kaydırıcı ile Kesilen Kısım) */}
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

                  {/* Ortadaki Kaydırıcı Çizgi */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none z-10 flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-7 h-7 -ml-3.5 bg-white text-stone-800 rounded-full shadow-lg border border-stone-300 flex items-center justify-center text-[10px] font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Parmağın Kaydırdığı Giriş */}
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
                  <p className="text-stone-700 italic text-sm leading-relaxed">
                    "{currentPage.note}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs text-stone-500">
                    <span className="text-[11px] text-stone-400">
                      Sayfa {currentPageIndex + 1} / {pages.length}
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

                {/* Sayfa Geçiş Butonları */}
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

          {/* TAB 2: TOPLU YÜKLEME STÜDYOSU */}
          {activeTab === 'studio' && (
            <div className="p-4 pb-24 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Toplu Yükleme</span>
                <h2 className="text-2xl font-bold text-stone-900 mt-0.5">Seyahat Albümü Oluştur</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Galerinden dilediğin kadar fotoğraf seç; her biri defterine sanatsal bir sayfa olarak eklensin.
                </p>
              </div>

              {/* Çoklu Fotoğraf Seçici (multiple) */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleMultipleImages} 
                accept="image/*" 
                multiple
                className="hidden" 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-800/40 rounded-2xl p-8 text-center bg-white hover:bg-amber-50/50 transition cursor-pointer shadow-sm"
              >
                <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Upload size={26} />
                </div>
                <p className="text-sm font-bold text-stone-800">Fotoğrafları Seç (Çoklu Seçim)</p>
                <p className="text-xs text-stone-400 mt-1">
                  Aynı anda 5, 10 veya 20 fotoğraf seçebilirsiniz
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm">
                  Galeriyi Aç
                </span>
              </div>

              {/* Defterdeki Mevcut Sayfalar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Defterdeki Sayfalar ({pages.length})
                  </h3>
                  {pages.length > 1 && (
                    <button 
                      onClick={() => {
                        if (confirm("İlk sayfa hariç tüm sayfalar silinsin mi?")) {
                          setPages([initialPages[0]]);
                          setCurrentPageIndex(0);
                        }
                      }}
                      className="text-[11px] text-rose-600 font-semibold flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Temizle
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {pages.map((p, idx) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setCurrentPageIndex(idx);
                        setActiveTab('sketchbook');
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer shadow-sm ${
                        currentPageIndex === idx ? 'border-amber-800 scale-95' : 'border-white'
                      }`}
                    >
                      <img src={p.photoUrl} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                        <span className="text-[10px] text-white font-bold truncate">#{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ŞABLON MAĞAZASI */}
          {activeTab === 'store' && (
            <div className="p-4 pb-24 space-y-4 text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Tasarım Mağazası</span>
              <h2 className="text-2xl font-bold text-stone-900">Defter Temaları</h2>
              <p className="text-xs text-stone-500">Hazır suluboya ve akrilik defter temalarını burada satabilirsiniz.</p>
              
              <div className="bg-white p-5 rounded-2xl border border-stone-200 text-left space-y-2">
                <h3 className="font-bold text-stone-800">Kyoto Pastel Akrilik Paketi</h3>
                <p className="text-xs text-stone-500">Özel pirinç kağıdı dokusu, Japon tapınak damgaları ve fırça seti.</p>
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
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-2.5 flex justify-around items-center z-30">
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
            <span className="text-[10px]">Toplu Ekle</span>
          </button>

          <button 
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'store' ? 'text-amber-800 font-bold' : 'text-stone-400'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px]">Mağaza</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
