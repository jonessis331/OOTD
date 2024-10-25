// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      {/* Profile screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Settings screen */}
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
