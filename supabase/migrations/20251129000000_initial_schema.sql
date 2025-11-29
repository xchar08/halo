-- Enable pgvector for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- USERS: Public profile table linked to Auth
CREATE TABLE users (
    userId UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    displayName TEXT,
    research_tier VARCHAR(20) DEFAULT 'standard' CHECK (research_tier IN ('standard', 'lab', 'enterprise')),
    daily_agent_quota INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS: Workspaces for specific R&D goals
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL, -- Maps to auth.users(id)
    name TEXT NOT NULL,
    description TEXT,
    raw_spec TEXT, 
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOCUMENTS: The atomic unit of source material
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    url TEXT,
    title TEXT,
    content TEXT,
    authors TEXT[],
    publication_date DATE,
    source_type VARCHAR(20) CHECK (source_type IN ('arxiv', 'github', 'blog', 'manual', 'web_search')),
    math_density_score FLOAT DEFAULT 0.0,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHUNKS: The searchable content (Text + Equations)
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT,
    content TEXT NOT NULL,
    contains_math BOOLEAN DEFAULT FALSE,
    embedding VECTOR(1536), 
    token_count INT
);

-- CITATIONS: The Graph Edges
CREATE TABLE citations (
    source_doc_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    target_doc_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    citation_type VARCHAR(20) CHECK (citation_type IN ('explicit', 'semantic', 'refutation')),
    context TEXT, 
    weight FLOAT DEFAULT 1.0,
    PRIMARY KEY (source_doc_id, target_doc_id)
);

-- AGENT LOGS: Realtime feedback
CREATE TABLE agent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    step TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VALIDATION_REPORTS: Final outputs
CREATE TABLE validation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    summary_markdown TEXT,
    claim_map JSONB, 
    agent_logs JSONB[], 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_citations_source ON citations(source_doc_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_agent_logs_project_id ON agent_logs(project_id);
CREATE INDEX idx_projects_owner ON projects(owner_id);

-- SECURITY (ROW LEVEL SECURITY)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- 1. Projects: Users can only access projects they own
CREATE POLICY "Users can manage own projects" ON projects
    FOR ALL USING (auth.uid() = owner_id);

-- 2. Documents: Access if user owns the parent project
CREATE POLICY "Users can view own documents" ON documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = documents.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- 3. Reports: Access if user owns the parent project
CREATE POLICY "Users can view own reports" ON validation_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = validation_reports.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- 4. Logs: Access if user owns the parent project
CREATE POLICY "Users can view own logs" ON agent_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = agent_logs.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- 5. Users: Users can read/update their own profile
CREATE POLICY "Users can manage own profile" ON users
    FOR ALL USING (auth.uid() = "userId");

-- 6. Citations: Public read (Simplified for graph performance)
-- OR strictly linked via document ownership (more secure but complex)
CREATE POLICY "Users can read citations" ON citations
    FOR SELECT USING (true);
CREATE POLICY "Users can insert citations" ON citations
    FOR INSERT WITH CHECK (true);

-- REALTIME SETUP
-- Add tables to the publication so the frontend listeners work
ALTER PUBLICATION supabase_realtime ADD TABLE agent_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE validation_reports;
