import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './auth.js';
import { db } from './db/index.js';
import { projects, deployments } from './db/schema.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Auth routes
app.use('/api/auth/*', auth.handler);

// Protected routes middleware
const requireAuth = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = session.user;
  next();
};

// Projects routes
app.get('/api/projects', requireAuth, async (req, res) => {
  try {
    const userProjects = await db.select().from(projects).where(eq(projects.userId, req.user.id));
    res.json(userProjects);
  } catch (error) {
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
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.insert(projects).values(project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Deployments routes
app.get('/api/projects/:projectId/deployments', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project belongs to user
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const projectDeployments = await db.select().from(deployments).where(eq(deployments.projectId, projectId));
    res.json(projectDeployments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

app.post('/api/projects/:projectId/deploy', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { commitMessage } = req.body;
    
    // Verify project belongs to user
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const deployment = {
      id: nanoid(),
      projectId,
      status: 'pending',
      url: `https://${nanoid()}.vercel-clone.app`,
      commitMessage: commitMessage || 'Deploy from dashboard',
      createdAt: new Date()
    };
    
    await db.insert(deployments).values(deployment);
    
    // Simulate deployment process
    setTimeout(async () => {
      try {
        await db.update(deployments)
          .set({ status: 'building' })
          .where(eq(deployments.id, deployment.id));
          
        setTimeout(async () => {
          await db.update(deployments)
            .set({ status: 'success' })
            .where(eq(deployments.id, deployment.id));
        }, 3000);
      } catch (error) {
        console.error('Deployment simulation error:', error);
      }
    }, 1000);
    
    res.json(deployment);
  } catch (error) {
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