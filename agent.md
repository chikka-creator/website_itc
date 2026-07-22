# AGENT.md — Website Resmi ITClub SMKN 1 Surabaya

## 0. Perintah Eksekusi (Baca Dulu Sebelum Mulai)

Kamu adalah AI coding agent yang bekerja **otonom, satu kali jalan, tanpa interupsi**. Selesaikan seluruh website ini — struktur project, semua halaman, semua komponen, semua animasi, styling, dan konten — sampai bisa dijalankan dengan `npm run dev` tanpa error. Jangan berhenti di tengah untuk menunggu konfirmasi user. Jangan hanya membuat skeleton/placeholder kosong — setiap halaman harus fungsional dan selesai secara visual.

Urutan kerja yang wajib diikuti:
1. Inisialisasi project (§9).
2. Bangun design system & tokens (§7–8) sebelum menyentuh halaman.
3. Bangun komponen shared (dock, window, canvas, cursor, dsb).
4. Bangun tiap halaman sesuai §5.
5. Pasang animasi & interaksi (§6).
6. Isi konten sesuai §10 dan §11 (termasuk kebijakan placeholder).
7. Audit sendiri terhadap checklist (§13) sebelum menyatakan selesai.

Jika ada instruksi yang ambigu, **pilih interpretasi yang paling konsisten dengan semangat "Digital Workspace premium, bukan landing page biasa"**, jalan terus, lalu catat asumsi tersebut di bagian akhir sebagai laporan (lihat §14).

---

## 1. Tujuan

Bangun website resmi ITClub SMKN 1 Surabaya menggunakan **Next.js App Router** dengan pengalaman selayaknya **Digital Workspace / mini Operating System interaktif** — bukan landing page atau homepage konvensional yang hanya scroll-dan-baca.

**Definisi "berbeda dari landing page biasa" (wajib dipenuhi, ini kriteria lolos/tidak lolos):**
- Tidak ada bagian yang hanya statis teks + gambar tanpa interaksi. Setiap section punya minimal satu bentuk keterlibatan user (drag, hover-reveal, scroll-triggered motion, klik-untuk-fokus, dsb).
- Navigasi tidak memakai navbar horizontal klasik di atas — gunakan **dock mengambang** (§4, §5.1).
- Transisi antar "halaman" terasa seperti berpindah window/workspace, bukan reload/redirect biasa (gunakan shared layout transition / view transition).
- Cursor custom di desktop yang bereaksi terhadap elemen interaktif (opsional tapi disarankan untuk memperkuat kesan "OS").
- User harus bisa "mengacak-acak" tampilan sampai batas wajar (drag window, pan canvas) tanpa merusak UX — ini pengalaman workspace, bukan brosur.

---

## 2. Kebijakan Data Belum Jelas (Placeholder Policy)

Karena agent berjalan otonom tanpa jeda tanya-jawab, **agent DILARANG menunggu/bertanya di tengah proses**. Sebagai gantinya:

- Untuk data yang belum tersedia (§11), **agent WAJIB mengisi placeholder yang jelas ditandai**, BUKAN mengarang seolah itu fakta:
  - Di kode: beri komentar `// TODO(DATA): <jelaskan apa yang perlu diisi user>`.
  - Di UI: tampilkan label kecil kontras rendah bertuliskan **"Data Sementara"** atau **"Segera Diperbarui"** di dekat konten placeholder (misal foto kegiatan, nama pembina).
  - Untuk foto kegiatan yang belum ada asetnya: gunakan blok gradient/placeholder abstrak bertema warna project (§8), JANGAN mengambil foto sembarang dari internet dan mengklaimnya sebagai foto ITClub.
  - Untuk link WhatsApp resmi yang belum ada: gunakan `href="#"` dengan komentar TODO, dan tampilkan tombol dalam keadaan visually complete tapi non-aktif atau menuju placeholder.
- Setelah selesai membangun seluruh website, agent WAJIB membuat file `DATA_TODO.md` di root project yang merangkum semua placeholder yang perlu diisi user (lihat §14).
- Larangan mutlak: **jangan pernah mengarang nama pembina, prestasi, struktur pengurus, atau statistik** (jumlah anggota, tahun berdiri jika tidak eksplisit disebut, dsb).

---

## 3. Prinsip Utama

- Next.js App Router + TypeScript, wajib.
- UI/UX unik, premium, tidak boleh terasa seperti template UI kit yang bisa dikenali (misal: jangan meniru layout landing page SaaS generik).
- Seluruh konten (teks) menggunakan Bahasa Indonesia baku namun tetap hangat, sesuai suara organisasi pelajar/ekstrakurikuler — bukan korporat kaku.
- Ikuti Kebijakan Placeholder di §2 untuk data yang belum jelas — jangan berhenti bertanya, jangan mengarang.
- Hanya 2 divisi yang boleh muncul di kode maupun konten: **Programming** dan **Desain Grafis**. Dilarang menambahkan divisi lain apa pun selain kedua nama ini (termasuk namun tidak terbatas pada: Networking, Multimedia, Animasi, Videografi) di mana pun — baik di array data, komentar contoh, maupun dummy data.

