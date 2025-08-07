# User Management Fullstack App

Ein vollständiges Full-Stack-Projekt zur Verwaltung von **Benutzern, Rollen und Rechten** mit:

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: Vue.js + Vuetify
- **Datenbank**: PostgreSQL

## Projektstruktur

```
user-management-fullstack/
├── backend/         # Node.js REST API
├── frontend/        # Vue.js SPA mit Vuetify
├── sql/             # SQL-Dateien (Datenbankschema, Seed-Daten)
└── README.md
```

## Voraussetzungen (wenn du noch nichts installiert hast)

### Node.js + npm installieren

https://nodejs.org (LTS-Version wählen)

### PostgreSQL installieren

https://www.postgresql.org/download/

Optional: ein Client für Posgresql installieren: dbBeaver

Beim Setup: Benutzer `postgres` + Passwort vergeben

### Vue CLI installieren

```bash
npm install -g @vue/cli
```

## Projekt-Setup Schritt für Schritt

### 1. Backend einrichten

```bash
cd backend
npm init -y
npm install express pg cors dotenv
npm install --save-dev nodemon
```

#### Beispiel `.env`

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=dein_passwort
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_management
```

#### Backend starten

```bash
npm run dev
```

### 2. Frontend einrichten

```bash
cd ../frontend
vue create frontend
```

Bei der CLI kannst du entweder "Default (Vue 3)" wählen oder manuell konfigurieren.

```bash
cd frontend
vue add vuetify
npm install axios
```

#### Frontend starten

```bash
npm run serve
```

### 3. Datenbank vorbereiten

1. PostgreSQL starten
2. Neue Datenbank erstellen: `user_management`
3. SQL-Schema aus `sql/init.sql` ausführen

## 📡 API-Endpunkte (Beispiele)

| Methode | Route                         | Beschreibung                  |
| ------- | ----------------------------- | ----------------------------- |
| GET     | `/api/users`                  | Benutzer auflisten            |
| POST    | `/api/users`                  | Benutzer anlegen              |
| POST    | `/api/roles`                  | Neue Rolle erstellen          |
| DELETE  | `/api/roles/:id`              | Rolle löschen                 |
| POST    | `/api/permissions`            | Neues Recht erstellen         |
| DELETE  | `/api/permissions/:id`        | Recht löschen                 |
| POST    | `/api/users/:id/assign-role`  | Rolle einem Benutzer zuweisen |
| POST    | `/api/roles/:id/assign-right` | Recht einer Rolle zuweisen    |

## Entwicklungsskripte

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run serve
```

## Weitere Tools (optional)

| Tool    | Zweck                        |
| ------- | ---------------------------- |
| Postman | API testen                   |
| pgAdmin | PostgreSQL visuell verwalten |
| GitHub  | Code hosten und teilen       |

## Git & GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dein-benutzername/user-management-fullstack.git
git push -u origin main
```

## Autor

Thanh Tung Nguyen
