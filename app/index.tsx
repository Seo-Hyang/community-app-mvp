import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>메인 페이지</Text>
      <Button title="로그인" onPress={() => router.push("/login")} />
      <Button title="글쓰기" onPress={() => router.push("/post/write")} />
      <Button title="게시글 상세" onPress={() => router.push("/post/123")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
