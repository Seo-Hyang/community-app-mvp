import { db } from "@/services/firebaseConfig";
import { colors } from "@/styles/shared";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PostData {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  userDisplayName: string;
  createdAt: Date;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPost({
            id: snap.id,
            title: data.title,
            content: data.content,
            imageUrl: data.imageUrl || null,
            userDisplayName: data.userDisplayName,
            createdAt: data.createdAt?.toDate() ?? new Date(),
          });
        } else {
          Alert.alert("404", "게시글을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        Alert.alert("오류", "게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>게시글이 존재하지 않습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>{post.userDisplayName}</Text>
        <Text style={styles.date}>
          {format(post.createdAt, "yyyy.MM.dd HH:mm")}
        </Text>
      </View>
      <View style={styles.contentbox}>
        <Text style={styles.content}>{post.content}</Text>
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.image} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  author: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.subText,
  },
  date: {
    fontSize: 14,
    color: colors.subText,
  },
  contentbox: {
    paddingHorizontal: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: colors.text,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
});
