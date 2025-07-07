import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { borderRadius, colors } from "../styles/shared";

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && { backgroundColor: "#E5DCD4" },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  text: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
