# FUTURE_FS_03 — Kokouvi Wash · Premium Laundry & Pressing Platform 🧼

> **Future Interns** · Full Stack Web Development Track · Task 3 of 3

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)

## 🔗 Live Demo

**[kokouvi-wash.onrender.com](https://kokouvi-wash.onrender.com/)**


---

## Overview

**Kokouvi Wash** is a full-stack professional website built for a real local business — a pressing and laundry service located at 63 rue Madjatom, Tokoin Gbadago, Lomé, Togo.

This project fulfills **Task 3** of the Future Interns Full Stack Web Development internship, which requires building a professional website for a real local business and pitching it to the owner as a live project.

The platform provides a complete digital presence — from an interactive price estimator and WhatsApp quote sender to a live pickup scheduler with real-time order tracking.

---

## 🏗️ Architecture

### Unified Full-Stack Design

The application runs on a **single unified server** (port 3000) combining frontend and backend:

```
┌─────────────────────────────────────┐
│   React SPA (Vite + HMR)            │ ← Frontend
├─────────────────────────────────────┤
│   Express Middleware Layer          │
│   • REST API  • Zod Validation      │ ← Middle Tier
│   • CORS  • Error Handling          │
├─────────────────────────────────────┤
│   Prisma ORM                        │
│   • Type-Safe Queries               │ ← Data Layer
│   • Schema Validation               │
├─────────────────────────────────────┤
│   SQLite (local dev.db)             │ ← Persistence
└─────────────────────────────────────┘
```

All `/api/*` requests are handled by Express. All other requests serve the React SPA. This unified architecture means **zero CORS issues** in both development and production.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI Framework |
| React Router DOM | v7 | Client-side routing |
| Vite | 6 | Build Tool & Dev Server |
| Framer Motion (`motion/react`) | 12 | Animations & transitions |
| Lucide React | Latest | Icon system |

### Backend & Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.x | Web Framework |
| Prisma ORM | 5 | Database access layer |
| SQLite | Latest | Local persistent database |
| Zod | Latest | Request schema validation |
| TSX | Latest | TypeScript execution |

---

## 📂 Project Structure

```text
FUTURE_FS_03/
├── prisma/
│   ├── schema.prisma           # Database schema definition (SQLite)
│   └── dev.db                  # Local SQLite database file (auto-generated)
├── public/                     # Static assets (robots.txt, sitemap, manifest)
├── src/
│   ├── assets/                 # Local images and logos
│   ├── components/             # Reusable React components
│   ├── pages/                  # Main application pages
│   ├── data.ts                 # Single source of truth (prices, services, FAQ)
│   ├── index.css               # Global design system and styles
│   ├── main.tsx                # React entry point
│   └── types.ts                # Shared TypeScript type declarations
├── .env.example                # Environment variables template
├── index.html                  # HTML entry with SEO meta tags and JSON-LD
├── package.json                # Dependencies and scripts
├── server.ts                   # Express backend + Vite dev middleware
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0 — check with `node -v`
- **Git** — [git-scm.com](https://git-scm.com/)
- **VS Code** (recommended)

### Setup (5 minutes)

```bash
# 1. Clone or extract the project and open in VS Code

# 2. Install all dependencies (frontend + backend in one command)
npm install

# 3. Configure environment variables
cp .env.example .env
# Windows (PowerShell): copy .env.example .env

# 4. Initialize the local SQLite database
npx prisma generate
npx prisma db push

# 5. Start the application
npm run dev

# 6. Open your browser at http://localhost:3000
```

### Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
APP_URL="http://localhost:3000"
```

---

## 🎯 Key Features

### Customer Experience
- **Hero section** — Business presentation with live open/closed status indicator (auto-detected based on Lome GMT+0 timezone and real working hours)
- **Services pages** — Detailed service sheets: Ironing, Dry Cleaning, Standard Washing, Curtains and Household Linen
- **Interactive price list** — Real-time search and category filters across all clothing designations (men, women, household linen)
- **Quote estimator** — Live calculator in FCFA with item basket and instant WhatsApp quote sending
- **Pickup scheduler** — Online home pickup booking form for Lome with address and preferred time slot
- **Live order tracking** — Real-time status tracking panel (pending -> in progress -> completed) integrated alongside the scheduler
- **Photo gallery** — Thematic filters and interactive Lightbox viewer with keyboard navigation
- **Dynamic FAQ** — Instant search filter across all questions
- **Contact page** — Interactive Lome map (rue Madjatom, Tokoin Gbadago), clickable phone numbers, and secure contact form

### Business Information
| Field | Value |
|-------|-------|
| Business | Kokouvi Wash |
| Address | 63 rue Madjatom, Porte N°272 — Tokoin Gbadago, Lome |
| Phone | +228 91 86 49 72 / 90 03 85 27 / 90 56 42 96 |
| Hours | Monday–Saturday, 7:00–18:00 |
| Closed | Sundays |
| Services | Pressing · Blanchisserie · Nettoyage a sec · Livraison |

---

## 🔌 REST API Endpoints

All routes are prefixed with `/api`:

### Public Endpoints
```
GET  /api/status
├── Response: { isOpen: boolean, currentTime, nextOpeningTime }
└── Live open/closed status based on Lome timezone

POST /api/contact
├── Request:  { name, email, phone, message }
└── Saves and acknowledges a contact request

POST /api/pickups
├── Request:  { customerName, phone, address, preferredDate, preferredTime, specialInstructions? }
└── Schedules a home pickup

GET  /api/pickups/track
├── Query:    ?phone=... or ?id=...
└── Returns pickup status and history for the customer

POST /api/quotes
├── Request:  { customerName, phone, items, estimatedTotal }
└── Saves a quote estimate from the estimator

POST /api/newsletter
├── Request:  { email }
└── Registers email address to newsletter
```

### Admin Endpoints
```
GET  /api/admin/pickups              # List all scheduled pickups
POST /api/admin/pickups/:id/status   # Update pickup status
GET  /api/admin/stats                # Global activity statistics
```

---

## 📊 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, history timeline, live status, service overview |
| About | `/about` | Company story, quality commitments, client testimonials |
| Services | `/services` | Service detail cards with pricing |
| Price list | `/tarifs` | Full interactive clothing designation list with search |
| Quote estimator | `/estimateur` | Live FCFA calculator with WhatsApp sender |
| Pickup scheduler | `/collecte` | Home pickup booking form + live tracking panel |
| Gallery | `/galerie` | Photo album with Lightbox viewer |
| FAQ | `/faq` | Searchable FAQ |
| Contact | `/contact` | Map, phone numbers, contact form |

---

## 🏢 Production Deployment

### Build for Production
```bash
# Compile React (-> /dist) and bundle Express server (-> /dist/server.cjs)
npm run build

# Start production server
npm run start
```

### Deploy on Render or Railway
1. Push the repo to GitHub (`FUTURE_FS_03`)
2. Create a **Web Service** on [Render](https://render.com)
3. Build command: `npm install && npx prisma generate && npx prisma db push && npm run build`
4. Start command: `npm run start`
5. The SQLite database persists in the server filesystem

---

## 🔧 Troubleshooting

### Port already in use (`EADDRINUSE :::3000`)
```bash
# macOS / Linux
kill -9 $(lsof -t -i:3000)

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Prisma or SQLite errors (`PrismaClientInitializationError`)
```bash
npx prisma generate
npx prisma db push
```

### Missing or corrupted `node_modules`
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Best Practices Implemented

### Architecture
- ✅ **Unified server** — React and Express on a single port, zero CORS configuration
- ✅ **Single source of truth** — all prices, services and FAQ content live in `src/data.ts`
- ✅ **Zod validation** — every incoming API request validated before touching the database
- ✅ **TypeScript** — full type coverage across frontend and backend

### SEO & Visibility
- ✅ **JSON-LD structured data** — Business schema in `index.html` for Google rich results
- ✅ **Sitemap and robots.txt** — ready to be indexed from day one
- ✅ **Vite code splitting** — automatic page-level bundle splitting
- ✅ **Live open/closed indicator** — based on real business hours (GMT+0 Lome)

### User Experience
- ✅ **WhatsApp integration** — quote estimator sends directly to business WhatsApp
- ✅ **Clickable phone numbers** — `tel:` links on all contact pages
- ✅ **Keyboard-navigable gallery** — Lightbox with arrow key support
- ✅ **Real-time order tracking** — customers track pickup by phone number or order ID

---

## 🔮 Future Improvements

1. **Admin authentication** — Secure `/api/admin/*` endpoints with JWT login
2. **SMS notifications** — Notify Lome customers automatically when order status changes
3. **Before/after photos** — Allow staff to attach pickup photos to each order record
4. **Online payment** — Integrate a West Africa payment gateway (Flooz / T-Money)
5. **Multi-language** — French / English toggle (consistent with Task 1 portfolio)

---

## 🔧 Available npm Scripts

```bash
npm run dev       # Start unified dev server (React + Express, port 3000)
npm run build     # Build React SPA + bundle Express server for production
npm run start     # Start production server
npm run lint      # Run TypeScript linter
```

```bash
npx prisma generate   # Generate Prisma client types
npx prisma db push    # Sync schema to local dev.db
npx prisma studio     # Visual database explorer (browser UI)
```

---

## 📋 Task Completion — Future Interns Brief

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Professional website for a real local business | ✅ | Kokouvi Wash — pressing & laundry, Lome |
| Live website demo | ✅ | Deployed on Render (unified server) |
| GitHub repo (FUTURE_FS_03) | ✅ | Source code with full documentation |
| Short pitch explaining how the site helps the business grow | ✅ | See pitch below |

**Skills demonstrated :** Real-world web development · client communication · business problem solving · pitching · full-stack delivery

---

## 🎤 Business Pitch

**The problem :** Kokouvi Wash has been serving Lome for decades with no digital presence. Customers have no way to check prices, request pickups, or track their orders without calling or visiting in person.

**The solution :** This platform gives Kokouvi Wash three new growth channels :

1. **Online visibility** — SEO-optimized pages and Google structured data mean new customers in Tokoin Gbadago and surrounding neighborhoods can find the business on Google.
2. **WhatsApp quotes** — The interactive price estimator lets customers build their order and send it directly to the business WhatsApp in one tap. Fewer phone calls, faster conversions.
3. **Home pickup requests** — Customers can schedule a pickup online and track their laundry status in real time. This removes the biggest friction point for busy customers — having to travel to the shop.

**The result :** More customers reached, more orders handled, less time spent on manual coordination.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**ALOVE Koffi Israel** 
Licence Developpement d'Applications — ESIG Global Success, Lome, Togo
[github.com/resval696](https://github.com/resval696)

---

*Future Interns · Full Stack Web Development Track · FUTURE_FS_03*

**Kokouvi Wash** — A real business, a real website, a real pitch. Built with React, Node.js, and SQLite. 🧼⚙️