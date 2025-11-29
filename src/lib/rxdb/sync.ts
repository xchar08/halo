import { replicateRxCollection } from 'rxdb/plugins/replication';
import { RxCollection } from 'rxdb';
import { createClient } from '@/lib/supabase/client';
import { RxDocumentType, RxCitationType } from './schema';

const supabase = createClient();

export async function startSync(
  docCollection: RxCollection<RxDocumentType>,
  citCollection: RxCollection<RxCitationType>
) {
  console.log("Initializing Sync...");

  // --- DEBUG: MANUAL JUMP START ---
  // Fetch latest docs immediately to bypass replication lag/issues
  const { data: debugData, error: debugError } = await supabase
    .from('documents')
    .select('*')
    .limit(20);
  
  console.log("DEBUG MANUAL SUPABASE FETCH:", { count: debugData?.length, error: debugError });

  if (debugData && debugData.length > 0) {
      try {
          const docsToUpsert = debugData.map((d: any) => ({
              id: d.id,
              title: d.title || 'Untitled',
              url: d.url || '',
              content: d.content || '',
              project_id: d.project_id || '',
              source_type: d.source_type || 'web_search',
              math_density_score: d.math_density_score || 0,
              updated_at: d.created_at, 
              // RxDB meta fields required for local ops
              _deleted: false, 
              _attachments: {} 
          }));
          
          await docCollection.bulkUpsert(docsToUpsert);
          console.log(`DEBUG: Manually upserted ${docsToUpsert.length} docs into RxDB`);
      } catch(e) {
          console.error("DEBUG: Manual Upsert failed (Schema Mismatch?)", e);
      }
  }
  // --------------------------------

  // 1. Documents Replication (Long-term sync)
  const docReplication = await replicateRxCollection({
    collection: docCollection,
    replicationIdentifier: 'sync-docs-v4-manual-fix', // Bumped version again
    live: true,
    retryTime: 5000,
    pull: {
      async handler(lastCheckpoint: any, batchSize) {
        const minDate = lastCheckpoint ? lastCheckpoint.updated_at : new Date(0).toISOString();

        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .gt('created_at', minDate)
          .order('created_at', { ascending: true })
          .limit(batchSize);

        if (error) {
            console.error("Sync Error:", error);
            throw error;
        }

        const docs = data.map((d: any) => ({
            id: d.id,
            title: d.title || 'Untitled',
            url: d.url || '',
            content: d.content || '',
            project_id: d.project_id || '',
            source_type: d.source_type || 'web_search',
            math_density_score: d.math_density_score || 0,
            updated_at: d.created_at, 
            _deleted: false, 
            _attachments: {} 
        }));

        return {
          documents: docs,
          checkpoint: docs.length > 0 ? { updated_at: docs[docs.length - 1].updated_at } : lastCheckpoint
        };
      }
    }
  });

  // 2. Realtime Trigger
  supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'documents',
      },
      (payload) => {
        console.log('Realtime INSERT received:', payload.new);
        docReplication.reSync(); 
      }
    )
    .subscribe();

  return { docReplication };
}
