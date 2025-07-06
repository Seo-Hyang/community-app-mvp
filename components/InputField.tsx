import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { borderRadius, colors } from "../styles/shared";

interface Props extends TextInputProps {}

export default function InputField(props: Props) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.subText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
  },
});