---

## 4. Konsep Global

Website terasa seperti sistem operasi modern versi ringan:
- **Floating windows** — setiap "kartu" konten bisa berupa window yang bisa difokuskan, dengan shadow/depth berbeda saat aktif vs tidak.
- **Dock navigation** ala macOS, tapi diadaptasi (bentuk, ikon, dan micro-interaction harus terasa custom, bukan copy 1:1 dari macOS dock) — magnify-on-hover ringan, indikator halaman aktif, posisi fixed bottom-center.
- **Smooth spring animation** di semua transisi (bukan easing linear/ease-in-out generik).
- **Glass panels** — backdrop-blur + border tipis translucent + noise texture halus di atasnya supaya tidak terasa flat/plastic.
- **Infinite canvas** khusus di halaman `/project`.
- **Motion premium** — setiap interaksi (hover, klik, scroll) punya feedback gerak, tapi tetap within performance budget (§12).

---

## 5. Halaman & Spesifikasi Detail

### 5.1 `/` — Beranda
- Full-viewport "workspace" saat load: dock mengambang muncul dengan staggered entrance animation.
- Background hidup: gradient mesh animasi lambat (bukan gambar statis) menggunakan Canvas/WebGL ringan atau CSS animated gradient — hindari GIF/video berat demi performance budget.
- 2–4 floating object (kartu kecil: "Divisi Programming", "Divisi Desain Grafis", "Project Terbaru", "Gabung ITClub") yang bisa di-drag ringan dengan inertia, kembali ke posisi semula (snap-back) setelah beberapa detik idle atau tetap di posisi baru — pilih salah satu, konsisten.
- CTA "Gabung ITClub" harus jadi elemen paling menonjol secara visual (bukan hanya tombol biasa — beri micro-interaction unik, misal magnetic button effect mengikuti cursor).
- Hero copy singkat, storytelling, bukan paragraf panjang.

### 5.2 `/tentang`
- Storytelling linear tentang ITClub sebagai ekstrakurikuler SMKN 1 Surabaya (isi sesuai §10).
- Timeline interaktif: scroll-triggered reveal, garis timeline yang "tumbuh" mengikuti scroll progress.
- Motion saat scroll: parallax ringan, fade/slide-in per section, gunakan Intersection Observer / Framer Motion `whileInView`.

### 5.3 `/divisi`
- Hanya 2 window: Programming dan Desain Grafis.
- Floating draggable windows dengan momentum & spring physics saat dilepas.
- Window yang difokuskan (klik) naik z-index, scale sedikit lebih besar; window lain blur + dim (backdrop-filter blur + opacity turun).
- Tiap window berisi: deskripsi singkat divisi, contoh kegiatan/skill yang dipelajari (boleh generik berdasar nama divisi selama tidak mengarang klaim spesifik seperti prestasi), placeholder foto kegiatan (§2).

### 5.4 `/project`
- Infinite canvas: zoom (scroll/pinch), pan (drag kosong di background), drag per-item project card.
- Tampilkan project sebagai kartu mengambang di atas canvas; klik untuk detail modal/expand.
- Karena "Data yang belum tersedia" mencakup foto kegiatan, project juga kemungkinan besar dummy — tandai jelas sebagai contoh/placeholder sesuai §2 kecuali user sudah memberi data project riil di percakapan.

### 5.5 `/kontak`
- Pilih salah satu gaya kreatif: **terminal interaktif** (user "mengetik" perintah seperti `whoami`, `contact`, `join` dan mendapat respons bergaya CLI) ATAU **floating panel** kontak dengan form. Terminal lebih memperkuat tema "OS" — disarankan sebagai default jika tidak ada preferensi lain.
- Link WhatsApp resmi: ikuti §2 (placeholder jika belum ada).

---

## 6. Animasi & Interaksi

Stack wajib:
- **Framer Motion** — transisi komponen, shared layout transitions antar "window"/halaman, gesture (drag, whileHover, whileTap).
- **GSAP** (+ ScrollTrigger) — animasi scroll kompleks di `/tentang` dan efek reveal yang butuh timeline presisi.
- **Lenis** — smooth scroll di seluruh situs.
- Spring physics & inertia dipakai konsisten untuk semua drag interaction (window, floating object, canvas project) — jangan campur dengan easing linear di tempat lain, supaya "rasa gerak" situs konsisten.
- Shared layout transition wajib dipakai saat berpindah antar halaman dock agar terasa seperti berpindah workspace, bukan reload.

