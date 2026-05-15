# 🏍️ Old City Army — Guida al Progetto

Benvenuto nel progetto Old City Army! Questo è il sito della fratellanza su due ruote, costruito con React, Node.js e MongoDB.

Se sei nuovo qui, non preoccuparti — questa guida ti accompagna passo passo in tutto.

---

## 🗂️ Come è strutturato il progetto

```
old-city-army/
│
├── frontend/                  ← Quello che vede l'utente (React)
│   └── src/
│       ├── components/        → Navbar, Footer, NotificationBell
│       ├── context/           → AuthContext, NotificheContext
│       ├── hooks/             → useApi (recupera dati dal backend)
│       └── pages/             → tutte le pagine del sito
│           ├── Home.jsx
│           ├── Galleria.jsx   → con upload foto su Cloudinary
│           ├── Raduni.jsx     → con iscrizione/disdetta
│           ├── Percorsi.jsx
│           ├── Blog.jsx
│           ├── FAQ.jsx
│           ├── ChiSiamo.jsx
│           ├── Profilo.jsx    → profilo utente con modifica dati
│           ├── Notifiche.jsx  → centro notifiche
│           ├── AdminPanel.jsx → gestione ruoli (solo admin)
│           └── Auth.jsx       → login e registrazione
│
└── backend/                   ← Il cervello del sito (Express + MongoDB)
    ├── models/                → la forma dei dati su MongoDB
    │   ├── Member.js
    │   ├── Event.js
    │   ├── Percorso.js
    │   ├── Content.js         → BlogPost e GalleryItem
    │   └── Notification.js
    ├── routes/                → le API che il frontend chiama
    │   ├── auth.js
    │   ├── members.js
    │   ├── events.js
    │   ├── gallery.js
    │   ├── percorsi.js
    │   ├── blog.js
    │   └── notifiche.js
    ├── middleware/
    │   ├── auth.js            → controlla il token JWT
    │   └── upload.js          → gestisce upload foto su Cloudinary
    ├── utils/
    │   └── notifiche.js       → funzioni per inviare notifiche
    └── server.js              → punto di partenza del backend
```

---

## 🚀 Come avviare il progetto

Hai bisogno di **due terminali aperti** contemporaneamente — uno per il backend e uno per il frontend.

### Terminale 1 — Backend
```bash
cd old-city-army/backend
npm install
npm run dev
```
Se tutto va bene vedrai:
```
✅ MongoDB connesso con successo
🚀 Server in ascolto sulla porta 5000
```

### Terminale 2 — Frontend
```bash
cd old-city-army/frontend
npm install
npm start
```
Il sito si aprirà automaticamente su `http://localhost:3000`.

> ⚠️ Il comando del frontend è `npm start`, non `npm run dev` — quello è solo per il backend!

---

## ⚙️ Configurazione — file .env

Prima di avviare il backend devi creare il file `.env` dentro la cartella `backend/`. Copialo dall'esempio:

```bash
cp .env.example .env
```

Poi aprilo e compila questi valori:

```env
PORT=5000

# Database — scegli uno dei due:
MONGODB_URI=mongodb://localhost:27017/oldcityarmy        # MongoDB in locale
# MONGODB_URI=mongodb+srv://utente:password@cluster...  # MongoDB Atlas (cloud)

# Sicurezza — metti una stringa lunga e casuale
JWT_SECRET=qualcosa_di_lungo_e_difficile_da_indovinare
JWT_EXPIRES_IN=7d

# Cloudinary — per l'upload delle foto in galleria
# Trovi questi valori su https://cloudinary.com → dashboard
CLOUDINARY_CLOUD_NAME=il_tuo_cloud_name
CLOUDINARY_API_KEY=la_tua_api_key
CLOUDINARY_API_SECRET=il_tuo_api_secret

NODE_ENV=development
```

> 🔒 Non condividere mai questo file con nessuno e non caricarlo su GitHub!

---

## 🗄️ I dati su MongoDB

Queste sono le "tabelle" (in MongoDB si chiamano collezioni) che il progetto usa:

### 👤 Members — i membri
Chi si registra sul sito. Ogni membro ha nome, cognome, email, password (hashata, mai in chiaro), moto, bio, avatar e un ruolo.

I ruoli disponibili sono:
- `membro` — utente normale (default)
- `veterano` — membro storico
- `presidente` — ruolo di rappresentanza
- `admin` — accesso al pannello di gestione

### 🏍️ Events — i raduni
Gli appuntamenti organizzati. Ogni raduno ha titolo, descrizione, data, luogo e una lista di chi si è iscritto.

### 🛣️ Percorsi
I tracciati condivisi dai membri. Ogni percorso ha distanza, difficoltà, punto di partenza e arrivo, e facoltativamente un file GPX.

### 📰 BlogPost
Gli articoli del blog, scritti dagli admin. Tiene traccia automaticamente delle visite.

