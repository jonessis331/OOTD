import { View, Text, Image, TouchableOpacity } from "react-native";
import posts from "~/assets/data/posts.json";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function PostListItem({ post }) {
  const [showBoxes, setShowBoxes] = useState(false);

  const handleToggleBoxes = () => {
    setShowBoxes((prevState) => !prevState);
  };

  return (
    <View className="bg-white">
      {/*Header */}
      <View className="ml-1 p-3 flex-row items-center gap-2">
        <Image
          source={{ uri: post.user.image_url }}
          className="w-12 aspect-square rounded-full border-2 border-emerald-50"
        />
        <Text className="font-semibold">{post.user.username}</Text>
      </View>
      {/**Post Image */}
      <View>
        <TouchableOpacity onPress={handleToggleBoxes} activeOpacity={1}>
          <Image
            source={{ uri: post.image_url }}
            className="ml-2 aspect-[2/3] rounded-3xl mr-2 press: z-0"
          />
        </TouchableOpacity>
        {showBoxes && (
          <View className="absolute inset-0">
            <View className="absolute top-96 left-10 bg-amber-500 p-2 rounded-lg hover: z-50">
              <View className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-600 border-2 border-amber-900"></View>
              <Text className="text-white">Raybands Erika Classics 2015</Text>
            </View>
          </View>
        )}
      </View>
      {/* Icons */}
      <View className="flex-row gap-3 p-3">
        <AntDesign name="hearto" size={20} />
        <Ionicons name="chatbubble-outline" size={20} />
        <Feather name="send" size={20} />
        <Feather name="bookmark" size={20} className="ml-auto" />
      </View>
    </View>
  );
}
