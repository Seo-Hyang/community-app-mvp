// app/index.tsx
import PrimaryButton from "@/components/PrimaryButton";
import { colors } from "@/styles/shared";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>메인 페이지</Text>
      <PrimaryButton
        title="로그인"
        onPress={() => router.push("/auth/login")}
      />
      <PrimaryButton
        title="글쓰기"
        onPress={() => router.push("/post/write")}
        style={styles.button}
      />
      <PrimaryButton
        title="게시글 상세"
        onPress={() => router.push("/post/123")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  button: {
    marginTop: 12,
    width: "100%",
  },
});
