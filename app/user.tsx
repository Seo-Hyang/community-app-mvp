import CustomHeader from "@/components/CustomHeader";
import PostCard from "@/components/PostCard";
import PrimaryButton from "@/components/PrimaryButton";
import { UserPostItem, useUserPosts } from "@/queries/useUserPosts";
import { auth } from "@/services/firebaseConfig";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/styles/shared";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function UserScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const { data: posts, isLoading } = useUserPosts();

  const logout = useAuthStore((state) => state.logout);

  const onLogout = async () => {
    await signOut(auth);
    logout();
    router.replace("/auth/login");
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.text}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="프로필" />
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.text}>
            이메일: <Text style={styles.name}>{user.email}</Text>
          </Text>
          <Text style={styles.text}>
            닉네임: <Text style={styles.name}>{user.displayName}</Text>
          </Text>
          <PrimaryButton title={"로그아웃"} onPress={onLogout} />
        </View>

        <Text style={styles.listHeader}>내가 쓴 게시글</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            keyExtractor={(item: UserPostItem) => item.id}
            renderItem={({ item }) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/post/${item.id}`)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <PostCard
                  id={item.id}
                  title={item.title}
                  userDisplayName={item.userDisplayName}
                  createdAt={format(item.createdAt, "yyyy.MM.dd")}
                />
              </Pressable>
            )}
          />
        ) : (
          <Text style={styles.text}>아직 작성한 게시글이 없습니다.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  section: {
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  postDate: {
    fontSize: 12,
    color: colors.subText,
    marginLeft: 8,
  },
});
