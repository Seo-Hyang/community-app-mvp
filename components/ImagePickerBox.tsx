import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, Text } from "react-native";
import { borderRadius, colors } from "../styles/shared";

interface ImagePickerBoxProps {
  imageUrl: string | null;
  onPickImage: (uri: string) => void;
}

export default function ImagePickerBox({
  imageUrl,
  onPickImage,
}: ImagePickerBoxProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "이미지를 선택하려면 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      onPickImage(result.assets[0].uri);
    }
  };

  return (
    <Pressable style={styles.box} onPress={pickImage}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>이미지를 선택하세요</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 160,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.md,
  },
  placeholder: {
    color: colors.subText,
    fontSize: 14,
  },
});