---

## 7. Visual & Palet Warna

- Tanpa warna neon, tanpa warna saturasi tinggi yang mencolok.
- Palet dasar: off-white (`#F5F4F1` area), navy (`#0B1220`–`#14213D` range), charcoal (`#1C1C1E`), slate (`#475569`–`#64748B` range).
- Aksen (gunakan sangat terbatas, <10% area): boleh satu warna hangat muted (misal amber pudar) untuk CTA supaya tidak monoton.
- Glassmorphism premium: blur cukup tinggi (16–24px), border 1px rgba putih rendah opacity, shadow lembut multi-layer (bukan shadow default Tailwind polos).
- Noise texture: overlay SVG/PNG noise tipis (opacity ~3–5%) di atas background gelap untuk hilangkan kesan flat.
- Depth: gunakan layering z-index + perbedaan blur/shadow untuk membangun hierarki, bukan sekadar warna lebih gelap.

---

## 8. Typography

- Font utama: **Geist** (prioritas pertama, karena native support di Next.js via `next/font`). Alternatif jika ingin variasi: Satoshi, General Sans, atau IBM Plex Sans.
- Gunakan `next/font` untuk load font (local atau Google Fonts jika tersedia), bukan `<link>` manual, demi performance score.
- Skala tipografi jelas: minimal 5 tingkat (display, h1, h2, body, caption) dengan tracking/leading yang disesuaikan tiap tingkat, bukan hanya beda ukuran.

---

## 8.1 Disiplin Spacing, Padding & Margin (Wajib — Kriteria Lolos/Tidak Lolos)

Konsep boleh eksperimental (floating window, infinite canvas, dsb), tapi **rapi bukan opsional**. "Unik" tidak boleh jadi alasan konten terasa sesak, mepet, atau berantakan. Aturan berikut wajib diikuti di seluruh halaman:

- **Buat spacing scale konsisten** di Tailwind config (misal berbasis 4px: 4, 8, 12, 16, 24, 32, 48, 64, 96px) dan pakai HANYA nilai dari scale ini — jangan pakai angka spacing acak/manual di luar scale supaya rapi secara sistematis, bukan kebetulan.
- **Padding internal minimum untuk setiap card/window/panel**: minimal `24px` (mobile) / `32–40px` (desktop) dari tepi container ke konten teks/elemen di dalamnya. Dilarang teks menempel langsung ke border/edge card.
- **Jarak antar card/window yang berdekatan**: minimal `24px` (mobile) / `32px` (desktop) gap antar elemen sejenis yang bersebelahan — baik dalam grid statis maupun floating layout. Untuk floating/draggable window, beri "personal space" minimum saat auto-layout awal supaya window tidak saling tumpang tindih secara tidak sengaja saat pertama kali render.
- **Line-height & jarak antar baris teks**: body text minimal `1.5–1.6` line-height; jangan biarkan teks bertumpuk rapat.
- **Jarak antara heading dan body text di bawahnya**: minimal `12–16px`, jangan menempel.
- **Jarak antar section vertikal** (terutama di `/tentang` yang scroll panjang): minimal `80–120px` di desktop, `48–64px` di mobile — supaya tiap section terasa "bernapas", bukan terpotong berdempetan.
- **Touch target & clickable area**: tombol/CTA minimal `44x44px` area klik dengan padding internal cukup, jangan tombol kecil dengan teks mepet ke tepi.
- **Hindari elemen dekoratif (noise texture, glass panel, floating object) menabrak/menutupi teks penting** — pastikan ada z-index dan area aman (safe area) di sekitar teks utama yang bebas dari overlay dekoratif.
- **Uji dari sudut pandang "apakah ini terlihat sesak?"** di setiap breakpoint (mobile, tablet, desktop) sebelum lanjut ke halaman berikutnya — bukan hanya di satu ukuran layar saja.
- Intinya: **konsep boleh berani dan tidak biasa, tapi eksekusi visualnya tetap harus terasa tenang, ter-organisir, dan premium** — bukan ramai/berantakan/norak. Kerapian adalah bagian dari kesan "premium", bukan bertentangan dengannya.

---

## 9. Tech Stack & Setup

- Next.js (App Router) — versi stabil terbaru saat build.
- TypeScript, strict mode aktif.
- Tailwind CSS dengan konfigurasi custom (extend palette §7, custom spacing/blur jika perlu) — jangan pakai warna default Tailwind mentah untuk elemen brand.
- Framer Motion, GSAP (+`@gsap/react` jika dipakai), Lenis.
- React Three Fiber + Three.js: **opsional** — pakai hanya jika menambah nilai signifikan (misal background 3D halus di Beranda) dan tidak mengorbankan performance budget (§12). Jika ragu, prioritaskan CSS/Canvas 2D yang lebih ringan.
- Struktur folder yang disarankan:
  ```
  app/
    layout.tsx
    page.tsx                 // Beranda
    tentang/page.tsx
    divisi/page.tsx
    project/page.tsx
    kontak/page.tsx
  components/
    dock/
    windows/
    canvas/
    cursor/
    shared/
  lib/
  styles/
  public/
  DATA_TODO.md               // wajib dibuat di akhir, lihat §14
  ```

