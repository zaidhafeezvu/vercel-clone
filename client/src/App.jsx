import { useAuth } from './lib/useAuth.jsx';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return session ? <Dashboard /> : <AuthPage />;
}

export default App;
