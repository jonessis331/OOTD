import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/src/providers/AuthProvider";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack initialRouteName="signIn">
      <Stack.Screen name="signIn" options={{ headerShown: true }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
    </Stack>
  );
}
