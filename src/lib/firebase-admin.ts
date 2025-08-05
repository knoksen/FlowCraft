import * as admin from 'firebase-admin';

// This prevents Firebase from being initialized more than once.
if (!admin.apps.length) {
  // Check if the service account JSON is available in the environment variables
  // This is the recommended way for security reasons, especially in production.
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    // Fallback for local development if you don't have the env var set up.
    // Ensure you have the service account file locally and the path is correct.
    // Note: It's better to use environment variables.
    try {
        const serviceAccount = require('../../serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error(
            'Firebase Admin initialization failed. ' +
            'Ensure GOOGLE_APPLICATION_CREDENTIALS is set or serviceAccountKey.json exists.'
        );
        // We can choose to not throw an error here to allow the app to run
        // for features that don't require admin access.
    }
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
