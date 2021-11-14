import { credential, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { config } from "dotenv";

config();

const serviceKeyJSON = JSON.parse(process.env.SERVICEKEYJSON ?? "{}");
serviceKeyJSON.private_key = serviceKeyJSON.private_key.replace(/\\n/g, "\n");

initializeApp({
    credential: credential.cert(serviceKeyJSON),
});

export async function readFile(file: string) {
    const doc = await db.doc(file).get();
    return doc.data();
}

export let db = firestore();
