import { credential, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { config } from "dotenv";

config();

const serviceKey = JSON.parse(process.env.SERVICEKEYJSON ?? "{}");

initializeApp({ credential: credential.cert(serviceKey) });

export async function readFile(file: string) {
    const doc = await db.doc(file).get();
    return doc.data();
}

export let db = firestore();
