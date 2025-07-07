import PrimaryButton from "@/components/PrimaryButton";
import { colors } from "@/styles/shared";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { auth } from "@/services/firebaseConfig";
import { useAuthStore } from "@/stores/authStore";

import { signOut } from "firebase/auth";

export default function MainScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {user && <PrimaryButton title="로그아웃" onPress={handleLogout} />}

      <Text style={styles.title}>메인 페이지</Text>

      <PrimaryButton
        title="로그인"
        onPress={() => router.push("/auth/login")}
      />
      <PrimaryButton
        title="회원가입"
        onPress={() => router.push("/auth/signup")}
      />
      <PrimaryButton
        title="글쓰기"
        onPress={() => router.push("/post/write")}
        style={styles.button}
      />
      <PrimaryButton
        title="게시글 목록"
        onPress={() => router.push("/post/")}
        style={styles.button}
      />

      <PrimaryButton
        title="사용자 확인"
        onPress={() => {
          const currentUser = auth.currentUser;
          console.log("currentUser:", currentUser?.displayName);
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  button: {
    width: "100%",
  },
});
