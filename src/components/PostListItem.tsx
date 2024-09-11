import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
  Animated,
  PanResponder
} from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useState, useRef } from "react";

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
import ItemInfoPopupGridItem from "./ItemInfoPopupGridItem";

export default function PostListItem({ post }) {
  const { width, height } = useWindowDimensions();
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showBoxes, setShowBoxes] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -width,
            useNativeDriver: false
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true
            }).start();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            }).start();
          });
        }
      }
    })
  ).current;

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

  return (
    <View className="bg-gray-600 mt-10">
      {/*Header */}
      <View className="ml-3 w-60 mt-2 mb-2  opacity-80 rounded-3xl shadow-md shadow-black" >
      <View className="ml-1 flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full border border-emerald-50"
        />
        <Text className="font-semibold text-white">{post?.profiles?.username}</Text>
      </View>
      </View>
      {/**Post Image */}
      <View className = "shadow-xl shadow-black">
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateX }] }}
        >
          <TouchableOpacity onPress={() => setShowBoxes(!showBoxes)} activeOpacity={1}>
            {/* Content */}
            <AdvancedImage
              cldImg={image}
              className="item-center ml-4 aspect-[2/3] rounded-3xl mr-4"
              onLayout={onImageLayout}
              style={{ width: '100%', height: undefined, aspectRatio: 2/3 }} // Adjust aspect ratio as needed
            />
          </TouchableOpacity>
          {showBoxes && (
            <ItemInfoPopups items={post.items} imageWidth={imageDimensions.width} imageHeight={imageDimensions.height} />
          )}
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: width,
            width: width,
            height: height,
            backgroundColor: 'white',
            opacity,
            transform: [{ translateX }]
          }}
        >
          <ItemInfoPopupGridItem items={post.items} />
        </Animated.View>
      </View>
      {/* Icons */}
      <View className="flex-row gap-3 p-5">
        <AntDesign name="hearto" color="white" size={25} />
        {/* <Ionicons name="share" size={20}/> */}
        {/* <Feather name="send" size={20} /> */}
        <Text>
          {post?.outfit_caption}
        </Text>
        <Feather name="share" color="white" size={25} className="ml-auto" />
      </View>
    </View>
  );
}
