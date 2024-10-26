// app/(tabs)/profile/post/index.tsx

import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { View, FlatList } from "react-native";
import { supabase } from "~/src/lib/supabase";
import PostListItem from "~/src/components/PostListItem";
import { useAuth } from "~/src/providers/AuthProvider";

export default function PostCarousel() {
  const { index, type } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      let data;
      let error;
      if (type === "userPosts") {
        ({ data, error } = await supabase
          .from("outfits")
          .select("*, profiles (*)")
          .eq("user_id", userId || user?.id)
          .order("created_at", { ascending: false }));
      } else if (type === "likedPosts") {
        ({ data, error } = await supabase
          .from("outfit_likes")
          .select(
            `
            outfit_id,
            outfits:outfit_id (
              *,
              profiles (*)
            )
          `
          )
          .eq("user_id", user.id));
        if (data) {
          data = data.map((item) => item.outfits);
        }
      } else {
        // Handle other types if necessary
      }

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data);
    };

    fetchPosts();
  }, [user, type]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false, headerTitle: "" }} />
      <View style={{ flex: 1, backgroundColor: "#FFFCF1" }}>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={({ item }) => <PostListItem post={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}
