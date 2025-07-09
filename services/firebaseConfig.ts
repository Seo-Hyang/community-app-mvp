import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkGQnyzD5Ij8lvtxOTmPUz6UvE83qfX6g",
  authDomain: "klp-community-app.firebaseapp.com",
  projectId: "klp-community-app",
  storageBucket: "klp-community-app.firebasestorage.app",
  messagingSenderId: "589179998102",
  appId: "1:589179998102:web:11d9ed4e6247726d4d97b7",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
