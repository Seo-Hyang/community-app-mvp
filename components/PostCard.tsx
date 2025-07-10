import { useRouter } from "expo-router";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { borderRadius, colors } from "../styles/shared";

interface PostCardProps {
  id: string;
  title: string;
  userDisplayName: string;
  imageUrl?: string | null;
  createdAt?: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function PostCard({
  id,
  title,
  userDisplayName,
  imageUrl,
  createdAt,
  onPress,
}: PostCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/post/${id}`)}
    >
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {userDisplayName} · {createdAt}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: 16,
    overflow: "hidden",
    paddingBottom: 8,
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.subText,
  },
  pressed: {
    backgroundColor: "#E5DCD4",
  },
});
