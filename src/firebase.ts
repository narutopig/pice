import { credential, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const serviceKey = require("./serviceKey.json");

initializeApp({ credential: credential.cert(serviceKey) });

export async function readFile(file: string) {
    const doc = await db.doc(file).get();
    return doc.data();
}

export let db = firestore();
