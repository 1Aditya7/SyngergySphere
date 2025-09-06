# SynergySphere - Projects Dashboard

A team collaboration platform for managing projects, tasks, and team communication.

## What it does

This is the projects dashboard where users can:
- View all their projects in a grid layout
- See project progress and team members
- Create new projects with team member invitations
- Search and filter projects
- Track project statistics

## How to run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Features

### Project Cards
- Project name and description
- Progress bar showing completion percentage
- Team member avatars with initials
- Click to open project details

### New Project Modal
- Create projects with name and description
- Add team members by email
- Form validation

### Dashboard
- Statistics showing total projects, team members, completed projects
- Search bar to find projects
- Responsive grid layout (1 column on mobile, up to 4 on desktop)

## Tech Stack

- Next.js 15 with React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

## API Endpoints

- GET /api/projects - List all projects
- POST /api/projects - Create new project
- GET /api/projects/:id/progress - Get project progress

## Project Structure

```
src/
├── app/
│   ├── api/projects/          # API routes
│   ├── page.tsx              # Main dashboard
│   └── layout.tsx            # App layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── project-card.tsx      # Project card component
│   └── new-project-modal.tsx # New project form
├── types/
│   └── project.ts            # TypeScript interfaces
└── lib/
    └── utils.ts              # Utility functions
```

## Current Status

- Uses mock data for demonstration
- Ready for database integration
- Fully responsive design
- All core features implemented