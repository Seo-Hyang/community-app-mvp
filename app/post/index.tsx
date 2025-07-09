import CustomHeader from "@/components/CustomHeader";
import FloatingWriteButton from "@/components/FloatingWriteButton";
import PostCard from "@/components/PostCard";
import { auth, db } from "@/services/firebaseConfig";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface PostItem {
  id: string;
  title: string;
  userDisplayName: string;
  createdAt: Date;
}

export default function PostListScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = useAuthStore((state) => state.logout);

  const onLogout = async () => {
    await signOut(auth);
    logout();
    router.replace("/auth/login");
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: PostItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            userDisplayName: data.userDisplayName,
            createdAt: data.createdAt?.toDate() ?? new Date(),
          };
        });
        setPosts(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="게시글 목록"
        showBackButton={false}
        rightElement={
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.text}
            onPress={onLogout}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => router.push(`/post/${post.id}`)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <PostCard
              id={post.id}
              title={post.title}
              userDisplayName={post.userDisplayName}
              createdAt={format(post.createdAt, "yyyy.MM.dd")}
            />
          </Pressable>
        ))}
      </ScrollView>
      <FloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
