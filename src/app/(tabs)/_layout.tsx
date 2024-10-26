import { Redirect, Stack, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "~/src/providers/AuthProvider";
import testvw from "./testvw";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1B1B1B" },
        tabBarActiveTintColor: "#CBCBCB",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          //headerTitle: "For you",

          headerStyle: { height: "0%" },
          headerTintColor: "black",

          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="new"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          headerShown: false,
          headerTitle: "",
          headerTintColor: "#FAFBFD",
          headerStyle: {
            height: 60,
            backgroundColor: "#323232",
            borderBottomColor: "transparent",
          },
          // headerShadowVisible: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={26} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="testvw"
        //component = {testvw}
        options={{
          headerTitle: "Test",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="info" size={26} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
