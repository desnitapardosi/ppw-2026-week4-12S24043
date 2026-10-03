# Personal Portfolio - Week 4

## Identitas

- **Nama:** Desnita Pardosi
- **NIM:** 12S24043
- **Program Studi:** S1 Sistem Informasi
- **Institusi:** Institut Teknologi Del
- **Tahun:** 2026

---

## Deskripsi

Project ini merupakan pengembangan dari Personal Portfolio pada Week 3 yang dilakukan dengan menerapkan refactoring arsitektur web.

Pada Week 4, data yang sebelumnya ditulis langsung pada HTML dipisahkan ke dalam beberapa file JSON. Data tersebut kemudian diambil menggunakan JavaScript melalui Fetch API dan ditampilkan secara dinamis pada halaman web.

Project ini menerapkan konsep **Decoupled Multi-Tier Architecture** dan **Client-Side Rendering (CSR)** dengan memisahkan bagian data, service, dan tampilan.

---

## Tujuan

Tujuan pengembangan project ini adalah:

1. Memisahkan data dari struktur HTML.
2. Menggunakan file JSON sebagai sumber data portfolio.
3. Mengambil data menggunakan Fetch API.
4. Menampilkan data secara dinamis menggunakan JavaScript.
5. Menggunakan satu modal untuk menampilkan detail setiap project.
6. Mengembangkan form contact menggunakan Fetch API.
7. Menyimpan data form menggunakan localStorage.
8. Melakukan pengujian menggunakan browser DevTools, khususnya Network.

---

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3
- Bootstrap Icons
- JSON
- Fetch API
- LocalStorage
- Browser DevTools

---

## Struktur Project

```text
ppw-2026-week4-12S24043/
│
├── index.html
│
├── css/
│   └── custom-style.css
│
├── data/
│   ├── profile.json
│   ├── projects.json
│   └── services.json
│
├── js/
│   ├── api-service.js
│   └── app.js
│
└── README.md