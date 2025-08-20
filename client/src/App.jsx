import { useSession } from './lib/auth';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
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
