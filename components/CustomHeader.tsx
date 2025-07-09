// components/CustomHeader.tsx
import { colors } from "@/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

export default function CustomHeader({
  title,
  showBackButton = true,
  rightElement = null,
}: Props) {
  return (
    <View style={styles.container}>
      {/* 좌측 백 버튼 */}
      {showBackButton ? (
        <Link href=".." asChild>
          <TouchableOpacity style={styles.sideButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </Link>
      ) : (
        <View style={styles.sideButton} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightElement ? (
        <View style={styles.sideButton}>{rightElement}</View>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sideButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
});
