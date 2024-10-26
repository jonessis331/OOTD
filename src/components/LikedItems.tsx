// src/components/LikedItems.js
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function LikedItems() {
  const { user } = useAuth();
  const router = useRouter();
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedItems = async () => {
      setLoading(true);
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
        .eq("user_id", user.id)
        .not("item_id", "is", null);

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
    setLoading(false);
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
        source={{
          uri:
            item.googleItem?.n_background_local ||
            item.googleItem?.thumbnail ||
            item.item_image_url ||
            "https://res.cloudinary.com/dmhfubcfi/image/upload/v1729185488/wajmzkli0qvmopaukvqe.jpg",
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

  if (likedItems.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>No liked items yet.</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  messageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageText: { fontSize: 18, color: "#888" },
});
