import { View, Text, Image, TouchableOpacity } from "react-native";
import { DetectedItem } from "../utils/dataTypes";

interface ItemInfoPopupsProps {
  items: DetectedItem[];
  imageWidth: number;
  imageHeight: number;
}

export default function ItemInfoPopups({ items, imageWidth, imageHeight }: ItemInfoPopupsProps) {
  return (
    <View className="absolute inset-0">
      {items.map((item, index) => {
        if (!item.googleItem?.thumbnail) return null;

        const { bounding_box } = item;
        const centerX = (bounding_box.left + bounding_box.right) / 2 * imageWidth;
        const centerY = (bounding_box.top + bounding_box.bottom) / 2 * imageHeight;

        return (
          <TouchableOpacity key={index} onPress={() => { openItemInfo(item) }}>
            <View
              className="absolute bg-slate-400 w-24 p-4 m-2 rounded-lg shadow-lg"
              style={{ left: centerX, top: centerY }}
            >
              <Image
                source={{ uri: item.googleItem?.thumbnail }}
                className="w-16 h-16 rounded-lg"
              />
              <View className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-300 border border-slate-400" />
              <Text className="font-semibold mt-2" numberOfLines={1}>
                {item.googleItem?.title || item.item_id}
              </Text>
              {/* Add more item details as needed */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


{/* <View className="absolute inset-0">
            <View className="absolute top-96 left-10 bg-amber-500 p-2 rounded-lg hover: z-50">
              <View className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-600 border-2 border-amber-900"></View>
              <Text className="text-white">{item.name}</Text>
            </View>
    </View> */}