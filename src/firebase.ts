import {} from "firebase-admin/firestore";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const serviceKey = require("./serviceKey.json");

initializeApp({ credential: admin.credential.cert(serviceKey) });

export async function readFile(file: string) {
    const doc = await db.doc(file).get();
    return doc.data();
}

export let db = admin.firestore();
