# Vercel Clone - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Overview

Vercel Clone is a full-stack web application that replicates Vercel's core functionality. It consists of a React frontend (Vite) and Express backend with SQLite database, using better-auth for authentication.

## Quick Setup & Validation

### Bootstrap the Repository
Run these commands in exact order:

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   **Timing:** Takes ~25 seconds. Set timeout to 60+ seconds. NEVER CANCEL.

2. **Set up environment variables:**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```
   **Timing:** Takes ~4 seconds. Set timeout to 30+ seconds. NEVER CANCEL.

4. **Start development servers:**
   ```bash
   npm run dev
   ```
   **Timing:** Takes ~3 seconds to start both servers. Set timeout to 30+ seconds. NEVER CANCEL.

### Validation Steps
**ALWAYS validate your changes by running through this complete end-to-end scenario:**

1. Navigate to http://localhost:5173
2. Click "Don't have an account? Sign up"
3. Create account with: Full Name: "Test User", Email: "test@example.com", Password: "password123"
4. Verify successful login to dashboard showing "Welcome, Test User"
5. Click "New Project" button
6. Fill form: Project Name: "Test Project", Description: "A test project for validation"
7. Click "Create" button
8. Click "Deploy" button on the created project
9. Wait for deployment to show "success" status (takes ~10 seconds)
10. Verify deployment URL appears and is clickable

## Development Commands

### Core Commands
- `npm run dev` - Start both frontend (http://localhost:5173) and backend (http://localhost:3001)
- `npm run dev:client` - Start only React frontend  
- `npm run dev:server` - Start only Express backend
- `npm run build` - Build both client and server for production
- `npm run build:client` - Build only React client (outputs to client/dist/)
- `npm run build:server` - No-op for server (no build step needed)

### Linting
```bash
cd client && npm run lint
```
**WARNING:** Currently fails with 3 linting errors (unused variables). Fix before committing:
- `/client/src/lib/auth.js:60` - unused `error` variable in catch block
- `/client/src/lib/useAuth.jsx:18` - unused `error` variable in catch block  
- `/client/src/lib/useAuth.jsx:49` - react-refresh/only-export-components violation

## Project Structure

```
vercel-clone/
├── client/                 # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/     # AuthPage.jsx, Dashboard.jsx
│   │   ├── lib/           # api.js, auth.js, useAuth.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── dist/              # Build output (created by vite build)
│   └── package.json       # Client dependencies
├── server/                 # Express backend
│   ├── src/
│   │   ├── db/            # schema.js, index.js (SQLite + Drizzle ORM)
│   │   ├── auth.js        # better-auth configuration
│   │   └── index.js       # Express server entry point
│   └── package.json       # Server dependencies
├── data.db                # SQLite database (created automatically)
└── package.json           # Root workspace configuration
```

## Key Technical Details

### Database
- **SQLite with better-sqlite3** - Database file: `./data.db` (auto-created)
- **Drizzle ORM** - Schema in `/server/src/db/schema.js`
- **Tables:** projects, deployments  
- **Auto-initialization:** Tables created on server startup

### Authentication
- **better-auth library** - Handles sessions, signup/signin
- **Cookie-based sessions** - No JWT tokens
- **Environment:** Requires `BETTER_AUTH_SECRET` in server/.env

### API Endpoints
- **Auth:** POST /api/auth/signup, POST /api/auth/signin, POST /api/auth/signout
- **Projects:** GET /api/projects, POST /api/projects
- **Deployments:** GET /api/projects/:id/deployments, POST /api/projects/:id/deploy

### Frontend Libraries
- **React 19.1.1** with Vite 7.1.3
- **Tailwind CSS 4.1.12** for styling
- **React Router DOM 7.8.1** for navigation
- **Tanstack React Query 5.85.5** for data fetching

## Common Development Tasks

### Making Backend Changes
1. Edit files in `/server/src/`
2. Server auto-restarts with nodemon
3. **ALWAYS validate** with the end-to-end scenario above
4. Common files: `/server/src/index.js` (API routes), `/server/src/db/schema.js` (database schema)

### Making Frontend Changes  
1. Edit files in `/client/src/`
2. Vite provides hot reload
3. **ALWAYS validate** with the end-to-end scenario above
4. Common files: `/client/src/components/Dashboard.jsx` (main UI), `/client/src/lib/api.js` (API calls)

### Database Changes
1. Edit schema in `/server/src/db/schema.js`
2. Update table creation SQL in `/server/src/db/index.js`
3. Delete `data.db` to recreate database if needed
4. Restart server to apply changes

## Troubleshooting

### Common Issues
- **Port conflicts:** Ensure ports 3001 (backend) and 5173 (frontend) are available
- **Database locked:** Delete `data.db` and restart server
- **Linting errors:** Fix unused variables before committing
- **Build failures:** Check for import/export errors in React components
- **Auth issues:** Verify `BETTER_AUTH_SECRET` is set in server/.env

### Environment Files
- **Server:** PORT=3001, NODE_ENV=development, BETTER_AUTH_SECRET, BETTER_AUTH_URL
- **Client:** VITE_API_URL=http://localhost:3001

## Testing & Validation

### No Test Suite
This repository does not have automated tests. **ALWAYS manually validate** changes using the end-to-end scenario described above.

### Manual Testing Checklist
- [ ] Sign up new user works
- [ ] Sign in existing user works  
- [ ] Dashboard loads with projects
- [ ] Create new project works
- [ ] Deploy project works and shows success status
- [ ] Deployment URL generates correctly

### Before Committing
1. Run `cd client && npm run lint` and fix any errors
2. Run complete end-to-end validation scenario
3. Check that both servers start successfully with `npm run dev`

## Performance Notes
- **Installation:** ~25 seconds total
- **Build:** ~4 seconds total  
- **Deployment simulation:** ~10 seconds (backend simulates build process)
- **Server startup:** ~3 seconds for both servers

**NEVER CANCEL long-running operations.** Always set appropriate timeouts and let commands complete.