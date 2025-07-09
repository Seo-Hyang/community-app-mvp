import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/shared";

interface CommentItemProps {
  text: string;
  userDisplayName: string;
  createdAt: string;
}

export default function CommentItem({
  text,
  userDisplayName,
  createdAt,
}: CommentItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{userDisplayName}</Text>
        <Text style={styles.date}>{createdAt}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.subText,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
});
