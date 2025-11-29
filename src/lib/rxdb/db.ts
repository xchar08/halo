import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// Enable Plugins
addRxPlugin(RxDBUpdatePlugin);
if (process.env.NODE_ENV === 'development') {
    import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => {
        addRxPlugin(RxDBDevModePlugin);
    });
}

// Types
export type DocumentCollection = RxCollection<RxDocumentType>;
export type CitationCollection = RxCollection<RxCitationType>;
export type HaloDatabaseCollections = {
  documents: DocumentCollection;
  citations: CitationCollection;
};
export type HaloDatabase = RxDatabase<HaloDatabaseCollections>;

// Versioned Name to force reset on new deploys
const DB_NAME = 'halo_research_db_v5'; 

// Global Singleton for Client Side (prevents DB9 race condition)
declare global {
    interface Window {
        _haloRxDBPromise: Promise<HaloDatabase> | undefined;
    }
}

export async function getDatabase(): Promise<HaloDatabase> {
  // 1. Check Window Cache (Browser)
  if (typeof window !== 'undefined' && window._haloRxDBPromise) {
      return window._haloRxDBPromise;
  }

  // 2. Check Node Global Cache (Dev Server)
  if (!(global as any)._rxdbCreationPromise) {
      (global as any)._rxdbCreationPromise = _create();
  }
  
  // 3. Assign to Window for future calls
  const promise = (global as any)._rxdbCreationPromise;
  if (typeof window !== 'undefined') {
      window._haloRxDBPromise = promise;
  }

  return promise;
}

async function _create(): Promise<HaloDatabase> {
  console.log("Initializing RxDB Instance...");

  let storage: RxStorage<any, any> = getRxStorageDexie();
  if (process.env.NODE_ENV === 'development') {
      storage = wrappedValidateAjvStorage({ storage });
  }

  try {
      // Create Database
      const db = await createRxDatabase<HaloDatabaseCollections>({
        name: DB_NAME,
        storage: storage,
        multiInstance: true, // Critical for tab syncing
        ignoreDuplicate: true // Suppress creation errors if race occurs
      });

      // Create Collections
      await db.addCollections({
        documents: { schema: docSchema },
        citations: { schema: citationSchema },
      });

      return db;

  } catch (err: any) {
      console.warn("RxDB Init Warning (Recoverable):", err.message);
      // If it failed because it exists, we might ideally return the existing one
      // But 'ignoreDuplicate: true' usually handles this.
      throw err; 
  }
}
