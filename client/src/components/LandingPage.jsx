import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Vercel Clone</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <button
                onClick={onGetStarted}
                className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Deploy your projects
            <br />
            with confidence
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Build, deploy, and scale your applications with ease. 
            Experience the power of modern deployment infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button className="border border-gray-700 text-white px-8 py-3 rounded-md font-medium hover:border-gray-600 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why choose our platform?</h2>
          <p className="text-gray-400 text-lg">Everything you need to ship your next project</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <Zap className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Deploy in seconds, not minutes. Our edge network ensures your apps load instantly worldwide.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <Globe className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Global CDN</h3>
            <p className="text-gray-400">
              Automatically distributed across our global edge network for optimal performance.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <Shield className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Secure by Default</h3>
            <p className="text-gray-400">
              Built-in security features including HTTPS, DDoS protection, and automatic updates.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join thousands of developers who trust our platform
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors inline-flex items-center"
            >
              Start Building Today <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Vercel Clone. Built with React and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}