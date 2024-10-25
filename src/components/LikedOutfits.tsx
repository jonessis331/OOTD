// src/components/LikedOutfits.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function LikedOutfits() {
  const { user } = useAuth();
  const router = useRouter();
  const [likedOutfits, setLikedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePress = (index) => {
    router.push({
      pathname: "/profile/post",
      params: { index: index.toString(), type: "likedPosts" },
    });
  };

  useEffect(() => {
    const fetchLikedOutfits = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("outfit_likes")
        .select(
          `
          outfit_id,
          outfits:outfit_id (
            *,
            profiles (
              username,
              avatar_url
            )
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching liked outfits:", error);
        setLoading(false);
        return;
      }

      const likedOutfitsArray = data.map((item) => item.outfits);
      setLikedOutfits(likedOutfitsArray);
      setLoading(false);
    };

    fetchLikedOutfits();
  }, [user]);

  const numColumns = 3;
  const imageSize = Dimensions.get("window").width / numColumns;

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePress(index)}>
      <Image
        source={{
          uri: item.outfit_image_url,
        }}
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading...</Text>
      </View>
    );
  }

  if (likedOutfits.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>No liked outfits yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={likedOutfits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  messageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageText: { fontSize: 18, color: "#888" },
});
