// src/components/LikedItems.js
import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function LikedItems() {
  const { user } = useAuth();
  const router = useRouter();
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const fetchLikedItems = async () => {
      const { data } = await supabase
        .from("item_likes")
        .select(
          `
        item_id,
        outfit_id,
        outfits:outfit_id (
          items
        )
      `
        )
        .eq("user_id", user.id);
      console.log(data);

      const itemsArray = data.map((itemLike) => {
        const outfitItems = itemLike.outfits.items;
        const likedItem = outfitItems.find(
          (i) => i.item_id === itemLike.item_id
        );
        return {
          ...likedItem,
          outfit_id: itemLike.outfit_id,
        };
      });

      setLikedItems(itemsArray);
    };

    fetchLikedItems();
  }, [user]);

  const numColumns = 3;
  const imageSize = Dimensions.get("window").width / numColumns;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/profile/item/${item.outfit_id}/${encodeURIComponent(item.item_id)}`
        )
      }
    >
      <Image
        source={{ uri: item.googleItem?.thumbnail || item.item_image_url }}
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={likedItems}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        `${item.item_id}_${item.outfit_id}_${index}`
      }
      numColumns={numColumns}
    />
  );
}
