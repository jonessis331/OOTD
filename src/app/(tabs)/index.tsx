import { View, Text, Image, FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import PostListItem from "~/src/components/PostListItem";

export default function FeedScreen() {
  return (
    <FlatList
      className="bg-black"
      data={posts}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => <PostListItem post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
  // return (
  //   <View>
  //     <PostListItem post={posts[2]} />
  //     <PostListItem post={posts[1]} />
  //   </View>
  // );
}
