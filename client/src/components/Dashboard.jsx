import { useState, useEffect } from 'react';
import { signOut, useSession } from '../lib/auth';
import { api } from '../lib/api';
import { Plus, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);
      
      // Load deployments for each project
      const deploymentsData = {};
      for (const project of projectsData) {
        const projectDeployments = await api.getDeployments(project.id);
        deploymentsData[project.id] = projectDeployments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 3); // Show only last 3 deployments
      }
      setDeployments(deploymentsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'building':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'building':
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vercel Clone</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, {session?.user?.name}</span>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Projects</h2>
            <p className="text-gray-400">Manage and deploy your applications</p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first project to get started with deployments
              </p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                deployments={deployments[project.id] || []}
                onDeploy={loadProjects}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}

        {showCreateProject && (
          <CreateProjectModal
            onClose={() => setShowCreateProject(false)}
            onSuccess={() => {
              setShowCreateProject(false);
              loadProjects();
            }}
          />
        )}
      </main>
    </div>
  );
}

function ProjectCard({ project, deployments, onDeploy, getStatusIcon, getStatusColor }) {
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await api.createDeployment(project.id, {
        commitMessage: 'Deploy from dashboard'
      });
      setTimeout(onDeploy, 1000); // Reload data after a short delay
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
          <p className="text-gray-400">{project.description}</p>
        </div>
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="bg-gray-800 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {deploying ? 'Deploying...' : 'Deploy'}
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-300">Recent Deployments</h4>
        {deployments.length === 0 ? (
          <p className="text-gray-500 text-sm">No deployments yet</p>
        ) : (
          deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-900 rounded-md"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(deployment.status)}
                <div>
                  <p className="text-sm font-medium">{deployment.commitMessage}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(deployment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${getStatusColor(deployment.status)} capitalize`}>
                  {deployment.status}
                </span>
                {deployment.url && deployment.status === 'success' && (
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CreateProjectModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createProject({ name, description });
      onSuccess();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-awesome-project"
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="A brief description of your project"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}