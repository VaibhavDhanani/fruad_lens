import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Secure Your Digital Assets with AI-Powered Protection
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Get 100 free coins when you sign up today. Send, receive, and manage your digital currency with
                    confidence.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/signup">
                    <Button size="lg" className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-full bg-gradient-to-b from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="h-32 w-32 text-primary" />
                  </div>
                  <div className="absolute -right-4 top-1/4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div className="absolute -left-4 bottom-1/4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                    <Lock className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features That Set Us Apart
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Experience the future of digital wallets with our cutting-edge features
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Fast Transactions</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Send and receive coins instantly with our lightning-fast transaction system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Fraud Detection</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our advanced AI algorithms detect and prevent suspicious activities in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Secure Payments</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  End-to-end encryption ensures your transactions and data remain private and secure.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SecureWallet</span>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-left">
            © 2025 SecureWallet. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-sm text-gray-500 underline dark:text-gray-400">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 underline dark:text-gray-400">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
