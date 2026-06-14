# Backend API (PHP)

Bu proje, React frontend uygulaması için geliştirilmiş basit bir PHP tabanlı backend API sistemidir.

Amaç, minimal bir custom backend architecture ile kullanıcı yönetimi ve veri işlemlerini gerçekleştirmektir.

---

# 📁 Proje Yapısı

backend/
│
├── api/              # HTTP endpoint'leri
│   ├── auth.php
│   ├── users.php
│   └── test.php
│
├── config/           # Veritabanı ve genel ayarlar
│   └── db.php
│
├── core/             # Core yardımcı fonksiyonlar
│   └── response.php
│
├── services/         # Business logic (iş mantığı)
│
├── models/           # Veri modelleri
│
├── database/         # SQL schema ve seed dosyaları
│
├── utils/            # Helper fonksiyonlar
│
├── middlewares/      # Auth ve validation katmanı
│
└── README.md

---

# 🚀 Amaç

Bu backend sistemi şu amaçlarla oluşturulmuştur:

- React frontend için API sağlamak
- Basit kullanıcı işlemleri (login/register)
- Veritabanı işlemlerini yönetmek
- Minimal ve anlaşılır PHP mimarisi kurmak

---

# ⚙️ Teknolojiler

- PHP 7.4+
- MySQL
- Apache (veya Docker Apache container)
- JSON REST API

---

# 📡 API Mantığı

Tüm endpoint'ler JSON formatında veri döner.

## Response formatı:

```json
{
  "status": "ok | error",
  "data": {},
  "message": ""
}