---

## 10. Konten yang Sudah Pasti (Boleh Langsung Dipakai)

ITClub adalah ekstrakurikuler SMKN 1 Surabaya untuk pembelajaran teknologi dengan pendampingan guru, alumni, kakak kelas, dan DU/DI (Dunia Usaha/Dunia Industri). Hanya ada 2 divisi: Programming dan Desain Grafis.

Gunakan fakta ini sebagai dasar copywriting di semua halaman. Jangan menambah klaim di luar ini (misal jumlah anggota, tahun berdiri, prestasi spesifik) kecuali user memberi info tambahan.

---

## 11. Data yang Belum Tersedia (Wajib Placeholder, Ikuti §2)

- Nama pembina terbaru
- Struktur pengurus
- Prestasi terbaru
- Foto kegiatan terbaru
- Link WhatsApp resmi

---

## 12. Target Performa

- Lighthouse Performance > 95
- Accessibility > 95
- SEO > 95
- Perhatian khusus: animasi berat (GSAP/Three.js/WebGL) tidak boleh menurunkan skor di bawah target ini — gunakan lazy load, `will-change` secukupnya, dan reduce-motion fallback untuk `prefers-reduced-motion`.
- Semua interaksi drag/canvas harus tetap terasa 60fps di perangkat menengah — hindari re-render berlebihan (gunakan `useRef`/CSS transform, bukan re-render state per frame jika memungkinkan).

---

## 13. Checklist Audit Mandiri (Sebelum Menyatakan Selesai)

Agent wajib mengecek satu per satu sebelum melaporkan build selesai:

- [ ] `npm run dev` berjalan tanpa error/warning kritis.
- [ ] Semua 5 halaman (`/`, `/tentang`, `/divisi`, `/project`, `/kontak`) ada dan fungsional.
- [ ] Hanya 2 divisi (Programming, Desain Grafis) muncul di seluruh kode dan UI.
- [ ] Tidak ada warna neon di palet final.
- [ ] Dock navigation berfungsi di semua halaman dengan transisi antar halaman yang smooth (bukan reload polos).
- [ ] Draggable window di `/divisi` punya spring/momentum dan blur-focus behavior.
- [ ] Infinite canvas di `/project` bisa zoom + pan + drag.
- [ ] Setiap data belum tersedia (§11) ditandai jelas sebagai placeholder, tidak dikarang sebagai fakta.
- [ ] File `DATA_TODO.md` dibuat dan berisi daftar lengkap yang perlu user isi.
- [ ] `prefers-reduced-motion` dihormati minimal untuk animasi besar.
- [ ] Tidak ada teks yang menempel ke border/edge card — semua card/window pakai padding internal sesuai §8.1.
- [ ] Jarak antar card/window/section sudah sesuai minimum di §8.1, dicek di mobile, tablet, dan desktop.
- [ ] Tidak ada elemen dekoratif (noise, glass, floating object) yang menutupi/menabrak teks penting.

---

## 14. Laporan Akhir yang Wajib Dibuat Agent

Setelah build selesai, agent wajib menghasilkan:
1. **`DATA_TODO.md`** — daftar semua placeholder/data yang perlu diisi user, dengan lokasi file:baris untuk tiap item.
2. **Ringkasan asumsi** — daftar singkat keputusan desain/konten yang diambil sendiri saat instruksi ambigu (lihat §0), supaya user bisa cepat review dan koreksi jika perlu.

---

## 15. Larangan (Tegas)

- Jangan menggunakan template/starter kit UI yang bisa dikenali publik.
- Jangan copy-paste UI dari situs lain.
- Jangan mengarang data organisasi (pembina, prestasi, struktur, foto, kontak).
- Jangan menambah divisi apa pun selain Programming dan Desain Grafis (termasuk namun tidak terbatas pada: Networking, Multimedia, Animasi, Videografi).
- Jangan memakai warna neon.
- Jangan berhenti di tengah proses untuk bertanya — ikuti Kebijakan Placeholder (§2) dan lapor di akhir (§14).
- Jangan membuat halaman/section yang murni statis tanpa interaksi apa pun (lihat kriteria §1).

---

## 16. Visi

Website harus terasa seperti produk digital premium: memorable, sangat interaktif (bukan sekadar informatif), cepat, dan elegan — pengunjung merasa sedang membuka sebuah workspace digital milik ITClub, bukan membaca company profile.