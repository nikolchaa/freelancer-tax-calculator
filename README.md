# 💸 Freelancer Tax Calculator (Serbia)

Kalkulator poreza za frilensere u Srbiji — poređenje modela A i B sa automatski ažuriranim srednjim kursom EUR → RSD.

## 📦 Build Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/2c7685f4-0805-4874-8dd1-77de463b27af/deploy-status)](https://kalkulator-poreza.netlify.app)

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
- ☁️ Serverless funkcija (Mini API koji preuzima srednji kurs sa NBS putem [Kurs API](https://kurs.resenje.org/doc/)-ja)
- 🎨 TailwindCSS
- 🧩 shadcn/ui (Radix UI)
- 📈 Recharts

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
- 📧 Email: [nikolchaa@netrunners.work](mailto:nikolchaa@netrunners.work)
- 🐙 GitHub: [@nikolchaa](https://github.com/nikolchaa)
- 💼 LinkedIn: [Nikola Ranđelović](https://www.linkedin.com/in/nikolchaa)

## 🪪 Licenca

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE) — slobodno koristi, modifikuj i deli ✌️

## 🔨 Eksterni Alat

[Kurs API](https://kurs.resenje.org/doc/) by [Janoš Guljaš](https://resenje.org/)
