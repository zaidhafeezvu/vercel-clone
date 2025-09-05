# Go Backend Implementation

This directory contains a complete Go implementation of the Vercel Clone backend, providing identical functionality to the original Node.js/Express backend but with improved performance and type safety.

## Architecture

The Go backend is structured following standard Go project conventions:

```
go-server/
├── cmd/server/           # Application entry point
├── internal/             # Private application code
│   ├── auth/            # Authentication logic (JWT)
│   ├── database/        # Database connection and initialization
│   ├── handlers/        # HTTP request handlers
│   ├── middleware/      # HTTP middleware
│   ├── models/          # Data models and request/response structs
│   └── services/        # Business logic services
└── go.mod               # Go module definition
```

## Key Features

### Performance Benefits
- **Superior Performance**: Go's compiled nature and efficient runtime provide significantly better performance than Node.js
- **Low Memory Usage**: More efficient memory management compared to V8 JavaScript engine
- **Built-in Concurrency**: Goroutines handle multiple deployment operations simultaneously without blocking
- **Single Binary**: Compiles to a single executable with all dependencies included

### API Compatibility
The Go backend maintains 100% API compatibility with the original Node.js backend:

- **Authentication**: JWT-based auth with cookie support
- **Projects**: Full CRUD operations for projects
- **Deployments**: Complete deployment pipeline with status tracking
- **File Uploads**: ZIP file handling and extraction
- **Static Serving**: Serves deployment files and dashboard assets

### Technology Stack
- **Framework**: Gin (high-performance HTTP framework)
- **Database**: GORM with SQLite (same as Node.js version)
- **Authentication**: JWT with bcrypt password hashing
- **File Handling**: Native Go archive/zip and file system operations
- **CORS**: gin-contrib/cors middleware

## API Endpoints

All endpoints are identical to the Node.js implementation:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project

### Deployments
- `GET /api/projects/:id/deployments` - Get project deployments
- `POST /api/projects/:id/deploy` - Create deployment
- `GET /api/package-managers` - Get package manager info

### Static Files
- `GET /deployments/:id/*` - Serve deployment files

## Running the Go Backend

### Prerequisites
- Go 1.24 or later
- SQLite (included with Go's database/sql)

### Development
```bash
cd go-server

# Install dependencies
go mod tidy

# Build the server
go build -o bin/server cmd/server/main.go

# Run the server
./bin/server
```

The server starts on port 3001 (same as Node.js version).

### Environment Variables
The Go backend uses the same environment variables as the Node.js version:
- `PORT` - Server port (default: 3001)
- `BETTER_AUTH_SECRET` - JWT signing secret

## Database

Uses the same SQLite database (`data.db`) with identical schema:
- **Users**: Authentication and user data
- **Projects**: Project information
- **Deployments**: Deployment records and status

GORM handles automatic migrations, maintaining compatibility with the existing database.

## Migration from Node.js

The Go backend is a drop-in replacement:

1. **Stop Node.js server**
2. **Start Go server** (uses same database and file structure)
3. **Frontend requires no changes** (100% API compatible)

## Performance Comparison

Expected improvements over Node.js backend:
- **2-4x faster** API response times
- **50-70% lower** memory usage
- **Better concurrency** for simultaneous deployments
- **Faster startup** time

## Development Notes

### Code Organization
- **Handlers**: HTTP request/response logic
- **Services**: Business logic (deployment processing, etc.)
- **Models**: Type-safe data structures
- **Middleware**: Authentication, CORS, logging
- **Database**: GORM models and connection management

### Key Differences from Node.js
- **Strong typing**: Compile-time type checking prevents runtime errors
- **Error handling**: Explicit error handling patterns
- **Goroutines**: Background deployment processing without blocking
- **Memory management**: Garbage collected but more efficient than V8

### Future Enhancements
- **Metrics**: Built-in Prometheus metrics
- **Tracing**: OpenTelemetry integration
- **Configuration**: Viper-based config management
- **Testing**: Comprehensive test suite with testify
- **Docker**: Multi-stage builds for production deployment