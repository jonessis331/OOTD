import React, { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function PiecesScreen({ userId, setShowSegmentedControl }) {
  const [pieces, setPieces] = useState([]);
  const router = useRouter();

  // Fetch outfits and extract pieces (items) from each outfit
  useEffect(() => {
    const fetchPieces = async () => {
      const { data: outfitsData, error } = await supabase
        .from("outfits")
        .select("items")
        .eq("user_id", userId); // Fetch outfits based on userId

      if (error) {
        console.error("Error fetching outfits:", error);
        return;
      }

      //console.log("Outfits Data:", outfitsData);

      // Extract pieces from outfits
      const extractedPieces = outfitsData.reduce((allPieces, outfit) => {
        // Spread all items from the current outfit into the allPieces array
        return [...allPieces, ...outfit.items];
      }, []);

      console.log("Extracted Pieces:", extractedPieces);
      setPieces(extractedPieces);
    };

    fetchPieces();
  }, [userId]);

  const numColumns = 3;
  const imageSize = Dimensions.get("window").width / numColumns;

  const handlePress = (index) => {
    // Handle piece selection, maybe navigate to a detail page
    console.log(`Selected piece index: ${index}`);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handlePress(index)}>
      <Image
        source={{
          uri:
            item.googleItem?.n_background_thumbnail ||
            item.googleItem?.thumbnail ||
            item.item_image_url,
        }} // Using item_image_url to display the image
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={pieces}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()} // Assuming items don’t have unique ids
      numColumns={numColumns}
    />
  );
}
