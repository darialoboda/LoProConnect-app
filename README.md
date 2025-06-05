# 📡 LoProConnect – Webová e-learningová aplikácia o LPWAN (LTE-M & Wi-Fi HaLow)

**LoProConnect** je interaktívna vzdelávacia platforma zameraná na technológie LPWAN, konkrétne **LTE-M** a **Wi-Fi HaLow**.  
Projekt vznikol ako bakalárska práca na **Fakulte elektrotechniky a informatiky STU v Bratislave** v roku 2025.

Cieľom aplikácie je sprístupniť technické poznatky o moderných nízkoenergetických sieťových technológiách zrozumiteľnou, vizuálne atraktívnou a používateľsky prívetivou formou.

---

## ✨ Funkcionalita

- 👨‍🎓 Tri úrovne prístupu: **študent**, **učiteľ**, **administrátor**
- 📚 Kurzový systém s témami, teóriou a súbormi na stiahnutie
- 🧪 Kvízy a testovanie vedomostí
- 📈 Admin rozhranie na správu používateľov, kurzov a obsahu
- ☁️ Ukladanie súborov a obrázkov cez Cloudinary

---

## 🔧 Použité technológie

- **Frontend**: React
- **Backend**: Node.js, Express
- **Databáza**: MongoDB
- **Autentifikácia**: JSON Web Tokens (JWT)
- **Testovanie**: Jest + Supertest
- **Hostovanie**: Vercel (frontend), Render/Heroku (backend)

---

## 🚀 Inštalácia

### 1. Klonovanie repozitára
```
git clone https://github.com/tvoje-username/nazov-repozitara.git
cd nazov-repozitara
```
 ### 2. Lokálne spustenie
### 🔧 Backend
Otvor terminál a prejdi do priečinka backend:

```
cd backend
npm install
```
Nastav Cloudinary prihlasovacie údaje v súbore utils/cloudinaryConfig.js:
```
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});
```
Nastav MongoDB pripojenie v súbore api/start.js:
```
mongoose.connect('your_mongodb_connection_string')

```
Spusti backend server:
```
npm start
```
Backend bude dostupný na http://localhost:5000.

### 💻 Frontend
V novom termináli prejdi do priečinka frontend:
```
cd frontend
npm install
```
Nastav URL backendu v súbore src/utils/utils.js:
```
export const API_BASE_URL = 'http://localhost:5000';
```
Spusti frontend aplikáciu:
```
npm start
```
Frontend bude dostupný na http://localhost:3000.

### 🔒 Bezpečnostná poznámka
Prihlasovacie údaje a API kľúče nie sú súčasťou repozitára.

Pre MongoDB použite vlastný Atlas URI.

Pre Cloudinary údaje (cloud_name, api_key, api_secret) sa zaregistrujte na cloudinary.com.

### ✅ Overenie funkčnosti
http://localhost:3000 – React frontend

http://localhost:5000 – backendové API

### 🎓 Autor
### Daria Loboda

