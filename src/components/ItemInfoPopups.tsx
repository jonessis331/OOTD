import { View, Text, Image } from "react-native";

export default function ItemInfoPopups({ items }) {
  return (
    <View className="absolute inset-0">
      {items.map((item, index) => (
        <View key={index} className="bg-white w-32 p-4 m-2 rounded-lg shadow-lg">
          <Image
            source={{ uri: item.googleItem?.thumbnail }}
            className="w-24 h-24 rounded-lg"
          />
          <Text className="font-semibold mt-2" numberOfLines={1}>{item.googleItem?.title || item.item_id}</Text>
          {/* Add more item details as needed */}
        </View>
      ))}
    </View>
  );
}


{/* <View className="absolute inset-0">
            <View className="absolute top-96 left-10 bg-amber-500 p-2 rounded-lg hover: z-50">
              <View className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-600 border-2 border-amber-900"></View>
              <Text className="text-white">{item.name}</Text>
            </View>
    </View> */}