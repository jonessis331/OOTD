// app/(tabs)/profile/index.tsx
import React, { useEffect, useState, useRef } from "react";
import { FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { useAuth } from "~/src/providers/AuthProvider";
import { supabase } from "~/src/lib/supabase";
import { useRouter } from "expo-router";

export default function YourPostsScreen({ setShowSegmentedControl, userId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [outfits, setOutfits] = useState([]);
  const lastOffsetY = useRef(0);

  // Inside YourPostsScreen component
  const scrollThreshold = 50;
  let lastScrollTime = 0;

  const onScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const deltaY = currentOffsetY - lastOffsetY.current;
    const currentTime = Date.now();

    if (
      Math.abs(deltaY) > scrollThreshold &&
      currentTime - lastScrollTime > 200
    ) {
      const direction = deltaY > 0 ? "down" : "up";
      lastOffsetY.current = currentOffsetY;
      lastScrollTime = currentTime;

      if (direction === "down") {
        setShowSegmentedControl(false);
      } else {
        setShowSegmentedControl(true);
      }
    }
  };

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
      params: { index: index.toString(), type: "likedPosts" },
    });
  };

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

  return (
    <FlatList
      data={outfits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
}