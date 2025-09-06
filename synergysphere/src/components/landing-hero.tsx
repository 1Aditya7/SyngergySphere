"use client";

import { Button } from "@/components/ui/button";
import { Users, FolderOpen, MessageSquare, BarChart3, ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">SynergySphere</h1>
              <p className="text-muted-foreground">Team Collaboration Platform</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Collaborate Better, Build Faster
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one platform for project management, team communication, and task tracking. 
              Bring your team together and achieve your goals with SynergySphere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card p-6 rounded-lg border">
              <FolderOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Management</h3>
              <p className="text-muted-foreground">
                Organize your projects with intuitive boards, track progress, and manage deadlines effectively.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <MessageSquare className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Communication</h3>
              <p className="text-muted-foreground">
                Stay connected with threaded discussions, real-time messaging, and seamless collaboration.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your team's progress with detailed analytics and performance insights.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
