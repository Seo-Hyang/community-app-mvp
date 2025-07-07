import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface Props extends TextInputProps {
  secureTextEntry?: boolean;
}

export default function InputField({ secureTextEntry, ...props }: Props) {
  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor="#999"
        secureTextEntry={hide}
      />
      {secureTextEntry && (
        <Pressable style={styles.eyeButton} onPress={() => setHide(!hide)}>
          <Ionicons name={hide ? "eye-off" : "eye"} size={20} color="#888" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    paddingRight: 40, // 아이콘 영역 확보
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});
