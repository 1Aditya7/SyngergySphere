"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {project.name}
          </CardTitle>
          <Badge 
            variant={project.progress === 100 ? "default" : "secondary"}
            className="ml-2 flex-shrink-0"
          >
            {project.progress}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        
        {/* Team Members */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  +{project.teamMembers.length - 4}
                </span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground">
            {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
