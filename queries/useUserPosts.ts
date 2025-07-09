import { auth, db } from "@/services/firebaseConfig";
import type { PostDocument } from "@/types/firebaseTypes";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

export const useUserPosts = () => {
  const uid = auth.currentUser?.uid;

  return useQuery<PostDocument[]>({
    queryKey: ["user_posts", uid],
    queryFn: async () => {
      if (!uid) return [];
      const q = query(collection(db, "posts"), where("userId", "==", uid));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          userDisplayName: data.userDisplayName,
          createdAt: data.createdAt.toDate(),
        } as PostDocument;
      });
    },
    enabled: !!uid,
  });
};
