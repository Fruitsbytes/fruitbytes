export interface ResumeRole {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ResumeLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export interface ResumeMetadata {
  role: string;
  language: string;
  lastUpdated: string;
  version: string;
}

export interface ResumeCacheEntry {
  html: string;
  markdown: string;
  metadata: ResumeMetadata;
  cachedAt: number;
}

export interface ResumeConfig {
  roles: ResumeRole[];
  languages: ResumeLanguage[];
  defaultRole: string;
  defaultLanguage: string;
  cacheTTL: number;
  pdfOptions: PDFOptions;
}

export interface PDFOptions {
  orientation: 'portrait' | 'landscape';
  unit: 'mm' | 'pt' | 'in' | 'cm';
  format: 'a4' | 'letter' | 'legal';
  compress: boolean;
}

export interface DownloadOptions {
  role: string;
  language: string;
  format?: 'pdf' | 'html' | 'markdown';
}
