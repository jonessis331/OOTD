import { Image, Text, TextInput, View, Alert, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { uploadImage } from "~/src/lib/cloudinary";
import PostListItem from "~/src/components/PostListItem";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>();
  const [outfits, setOutfits] = useState<any[]>([]);
  const [likedOutfits, setLikedOutfits] = useState<any[]>([]);
  const [publicId, setPublicId] = useState<string | null>(null);

  const fetchProfileAndOutfits = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      setUsername(profileData.username);
      setImage(
        profileData.avatar_url
          ? `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${profileData.avatar_url}`
          : null
      );

      const { data: outfitsData, error: outfitsError } = await supabase
        .from("outfits")
        .select("*")
        .eq("user_id", user?.id);

      if (outfitsError) throw outfitsError;

      setOutfits(outfitsData);

      // Fetch liked outfits
      const { data: likedOutfitsData, error: likedOutfitsError } =
        await supabase
          .from("outfit_likes")
          .select(
            `
          outfit_id,
          outfits (
            *,
            profiles (
              username,
              avatar_url
            )
          )
        `
          )
          .eq("user_id", user.id);

      if (likedOutfitsError) throw likedOutfitsError;

      // Extract outfits from likedOutfitsData
      const likedOutfitsArray = likedOutfitsData.map((item) => item.outfits);

      setLikedOutfits(likedOutfitsArray);
    } catch (error) {
      console.error("Error fetching profile and outfits:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfileAndOutfits();
    }
  }, [user?.id]);

  if (!profile) {
    return <Text>Loading...</Text>;
  }

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
        const response = await uploadImage(image);
        avatarUrl = response.public_id;
        setPublicId(avatarUrl);
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
    <View className="p-3 flex-1">
      {/* Avatar image picker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-52 aspect-square self-center rounded-full"
        />
      ) : (
        <View className="w-52 aspect-square self-center rounded-full bg-slate-300" />
      )}
      <Text
        onPress={pickImage}
        className="font-mono font-semibold text-blue-500 m-5 self-center"
      >
        Change
      </Text>

      {/* Username input */}
      <Text className="mb-2 text-gray-500 font-mono font-semibold">
        Username
      </Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 p-3 rounded-md shadow-sm"
      />

      {/* Posts the user has made */}
      <Text className="mt-5 font-mono font-semibold text-lg">Your Posts</Text>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostListItem post={item} />}
      />

      {/* Posts the user has liked */}
      <Text className="mt-5 font-mono font-semibold text-lg">Liked Posts</Text>
      <FlatList
        data={likedOutfits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostListItem post={item} />}
      />

      {/* Buttons */}
      <View className="gap-2 mt-auto">
        <Button title={"Update"} onPress={updateProfile}></Button>
        <Button
          title={"Sign out"}
          onPress={() => supabase.auth.signOut()}
        ></Button>
      </View>
    </View>
  );
}
