import CommentItem from "@/components/CommentItem";
import CustomHeader from "@/components/CustomHeader";
import PrimaryButton from "@/components/PrimaryButton";
import { auth, db } from "@/services/firebaseConfig";
import { borderRadius, colors } from "@/styles/shared";
import { PostDocument } from "@/types/firebaseTypes";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<
    {
      id: string;
      text: string;
      userDisplayName: string;
      createdAtFormatted: string;
    }[]
  >([]);
  const [commentText, setCommentText] = useState("");

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
            userId: data.userId,
            userDisplayName: data.userDisplayName,
            createdAt: data.createdAt ?? new Date(),
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

  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, "posts", id, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          const date = data.createdAt?.toDate() ?? new Date();
          return {
            id: doc.id,
            text: data.text,
            userDisplayName: data.userDisplayName,
            createdAtFormatted: format(date, "yyyy.MM.dd HH:mm"),
          };
        });
        setComments(list);
      },
      (err) => {
        console.error("댓글 구독 에러:", err);
      }
    );
    return () => unsubscribe();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    if (!id) return;
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("댓글을 작성하려면 로그인해야 합니다.");
      return;
    }
    try {
      const commentsRef = collection(db, "posts", id, "comments");
      await addDoc(commentsRef, {
        text: commentText.trim(),
        userId: user.uid,
        userDisplayName: user.displayName || "익명",
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const router = useRouter();

  const handleDelete = () => {
    Alert.alert("삭제 확인", "정말 이 글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "posts", id!));
            router.replace("/post");
          } catch (e) {
            console.error(e);
            Alert.alert("삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

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
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // iOS: padding, Android: height 권장
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <CustomHeader title="게시글 상세" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{post.userDisplayName}</Text>
          <Text style={styles.date}>
            {format(post.createdAt.toDate(), "yyyy.MM.dd HH:mm")}
          </Text>
        </View>
        <View style={styles.contentbox}>
          <Text style={styles.content}>{post.content}</Text>
          {post.imageUrl && (
            <Image source={{ uri: post.imageUrl }} style={styles.image} />
          )}
        </View>
        {auth.currentUser?.uid === post.userId && (
          <View style={styles.actionButtons}>
            <PrimaryButton
              title={"수정하기"}
              onPress={() => router.replace(`/post/write/${id}`)}
            />
            <PrimaryButton title={"삭제하기"} onPress={handleDelete} />
          </View>
        )}
        <View style={styles.comments}>
          {/* 댓글 영역 */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="댓글을 입력하세요"
              multiline
            />
            <Pressable
              onPress={handleSubmitComment}
              style={styles.commentButton}
            >
              <Text>등록</Text>
            </Pressable>
          </View>
          <View style={styles.commentsContainer}>
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                text={c.text}
                userDisplayName={c.userDisplayName}
                createdAt={c.createdAtFormatted}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    padding: 14,
  },
  center: {
    flex: 1,
    justifyContent: "space-between",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 6,
  },
  comments: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  commentButton: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  commentsContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
});
