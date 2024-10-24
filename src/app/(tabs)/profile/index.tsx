// app/(tabs)/profile/index.tsx
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function YourPostsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      const { data: outfitsData } = await supabase
        .from("outfits")
        .select("*")
        .eq("user_id", user?.id);

      setOutfits(outfitsData);
    };

    fetchOutfits();
  }, [user]);

  const numColumns = 3;
  const imageSize = Dimensions.get("window").width / numColumns;

  const handlePress = (index) => {
    router.push({
      pathname: "/profile/post",
      params: { index },
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePress(index)}>
      <Image
        source={{ uri: item.outfit_image_url }}
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={outfits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
    />
  );
}
