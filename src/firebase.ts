import { credential, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { config } from "dotenv";

config();

const projectId = process.env.PROJECT_ID;
const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
    : "";

initializeApp({
    credential: credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
    }),
});

export async function readFile(file: string) {
    const doc = await db.doc(file).get();
    return doc.data();
}

export let db = firestore();
