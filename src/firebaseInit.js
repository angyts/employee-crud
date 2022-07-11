import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU8E77XlKgyXQSj_244jbqw1IjI4-lqDU",
  authDomain: "diary-34c28.firebaseapp.com",
  databaseURL: "https://diary-34c28.firebaseio.com",
  projectId: "diary-34c28",
  storageBucket: "diary-34c28.appspot.com",
  messagingSenderId: "481441809494",
  appId: "1:481441809494:web:55a7b8c9e396c90be8e7f7"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
