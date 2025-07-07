import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createUserDocument = async ({
  uid,
  email,
}: {
  uid: string;
  email: string | null;
}) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    email: email ?? "",
    createdAt: serverTimestamp(),
  });
};
