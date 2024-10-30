import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "~/src/components/Button"; // Your custom Button component
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";

export default function SignIn() {
  //const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      // Update user state and redirect
      setUser(data.user);
      router.replace("/(tabs)");
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Log In to Your App
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        <Button title="Sign In" onPress={signInWithEmail} loading={loading} />

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <Text style={{ color: "#fff" }}>Don't have an account? </Text>
          <Link href="/(auth)/signUp" style={{ color: "#007BFF" }}>
            Sign Up
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
