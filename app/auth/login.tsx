import { StyleSheet, Text, View } from "react-native";

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});
