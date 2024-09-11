import { Redirect, Stack, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "~/src/providers/AuthProvider";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{  tabBarStyle: {backgroundColor: '#2e353d'}, tabBarActiveTintColor: "black", tabBarShowLabel: false }}
      
    >
      <Tabs.Screen
        name="index"
        options={{
          //headerTitle: "For you",
          
          headerStyle: {height: "0%"},
          headerTintColor: "black",
        
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="new"
        options={{
          headerTitle: "Create post",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          headerTitle: "Your Closet",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
