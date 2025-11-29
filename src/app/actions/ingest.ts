"use server";

import { createClient } from "@/lib/supabase/server";
import { nebius, generateEmbedding } from "@/lib/nebius";
import { firecrawl } from "@/lib/firecrawl";
import { Document } from "@/types/research";

export async function ingestUrl(url: string, sourceType: Document['source_type']) {
    const supabase = await createClient();
    
    // 1. Create Document Entry
    const { data: doc, error: docError } = await supabase.from('documents').insert({
        url,
        source_type: sourceType,
        title: 'Processing...',
        math_density_score: 0
    }).select().single();

    if (docError) throw new Error(docError.message);

    try {
        // 2. Scrape Content (Firecrawl)
        console.log(`Scraping ${url}...`);
        const scraped = await firecrawl.scrape(url, { formats: ['markdown'] });
        
        if (!scraped.markdown) throw new Error("No markdown content found");

        // 3. Simple Chunking Strategy
        // Split by double newlines (paragraphs)
        const rawChunks = scraped.markdown.split(/\n\n+/).filter(c => c.length > 50);
        
        console.log(`Generated ${rawChunks.length} chunks. Embedding...`);

        // 4. Process Chunks & Embed (Nebius)
        const chunksToInsert = [];
        // Limit to first 20 chunks for MVP to prevent timeouts/costs
        const slicedChunks = rawChunks.slice(0, 20);
        
        // FIX: Use standard for loop instead of .entries() to avoid Iterator issues
        for (let index = 0; index < slicedChunks.length; index++) {
            const content = slicedChunks[index];
            const embedding = await generateEmbedding(content);
            
            // Detect Math (Heuristic: looks for LaTeX patterns)
            const containsMath = content.includes('$') || content.includes('\\begin');

            chunksToInsert.push({
                document_id: doc.id,
                chunk_index: index,
                content,
                contains_math: containsMath,
                embedding,
                token_count: Math.ceil(content.length / 4)
            });
        }

        // 5. Save Chunks to Vector Store
        if (chunksToInsert.length > 0) {
            const { error: chunkError } = await supabase
                .from('document_chunks')
                .insert(chunksToInsert);

            if (chunkError) throw chunkError;
        }

        // 6. Update Document Metadata
        await supabase.from('documents').update({
            title: scraped.metadata?.title || 'Untitled Document',
            math_density_score: chunksToInsert.length > 0 
                ? chunksToInsert.filter(c => c.contains_math).length / chunksToInsert.length
                : 0
        }).eq('id', doc.id);

        return { success: true, documentId: doc.id, chunks: chunksToInsert.length };

    } catch (error: any) {
        console.error("Ingestion Failed:", error);
        // Cleanup on fail
        await supabase.from('documents').delete().eq('id', doc.id);
        throw new Error(error.message || "Ingestion failed");
    }
}
