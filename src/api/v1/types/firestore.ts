import { FieldValue, Timestamp } from "firebase-admin/firestore";

export type FirestoreDataTypes = 
    | string
    | number
    | boolean
    | null
    | Date
    | Timestamp
    | FieldValue;