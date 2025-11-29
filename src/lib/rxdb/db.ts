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

// MODULE-LEVEL LOCK (Atomic across all calls)
let creationPromise: Promise<HaloDatabase> | null = null;

export async function createEphemeralDatabase(): Promise<HaloDatabase> {
  if (typeof window === 'undefined') throw new Error("RxDB is client-side only");

  // If a creation is already in progress, return that promise
  if (creationPromise) {
    console.log("[RxDB] Creation already in progress, reusing existing promise.");
    return creationPromise;
  }

  // Lock acquired - start creation
  const uniqueName = `halo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  console.log(`[RxDB] Creating Ephemeral DB: ${uniqueName}`);

  const setup = async (name: string) => {
      const db = await createRxDatabase<HaloDatabaseCollections>({
        name: name,
        storage: getRxStorageDexie(),
        multiInstance: false,
        ignoreDuplicate: true
      });

      await db.addCollections({
        documents: { schema: docSchema },
        citations: { schema: citationSchema },
      });

      return db;
  };

  // Create the promise and store it
  creationPromise = (async () => {
      try {
          return await setup(uniqueName);
      } catch (err: any) {
          console.error("[RxDB] Creation Failed:", err);
          console.error("[RxDB] Error Code:", err.code);
          console.error("[RxDB] Error Message:", err.message);
          
          // Retry once
          if (err.code === 'DB9') {
              console.warn("[RxDB] Retrying with new name...");
              return await setup(uniqueName + "_retry_" + Math.random().toString(36).slice(2));
          }
          throw err;
      } finally {
          // Release lock after completion (success or failure)
          creationPromise = null;
      }
  })();

  return creationPromise;
}

// Export a cleanup function for page unmount
export function destroyDatabase(db: HaloDatabase) {
    (db as any).destroy();
    creationPromise = null; // Reset lock
}
