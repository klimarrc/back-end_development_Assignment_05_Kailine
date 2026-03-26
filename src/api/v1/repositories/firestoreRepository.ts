
import { db } from "../../../../config/firebaseConfig";
import { Timestamp } from "firebase-admin/firestore";

const tsToIso = (v: any) => {
  if (v instanceof Timestamp) return v.toDate().toISOString();

  // handles the JSON shape { _seconds, _nanoseconds }
  if (v && typeof v === "object" && typeof v._seconds === "number") {
    const ms = v._seconds * 1000 + Math.floor((v._nanoseconds ?? 0) / 1_000_000);
    return new Date(ms).toISOString();
  }

  return v;
};

const normalizeTimestamps = <T extends Record<string, any>>(obj: T): T => {
  const copy: any = { ...obj };
  for (const k of Object.keys(copy)) {
    copy[k] = tsToIso(copy[k]);
  }
  return copy;
};
// Create a new document in a collection
export const createEventDocument = async <T>(
  collectionName: string,
  data: Partial<T>
): Promise<string> => {
  try {
    const docRef = await db.collection(collectionName).add(data);
    return docRef.id;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create document in ${collectionName}: ${errorMessage}`);
  }
};

// Get all documents in a collection.
export const getAllEventDocuments = async <T>(
  collectionName: string
): Promise<(T & { id: string })[]> => {
  try {
    const snapshot = await db.collection(collectionName).get();

    return snapshot.docs.map((doc) => ({
      ...normalizeTimestamps(doc.data() as T & Record<string, any>),
      id: doc.id,
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to retrieve all documents in ${collectionName}: ${errorMessage}`);
  }
};

// Get a single document by id.
export const getEventDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  try {
    const snapshot = await db.collection(collectionName).doc(id).get();

    if (!snapshot.exists) return null;

    return normalizeTimestamps({
      id: snapshot.id,

      ...(snapshot.data() as T),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to find the document in ${collectionName}: ${errorMessage}`);
  }
};


//Update a document by id.
export const updatePostEventDoc = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  try {
    await db.collection(collectionName).doc(id).update(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to update document in ${collectionName}: ${errorMessage}`);
  }
};

// Delete a document by id.
export const deletePostEventDoc = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    await db.collection(collectionName).doc(id).delete();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to delete document ${id} from ${collectionName}: ${errorMessage}`);
  }
};
