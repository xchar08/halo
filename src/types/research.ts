/**
 * Core domain types for the Research domain.
 * Defines the shape of documents, chunks, and projects within the system.
 */

export type SourceType = 'arxiv' | 'github' | 'blog' | 'manual';
export type CitationType = 'explicit' | 'semantic' | 'refutation';

export interface Document {
  id: string;
  url: string;
  title: string | null;
  authors: string[];
  publication_date: string | null;
  source_type: SourceType;
  math_density_score: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  contains_math: boolean;
  embedding?: number[]; // Optional on client to save bandwidth
  token_count: number;
}

export interface Citation {
  source_doc_id: string;
  target_doc_id: string;
  citation_type: CitationType;
  context: string;
  weight: number;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  raw_spec: string | null;
  settings: {
    depth: 'shallow' | 'deep';
    math_mode: boolean;
  };
  created_at: string;
}
