"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateProjectData } from "@/types/project";
import { Plus } from "lucide-react";

interface NewProjectModalProps {
  onCreateProject: (data: CreateProjectData) => void;
}

export function NewProjectModal({ onCreateProject }: NewProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateProjectData>({
    name: "",
    description: "",
    teamMemberEmails: [],
  });
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onCreateProject(formData);
    setFormData({ name: "", description: "", teamMemberEmails: [] });
    setEmailInput("");
    setOpen(false);
  };

  const addEmail = () => {
    if (emailInput.trim() && !formData.teamMemberEmails.includes(emailInput.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMemberEmails: [...prev.teamMemberEmails, emailInput.trim()]
      }));
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      teamMemberEmails: prev.teamMemberEmails.filter(e => e !== email)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new project and invite team members to collaborate.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name *
            </label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Brief project description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="emails" className="text-sm font-medium">
              Team Members
            </label>
            <div className="flex gap-2">
              <Input
                id="emails"
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" onClick={addEmail}>
                Add
              </Button>
            </div>
            
            {formData.teamMemberEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.teamMemberEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
