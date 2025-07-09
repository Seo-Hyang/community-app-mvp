import CustomHeader from "@/components/CustomHeader";
import PrimaryButton from "@/components/PrimaryButton";
import { auth, db, storage } from "@/services/firebaseConfig";
import { colors } from "@/styles/shared";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function WritePostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { granted } = await requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("이미지 접근 권한이 필요합니다.");
      return;
    }
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const user = auth.currentUser!;
    const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("본문을 입력해주세요.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("글을 작성하려면 로그인해야 합니다.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await uploadImageAsync(image);
      }
      await addDoc(collection(db, "posts"), {
        title,
        content,
        imageUrl,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName,
        createdAt: serverTimestamp(),
      });
      Alert.alert("게시글이 저장되었습니다.");
      router.replace("/");
    } catch (error) {
      console.error("Error saving post:", error);
      Alert.alert("게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="글 쓰기" />
      <View style={styles.container}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>본문</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="내용을 입력하세요"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />
        <PrimaryButton
          title="이미지 선택"
          onPress={pickImage}
          style={styles.imagePickerButton}
        />
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <PrimaryButton
          title={loading ? "저장 중..." : "저장하기"}
          onPress={handleSave}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  imagePickerButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
});
