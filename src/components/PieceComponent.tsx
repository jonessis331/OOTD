import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { DetectedItem, SimilarItem } from "~/src/utils/dataTypes";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import Button from "./Button";

const PieceComponent = ({
  item,
  onItemSelect,
}: {
  item: DetectedItem;
  onItemSelect: (selectedItemData: any) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (similarItem: SimilarItem) => {
    //const lowerCaseItemName = item.name.toLowerCase(); // Ensure consistent item IDs
    const itemId = item.itemId;
    onItemSelect({
      itemId,
      similarItem,
    });
    setIsExpanded(false);
  };

  return (
    <View className="mt-5">
      <View className="flex-row items-center w-full bg-white">
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <View className="flex-row gap-3 items-center">
            <Image
              source={{ uri: item.cropUrl }}
              className="w-24 aspect-square rounded-full"
            />
            <Text className="text-3xl font-mono font-extrabold">
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className="ml-auto"
          onPress={async () =>
            await WebBrowser.openBrowserAsync(
              "https://www.google.com/?client=safari"
            )
          }
        >
          <AntDesign name="link" color="black" size={22} className="pl-2" />
        </Pressable>
      </View>

      {isExpanded && (
        <View className="flex flex-row flex-wrap">
          {item.similarItems && item.similarItems.length > 0 ? (
            item.similarItems.map((similarItem, index) => (
              <View key={index} style={{ width: "45%", margin: "2.5%" }}>
                <Pressable
                  onPress={async () =>
                    await WebBrowser.openBrowserAsync(similarItem.link)
                  }
                >
                  <Image
                    source={{ uri: similarItem.thumbnail }}
                    className="w-full aspect-square rounded-lg"
                  />
                </Pressable>
                <Text numberOfLines={2} ellipsizeMode="tail">
                  {similarItem.title}
                </Text>
                <Text>{similarItem.source}</Text>
                <Button
                  width="100%"
                  title="Select"
                  onPress={() => handleSelect(similarItem)}
                />
              </View>
            ))
          ) : (
            <Text>No similar items found</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PieceComponent;
