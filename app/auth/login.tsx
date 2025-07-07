import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { signIn } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/styles/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailError("");
    setPasswordError("");

    if (!emailRegex.test(email)) {
      setEmailError("올바른 형태의 이메일을 입력해주세요");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const user = await signIn(email, password);
      if (user) {
        setUser({ uid: user.uid, email: user.email ?? "" });
        router.replace("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setPasswordError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

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

      <PrimaryButton title="로그인" onPress={handleLogin} />
      <PrimaryButton
        title="회원가입 하러 가기"
        onPress={() => router.push("/auth/signup")}
        style={styles.secondaryButton}
      />
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
  secondaryButton: {
    marginTop: 16,
  },
});
