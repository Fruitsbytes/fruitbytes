export interface BlogMetadata {
  title: string;
  description: string;
  author: string;
  date: string; // ISO date format
  category: string;
  tags: string[];
  image?: string; // Path to blog image
  readTime?: number; // Read time in minutes
}

export interface BlogPost {
  id: string; // Slug/URL-friendly identifier
  metadata: BlogMetadata;
  content: string; // HTML content (parsed from markdown)
  excerpt: string; // Short excerpt for list view
}

export type BlogCategory = 'Web Development' | 'AI & ML' | 'Backend' | 'Frontend' | 'DevOps' | 'Tutorial';
