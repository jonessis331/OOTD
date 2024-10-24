import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import { DetectedItem } from "../utils/dataTypes";
import { useNavigation } from "@react-navigation/native";
import { useStoreRootState } from "expo-router/build/global-state/router-store";
import { useEffect, useRef, useState } from "react";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { BlurView } from "expo-blur";
import DetailScreenTwo from "~/src/components/detailscreen";

interface ItemInfoPopupsProps {
  items: DetectedItem[];
  imageWidth: number;
  imageHeight: number;
  outfitId: string;
}

export default function ItemInfoPopups({
  items,
  imageWidth,
  imageHeight,
  outfitId,
}: ItemInfoPopupsProps) {
  //const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [itemList, setItemList] = useState<DetectedItem[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value
  const scaleValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();
  const openItemInfo = (item: any, items: any) => {
    setSelectedItem(item);
    setShowDetail(true);
    setItemList(items);
    //navigation.navigate('Detail', { items: items || [], selectedItem: item });
  };
  useEffect(() => {
    const fetchLikedItems = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("item_likes")
        .select("item_id")
        .eq("user_id", user.id)
        .eq("outfit_id", outfitId);

      if (error) {
        console.error("Error fetching liked items:", error);
      } else if (data) {
        const likedItemsData: { [key: string]: boolean } = {};
        data.forEach(({ item_id }) => {
          likedItemsData[item_id] = true;
        });
        setLikedItems(likedItemsData);
      } else {
        // No data means no items are liked
        setLikedItems({});
      }
    };

    fetchLikedItems();
  }, [user, outfitId]);

  const toggleItemLike = async (itemId: string) => {
    if (!user) return;
    const liked = likedItems[itemId];

    if (liked) {
      // Unlike the item
      const { error } = await supabase
        .from("item_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("outfit_id", outfitId)
        .eq("item_id", itemId);

      if (error) {
        console.error("Error unliking item:", error);
      }
    } else {
      // Like the item
      const { error } = await supabase.from("item_likes").insert({
        user_id: user.id,
        outfit_id: outfitId,
        item_id: itemId,
      });

      if (error) {
        console.error("Error liking item:", error);
      }
    }
  };

  const handleItemLike = (itemId: string) => {
    console.log("PressedItem", itemId);
    if (!scaleValues[itemId]) {
      scaleValues[itemId] = new Animated.Value(1);
    }
    setLikedItems((prevLikedItems) => ({
      ...prevLikedItems,
      [itemId]: !prevLikedItems[itemId],
    }));

    // Animate the scale
    Animated.sequence([
      Animated.timing(scaleValues[itemId], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(scaleValues[itemId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Call API to like/unlike the item
    toggleItemLike(itemId);
  };
  useEffect(() => {
    if (selectedItem) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [selectedItem]);

  return (
    <>
      {showDetail && (
        <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
          <BlurView intensity={20} style={styles.blurView}>
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setShowDetail(false)}
            />
            <DetailScreenTwo selectedItem={selectedItem} items={items} />
          </BlurView>
        </Animated.View>
      )}
      <View className="absolute inset-0">
        {items.map((item, index) => {
          if (!item.googleItem?.thumbnail) return null;
          const itemId = item.item_id;

          // Initialize scaleValue for this item if not already done
          if (!scaleValues[itemId]) {
            scaleValues[itemId] = new Animated.Value(1);
          }

          const { bounding_box } = item;
          const centerX =
            ((bounding_box.left + bounding_box.right) / 2) * imageWidth;
          const centerY =
            ((bounding_box.top + bounding_box.bottom) / 2) * imageHeight;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                openItemInfo(item, items);
              }}
            >
              <View
                className="absolute bg-slate-400 w-24 p-4 m-2 rounded-lg shadow-lg"
                style={{ left: centerX, top: centerY }}
              >
                <Image
                  source={{ uri: item.googleItem?.thumbnail }}
                  className="w-16 h-16 rounded-lg"
                />
                <View className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-300 border border-slate-400" />
                <View className="flex-row">
                  <Text className="font-semibold mt-2" numberOfLines={1}>
                    {item.googleItem?.title || item.itemId}
                  </Text>
                  <Pressable
                    onPress={() => handleItemLike(item.item_id)}
                    style={styles.likeButton}
                  >
                    <Animated.View
                      style={{ transform: [{ scale: scaleValues[itemId] }] }}
                    >
                      <AntDesign
                        name={likedItems[itemId] ? "heart" : "hearto"}
                        color="white"
                        size={10}
                      />
                    </Animated.View>
                  </Pressable>
                </View>
                {/* Add more item details as needed */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure it is above other elements
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    justifyContent: "center",
    marginLeft: "auto",
  },
});
