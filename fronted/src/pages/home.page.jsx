import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Clock, Users, Database, Lock, CheckCircle, PieChart, Server, Globe, Zap } from 'lucide-react';

// Hero section with animated gradient background
const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
      <div className="absolute h-32 w-full bg-gradient-to-b from-black/0 to-blue-900/20 bottom-0 left-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                AI-Powered
              </span> Fraud Detection
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-lg">
              Advanced protection with AI and rule-based analysis to stop fraud in real-time and secure your transactions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started
              </button>
              <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition-all">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75 blur"></div>
              <div className="relative bg-gray-900 p-6 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="flex items-center text-green-400">
                    <span className="h-2.5 w-2.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    System Active
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/80 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Transaction Analysis</span>
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/80 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Threat Detection</span>
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`h-3 rounded-full ${i === 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/80 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-400">Protected Transactions</div>
                        <div className="text-2xl font-bold text-white">347,921</div>
                      </div>
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features section
const Features = () => {
  const features = [
    {
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      title: "Behavior Analysis",
      description: "Detects unusual patterns and behaviors in transaction history."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Geolocation Tracking",
      description: "Identifies impossible travel scenarios and location-based anomalies."
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Real-time Detection",
      description: "Stops fraudulent transactions before they're processed."
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Fraud Ring Detection",
      description: "Uncovers complex fraud networks through graph analysis."
    },
    {
      icon: <PieChart className="h-6 w-6 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Provides deep insights with ML-powered data analysis."
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      title: "Adaptive Learning",
      description: "Continuously improves through AI model retraining."
    },
  ];
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Comprehensive Protection Features</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Our system combines AI and rule-based detection to provide industry-leading fraud prevention.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="bg-blue-50 inline-block p-3 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Technology stack section
const TechStack = () => {
  const techStacks = [
    { name: "Python", description: "Core backend processing" },
    { name: "Node.js", description: "API services" },
    { name: "XGBoost", description: "Machine learning model" },
    { name: "MongoDB", description: "Transaction database" },
    { name: "GraphDB", description: "Relationship analysis" },
    { name: "AWS/GCP", description: "Cloud infrastructure" },
  ];
  
  return (
    <div className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Powered by Advanced Technology</h2>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Built with industry-leading technologies for performance and reliability.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStacks.map((tech, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
            >
              <Server className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Animated stats counter
const StatsCounter = () => {
  const [counts, setCounts] = useState({
    transactions: 0,
    fraudPrevented: 0,
    savedAmount: 0,
    accuracy: 0
  });
  
  const targetCounts = {
    transactions: 1500000,
    fraudPrevented: 27580,
    savedAmount: 15,
    accuracy: 99.7
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        transactions: Math.min(prev.transactions + 50000, targetCounts.transactions),
        fraudPrevented: Math.min(prev.fraudPrevented + 900, targetCounts.fraudPrevented),
        savedAmount: Math.min(prev.savedAmount + 0.5, targetCounts.savedAmount),
        accuracy: Math.min(prev.accuracy + 3, targetCounts.accuracy)
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Making a Difference</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            See the impact our fraud detection system has made for businesses worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {counts.transactions.toLocaleString()}+
            </div>
            <div className="text-gray-600">Transactions Monitored</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {counts.fraudPrevented.toLocaleString()}+
            </div>
            <div className="text-gray-600">Fraud Attempts Blocked</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ${counts.savedAmount.toFixed(1)}M+
            </div>
            <div className="text-gray-600">Customer Savings</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {counts.accuracy.toFixed(1)}%
            </div>
            <div className="text-gray-600">Detection Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CTA section
const CTA = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Transactions?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Implement our AI-powered fraud detection system and protect your business from financial threats.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl">
            Get Started Now
          </button>
          <button className="bg-transparent border border-white hover:bg-white/10 text-white font-medium py-3 px-8 rounded-lg transition-all">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center text-white font-bold text-xl">
              <Shield className="h-6 w-6 text-blue-400 mr-2" />
              FraudShield AI
            </div>
            <p className="mt-2 text-sm">Advanced fraud detection powered by AI</p>
          </div>
          
          <div className="flex gap-8">
            <div>
              <h3 className="font-medium text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>Features</li>
                <li>Security</li>
                <li>Case Studies</li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Blog</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">© 2025 FraudShield AI. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Lock className="h-5 w-5" />
            <Globe className="h-5 w-5" />
            <Shield className="h-5 w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">FraudShield AI</span>
            </div>
            
            <div className="hidden md:flex space-x-8 text-gray-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#technology" className="hover:text-blue-600 transition-colors">Technology</a>
              <a href="#results" className="hover:text-blue-600 transition-colors">Results</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 font-medium">Log In</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Hero />
        <Features />
        <StatsCounter />
        <TechStack />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;