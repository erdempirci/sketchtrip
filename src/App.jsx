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
    } catch (
