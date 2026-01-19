# İTÜ Matematik Bölümü Ders Yönetim Sistemi

> İstanbul Teknik Üniversitesi Matematik Bölümü'nün ders yönetim sisteminin modern web teknolojileri ile yeniden tasarımı.

## 🔗 Demo

| Ortam | URL |
|-------|-----|
| **Yeni Sistem** | [web.itu.edu.tr/ilcan21](https://web.itu.edu.tr/ilcan21/) |
| **Eski Sistem** | [mathavuz.itu.edu.tr](https://mathavuz.itu.edu.tr/) |

## ✨ Özellikler

- 🎯 **Birleşik Hedef Kitle** - Havuz ve bölüm dersleri tek platformda
- 🌐 **Çoklu Dil Desteği** - Türkçe ve İngilizce
- 🌙 **Karanlık Mod** - Sistem temasına uyumlu
- 📱 **Responsive Tasarım** - Mobil uyumlu arayüz
- ⚡ **SPA Mimarisi** - Hızlı sayfa geçişleri
- ♿ **Erişilebilirlik** - WCAG uyumlu componentler

## 🛠️ Teknoloji Yığını

| Kategori | Teknoloji |
|----------|-----------|
| Framework | React 19 |
| Dil | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS v4 |
| UI | shadcn/ui + Radix UI |
| Routing | React Router 7 |
| State | TanStack Query |
| i18n | i18next |
| Animasyon | Framer Motion |

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## 📁 Proje Yapısı

```
src/
├── components/     # UI componentleri
│   ├── common/     # Ortak componentler
│   └── ui/         # shadcn/ui componentleri
├── config/         # Uygulama konfigürasyonu
├── hooks/          # Custom React hooks
├── lib/            # Yardımcı fonksiyonlar
├── locale/         # Çeviri dosyaları (TR/EN)
├── pages/          # Sayfa componentleri
├── providers/      # Context providers
├── routes/         # Routing yapılandırması
├── services/       # API servisleri
└── types/          # TypeScript tipleri
```

## 📝 Lisans

Bu proje İTÜ Matematik Mühendisliği Bölümü bitirme projesi kapsamında geliştirilmiştir.

---

**MAT 4901** - Matematik Müh. Tasarımı I | 2025-2026 Güz Dönemi
