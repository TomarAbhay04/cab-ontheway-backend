import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }; // Add assertion

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // storageBucket: 'cabonway-7e777' // Replace 'your-project-id' with your Firebase project ID
    storageBucket: 'cabonway-7e777.appspot.com/images' 
});


const bucket = admin.storage().bucket();

export default bucket;