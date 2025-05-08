import { 
    ArrowRight, 
    Shield, 
    Zap, 
    Lock, 
    BarChart3, 
    Fingerprint, 
    Globe, 
    Clock, 
    RefreshCcw, 
    ToggleLeft, 
    Network, 
    AlertTriangle, 
    Wallet, 
    LineChart, 
    Settings, 
    Users
  } from "lucide-react";
  import { useState } from "react";
  import hero from "./hero.jpg"
  
  function Check(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  
  export default function HomePage() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        
  
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-24 md:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="flex flex-col gap-6">
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <Zap className="mr-1 h-3.5 w-3.5" />
                    Next-Gen Fraud Detection
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Protect Your Transactions with
                    <span className="text-blue-600 dark:text-blue-400"> AI-Powered </span>
                    Intelligence
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                    FraudGuard combines advanced AI models with real-time monitoring to detect and prevent fraudulent transactions before they happen.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a 
                      href="/login" 
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-medium transition-colors hover:bg-blue-700"
                    >
                      Request Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    <a 
                      href="/docs" 
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 font-medium transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
                    >
                      Learn More
                    </a>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                      <div className="h-8 w-8 rounded-full bg-slate-300"></div>
                      <div className="h-8 w-8 rounded-full bg-slate-400"></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                    </p>
                  </div>
                </div>
                <div className="relative mx-auto lg:mx-0">
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                    <div className="aspect-[16/9] overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!isVideoPlaying ? (
                          <div 
                            className="flex items-center justify-center cursor-pointer"
                            onClick={() => setIsVideoPlaying(true)}
                          >
                            <div className="rounded-full bg-blue-600 p-4 shadow-lg">
                              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            
                          </div>
                        ) : (
                          <img className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500" src={hero}></img>
                            
                                                  )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="ml-2 text-sm font-medium">Live Demo Dashboard</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-600/20 blur-xl"></div>
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-600/20 blur-xl"></div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Key Features Section */}
          <section id="features" className="py-20 bg-white dark:bg-slate-950">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Shield className="mr-1 h-3.5 w-3.5" />
                  Advanced Protection
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Comprehensive Fraud Detection Features
                </h2>
                <p className="max-w-[800px] text-slate-600 dark:text-slate-400 md:text-lg">
                  Our all-in-one platform provides multiple layers of protection to keep your transactions secure
                </p>
              </div>
  
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">AI-Based Fraud Detection</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Advanced machine learning algorithms identify suspicious patterns and flag potential fraud in real-time.
                  </p>
                </div>
  
                {/* Feature 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900">
                    <LineChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">XGBoost Lightweight Model</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Our optimized model delivers high accuracy fraud detection while minimizing computational resources.
                  </p>
                </div>
  
                {/* Feature 3 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900">
                    <RefreshCcw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Model Retraining & Switching</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Easily retrain your model or switch between models with a single click to adapt to evolving fraud patterns.
                  </p>
                </div>
  
                {/* Feature 4 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900">
                    <Network className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Graph-Based Anomaly Detection</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Identify suspicious patterns across IP, device, location, and time data using advanced graph algorithms.
                  </p>
                </div>
  
                {/* Feature 5 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Unusual Transaction Detection</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    AI-powered analysis flags unusual transactions based on historical patterns and user behavior.
                  </p>
                </div>
  
                {/* Feature 6 */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900">
                    <Wallet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Lightweight Test Wallet</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Built-in wallet for testing fraud detection capabilities in a controlled environment.
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          {/* Technology Section */}
          <section id="technology" className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <Zap className="mr-1 h-3.5 w-3.5" />
                    Advanced Technology
                  </div>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Powered by Cutting-Edge AI Technology
                  </h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 md:text-lg">
                    Our fraud detection system utilizes state-of-the-art machine learning models and algorithms to provide the most accurate and reliable protection available.
                  </p>
                  
                  <div className="mt-8 grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">XGBoost Model Architecture</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Optimized for both speed and accuracy, providing real-time fraud detection with minimal resources.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Graph Neural Networks</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Advanced relationship modeling to detect coordinated fraud attempts across multiple accounts or devices.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Continuous Learning</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Models adapt to new threats with automated retraining capabilities that incorporate the latest fraud patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-6 w-full">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium">Model Performance</h4>
                            
                          </div>
                          <div className="h-48 w-full bg-slate-50 dark:bg-slate-800 rounded-md flex items-center justify-center">
                            {/* Placeholder for chart */}
                            <div className="flex flex-col items-center gap-2">
                              <BarChart3 className="h-10 w-10 text-blue-600/50 dark:text-blue-400/50" />
                              <span className="text-sm text-slate-500">Performance metrics visualization</span>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                              <div className="text-xs text-slate-600 dark:text-slate-400">Accuracy</div>
                              <div className="text-lg font-medium">99.4%</div>
                            </div>
                            <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                              <div className="text-xs text-slate-600 dark:text-slate-400">R^2 Score</div>
                              <div className="text-lg font-medium">0.9971226008723858</div>
                            </div>
                            <div className="rounded-md bg-purple-50 p-2 dark:bg-purple-900/20">
                              <div className="text-xs text-slate-600 dark:text-slate-400">RMS</div>
                              <div className="text-lg font-medium"> 0.6090815126943504</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-600/20 blur-xl"></div>
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-600/20 blur-xl"></div>
                </div>
              </div>
            </div>
          </section>
  
          {/* How It Works Section */}
          <section id="demo" className="py-20 bg-white dark:bg-slate-950">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Lock className="mr-1 h-3.5 w-3.5" />
                  System Workflow
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  How FraudGuard Works
                </h2>
                <p className="max-w-[800px] text-slate-600 dark:text-slate-400 md:text-lg">
                  Our multi-layered approach provides comprehensive protection at every step of the transaction process
                </p>
              </div>
  
              <div className="mt-16 grid gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Fingerprint className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      1
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">Data Collection</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    System collects transaction data, device fingerprinting, IP information, and user behavior patterns.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      2
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">Real-time Analysis</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    XGBoost model analyzes the data in milliseconds to identify potential fraud signals.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <Network className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      3
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">Graph Analysis</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Connection patterns between users, locations, and devices are mapped to detect coordinated fraud.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                      <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      4
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">Action & Protection</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    System automatically blocks suspicious transactions and alerts administrators for review.
                  </p>
                </div>
              </div>
  
              <div className="mt-16">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-2">
                      <h3 className="text-xl font-bold">Test Our Fraud Detection System</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Experience FraudGuard's capabilities with our interactive demo wallet. Simulate transactions and see how our system identifies suspicious activities in real-time.
                      </p>
                      <div className="mt-4">
                        <a 
                          href="/demo-wallet" 
                          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          Try Demo Wallet
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Wallet className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Admin Dashboard Section */}
          <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="order-2 lg:order-1">
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                    <div className="p-1">
                      <div className="flex items-center gap-2 border-b p-2">
                        <div className="flex space-x-1">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Admin Dashboard</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-2">
                        <div className="col-span-1 flex flex-col gap-1">
                          <div className="rounded bg-slate-100 p-2 dark:bg-slate-800">
                            <div className="text-xs font-medium">Navigation</div>
                            <div className="mt-2 space-y-1">
                              <div className="rounded bg-blue-50 p-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">Dashboard</div>
                              <div className="rounded p-1 text-xs">Transactions</div>
                              <div className="rounded p-1 text-xs">Analytics</div>
                              <div className="rounded p-1 text-xs">Models</div>
                              <div className="rounded p-1 text-xs">Settings</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 rounded bg-slate-100 p-2 dark:bg-slate-800">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium">Fraud Overview</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Today</div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            <div className="rounded bg-white p-2 dark:bg-slate-900">
                              <div className="text-xs text-slate-600 dark:text-slate-400">Transactions</div>
                              <div className="text-lg font-medium">8,942</div>
                            </div>
                            <div className="rounded bg-white p-2 dark:bg-slate-900">
                              <div className="text-xs text-slate-600 dark:text-slate-400">Blocked</div>
                              <div className="text-lg font-medium text-red-600">24</div>
                            </div>
                          </div>
                          <div className="mt-2 h-24 rounded bg-white dark:bg-slate-900">
                            <div className="flex h-full items-center justify-center">
                              <BarChart3 className="h-12 w-12 text-slate-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <Settings className="mr-1 h-3.5 w-3.5" />
                    Admin Features
                  </div>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Comprehensive Management Dashboard
                  </h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 md:text-lg">
                    Our powerful admin interface provides complete control and visibility over your fraud detection system.
                  </p>
                  
                  <div className="mt-8 grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Model Configuration</h3>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                          Fine-tune detection algorithms and switch between models with a single click.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                        <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Real-time Analytics</h3>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                          Monitor system performance and transaction patterns with comprehensive dashboards.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Alert Management</h3>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                          Review and respond to fraud alerts with customizable workflows and notification settings.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <a 
                      href="/admin" 
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-medium transition-colors hover:bg-blue-700"
                    >
                      Explore Admin Features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    </div>
                </div>
              </div>
            </div>
          </section>
  
        
                
              
          
          {/* CTA Section */}
          <section className="py-20 bg-blue-600 text-white">
            <div className="container px-4 md:px-6">
              <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to Protect Your Business?
                  </h2>
                  <p className="mt-4 text-blue-100 md:text-lg">
                    Join hundreds of businesses that trust FraudGuard to secure their transactions and protect their customers.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <a 
                      href="/signup" 
                      className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-blue-600 font-medium transition-colors hover:bg-blue-50"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    <a 
                      href="/demo" 
                      className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-white font-medium transition-colors hover:bg-blue-700"
                    >
                      Request Demo
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <Users className="h-10 w-10 text-blue-100" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <Shield className="h-10 w-10 text-blue-100" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <BarChart3 className="h-10 w-10 text-blue-100" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <Globe className="h-10 w-10 text-blue-100" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <Zap className="h-10 w-10 text-blue-100" />
                    </div>
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500">
                      <Lock className="h-10 w-10 text-blue-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
  
        {/* Footer */}
        <footer className="border-t bg-white dark:bg-slate-950 dark:border-slate-800">
          <div className="container px-4 py-12 md:px-6">
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold">FraudGuard</span>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                  Advanced AI-powered fraud detection to protect your business and customers from evolving threats.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">Product</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Features</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Pricing</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Demo</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Resources</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Documentation</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Guides</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Blog</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">About</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Careers</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Contact</a></li>
                  <li><a className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" href="#">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t pt-6 dark:border-slate-800">
              <p className="text-center text-xs text-slate-600 dark:text-slate-400">
                © 2025 FraudGuard. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
     
 

