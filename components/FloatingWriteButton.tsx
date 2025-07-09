import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { borderRadius, colors } from "../styles/shared";

export default function FloatingWriteButton() {
  const router = useRouter();

  return (
    <Pressable style={styles.fab} onPress={() => router.push("/post/write")}>
      <Text style={styles.text}>글 쓰기</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
