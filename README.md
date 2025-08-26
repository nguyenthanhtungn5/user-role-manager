# User Management Fullstack App

Ein vollständiges Full-Stack-Projekt zur Verwaltung von **Benutzern, Rollen und Rechten** mit:

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: Vue.js + Vuetify
- **Datenbank**: PostgreSQL (in Docker container)

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
https://www.npmjs.com/

### Docker + Docker compose installieren

https://docs.docker.com/get-docker/
https://docs.docker.com/compose/

Optional: ein Client für Posgresql installieren: dbBeaver

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
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_management
PORT=8888

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

Starten mit Command: docker compose up

## API-Dokumentation (Swagger UI)

Die API ist unter folgendem Endpunkt dokumentiert:

http://localhost:8888/api-docs

API-Endpunkte (basierend auf Swagger)

| Methode | Route                          | Beschreibung                              |
| ------- | ------------------------------ | ----------------------------------------- |
| GET     | `/api/users`                   | Benutzer auflisten                        |
| POST    | `/api/users`                   | Benutzer anlegen                          |
| DELETE  | `/api/users`                   | Benutzer löschen                          |
| GET     | `/api/roles`                   | Rolle auflisten                           |
| POST    | `/api/roles`                   | Neue Rolle erstellen                      |
| DELETE  | `/api/roles/:id`               | Rolle löschen                             |
| GET     | `/api/permissions`             | Rechte auflisten                          |
| POST    | `/api/permissions`             | Neues Recht erstellen                     |
| DELETE  | `/api/permissions/:id`         | Recht löschen                             |
| GET     | `/api/assign/user-roles`       | Rollen-Zuweisungen zu Benutzern auflisten |
| PUT     | `/api/assign/user-roles`       | Rollen einem Benutzer zuweisen            |
| GET     | `/api/assign/role-permissions` | Rechte-Zuweisungen zu Rollen auflisten    |
| PUT     | `/api/assign/role-permissions` | Rechte einer Rolle zuweisen               |

## Entwicklungsskripte

### Backend

```bash
npm run dev
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
