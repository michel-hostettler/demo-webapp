# Claude Code Instructions

React Frontend für die Demo WebApp mit Backend-Anbindung.

## Projekt-Struktur

```
src/
├── api/
│   └── todoApi.js        # Backend API client
├── components/
│   ├── Counter.jsx       # Counter component
│   ├── Counter.test.jsx  # Counter tests
│   ├── TodoList.jsx      # Todo list (mit Backend)
│   ├── TodoList.test.jsx # TodoList tests
│   ├── Header.jsx
│   └── Footer.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

## Wichtige Befehle

```bash
# Development Server
npm run dev

# Tests
npm test

# Build
npm run build
```

## Backend-Verbindung

Das Frontend verbindet sich mit dem Spring Boot Backend (demo-webapp-backend).

### Environment Variablen

- `VITE_API_URL` - Backend URL (default: http://localhost:8080)

### API Endpoints (Backend)

- GET /api/todos - Alle Todos laden
- POST /api/todos - Neues Todo erstellen
- PATCH /api/todos/:id/toggle - Todo Status ändern
- DELETE /api/todos/:id - Todo löschen
- GET /api/health - Health Check

## Multi-Repo Setup

Dieses Frontend gehört zu einem Multi-Repo Projekt:

- **Frontend**: demo-webapp (dieses Repo)
- **Backend**: demo-webapp-backend

Für Preview-Deployments müssen beide Services laufen.
