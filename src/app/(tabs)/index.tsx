import { View, Text, Image, FlatList } from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";
import { log } from "~/src/utils/config";
import { useState, useEffect } from "react";
import { useAuth } from "~/src/providers/AuthProvider";


export const fetchOutfits = async () => {
  log.info("Entering fetchOutfits function"); // Log added

  try {
    const { data, error } = await supabase
      .from("outfits")
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `).order('date_created', { ascending: false });

    if (error) {
      log.error("Error fetching outfits:", error);
      throw error;
    }

    log.info("Fetched outfits from Supabase", data); // Log fetched data
    return data;
  } catch (error) {
    log.error("Error in fetchOutfits:", error); // Log the error
    throw error;
  } finally {
    log.info("Leaving fetchOutfits");
  }
};

export default function FeedScreen() {
  
  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const data = await fetchOutfits();
        setPosts(data);
        //console.warn(data);
        //setProfile(profiles);
      } catch (error) {
        console.error("Failed to fetch outfits", error);
      } finally {
        setLoading(false);
      }
    };

    loadOutfits();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      className="bg-gray-600"
      data={posts}
      contentContainerStyle={{
        gap: 10,
        maxWidth: 512,
        width: "100%",
        alignSelf: "center",
      }}
      renderItem={({ item }) => <PostListItem post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
