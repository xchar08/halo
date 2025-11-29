import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

addRxPlugin(RxDBUpdatePlugin);
// Only load dev-mode if not production to save bundle size
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin));
}

export type DocumentCollection = RxCollection<RxDocumentType>;
export type CitationCollection = RxCollection<RxCitationType>;
export type HaloDatabaseCollections = {
  documents: DocumentCollection;
  citations: CitationCollection;
};
export type HaloDatabase = RxDatabase<HaloDatabaseCollections>;

const DB_NAME = 'halo_research_db_v6'; 

// Use globalThis to work in both Node and Browser
declare global {
    var _haloRxDBPromise: Promise<HaloDatabase> | undefined;
}

export async function getDatabase(): Promise<HaloDatabase> {
  // 1. Check Global Cache
  if (globalThis._haloRxDBPromise) {
      return globalThis._haloRxDBPromise;
  }

  // 2. Create & Cache
  globalThis._haloRxDBPromise = _create();
  return globalThis._haloRxDBPromise;
}

async function _create(): Promise<HaloDatabase> {
  console.log("Init RxDB...");
  
  // Ensure storage is only created in browser if using Dexie
  // (Dexie requires IndexedDB which is browser-only)
  if (typeof window === 'undefined') {
      // If called on server side during build, return null or mock
      // RxDB with Dexie cannot run on Server Side Rendering (SSR)
      throw new Error("RxDB can only be initialized on the client side.");
  }

  let storage: RxStorage<any, any> = getRxStorageDexie();
  
  if (process.env.NODE_ENV === 'development') {
      storage = wrappedValidateAjvStorage({ storage });
  }

  try {
      const db = await createRxDatabase<HaloDatabaseCollections>({
        name: DB_NAME,
        storage: storage,
        multiInstance: true,
        ignoreDuplicate: true
      });

      await db.addCollections({
        documents: { schema: docSchema },
        citations: { schema: citationSchema },
      });

      return db;
  } catch (err: any) {
      console.warn("RxDB Init Failed:", err);
      throw err;
  }
}
