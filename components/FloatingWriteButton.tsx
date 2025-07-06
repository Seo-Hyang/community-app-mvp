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
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
