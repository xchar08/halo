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

  // 1. Replication
  const docReplication = await replicateRxCollection({
    collection: docCollection,
    replicationIdentifier: 'sync-docs-v5',
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

        if (error) throw error;

        const docs = data.map((d: any) => ({
            id: d.id,
            title: d.title || 'Untitled',
            url: d.url || '',
            content: d.content || '',
            project_id: d.project_id || '',
            source_type: d.source_type || 'web_search',
            math_density_score: d.math_density_score || 0,
            metadata: d.metadata || {}, // Map metadata
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
  supabase.channel('table-db-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'documents' }, 
    () => docReplication.reSync())
    .subscribe();

  return { docReplication };
}
