"use client";

import {
  BookOpenCheck,
  CalendarRange,
  Donut,
  FileText,
  Palette,
  Sparkles,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NoteyIcon } from "@/components/NoteyIcon";
import React from 'react';

export default function LandingPage() {
  const router = useRouter();

  // Auto-login if remembered
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const remember = localStorage.getItem('notey-remember');
      const auth = localStorage.getItem('notey-auth');
      if (remember === 'true' && auth === 'true') {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  // Handler for Get Started button
  const handleGetStarted = () => {
    router.push('/signup');
  };

  // Animated gradient colors for NoteyIcon
  const [gradientIndex, setGradientIndex] = React.useState(0);
  const gradients: [string, string][] = [
    ["#ec4899", "#f59e42"], // pink to yellow
    ["#6366f1", "#f472b6"], // indigo to pink
    ["#10b981", "#f59e42"], // green to yellow
    ["#f59e42", "#6366f1"], // yellow to indigo
  ];
  React.useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((i) => (i + 1) % gradients.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [gradients.length]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-zinc-900/95 px-4 backdrop-blur-sm md:px-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7 bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text" />
          <h1 className="text-2xl font-bold font-headline tracking-tight bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
            NoteNotey
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGetStarted}
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-yellow-500 px-4 py-2 text-sm font-medium text-white hover:from-pink-600 hover:to-yellow-600 transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Side: Text and CTA */}
              <div className="space-y-6 text-left">
                <h1 className="font-headline text-4xl font-bold tracking-tighter bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Stop Quitting.<br />
                  Start Achieving.
                </h1>
                <p className="max-w-[700px] text-green-200 md:text-xl">
                  NoteNotey helps you turn scattered thoughts into structured success. Log daily achievements, set clear goals, and watch your progress soar with AI-powered insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white hover:from-pink-600 hover:to-yellow-600 transition-colors shadow-lg"
                  >
                    Get Started for Free
                  </button>
                  <a href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-green-300 bg-transparent px-6 py-3 text-lg font-semibold text-green-100 hover:bg-green-900/10 transition-colors">Learn More</a>
                </div>
              </div>
              {/* Right Side: Notey SVG Icon */}
              <div className="flex justify-center items-center">
                <div className="w-full flex flex-col items-center justify-center">
                  <NoteyIcon size={260} className="drop-shadow-2xl transition-all duration-700" style={{ transition: 'filter 0.7s', filter: `drop-shadow(0 0 40px ${gradients[gradientIndex][0]})` }} gradientColors={gradients[gradientIndex]} />
                  <span className="mt-4 text-lg font-semibold text-green-200">Your notes, your journey.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-zinc-800/80 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-yellow-500 px-3 py-1 text-sm font-bold bg-clip-text text-transparent">
                Key Features
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                Your Personal Productivity Hub
              </h2>
              <p className="max-w-[900px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NoteNotey is packed with features to help you stay organized,
                focused, and motivated on your journey to success.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card: Daily Log */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-pink-500/30 to-yellow-400/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpenCheck className="h-10 w-10 text-pink-400 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">Daily Log</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Record accomplishments and tasks in a simple, visual daily log.
                </p>
              </div>
              {/* Feature Card: Weekly Summary */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-yellow-400/30 to-green-400/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <CalendarRange className="h-10 w-10 text-yellow-300 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">Weekly Summary</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Automatically get a high-level summary of your weekly progress.
                </p>
              </div>
              {/* Feature Card: AI Task Suggestions */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-green-400/30 to-pink-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="h-10 w-10 text-green-300 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">AI Task Suggestions</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Let our AI suggest relevant tasks for the next day based on your logs.
                </p>
              </div>
              {/* Feature Card: Goal Setting */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-pink-500/30 to-green-400/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-10 w-10 text-green-300 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">Goal Setting</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Set weekly and monthly goals to keep yourself on track.
                </p>
              </div>
              {/* Feature Card: Progress Visualization */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-yellow-400/30 to-pink-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Donut className="h-10 w-10 text-yellow-300 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">Progress Visualization</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Visualize your progress towards your goals with clear indicators.
                </p>
              </div>
              {/* Feature Card: Theme Customization */}
              <div className="group flex flex-col items-center p-8 text-center rounded-3xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 shadow-xl backdrop-blur-md border border-zinc-800 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
                <div className="mb-5 rounded-full bg-gradient-to-tr from-green-400/30 to-yellow-400/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Palette className="h-10 w-10 text-green-200 drop-shadow-lg" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-white tracking-tight">Theme Customization</h3>
                <p className="text-base text-green-100/90 font-medium">
                  Switch between light and dark modes for your comfort.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center border-t border-zinc-800 p-4 bg-zinc-900">
        <p className="text-xs bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
          &copy; 2024 NoteNotey. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
