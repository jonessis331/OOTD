// app/(tabs)/profile/item/[outfitId]/[itemId].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { supabase } from "~/src/lib/supabase";
import InfoSheet from "~/src/components/InfoSheet";
import PrettyPopup from "~/src/components/PrettyPopup";

export default function ItemDetail() {
  const { outfitId, itemId } = useLocalSearchParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase
        .from("outfits")
        .select("items")
        .eq("id", outfitId)
        .single();

      if (data) {
        const outfitItems = data.items;
        const matchedItem = outfitItems.find((i) => i.item_id === itemId);
        setItem(matchedItem);
      }
    };

    fetchItem();
  }, [outfitId, itemId]);

  if (!item) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InfoSheet item={item} />
      <PrettyPopup item={item} />
      <Image
        source={{ uri: item.googleItem?.thumbnail || item.item_image_url }}
        style={styles.image}
      />
      <Text style={styles.title}>{item.googleItem?.title || item.item_id}</Text>
      {/* Add more item details here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  image: { width: "100%", height: 300, resizeMode: "contain" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});
