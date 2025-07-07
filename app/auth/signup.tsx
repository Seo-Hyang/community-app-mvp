import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { signUp } from "@/services/authService";
import { createUserDocument } from "@/services/userService";
import { colors } from "@/styles/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignupScreen() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    setNicknameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      valid = false;
    }

    if (!emailRegex.test(email)) {
      setEmailError("올바른 형태의 이메일을 입력해주세요");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다");
      valid = false;
    }
    if (!(hasLetter && hasNumber && hasSpecial)) {
      setPasswordError("영문자, 숫자, 특수문자를 모두 포함해야 합니다");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("입력한 비밀번호와 일치하지 않습니다.");
      valid = false;
    }

    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const user = await signUp(email, password);
      await createUserDocument({
        uid: user.uid,
        email: user.email ?? "",
        displayName: nickname.trim(),
      });
      router.replace("/auth/login");
    } catch (error: any) {
      setEmailError(error.message ?? "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <InputField
        placeholder="이메일"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        autoCapitalize="none"
      />

      {nicknameError ? (
        <Text style={styles.errorText}>{nicknameError}</Text>
      ) : null}
      <InputField
        placeholder="닉네임"
        value={nickname}
        onChangeText={(text) => {
          setNickname(text);
          setNicknameError("");
        }}
      />

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <InputField
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
      />

      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}
      <InputField
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordError("");
        }}
      />

      <PrimaryButton title="가입하기" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#FF5A5F",
    marginBottom: 4,
    marginLeft: 4,
    fontSize: 13,
  },
});
