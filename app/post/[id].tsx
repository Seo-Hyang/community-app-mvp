import PostCard from "@/components/PostCoard";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>게시글 상세 - ID: {id}</Text>
      <PostCard
        id={"1245131"}
        title={"임시 게시물"}
        userDisplayName={"작성자 이름"}
        createdAt={"2025.07.06"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20 },
});
