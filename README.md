# 💸 Freelancer Tax Calculator (Serbia)

Kalkulator poreza za frilensere u Srbiji — poređenje modela A i B sa automatski ažuriranim srednjim kursom EUR → RSD.

## ✨ Funkcionalnosti

- Bruto unos u EUR ili RSD
- Automatsko preuzimanje srednjeg kursa sa NBS
- Porez i doprinosi prema Modelu A i Modelu B
- Prikaz neto prihoda u EUR i RSD
- Indikator osiguranja (da li je korisnik već zdravstveno osiguran)
- Vizuelni prikaz opterećenja (progress bar)
- Footer sa kontakt podacima

## 🔧 Tehnologije

- ⚛️ Preact + Vite (JSX)
- ☁️ Serverless funkcija
- 🎨 TailwindCSS
- 🧹 shadcn/ui (Radix UI)
- 📊 Recharts

## 🚀 Pokretanje

```bash
git clone https://github.com/nikolchaa/freelancer-tax-calculator
cd freelancer-tax-calculator
npm install
netlify dev
```

Aplikacija će biti dostupna na `http://localhost:8888`.

## 📬 Kontakt

- 🌐 Web: [nikolchaa.com (WIP)](https://nikolchaa.com)
- 📧 Email: [contact@nikolchaa.com](mailto:contact@nikolchaa.com)
- 🐙 GitHub: [@nikolchaa](https://github.com/nikolchaa)
- 💼 LinkedIn: [Nikola Ranđelović](https://www.linkedin.com/in/nikolchaa)

## 🧪 Licenca

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE) — slobodno koristi, modifikuj i deli ✌️

## ☁️ Serverless Kurs API Proxy

Da bi se izbegli CORS problemi pri direktnom pozivanju [Kurs API](https://kurs.resenje.org/doc/)-ja iz frontend aplikacije, koristi se jednostavna serverless funkcija kao proxy sloj.

Ova funkcija se hostuje putem Netlify Functions i ponaša se kao mini API koji prosleđuje zahteve ka [Kurs API](https://kurs.resenje.org/doc/)-ju i vraća odgovore klijentu bez CORS ograničenja.

Na ovaj način aplikacija uvek ima pristup svežem kursu EUR → RSD sa NBS, bez potrebe za dodatnom konfiguracijom CORS zaglavlja na originalnom API-ju.
