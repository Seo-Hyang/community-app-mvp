// components/CustomHeader.tsx
import { colors } from "@/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode; // ← 우측에 렌더링할 요소
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
        <View style={styles.sideButton} /> // 빈 공간 채우기
      )}

      {/* 중앙 타이틀 */}
      <Text style={styles.title}>{title}</Text>

      {/* 우측 사용자 지정 버튼 */}
      {rightElement ? (
        <View style={styles.sideButton}>{rightElement}</View>
      ) : (
        <View style={styles.sideButton} /> // 빈 공간 채우기
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ← 좌/중앙/우 구분
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sideButton: {
    width: 40, // 아이콘 영역 고정 너비
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1, // 가운데 제목이 가능한 넓게
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
});
