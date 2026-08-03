export interface DocumentMetadata {
  doc_id: string;
  title: string;
  audience: 'student' | 'faculty' | 'staff' | 'all';
  department: string;
  language: string;
  source_url: string;
  retrieved_at: string;
  document_version: string;
  [key: string]: any;
}

export interface RawDocument {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
}

export interface ChunkRecord {
  id: string;
  doc_id: string;
  chunk_index: number;
  content: string;
  metadata: DocumentMetadata;
  embedding?: number[];
  score?: number;
}

export interface TriplesRecord {
  id: string;
  subject: string;
  relation: string;
  object: string;
  source_doc: string;
  confidence: number;
}

export interface BenchmarkQuery {
  id: number;
  query: string;
  gold_answer: string;
  gold_doc_id: string;
  gold_substring: string;
  metadata_filter?: Record<string, string>;
}

export type ChunkingStrategyType = 'fixed_size' | 'by_sentences' | 'recursive';
