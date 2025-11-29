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

// NUCLEAR FIX: Randomize DB name on every load
// This guarantees no "Version Mismatch" or "DB Locked" errors.
const DB_NAME = `halo_db_${Math.random().toString(36).substring(7)}`; 

// Global Cache
declare global {
    var _haloRxDBPromise: Promise<HaloDatabase> | undefined;
}

export async function getDatabase(): Promise<HaloDatabase> {
  if (typeof window === 'undefined') throw new Error("RxDB is client-side only");

  if (globalThis._haloRxDBPromise) {
      return globalThis._haloRxDBPromise;
  }

  globalThis._haloRxDBPromise = _create();
  return globalThis._haloRxDBPromise;
}

async function _create(): Promise<HaloDatabase> {
  console.log(`Init RxDB (${DB_NAME})...`);

  const db = await createRxDatabase<HaloDatabaseCollections>({
    name: DB_NAME,
    storage: getRxStorageDexie(),
    multiInstance: false, // No sharing needed for ephemeral DB
    ignoreDuplicate: true
  });

  await db.addCollections({
    documents: { schema: docSchema },
    citations: { schema: citationSchema },
  });

  return db;
}
