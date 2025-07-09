// /app/post/write/[id].tsx

import CustomHeader from "@/components/CustomHeader";
import PrimaryButton from "@/components/PrimaryButton";
import { auth, db, storage } from "@/services/firebaseConfig";
import { colors } from "@/styles/shared";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const refDoc = doc(db, "posts", id);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title);
          setContent(data.content);
          setImage(data.imageUrl || null);
        } else {
          Alert.alert("404", "수정할 글을 찾을 수 없습니다.");
          router.back();
        }
      } catch (e) {
        console.error(e);
        Alert.alert("불러오기 실패");
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const pickImage = async () => {
    const { granted } = await requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert("권한 필요");
    const res = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets.length) setImage(res.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    const blob = await (await fetch(uri)).blob();
    const user = auth.currentUser!;
    const imgRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
    await uploadBytes(imgRef, blob);
    return getDownloadURL(imgRef);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("제목을 입력해주세요.");
    if (!content.trim()) return Alert.alert("본문을 입력해주세요.");
    const user = auth.currentUser;
    if (!user) return Alert.alert("로그인 후 이용하세요.");

    setSaving(true);
    try {
      let imageUrl = image;
      if (image && image.startsWith("file://")) {
        imageUrl = await uploadImage(image);
      }

      await updateDoc(doc(db, "posts", id!), {
        title,
        content,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("수정 완료");
      router.replace(`/post/${id}`);
    } catch (e) {
      console.error(e);
      Alert.alert("수정 중 오류");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="글 수정" />
      <View style={styles.container}>
        <Text style={styles.label}>제목</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>본문</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          multiline
        />

        <PrimaryButton
          title="이미지 선택"
          onPress={pickImage}
          style={styles.imagePickerButton}
        />
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <PrimaryButton
          title={saving ? "수정 중..." : "수정하기"}
          onPress={handleSave}
          disabled={saving}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
