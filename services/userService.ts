import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createUserDocument = async ({
  uid,
  email,
  displayName,
}: {
  uid: string;
  email: string | null;
  displayName: string;
}) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    email: email ?? "",
    displayName: displayName,
    createdAt: serverTimestamp(),
  });
};
