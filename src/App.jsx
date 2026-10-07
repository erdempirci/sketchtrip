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
  Palette,
  Download,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    stamp
