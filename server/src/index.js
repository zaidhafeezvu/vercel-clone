import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/index.js';
import { projects, deployments } from './db/schema.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Get the project root directory
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CLIENT_DIST_DIR = path.join(PROJECT_ROOT, 'client/dist');

// Ensure public directory exists
async function ensurePublicDirectory() {
  try {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });
    console.log('Public directory ensured');
  } catch (error) {
    console.error('Error creating public directory:', error);
  }
}

// Copy directory recursively
async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error copying directory:', error);
    throw error;
  }
}

// Fix asset paths in HTML file for deployment
async function fixHtmlAssetPaths(htmlFilePath) {
  try {
    let htmlContent = await fs.readFile(htmlFilePath, 'utf8');
    
    // Replace absolute paths with relative paths
    htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
    htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
    htmlContent = htmlContent.replace(/href="\/vite\.svg"/g, 'href="./vite.svg"');
    
    await fs.writeFile(htmlFilePath, htmlContent);
    console.log('Fixed asset paths in HTML file');
  } catch (error) {
    console.error('Error fixing HTML asset paths:', error);
    throw error;
  }
}

// Generate deployment files in the public folder
async function generateDeploymentFiles() {
  // Check if client build exists
  try {
    await fs.access(CLIENT_DIST_DIR);
  } catch (error) {
    throw new Error('Client build not found. Please run "npm run build:client" first.');
  }
  
  // Copy client build files to public directory
  await copyDirectory(CLIENT_DIST_DIR, PUBLIC_DIR);
  
  // Fix asset paths in the HTML file
  const htmlFilePath = path.join(PUBLIC_DIR, 'index.html');
  await fixHtmlAssetPaths(htmlFilePath);
  
  console.log('Deployment files generated in public folder');
  return PUBLIC_DIR;
}

// Initialize public directory on startup
await ensurePublicDirectory();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(PUBLIC_DIR));

// Simple user store (in production, this would be in the database)
const users = new Map();

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = nanoid();
    
    users.set(email, {
      id: userId,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('auth-token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    res.json({ user: { id: userId, email, name } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.cookie('auth-token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signout', (req, res) => {
  res.clearCookie('auth-token');
  res.json({ message: 'Signed out successfully' });
});

app.get('/api/auth/session', (req, res) => {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: decoded.userId, email: decoded.email, name: decoded.name } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Protected routes middleware
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Projects routes
app.get('/api/projects', requireAuth, async (req, res) => {
  try {
    const userProjects = await db.select().from(projects).where(eq(projects.userId, req.user.userId));
    res.json(userProjects);
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = {
      id: nanoid(),
      name,
      description: description || '',
      userId: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.insert(projects).values(project);
    res.json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Deployments routes
app.get('/api/projects/:projectId/deployments', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project belongs to user
    const project = await db.select().from(projects).where(eq(projects.id, projectId));
    if (!project.length || project[0].userId !== req.user.userId) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const projectDeployments = await db.select().from(deployments).where(eq(deployments.projectId, projectId));
    res.json(projectDeployments);
  } catch (error) {
    console.error('Deployments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

app.post('/api/projects/:projectId/deploy', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { commitMessage } = req.body;
    
    // Verify project belongs to user
    const project = await db.select().from(projects).where(eq(projects.id, projectId));
    if (!project.length || project[0].userId !== req.user.userId) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const deploymentId = nanoid();
    const deployment = {
      id: deploymentId,
      projectId,
      status: 'pending',
      url: `http://localhost:${PORT}`,
      commitMessage: commitMessage || 'Deploy from dashboard',
      createdAt: new Date()
    };
    
    await db.insert(deployments).values(deployment);
    
    // Start deployment process
    setTimeout(async () => {
      try {
        // Update to building status
        await db.update(deployments)
          .set({ status: 'building' })
          .where(eq(deployments.id, deploymentId));
          
        // Generate deployment files
        setTimeout(async () => {
          try {
            await generateDeploymentFiles();
            
            // Update to success status
            await db.update(deployments)
              .set({ status: 'success' })
              .where(eq(deployments.id, deploymentId));
            
            console.log(`Deployment ${deploymentId} completed successfully`);
          } catch (fileError) {
            console.error('Error generating deployment files:', fileError);
            
            // Update to error status
            await db.update(deployments)
              .set({ status: 'error' })
              .where(eq(deployments.id, deploymentId));
          }
        }, 3000);
      } catch (error) {
        console.error('Deployment process error:', error);
        
        // Update to error status
        await db.update(deployments)
          .set({ status: 'error' })
          .where(eq(deployments.id, deploymentId));
      }
    }, 1000);
    
    res.json(deployment);
  } catch (error) {
    console.error('Deployment creation error:', error);
    res.status(500).json({ error: 'Failed to create deployment' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});