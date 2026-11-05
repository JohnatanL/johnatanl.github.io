import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;
export type CertificateEntry = CollectionEntry<'certificates'>;
export type EducationEntry = CollectionEntry<'education'>;
export type ProjectEvidenceItem = ProjectEntry['data']['evidences'][number];

export interface AggregatedEvidence {
  projectId: string;
  projectTitle: string;
  evidence: ProjectEvidenceItem;
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.title.localeCompare(b.data.title, 'es');
  });
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const published = await getPublishedProjects();
  const featured = published.filter((entry) => entry.data.featured);
  return featured.length > 0 ? featured : published.slice(0, 2);
}

export async function getPublishedCertificates(): Promise<CertificateEntry[]> {
  const entries = await getCollection('certificates', ({ data }) => !data.draft);
  return entries.sort((a, b) => {
    const dateA = a.data.issueDate?.getTime() ?? 0;
    const dateB = b.data.issueDate?.getTime() ?? 0;
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return a.data.title.localeCompare(b.data.title, 'es');
  });
}

export async function getPublishedEducation(): Promise<EducationEntry[]> {
  const entries = await getCollection('education', ({ data }) => !data.draft);
  return entries.sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.title.localeCompare(b.data.title, 'es');
  });
}

export async function getAllPublishedEvidences(): Promise<AggregatedEvidence[]> {
  const projects = await getPublishedProjects();
  const items: AggregatedEvidence[] = [];

  for (const project of projects) {
    for (const evidence of project.data.evidences) {
      items.push({
        projectId: project.id,
        projectTitle: project.data.title,
        evidence,
      });
    }
  }

  return items;
}

