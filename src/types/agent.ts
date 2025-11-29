export type AgentStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type ClaimVerdict = 'supported' | 'debated' | 'refuted' | 'unknown';

export interface AgentLogEntry {
  timestamp: string;
  step: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ValidatedClaim {
  claimText: string;
  verdict: ClaimVerdict;
  confidence: number;
  citations: {
    documentId: string;
    chunkId: string;
    relevanceScore: number;
    snippet: string;
  }[];
}

export interface AgentRunResult {
  projectId: string;
  status: 'success' | 'partial_failure';
  summaryMarkdown: string;
  findings: ValidatedClaim[];
  logs: AgentLogEntry[];
}

export interface ResearchState {
  // Required by LangGraph for state extensibility
  [key: string]: any;
  
  projectId: string;
  query: string;
  seedPapers: { id: string; title: string }[];
  depth: number;
  maxDepth: number;
  logs: AgentLogEntry[];
  findings: ValidatedClaim[];
}
