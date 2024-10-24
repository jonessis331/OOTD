// app/(tabs)/profile/post/index.tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { View, FlatList, Dimensions } from "react-native";
import { supabase } from "~/src/lib/supabase";
import PostListItem from "~/src/components/PostListItem";
import { useAuth } from "~/src/providers/AuthProvider";

export default function PostCarousel() {
  const { index } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("outfits")
        .select("*, profiles (*)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data);
    };

    fetchPosts();
  }, [user]);

  if (posts.length === 0) return null;

  const windowWidth = Dimensions.get("window").width;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTitle: "" }} />
      <FlatList
        data={posts}
        horizontal
        pagingEnabled
        initialScrollIndex={parseInt(index, 10)}
        getItemLayout={(data, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: windowWidth }}>
            <PostListItem post={item} />
          </View>
        )}
      />
    </>
  );
}
