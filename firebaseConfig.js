// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

const fbApp = initializeApp(firebaseConfig);
const fbStorage = getStorage(fbApp);

module.exports = { fbStorage }
// export { storage }