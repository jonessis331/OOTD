import React, { useState } from "react";
import { Image, Pressable, Text, View, TextInput} from "react-native";
import { DetectedItem } from "../utils/dataTypes";
import { useNavigation } from '@react-navigation/native';
import Button from "./Button";
import { scrapUrl } from "~/src/lib/scraperapi";
import { generateTags } from "~/src/lib/openai";
import * as WebBrowser from 'expo-web-browser';

const PieceComponent = ({ item, onItemSelect }: { item: DetectedItem, onItemSelect: (selectedTags: any) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = async (link: string) => {
    try {
      console.log("Entering handleSelect function");
      const data = await scrapUrl(link);
      const scraped_tags = await generateTags(data);
      console.log('scraped tags', JSON.stringify(scraped_tags));

      // Pass the generated tags back to the parent component
      onItemSelect({ itemId: item.name, tags: scraped_tags });

    } catch (error) {
      //console.error('error tagging scraped:', error);
    }
  };
  return (
    <View style={{ marginTop: 20 }}>
      <View className="flex-row items-center w-full bg-gray-200 rounded-full p-2">
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <View className="flex-row gap-3 items-center">
            <Image
              source={{ uri: item.cropUrl }}
              className="w-10 aspect-square rounded-full"
            />
            <Text className="font-serif font-extrabold">
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
            <TextInput className = "w-11 items-center bg-white">

            </TextInput>
          </View>
        </Pressable>
        <Pressable
          className = "ml-auto"
          onPress={async () =>
            await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")
          }
          
          // save webpage last open url and toggle is manual to flag for deep tag additional call
        >
          <View className="w-12 aspect-square rounded-full bg-slate-800 ml-2"></View>
        </Pressable>
      </View>

      {isExpanded && (
        <View>
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
                      className="w-[100%] aspect-square rounded-lg"
                    />
                  </Pressable>
                  <Text numberOfLines={2} ellipsizeMode="tail">
                    {similarItem.title}
                  </Text>
                  <Text>{similarItem.source}</Text>
                  <Button
                    width="100%"
                    title="Select"
                    
                    onPress={() => { 
                      handleSelect(similarItem.link)
                      setIsExpanded(!isExpanded);
                    }}
                  />
                </View>
              ))
            ) : (
              <Text>No similar items found</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );

};

export default PieceComponent;