### 📸 GalleryItem
Le foto caricate dai membri. Vengono salvate su Cloudinary e in MongoDB viene salvato solo l'URL.

### 🔔 Notifications
Le notifiche per ogni membro. Vengono create automaticamente quando un admin pubblica un raduno, modifica un evento, o si registra un nuovo membro.

---

## 🔑 Le API disponibili

### Autenticazione
```
POST /api/auth/registra       → crea un nuovo account
POST /api/auth/accedi         → login, restituisce il token JWT
GET  /api/auth/me             → chi sono? (richiede login 🔒)
```

### Membri
```
GET   /api/members            → lista tutti i membri
PUT   /api/members/me         → aggiorna il mio profilo (🔒)
PATCH /api/members/:id/ruolo  → cambia ruolo a un membro (🔒 solo admin)
```

### Raduni
```
GET    /api/events                  → lista raduni
GET    /api/events/:id              → dettaglio raduno
POST   /api/events                  → crea raduno (🔒 admin)
PUT    /api/events/:id              → modifica raduno (🔒 admin)
DELETE /api/events/:id              → elimina raduno (🔒 admin)
POST   /api/events/:id/partecipa    → iscriviti o disdici (🔒)
```

### Galleria
```
GET    /api/gallery               → lista foto (filtra con ?categoria=moto)
POST   /api/gallery               → carica una foto (🔒)
POST   /api/gallery/:id/like      → metti o togli like (🔒)
DELETE /api/gallery/:id           → elimina la tua foto (🔒)
```

### Percorsi
```
GET    /api/routes        → lista percorsi
POST   /api/routes        → aggiungi percorso (🔒)
PUT    /api/routes/:id    → modifica percorso (🔒)
DELETE /api/routes/:id    → elimina percorso (🔒 admin)
```

### Blog
```
GET  /api/blog       → lista articoli
GET  /api/blog/:id   → articolo singolo
POST /api/blog       → pubblica articolo (🔒 admin)
```

### Notifiche
```
GET    /api/notifiche              → le mie notifiche (🔒)
PATCH  /api/notifiche/:id/leggi    → segna come letta (🔒)
PATCH  /api/notifiche/leggi-tutte  → segna tutte come lette (🔒)
DELETE /api/notifiche/:id          → elimina una notifica (🔒)
DELETE /api/notifiche              → elimina tutte (🔒)
```

---

## 🔔 Come funzionano le notifiche

Le notifiche vengono create automaticamente dal backend in questi casi:

| Evento | Chi riceve |
|--------|-----------|
| Admin crea un nuovo raduno | Tutti i membri |
| Admin modifica un raduno | Solo chi è iscritto |
| Nuovo membro si registra | Solo gli admin |

Sul frontend la campanella in navbar si aggiorna ogni 30 secondi. Il badge rosso mostra quante notifiche non hai ancora letto.

---

## 🛠️ Come diventare admin

Quando ti registri sei automaticamente `membro`. Per diventare admin la prima volta devi farlo manualmente da MongoDB Compass:

1. Apri Compass e connettiti a `mongodb://localhost:27017`
2. Vai su `oldcityarmy → members`
3. Trova il tuo documento, clicca su Edit
4. Cambia il campo `ruolo` da `"membro"` a `"admin"`
5. Salva

Da quel momento puoi usare il pannello admin su `/admin` per cambiare il ruolo agli altri membri direttamente dal sito.

---

## 📦 Pacchetti usati

### Frontend
| Pacchetto | A cosa serve |
|-----------|-------------|
| `react-router-dom` | navigazione tra le pagine |
| `axios` | chiamate HTTP al backend |

### Backend
| Pacchetto | A cosa serve |
|-----------|-------------|
| `express` | server web |
| `mongoose` | connessione e query MongoDB |
| `bcryptjs` | hashing delle password |
| `jsonwebtoken` | autenticazione con token JWT |
| `cors` | permette al frontend di parlare col backend |
| `dotenv` | legge le variabili dal file .env |
| `multer` | gestisce l'upload dei file |
| `cloudinary` | salva le foto nel cloud |
| `multer-storage-cloudinary` | collega multer a cloudinary |
| `nodemon` | riavvia il backend automaticamente durante lo sviluppo |

---

## 🌐 Mettere il sito online

Quando sei pronto a pubblicare il sito:

**Frontend → Vercel o Netlify (gratis)**
```bash
cd frontend
npm run build
# carica la cartella /build
# aggiungi il file _redirects con: /*  /index.html  200
```

**Backend → Railway o Render (gratis)**
- Collega il repository GitHub
- Imposta le variabili d'ambiente dal pannello
- Il comando di avvio è: `npm start`

**Database → MongoDB Atlas (gratis fino a 512MB)**
- Crea un cluster M0 gratuito
- Sostituisci MONGODB_URI nel .env con la stringa Atlas

---

Fatto con ❤️ per Old City Army.
Fratellanza su due ruote — vivila, guidala, condividila. 🏍️
