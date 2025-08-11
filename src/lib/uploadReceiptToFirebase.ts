/* // getStorage       : Connects to Firebase Storage
// ref              : Creates a reference to a file path in Storage
// uploadBytes      : Uploads a file (like a PDF blob)
// getDownloadURL   : Gets a public link to the uploaded file
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//Initializes Firebase in React app
import { initializeApp } from 'firebase/app'; 

//  Web SDK config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAE3ZLp9_xbdjbh6QIL1aKIQI7GHNqsnE8",
    authDomain: "ovesopticproject.firebaseapp.com",
    projectId: "ovesopticproject",
    storageBucket: "ovesopticproject.firebasestorage.app",
    messagingSenderId: "465661777109",
    appId: "1:465661777109:web:b7a0c3b9804be2c4dabe5c"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadPDFBlob(blob: Blob, filename: string): Promise<string> {
  const storageRef = ref(storage, `prescriptions/${filename}`);
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);
  return url; // This is the public link to send via SMS/email
}
 */