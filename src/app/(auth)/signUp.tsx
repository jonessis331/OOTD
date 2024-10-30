import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "~/src/components/Button"; // Your custom Button component
import { supabase } from "~/src/lib/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Please check your inbox for email verification!");
      router.replace("/signIn");
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
          Sign Up for Your App
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

        <Button title="Sign Up" onPress={signUpWithEmail} loading={loading} />

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <Text style={{ color: "#fff" }}>Already have an account? </Text>
          <Link href="/(auth)/signIn" style={{ color: "#007BFF" }}>
            Sign In
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
