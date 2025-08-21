# Vercel Clone

A minimal full-stack Vercel clone built with modern web technologies.

## Tech Stack

- **Runtime**: Bun (JavaScript runtime and package manager)
- **Frontend**: Vite + React + Tailwind CSS  
- **Backend**: Express.js + Bun
- **Authentication**: Better-Auth
- **Database**: SQLite (Bun's built-in SQLite) + Drizzle ORM
- **UI Components**: Lucide React Icons

## Features

- 🔐 User authentication (sign up/sign in)
- 📁 Project management
- 🚀 Deployment simulation
- 📊 Deployment history and status tracking
- 📱 Responsive dashboard UI
- 🎨 Modern, Vercel-inspired design

## Quick Start

**Prerequisites**: [Bun](https://bun.sh/) (JavaScript runtime and package manager)

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaidhafeezvu/vercel-clone.git
   cd vercel-clone
   ```

2. **Install dependencies**
   ```bash
   bun run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Server environment
   cp server/.env.example server/.env
   
   # Client environment  
   cp client/.env.example client/.env
   ```

4. **Start the development servers**
   ```bash
   bun run dev
   ```

   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:3001

## Project Structure

```
vercel-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── db/            # Database schema and connection
│   │   ├── routes/        # API routes (future)
│   │   └── index.js       # Server entry point
│   └── package.json
└── package.json           # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/sign-in` - User sign in
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User sign out

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
bun run dev
```

### Backend Development
```bash
cd server
bun run dev
```

### Build for Production
```bash
bun run build
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
