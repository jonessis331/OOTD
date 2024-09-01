import React, { useState } from "react";
import { Image, Pressable, Text, View, TextInput, ActivityIndicator } from "react-native";
import { DetectedItem } from "../utils/dataTypes";
import { useNavigation } from '@react-navigation/native';
import Button from "./Button";
import { scrapUrl, scrapUrlWithBeeScraper } from "~/src/lib/scraperapi";
import { generateTags, generateTagsTwo } from "~/src/lib/openai";
import * as WebBrowser from 'expo-web-browser';
import { fetchAndParseWebpage, fetchProductInfo } from "../lib/experiment";

import { log } from "~/src/utils/config";
import { logIncomingData } from "~/src/utils/config"; // Import the logging utility

const PieceComponent = ({ item, onItemSelect }: { item: DetectedItem, onItemSelect: (selectedTags: any) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [link, setLink] = useState(""); // State to manage the input link

  const handleSelect = async (link: string) => {
    logIncomingData(link, 'handleSelect'); // Log incoming data
    setLoading(true); // Start loading
    try {
      console.log("Entering handleSelect function");
      
      const parseResponse = await fetchAndParseWebpage(link);
      logIncomingData(parseResponse, 'fetchAndParseWebpage Response'); // Log response data

      const openTagsTwo = await generateTagsTwo(parseResponse.paragraph);
      logIncomingData(openTagsTwo, 'generateTagsTwo Response'); // Log response data

      let openTagsOne;
      if (!link.includes('amazon')) {
        const scrappedINFO = await scrapUrlWithBeeScraper(link);
        logIncomingData(scrappedINFO, 'scrapUrlWithBeeScraper Response'); // Log response data
        openTagsOne = await generateTags(scrappedINFO);
        logIncomingData(openTagsOne, 'generateTags Response'); // Log response data
      } else {
        openTagsOne = null;
      }

      const data = await scrapUrl(link);
      const scraped_tags = await generateTags(data);
      logIncomingData(scraped_tags, 'scrapUrl Response'); // Log response data

      // Pass the generated tags back to the parent component
      onItemSelect({
        itemId: item.name,
        tags: {
          openTagsOne,
          openTagsTwo,
          scraped_tags,
          material: parseResponse.materialTags,
          Brand: parseResponse.brand,
          Other: parseResponse.otherTags,
          // Include any additional tags you want to store
        }
      });

    } catch (error) {
      log.error('error tagging scraped:', error);
    } finally {
      log.info("Leaving handleSelect")
      setLoading(false); // End loading
    }
  };
  return (
    <View className="mt-5">
      <View className="flex-row items-center w-full bg-white rounded-full p-2">
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <View className="flex-row gap-3 items-center">
            <Image source={{ uri: item.cropUrl }} className="w-24 aspect-square rounded-full" />
            <Text className="text-3xl font-mono font-extrabold">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <TextInput
              className="w-11 items-center bg-white"
              value={link}
              onChangeText={setLink}
              onSubmitEditing={() => handleSelect(link)}
              returnKeyType="go"
            />
          </View>
        </Pressable>
        <Pressable className="ml-auto" onPress={async () => await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")}>
          <View className="w-12 aspect-square rounded-full bg-slate-800 ml-2" />
        </Pressable>
      </View>

      {isExpanded && (
        <View className="flex flex-row flex-wrap">
          {item.similarItems && item.similarItems.length > 0 ? (
            item.similarItems.map((similarItem, index) => (
              <View key={index} style={{ width: "45%", margin: "2.5%" }}>
                <Pressable onPress={async () => await WebBrowser.openBrowserAsync(similarItem.link)}>
                  <Image source={{ uri: similarItem.thumbnail }} className="w-full aspect-square rounded-lg" />
                </Pressable>
                <Text numberOfLines={2} ellipsizeMode="tail">
                  {similarItem.title}
                </Text>
                <Text>{similarItem.source}</Text>
                <Button width="100%" title="Select" onPress={() => handleSelect(similarItem.link)} />
                {loading && <ActivityIndicator size="small" color="#0000ff" />}
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

