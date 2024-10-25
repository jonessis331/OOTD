import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image, FlatList } from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";
import { log } from "~/src/utils/config";
import { useState, useEffect } from "react";
import { useAuth } from "~/src/providers/AuthProvider";
import ItemInfoPopupGridItem from "~/src/components/ItemInfoPopupGridItem";
import DetailScreenTwo from "~/src/components/detailscreen";
import ProfileScreen from "~/src/components/ProfileScreen";
const Stack = createStackNavigator();

export const fetchOutfits = async () => {
  log.info("Entering fetchOutfits function"); // Log added

  try {
    const { data, error } = await supabase
      .from("outfits")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url,
          id
        )
      `
      )
      .order("date_created", { ascending: false });

    if (error) {
      log.error("Error fetching outfits:", error);
      throw error;
    }

    log.info("Fetched outfits from Supabase"); //, data); // Log fetched data
    return data;
  } catch (error) {
    log.error("Error in fetchOutfits:", error); // Log the error
    throw error;
  } finally {
    log.info("Leaving fetchOutfits");
  }
};

export function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const data = await fetchOutfits();
        setPosts(data);
        ////console.warn(data);
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
      className="bg-zinc-800"
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

const DetailScreen = ({ route }) => {
  const { items = [], selectedItem } = route.params;
  //console.warn('selectedItem', selectedItem);
  //console.warn('items', items);
  return (
    <View className="self-center top-56 justify-center bg-[#B6C2CE] w-80 h-2/4 rounded-3xl">
      <View className="absolute top-0 rounded-t-3xl m-5 mb-10">
        <Image
          source={{ uri: selectedItem.item_image_url }}
          className="w-64 h-64"
        />
      </View>

      <Text>{selectedItem.tags.openAITags?.googleItem?.title}</Text>
      <View className="flex top-20 bg-[#4D766E] w-80 h-auto rounded-3xl">
        {items.map((item, index) => (
          <View className="flex items-center h-max flex-row bg-yellow-400">
            <Text className="ml-3 font-mono font-semibold max-w-52 from-neutral-950">
              {item.tags.openAITags.googleItem?.title}{" "}
            </Text>
            <Image
              source={{ uri: item.tags.openAITags?.googleItem?.thumbnail }}
              className="w-20 h-20 ml-auto mr-5"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Index() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen
          name="DetailScreenTwo"
          options={{ headerShown: false }}
          component={DetailScreenTwo}
        />
        <Stack.Screen
          name="Feed"
          options={{ headerShown: false }}
          component={FeedScreen}
        />
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
          component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
