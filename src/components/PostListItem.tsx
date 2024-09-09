import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "cloudinary-react-native";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "~/src/lib/cloudinary";
import ItemInfoPopups from "./ItemInfoPopups";

import { supabase } from "~/src/lib/supabase";
import { log } from "~/src/utils/config";

export default function PostListItem({ post }) {
  const { width } = useWindowDimensions();

  // Use the image with public ID, 'front_face'.
  //console.log('hello', post)
  const image = cld.image(post.outfit_image_public_id);
  
  image.resize(
    thumbnail()
      .width(width)
      .aspectRatio(2 / 3)
  );
  //.gravity(focusOn(FocusOn.face()))) // Crop the image, focusing on the face.
  //.roundCorners(byRadius(100)); // Round the corners.
  //console.warn("HELLO", typeof(post?.user))
  const user = post?.user
  const avatar = cld.image(post?.profiles?.avatar_url);
  // Apply the transformation.
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );

  const [showBoxes, setShowBoxes] = useState(false);
  //const [zoomed, setZoomed] = useState(false);

  const handleToggleBoxes = () => {
    setShowBoxes((prevState) => !prevState);
  };

  return (
    <View className="bg-white">
      {/*Header */}
      <View className="ml-3 w-60 mt-2 mb-2 bg-gray-200 opacity-80 rounded-3xl shadow-md shadow-black" >
      <View className="ml-1 flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full border-2 border-emerald-50"
        />
        <Text className="font-semibold">{post?.profiles?.username}</Text>
      </View>
      </View>
      {/**Post Image */}
      <View className = "shadow-md shadow-black">
        <TouchableOpacity onPress={handleToggleBoxes} activeOpacity={1}>
          {/* Content */}
          <AdvancedImage
            cldImg={image}
            className="item-center ml-4 aspect-[2/3] rounded-3xl mr-4"
          />
        </TouchableOpacity>
        {showBoxes && (
          <ItemInfoPopups items={post.items} />
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
