import { Timestamp } from "firebase/firestore";

export interface UserDocument {
  id: string; // uid
  email: string;
  displayName: string;
  createdAt: FirebaseTimestamp;
}

export interface PostDocument {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  userDisplayName: string;
  createdAt: FirebaseTimestamp;
}

export interface CommentDocument {
  id: string;
  text: string;
  userId: string;
  userDisplayName: string;
  createdAt: FirebaseTimestamp;
}
export type FirebaseTimestamp = Timestamp;
