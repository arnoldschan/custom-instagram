import firebase from 'firebase';
import firebaseConfig from "./firebaseConfig";
const firebaseApp = firebase.initializeApp(
    firebaseConfig
)
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
if (process.env.ENVIRONMENT !== "PRODUCTION") {
    db. useEmulator("instagram.arnold.com", 8080);
    auth.useEmulator("http://instagram.arnold.com:9099");
  }

export { db, auth, storage }