import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb'; // Removed getRxDatabase
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// Plugins
addRxPlugin(RxDBUpdatePlugin);
if (process.env.NODE_ENV === 'development') {
    import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin));
}

export type DocumentCollection = RxCollection<RxDocumentType>;
export type CitationCollection = RxCollection<RxCitationType>;
export type HaloDatabaseCollections = {
  documents: DocumentCollection;
  citations: CitationCollection;
};
export type HaloDatabase = RxDatabase<HaloDatabaseCollections>;

// DATABASE NAME
const DB_NAME = 'halo_research_db_v3'; 

// SINGLETON HOLDER
let dbPromise: Promise<HaloDatabase> | null = null;

export async function getDatabase(): Promise<HaloDatabase> {
  if (dbPromise) return dbPromise;

  // Start creation
  dbPromise = _create();
  return dbPromise;
}

async function _create(): Promise<HaloDatabase> {
  console.log("Init RxDB...");

  let storage: RxStorage<any, any> = getRxStorageDexie();
  if (process.env.NODE_ENV === 'development') {
      storage = wrappedValidateAjvStorage({ storage });
  }

  const db = await createRxDatabase<HaloDatabaseCollections>({
    name: DB_NAME,
    storage: storage,
    ignoreDuplicate: true, // Important for React StrictMode
    multiInstance: true,   // Important for multiple tabs
  });

  await db.addCollections({
    documents: { schema: docSchema },
    citations: { schema: citationSchema },
  });

  return db;
}
