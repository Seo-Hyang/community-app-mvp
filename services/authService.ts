import { auth } from "@/services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });

  return user;
};

export const signIn = async (email: string, password: string) => {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
};
