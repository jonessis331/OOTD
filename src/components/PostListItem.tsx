import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
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
import { useAuth } from "~/src/providers/AuthProvider";

export default function PostListItem({ post }) {
  const { width, height } = useWindowDimensions();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showBoxes, setShowBoxes] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current; // Create an animated value
  const router = useRouter();

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: Animated.event([null, { dx: translateX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -width,
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }).start();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }).start();
          });
        }
      },
    })
  ).current;

  // Handle avatar only if it exists
  const avatar = post?.profiles?.avatar_url
    ? cld.image(post?.profiles?.avatar_url)
    : null;

  if (avatar) {
    avatar.resize(
      thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
    );
  }

  const toggleOutfitLike = async (outfitId: string) => {
    if (!user) return;

    if (liked) {
      // Unlike the outfit
      const { error } = await supabase
        .from("outfit_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("outfit_id", outfitId);

      if (error) {
        console.error("Error unliking outfit:", error);
      }
    } else {
      // Like the outfit
      const { error } = await supabase.from("outfit_likes").insert({
        user_id: user.id,
        outfit_id: outfitId,
      });

      if (error) {
        console.error("Error liking outfit:", error);
      }
    }
  };

  useEffect(() => {
    const fetchLikedOutfit = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("outfit_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("outfit_id", post.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching liked outfit:", error);
      } else if (data) {
        setLiked(true);
      }
    };

    fetchLikedOutfit();
  }, [user, post.id]);

  const postImage = post?.outfit_image_public_id
    ? cld.image(post.outfit_image_public_id)
    : null;

  if (postImage) {
    postImage.resize(
      thumbnail()
        .width(width)
        .aspectRatio(2 / 3)
    );
  }

  const handlePostLike = () => {
    setLiked(!liked);

    // Animate the scale
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2, // Scale up
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(scaleValue, {
        toValue: 1, // Scale back to original
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Optionally, add logic to handle the like action (e.g., API call)
    toggleOutfitLike(post.id);
  };

  return (
    <View className="bg-[#FFFCF1] mt-10">
      {/* Header */}
      <TouchableOpacity
        onPress={() => {
          if (post?.profiles?.id === user?.id) {
            // Navigate to profile tab
            router.push("/(tabs)/profile");
          } else {
            // Navigate to the user's profile screen, passing the userId
            router.push(`/user/${post?.profiles?.id}`);
          }
        }}
      >
        <View className="ml-3 w-60 mt-2 mb-4 opacity-80 rounded-3xl shadow-md shadow-black">
          <View className="ml-2 flex-row items-center gap-2">
            {avatar && (
              <AdvancedImage
                cldImg={avatar}
                className="w-12 aspect-square rounded-full border border-emerald-50"
              />
            )}
            <Text className="ml-2 font-mono font-bold text-xl text-[#1B1B1B]">
              {post?.profiles?.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Post Image */}
      <View className="shadow-xl shadow-black">
        <View>
          <TouchableOpacity
            onPress={() => setShowBoxes(!showBoxes)}
            activeOpacity={1}
          >
            {/* Content */}
            {postImage && (
              <AdvancedImage
                cldImg={postImage}
                className="rounded-2xl"
                onLayout={onImageLayout}
                style={{
                  width: "94%",
                  height: undefined,
                  aspectRatio: 9 / 14,
                  alignSelf: "center",
                }} // Adjust aspect ratio as needed
              />
            )}
          </TouchableOpacity>
          {showBoxes && post.items && (
            <ItemInfoPopups
              items={post.items}
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              outfitId={post.id}
            />
          )}
        </View>
      </View>

      {/* Icons */}
      <View className="flex-row gap-3 pl-5 pt-3">
        <Pressable onPress={handlePostLike}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <AntDesign
              name={liked ? "heart" : "hearto"}
              color="#1B1B1B"
              size={22}
            />
          </Animated.View>
        </Pressable>
        <Text>{post?.outfit_caption}</Text>
        <Feather name="share" color="#1B1B1B" size={22} className="" />
      </View>
    </View>
  );
}
