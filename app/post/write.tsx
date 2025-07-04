import { View, Text, StyleSheet } from "react-native";

export default function PostWriteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>게시글 작성</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20 },
});
