import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // This will always 404 for now as requested
  notFound();
}
