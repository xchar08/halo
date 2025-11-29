import { createRxDatabase, addRxPlugin, RxDatabase, RxCollection, RxStorage } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { docSchema, citationSchema, RxDocumentType, RxCitationType } from './schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

if (process.env.NODE_ENV === 'development') {
    import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => {
        addRxPlugin(RxDBDevModePlugin);
    });
}

addRxPlugin(RxDBUpdatePlugin);

export type DocumentCollection = RxCollection<RxDocumentType>;
export type CitationCollection = RxCollection<RxCitationType>;

export type HaloDatabaseCollections = {
  documents: DocumentCollection;
  citations: CitationCollection;
};

export type HaloDatabase = RxDatabase<HaloDatabaseCollections>;

const globalForRxDB = global as unknown as { rxdb: HaloDatabase | undefined };

export async function getDatabase(): Promise<HaloDatabase> {
  if (globalForRxDB.rxdb) return globalForRxDB.rxdb;

  if (!(global as any)._rxdbCreationPromise) {
      (global as any)._rxdbCreationPromise = _create();
  }
  
  return (global as any)._rxdbCreationPromise;
}

async function _create(): Promise<HaloDatabase> {
  console.log("Creating RxDB...");

  let storage: RxStorage<any, any> = getRxStorageDexie();
  
  if (process.env.NODE_ENV === 'development') {
      storage = wrappedValidateAjvStorage({ storage });
  }
  
  const db = await createRxDatabase<HaloDatabaseCollections>({
    name: 'halo_research_db_v2', // UPDATED: Bump version to fix DB9 schema errors
    storage: storage,
    ignoreDuplicate: true,
  });

  await db.addCollections({
    documents: { schema: docSchema },
    citations: { schema: citationSchema },
  });

  globalForRxDB.rxdb = db;
  return db;
}
