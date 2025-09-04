import { ArrowRight, Zap, Globe, Shield, Sparkles, Rocket, Code } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    // Stagger card animations
    const timer1 = setTimeout(() => setVisibleCards(prev => [...prev, 0]), 200);
    const timer2 = setTimeout(() => setVisibleCards(prev => [...prev, 1]), 400);
    const timer3 = setTimeout(() => setVisibleCards(prev => [...prev, 2]), 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b border-gray-800/50 backdrop-blur-sm transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center group">
              <div className="relative">
                <Sparkles className="w-8 h-8 mr-3 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 mr-3 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Vercel Clone
              </h1>
            </div>
            <nav className="flex items-center space-x-8">
              <button
                onClick={onGetStarted}
                className="group relative bg-white text-black px-6 py-3 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-pulse">
              Deploy your projects
              <br />
              <span className="relative">
                with confidence
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              </span>
            </h1>
            <div className="absolute -top-4 -right-4">
              <Rocket className="w-12 h-12 text-blue-400 animate-bounce" />
            </div>
          </div>
          
          <p className={`text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            Build, deploy, and scale your applications with ease. 
            Experience the power of modern deployment infrastructure with lightning-fast performance.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <button
              onClick={onGetStarted}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center">
                Get Started 
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
            </button>
            
            <button className="group border-2 border-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/20 hover:bg-blue-400/10">
              <span className="flex items-center">
                <Code className="mr-2 w-5 h-5 transition-transform group-hover:rotate-12" />
                View Demo
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why choose our platform?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">Everything you need to ship your next project faster than ever</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lightning Fast Card */}
          <div className={`group relative transition-all duration-700 ${visibleCards.includes(0) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-500 group-hover:border-blue-400/50 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:scale-105"></div>
            
            {/* Card content */}
            <div className="relative p-8 text-center">
              {/* Animated icon container */}
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Zap className="w-8 h-8 text-blue-400 transition-all duration-500 group-hover:scale-125" />
                </div>
                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors duration-300">
                Lightning Fast
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                Deploy in seconds, not minutes. Our edge network ensures your apps load instantly worldwide with zero configuration required.
              </p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          </div>

          {/* Global CDN Card */}
          <div className={`group relative transition-all duration-700 ${visibleCards.includes(1) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-500 group-hover:border-green-400/50 group-hover:shadow-2xl group-hover:shadow-green-500/20 group-hover:scale-105"></div>
            
            {/* Card content */}
            <div className="relative p-8 text-center">
              {/* Animated icon container */}
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Globe className="w-8 h-8 text-green-400 transition-all duration-500 group-hover:scale-125" />
                </div>
                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-green-100 transition-colors duration-300">
                Global CDN
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                Automatically distributed across our global edge network for optimal performance. Your users get the best experience anywhere.
              </p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          </div>

          {/* Secure by Default Card */}
          <div className={`group relative transition-all duration-700 ${visibleCards.includes(2) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-500 group-hover:border-purple-400/50 group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:scale-105"></div>
            
            {/* Card content */}
            <div className="relative p-8 text-center">
              {/* Animated icon container */}
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Shield className="w-8 h-8 text-purple-400 transition-all duration-500 group-hover:scale-125" />
                </div>
                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-100 transition-colors duration-300">
                Secure by Default
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                Built-in security features including HTTPS, DDoS protection, and automatic updates. Focus on building, we handle security.
              </p>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-gradient-to-r from-gray-900/80 via-blue-900/20 to-purple-900/20 border-t border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Ready to get started?
              </h2>
              <div className="absolute -top-6 -right-6">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Join thousands of developers who trust our platform to deploy their applications with confidence
            </p>
            <button
              onClick={onGetStarted}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 inline-flex items-center"
            >
              <span className="relative z-10 flex items-center">
                Start Building Today 
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="hover:text-gray-300 transition-colors duration-300">
              &copy; 2024 Vercel Clone. Built with React and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}