# Vercel Clone

A minimal full-stack Vercel clone built with modern web technologies.

## Tech Stack

### Frontend
- **Framework**: Vite + React + Tailwind CSS  
- **Authentication**: Better-Auth client
- **UI Components**: Lucide React Icons
- **Routing**: React Router DOM

### Backend Options

#### Node.js Backend (Original)
- **Runtime**: Node.js with Express.js
- **Database**: SQLite + Drizzle ORM
- **Authentication**: Better-Auth + JWT

#### Go Backend (New - Recommended)
- **Runtime**: Go with Gin framework
- **Database**: SQLite + GORM
- **Authentication**: JWT with bcrypt
- **Performance**: 2-4x faster than Node.js
- **Memory**: 50-70% lower usage
- **Concurrency**: Built-in goroutines for deployments

## Features

- 🔐 User authentication (sign up/sign in)
- 📁 Project management
- 🚀 Deployment simulation
- 📊 Deployment history and status tracking
- 📱 Responsive dashboard UI
- 🎨 Modern, Vercel-inspired design

## Quick Start

**Prerequisites**: Node.js 16+ and npm (or [Bun](https://bun.sh/) for faster builds)

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaidhafeezvu/vercel-clone.git
   cd vercel-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Server environment
   cp server/.env.example server/.env
   
   # Client environment  
   cp client/.env.example client/.env
   ```

4. **Choose your backend and start servers**

   **Option A: Go Backend (Recommended)**
   ```bash
   npm run build:go
   npm run switch:go
   ```
   
   **Option B: Node.js Backend**
   ```bash
   npm run switch:node
   ```

   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:3001

## Backend Comparison

| Feature | Node.js Backend | Go Backend |
|---------|----------------|------------|
| **Performance** | Baseline | 2-4x faster |
| **Memory Usage** | Baseline | 50-70% lower |
| **Concurrency** | Event loop | Native goroutines |
| **Type Safety** | Runtime errors | Compile-time checking |
| **Deployment** | Node.js + deps | Single binary |
| **Startup Time** | ~2-3 seconds | ~0.5 seconds |

## Project Structure

```
vercel-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── ...
│   └── package.json
├── server/                 # Node.js Express backend
│   ├── src/
│   │   ├── db/            # Database schema and connection
│   │   └── index.js       # Server entry point
│   └── package.json
├── go-server/             # Go Gin backend (recommended)
│   ├── cmd/server/        # Application entry point
│   ├── internal/          # Private application code
│   │   ├── auth/         # Authentication logic
│   │   ├── handlers/     # HTTP handlers
│   │   ├── models/       # Data models
│   │   └── services/     # Business logic
│   └── go.mod
├── scripts/               # Utility scripts
└── package.json          # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User sign in  
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project

### Deployments
- `GET /api/projects/:id/deployments` - Get project deployments
- `POST /api/projects/:id/deploy` - Create new deployment

## Development

### Frontend Development
```bash
cd client
npm run dev
```

### Backend Development

**Node.js Backend:**
```bash
cd server
npm run dev
```

**Go Backend:**
```bash
cd go-server
go run cmd/server/main.go
```

### Build for Production

**Frontend:**
```bash
npm run build:client
```

**Node.js Backend:**
```bash
npm run build:server  # No build step needed
```

**Go Backend:**
```bash
npm run build:go
# Creates optimized binary at go-server/bin/server
```

## Database Schema

The application uses SQLite (Bun's built-in SQLite) with Drizzle ORM:

- **users** - User accounts
- **sessions** - Authentication sessions
- **projects** - User projects
- **deployments** - Project deployments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
