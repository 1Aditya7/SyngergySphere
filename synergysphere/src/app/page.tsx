"use client";

import { Button } from "@/components/ui/button";
import { Users, ArrowRight, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { SignInModal } from "@/components/signin-modal";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SynergySphere</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <SignInModal>
                  <Button size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </SignInModal>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center">
              <Users className="h-9 w-9 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">SynergySphere</h1>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Collaborate Better, Build Faster
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one platform for project management, team communication, and task tracking. 
              Bring your team together and achieve your goals with SynergySphere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <SignInModal>
                  <Button size="lg" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In to Continue
                  </Button>
                </SignInModal>
              )}
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card p-6 rounded-lg border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with real-time communication and shared workspaces.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Management</h3>
              <p className="text-muted-foreground">
                Organize your projects with intuitive boards, track progress, and manage deadlines.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Task Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your team's progress with detailed analytics and performance insights.
              </p>
            </div>
          </div>

        </div>
        </div>
    </div>
  );
}
