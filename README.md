# İTÜ Matematik Bölümü Ders Yönetim Sistemi

İstanbul Teknik Üniversitesi Matematik Bölümü için geliştirilen ders yönetim sisteminin modern web teknolojileri ile yeniden tasarlanmış sürümü.

## Demo Bağlantıları

| Ortam | URL |
|-------|-----|
| Yeni Sistem | [web.itu.edu.tr/ilcan21](https://web.itu.edu.tr/ilcan21/) |
| Eski Sistem | [mathavuz.itu.edu.tr](https://mathavuz.itu.edu.tr/) |
| GitHub | [ilcann/bitirme](https://github.com/ilcann/bitirme) |

## Proje Özeti

Bu proje; ders duyuruları, ders materyalleri, öğrenci listeleri, notlar ve devamsızlık yönetimini tek bir uygulamada birleştirir. Uygulama, rol bazlı erişim mantığı ile çalışır ve `ADMIN`, `INSTRUCTOR`, `STUDENT` kullanıcı tiplerine göre farklı ekranlar ve yetkiler sunar.

Öne çıkan başlıklar:

- Tek arayüzden ders, duyuru, materyal, not ve devamsızlık yönetimi
- Türkçe ve İngilizce dil desteği
- Mobil uyumlu, SPA tabanlı kullanıcı deneyimi
- Rol bazlı yetkilendirme
- Not ve devamsızlık tabloları için PDF dışa aktarma
- Gerçek backend ve MySQL veritabanı entegrasyonu

## Gereksinimler

### Zorunlu

- Node.js 20 veya üzeri
- npm
- Docker Desktop veya Docker Engine
- Docker Compose
- Git

### Önerilen

- Visual Studio Code
- MySQL istemcisi veya bir SQL yönetim aracı
- Modern bir tarayıcı: Chrome, Edge veya Firefox

## Teknoloji Yığını

| Katman | Teknolojiler |
|--------|--------------|
| Frontend | React 19, TypeScript, Vite |
| Stil | TailwindCSS v4, shadcn/ui, Radix UI |
| Routing | React Router 7 |
| State | TanStack Query |
| i18n | i18next |
| Animasyon | Framer Motion |
| PDF | jsPDF, jspdf-autotable |
| Backend | PHP 5.4, Apache |
| Veritabanı | MySQL 5.6 |

## Klasör Yapısı

```text
backend/
├── config/        # Ortam ve veritabanı yardımcıları
├── database/      # SQL şemaları ve seed dosyaları
├── public/        # HTTP giriş noktaları
├── src/           # Backend iş mantığı
└── index.php      # Geriye dönük uyumluluk için wrapper

frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── locale/
│   ├── pages/
│   ├── providers/
│   ├── routes/
│   └── services/
└── package.json

docker/
├── docker-compose.yml
└── php54.Dockerfile
```

## Kurulum

### 1. Depoyu klonlayın

```bash
git clone https://github.com/ilcann/bitirme.git
cd bitirme
```

### 2. Backend servislerini başlatın

Docker tabanlı geliştirme ortamı backend ve veritabanını birlikte çalıştırır.

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Bu komut şu servisleri ayağa kaldırır:

- `web` → PHP/Apache API servisi
- `db` → MySQL veritabanı servisi

Backend API yerel ortamda şu adresten erişilebilir:

```text
http://localhost:8080/ilcan21/api/index.php
```

### 3. Veritabanını içe aktarın

İlk kurulumda SQL dosyalarını veritabanına sırasıyla içe aktarın. Genel sıra aşağıdaki gibidir:

1. `backend/database/users.sql`
2. `backend/database/courses.sql`
3. `backend/database/announcements.sql`
4. `backend/database/course_materials.sql`

Örnek komutlar:

```bash
docker exec -i mysql_db mysql -uroot -proot_password bitirme_db < backend/database/users.sql
docker exec -i mysql_db mysql -uroot -proot_password bitirme_db < backend/database/courses.sql
docker exec -i mysql_db mysql -uroot -proot_password bitirme_db < backend/database/announcements.sql
docker exec -i mysql_db mysql -uroot -proot_password bitirme_db < backend/database/course_materials.sql
```

Örnek kullanıcıları hızlı kurulum için yüklemek isterseniz seed dosyasını da çalıştırabilirsiniz:

```bash
docker exec -i mysql_db mysql -uroot -proot_password bitirme_db < backend/database/seeds/users.example.sql
```

### 4. Frontend bağımlılıklarını yükleyin

```bash
cd frontend
npm install
```

### 5. Frontend geliştirme sunucusunu başlatın

```bash
npm run dev
```

Uygulama geliştirme modunda genellikle şu adresten açılır:

```text
http://localhost:5173
```

## Kullanılabilir Komutlar

Frontend klasöründe aşağıdaki komutlar kullanılabilir:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Örnek Giriş Bilgileri

Seed klasöründe yer alan örnek kullanıcılar:

| Rol | E-posta | Parola |
|-----|---------|--------|
| ADMIN | admin@bitirme.local | Bitirme123! |
| INSTRUCTOR | instructor@bitirme.local | Bitirme123! |
| STUDENT | student@bitirme.local | Bitirme123! |

## Notlar

- Backend, `backend/database/seeds/` klasöründeki örnek SQL dosyaları ile hızlı başlangıç için desteklenir. Bu klasörde kullanıcı, ders, duyuru ve materyal seed dosyaları ayrı ayrı tutulur.
- Not ve devamsızlık dışa aktarımları Türkçe karakter desteği için gömülü Unicode font kullanır.
- API istekleri geliştirme ortamında `/ilcan21/api` yoluna yönlendirilir.

## Lisans

Bu proje İTÜ Matematik Mühendisliği Bölümü bitirme projesi kapsamında geliştirilmiştir.

---

**MAT 4902** - Matematik Müh. Tasarımı II | 2025-2026 Bahar Dönemi
