import admin from "firebase-admin";

var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminFb = admin.firestore();
const adminDb = admin.firestore();
const adminFbAuth = admin.auth();

export { adminFb, adminDb, adminFbAuth };
