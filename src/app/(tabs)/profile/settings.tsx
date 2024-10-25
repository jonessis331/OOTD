// app/(tabs)/profile/settings.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import Button from "~/src/components/Button";
import { uploadImage } from "~/src/lib/cloudinary";
import { Stack } from "expo-router";

export default function SettingsScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      setProfile(profileData);
      setUsername(profileData.username);
      setImage(profileData.avatar_url);
    };

    fetchProfile();
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    try {
      let avatarUrl = profile.avatar_url;
      if (image && image !== avatarUrl) {
        const response = await uploadImage(image); // Implement uploadImage function
        avatarUrl = response.public_id;
      }

      const updates = {
        id: user?.id,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user?.id);

      if (error) throw error;

      Alert.alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error updating profile");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: "black" }]} />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Button title="Update Profile" onPress={updateProfile} />
        <Button
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
          style={{ marginTop: 20 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center" },
  input: { borderBottomWidth: 1, marginTop: 20 },
});
