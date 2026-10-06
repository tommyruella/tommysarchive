import { redirect } from "next/navigation";
import { WORKSTATION_PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return WORKSTATION_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/?project=${slug}&details=true`);
}
