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
  const [layoutComplete, setLayoutComplete] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      let data;
      let error;

      if (type === "userPosts") {
        ({ data, error } = await supabase
          .from("outfits")
          .select("*, profiles (*)")
          .eq("user_id", user?.id)
          .order("date_created", { ascending: false }));
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
      }

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      setPosts(data);
    };

    fetchPosts();
  }, [user, type]);

  // Scroll to the selected index once posts are loaded and layout is complete
  useEffect(() => {
    const scrollIndex = parseInt(index, 10);
    if (
      flatListRef.current &&
      posts.length > 0 &&
      !isNaN(scrollIndex) &&
      scrollIndex < posts.length &&
      scrollIndex >= 0 &&
      layoutComplete
    ) {
      console.log("Scrolling to index:", scrollIndex);
      flatListRef.current.scrollToIndex({
        index: scrollIndex,
        animated: true,
      });
    } else if (
      isNaN(scrollIndex) ||
      scrollIndex < 0 ||
      scrollIndex >= posts.length
    ) {
      //console.warn("Invalid index provided:", index);
    }
  }, [posts, index, layoutComplete]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false, headerTitle: "" }} />
      <View style={{ flex: 1, backgroundColor: "#FFFCF1" }}>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={({ item }) => <PostListItem post={item} />}
          keyExtractor={(item) => item.id.toString()} // Ensure it's a string
          // Adjust or remove getItemLayout based on your item size
          // getItemLayout={(data, index) => ({
          //   length: 300,
          //   offset: 300 * index,
          //   index,
          // })}
          onLayout={() => setLayoutComplete(true)}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      </View>
    </>
  );
}
