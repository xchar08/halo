import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

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

// NAME
const DB_NAME = 'halo_research_db_v4'; // Bump again to be safe

// GLOBAL WINDOW TYPE
declare global {
    interface Window {
        _haloRxDBPromise: Promise<HaloDatabase> | undefined;
    }
}

export async function getDatabase(): Promise<HaloDatabase> {
  // 1. Check Window Global (True Singleton)
  if (typeof window !== 'undefined' && window._haloRxDBPromise) {
      return window._haloRxDBPromise;
  }

  // 2. Create if missing
  const promise = _create();
  
  // 3. Attach to Window immediately
  if (typeof window !== 'undefined') {
      window._haloRxDBPromise = promise;
  }
  
  return promise;
}

async function _create(): Promise<HaloDatabase> {
  console.log("Creating RxDB Instance...");

  let storage: RxStorage<any, any> = getRxStorageDexie();
  if (process.env.NODE_ENV === 'development') {
      storage = wrappedValidateAjvStorage({ storage });
  }

  const db = await createRxDatabase<HaloDatabaseCollections>({
    name: DB_NAME,
    storage: storage,
    ignoreDuplicate: true, 
    multiInstance: true,   
  });

  await db.addCollections({
    documents: { schema: docSchema },
    citations: { schema: citationSchema },
  });

  return db;
}
