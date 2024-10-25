// (tabs)/profile/[userId]/index.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ProfileScreen from "~/src/components/ProfileScreen";
import { Text } from "react-native";

export default function UserProfile() {
  const { userId } = useLocalSearchParams();

  // Ensure we are correctly passing the userId to ProfileScreen
  if (!userId) return <Text>User ID is missing!</Text>;

  return <ProfileScreen userId={userId} />;
}
