import { StyleSheet, Text, View } from "react-native";

export default function UserPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>유저 페이지</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20 },
});
