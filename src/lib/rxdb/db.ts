import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

addRxPlugin(RxDBUpdatePlugin);

export type DocumentCollection = RxCollection<RxDocumentType>;
export type CitationCollection = RxCollection<RxCitationType>;
export type HaloDatabaseCollections = {
  documents: DocumentCollection;
  citations: CitationCollection;
};
export type HaloDatabase = RxDatabase<HaloDatabaseCollections>;

// REMOVED GLOBAL CACHE LOGIC completely. 
// We will create a fresh DB every time this function is called.

export async function createEphemeralDatabase(): Promise<HaloDatabase> {
  if (typeof window === 'undefined') throw new Error("RxDB is client-side only");

  // Unique name every time to prevent DB9
  const uniqueName = `halo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  console.log(`Creating Ephemeral RxDB: ${uniqueName}`);

  const db = await createRxDatabase<HaloDatabaseCollections>({
    name: uniqueName,
    storage: getRxStorageDexie(),
    multiInstance: false, 
    ignoreDuplicate: true
  });

  await db.addCollections({
    documents: { schema: docSchema },
    citations: { schema: citationSchema },
  });

  return db;
}
