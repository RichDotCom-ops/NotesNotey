"use client";

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
// import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function LoginPage() {
  // Always start in light mode on login page
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notey-theme', 'light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add('light');
    }
  }, []);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState(''); // Mock password field
  const [rememberMe, setRememberMe] = React.useState(false);

  const { toast } = useToast();
  // Login logic: set current user and redirect
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('notey-auth', 'true');
          localStorage.setItem('notey-user', email);
          localStorage.setItem('notey-current-user', email);
          localStorage.setItem('notey-remember', 'true');
        } else {
          sessionStorage.setItem('notey-auth', 'true');
          sessionStorage.setItem('notey-user', email);
          sessionStorage.setItem('notey-current-user', email);
          localStorage.removeItem('notey-remember');
          // Remove from localStorage to avoid auto-login
          localStorage.removeItem('notey-auth');
          localStorage.removeItem('notey-user');
          localStorage.removeItem('notey-current-user');
        }
      }
      window.location.href = '/dashboard';
    } else {
      toast({ title: 'Missing Email', description: 'Please enter an email.', variant: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 p-4">
      <button
        className="absolute left-4 top-4 flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }}
        aria-label="Go back to landing page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>
      <Card className="w-full max-w-sm border-green-200 shadow-lg bg-white/90 dark:bg-zinc-900/90">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-10 w-10 text-green-700 dark:text-green-400" />
          <CardTitle className="text-2xl font-bold font-headline text-green-900 dark:text-zinc-100">Login to NoteNotey</CardTitle>
          <CardDescription className="text-green-800 dark:text-green-300">Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-green-50 text-green-900 border-green-200 focus:border-green-700 focus:ring-green-700"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-green-900">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-green-50 text-green-900 border-green-200 focus:border-green-700 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="accent-green-600 h-4 w-4 rounded border-green-300 focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="text-green-900 text-sm select-none">Remember me</label>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600 transition-colors font-semibold"
            >
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-green-800">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="underline font-semibold text-green-700 hover:text-green-900">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
