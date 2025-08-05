import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "flowcraft-eh6nl",
  "appId": "1:109984165385:web:873933558312b717b712d8",
  "storageBucket": "flowcraft-eh6nl.firebasestorage.app",
  "apiKey": "AIzaSyCrQIS0s5V763R8j8W4wPLcTb7tfs3gQ0M",
  "authDomain": "flowcraft-eh6nl.firebaseapp.com",
  "messagingSenderId": "109984165385"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
