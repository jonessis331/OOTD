import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";

import { useAuth } from "~/src/providers/AuthProvider";
import { log, logIncomingData } from "~/src/utils/config";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Button from "~/src/components/Button";
import PieceComponent from "~/src/components/PieceComponent";
import {
  removeBackground,
  uploadImage,
  uploadNoBackground,
} from "~/src/lib/cloudinary";
import { detectItems } from "~/src/lib/lykdat";
import { fetchGoogleLensResults } from "~/src/lib/googlelens";
import { createCompleteOutfitData } from "~/src/lib/dataprocess";
import { DetectedItem, ImageUrl, SimilarItem } from "~/src/utils/dataTypes";
import googleLensMock from "~/mock_data/google_lens_response.json";
import mockDetectedItems from "~/mock_data/detected_items.json";
import mockResponse from "~/mock_data/mock_response.json";

import { useMockData } from "~/src/utils/config";

// Import missing functions
import { fetchAndParseWebpage, fetchProductInfo } from "~/src/lib/experiment";
import { scrapUrl, scrapUrlWithBeeScraper } from "~/src/lib/scraperapi";
import { generateTags, generateTagsTwo } from "~/src/lib/openai";
import { getDeepTags } from "~/src//lib/lykdat";

export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | "">(""); // New state for public_id
  const [items, setItems] = useState<DetectedItem[]>([]); // Detected items array
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: any }>({}); // Store selected tags
  const [selectedSimilarItems, setSelectedSimilarItems] = useState<{
    [key: string]: SimilarItem;
  }>({});
  const [googleItems, setGoogleItems] = useState<{
    [key: string]: SimilarItem;
  }>({});
  const [isLoading, setIsLoading] = useState(false); // Loading state for the entire process
  const [isProcessingItems, setIsProcessingItems] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const processDetectedItems = async (
    detectedItems: DetectedItem[],
    imageUrl: ImageUrl
  ): Promise<DetectedItem[]> => {
    logIncomingData({ detectedItems, imageUrl }, "processDetectedItems");
    log.info("Entering processDetectedItems function");

    const enrichedItems: DetectedItem[] = [];
    const itemNameCounters: { [key: string]: number } = {}; // Counter for item names

    for (const item of detectedItems) {
      // Update item name counters
      const lowerCaseItemName = item.name.toLowerCase();
      if (itemNameCounters[lowerCaseItemName]) {
        itemNameCounters[lowerCaseItemName] += 1;
      } else {
        itemNameCounters[lowerCaseItemName] = 1;
      }
      const itemId = `${lowerCaseItemName}_${itemNameCounters[lowerCaseItemName]}`;

      const { bounding_box } = item;
      const cropUrl = `${imageUrl.replace(
        "/upload/",
        `/upload/c_crop,w_${Math.round(
          Math.abs(bounding_box.left * 800 - bounding_box.right * 800)
        )},h_${Math.round(
          Math.abs(bounding_box.top * 800 - bounding_box.bottom * 800)
        )},x_${Math.round(bounding_box.left * 800)},y_${Math.round(
          bounding_box.top * 800
        )}/`
      )}`;

      let googleLensResults;
      try {
        if (useMockData) {
          googleLensResults = googleLensMock;
        } else {
          googleLensResults = await fetchGoogleLensResults(cropUrl);
        }

        enrichedItems.push({
          itemId,
          cropUrl,
          ...item,
          similarItems: googleLensResults.visual_matches || [],
          bounding_box: item.bounding_box,
          tags: [],
        });
      } catch (error) {
        log.error(`Error processing item ${item.name}:`, error);
        enrichedItems.push({
          itemId,
          ...item,
          similarItems: [],
          tags: [],
        });
      } finally {
        log.info("Leaving processDetectedItems");
      }
    }

    return enrichedItems;
  };

  const handleItemSelect = (selectedItemData: any) => {
    const { itemId, similarItem } = selectedItemData;
    const lowerCaseItemId = itemId.toLowerCase(); // Ensure consistent item IDs
    setSelectedSimilarItems((prevState) => ({
      ...prevState,
      [itemId]: similarItem,
    }));
  };

  const pickImage = async () => {
    log.info("Entering pickImage function");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    logIncomingData(result, "pickImage");

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Resize the image to ensure it is under 3MB
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Adjust the width as needed
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipResult.uri);

      // Choose whether to use mock response or actual upload
      const response = useMockData
        ? mockResponse
        : await uploadImage(manipResult.uri);
      setImageUrl(response.secure_url);
      setPublicId(response.public_id); // Save the public_id

      setIsLoading(true); // Start loading
      try {
        // Choose whether to use mock detected items or actual detection
        const detectedItemsResponse = useMockData
          ? mockDetectedItems
          : await detectItems(response.secure_url);
        logIncomingData(detectedItemsResponse, "detectedItemsResponse");

        const enrichedItems = await processDetectedItems(
          detectedItemsResponse.data.detected_items,
          response.secure_url
        );
        logIncomingData(
          enrichedItems,
          "after processDetectedItems back in pickImage"
        );
        setItems(enrichedItems);
      } catch (error) {
        Alert.alert("Error getting detected items");
      } finally {
        log.info("Leaving pickImage");
        setIsLoading(false); // End loading
      }
    }
  };

  const createPost = async () => {
    logIncomingData(
      { imageUrl, publicId, items, selectedTags, googleItems },
      "createPost"
    );

    if (!imageUrl) {
      return;
    }
    try {
      await createCompleteOutfitData(
        items,
        imageUrl,
        publicId,
        selectedTags,
        googleItems,
        user?.id
      );
      Alert.alert("Post created successfully");
    } catch (error) {
      Alert.alert("Error creating post");
    } finally {
      log.info("Leaving createPost");
    }
  };

  const handleCancel = () => {
    log.info("Entering handleCancel function");
    setImage(null);
    setImageUrl(null);
    setPublicId(""); // Clear the public_id
    setItems([]); // Clear detected items
    setSelectedTags({}); // Clear selected tags
    setSelectedSimilarItems({});
    setGoogleItems({});
  };

  const handleContinue = async () => {
    setIsProcessingItems(true);
    try {
      const itemIds = Object.keys(selectedSimilarItems);
      const processingPromises = itemIds.map(async (itemId) => {
        const similarItem = selectedSimilarItems[itemId];
        try {
          const processedData = await processSimilarItem(similarItem, itemId);
          return { itemId, processedData };
        } catch (error) {
          log.error(`Error processing item ${itemId}:`, error);
          return { itemId, processedData: null }; // Return null data but include itemId
        }
      });

      const results = await Promise.all(processingPromises);

      const tagsUpdates: { [key: string]: any } = {};
      const googleItemsUpdates: { [key: string]: SimilarItem } = {};

      results.forEach((result) => {
        const { itemId, processedData } = result;
        if (processedData) {
          tagsUpdates[itemId] = processedData.tags;
          googleItemsUpdates[itemId] = processedData.googleItem;
        }
      });

      setSelectedTags((prevTags) => ({
        ...prevTags,
        ...tagsUpdates,
      }));

      setGoogleItems((prevGoogleItems) => ({
        ...prevGoogleItems,
        ...googleItemsUpdates,
      }));

      if (Object.keys(tagsUpdates).length === 0) {
        Alert.alert("Failed to process items. Please try again.");
      }
    } catch (error) {
      log.error("Error processing items:", error);
      Alert.alert("An error occurred while processing items.");
    } finally {
      setIsProcessingItems(false);
    }
  };

  const processSimilarItem = async (
    similarItem: SimilarItem,
    itemId: string
  ) => {
    try {
      const parseResponse = await fetchAndParseWebpage(similarItem.link);

      const openTagsTwo = await generateTagsTwo({
        paragraph: parseResponse.paragraph,
        link: similarItem.link,
        title: similarItem.title,
        source: similarItem.source,
      });

      let openTagsOne;
      if (!similarItem.link.includes("amazon")) {
        const scrappedINFO = await scrapUrlWithBeeScraper(similarItem.link);
        openTagsOne = await generateTags({
          paragraph: JSON.stringify(scrappedINFO),
          link: similarItem.link,
          title: similarItem.title,
          source: similarItem.source,
        });
      } else {
        openTagsOne = null;
      }

      const data = await scrapUrl(similarItem.link);
      const scraped_tags = await generateTags({
        paragraph: data,
        link: similarItem.link,
        title: similarItem.title,
        source: similarItem.source,
      });

      const item = items.find((item) => item.itemId === itemId);

      const deepTags = similarItem.thumbnail
        ? await getDeepTags(similarItem.thumbnail ?? "")
        : await getDeepTags(item?.cropUrl ?? "");

      const background_response = await uploadImage(similarItem.thumbnail);
      //const n_background = await
      const local_n_background = await removeBackground(
        background_response.url
      );
      const processedData = {
        googleItem: {
          n_background_thumbnail: background_response.public_id,
          n_background_local: local_n_background.url,
          link: similarItem.link,
          title: similarItem.title,
          source: similarItem.source,
          thumbnail: similarItem.thumbnail,
        },
        tags: {
          openTagsOne,
          openTagsTwo,
          scraped_tags,
          deepTags,
          material: parseResponse.materialTags,
          Brand: parseResponse.brand,
          Other: parseResponse.otherTags,
        },
      };

      return processedData;
    } catch (error) {
      log.error("Error processing similar item:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView className="bg-[#FFFCF1]">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "#FFFCF1",
          height: "100%",
        }}
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-dvw aspect-[2/3] rounded-2xl self-center"
              />
            ) : (
              <PlaceholderImage />
            )}
            <Text
              onPress={pickImage}
              className="text-blue-500 font-bold mt-5 self-center"
            >
              Change
            </Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Caption for you outfit"
              className="bg-white w-full p-3 rounded-xl mt-5"
            />
            {items.map((item, index) => (
              <PieceComponent
                key={index}
                item={item}
                onItemSelect={handleItemSelect}
              />
            ))}
          </>
        )}
        <View className="mt-5 w-full">
          {Object.keys(selectedSimilarItems).length > 0 &&
            !isProcessingItems && (
              <Button width="100%" title="Continue" onPress={handleContinue} />
            )}
          {isProcessingItems && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isProcessingItems && (
            <>
              <Button width="100%" title="Share" onPress={createPost} />
              <Button width="100%" title="Cancel" onPress={handleCancel} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const LoadingIndicator = () => (
  <View className="flex items-center">
    <ActivityIndicator size="large" color="#0000ff" />
    <Text className="mt-2">Analyzing image...</Text>
  </View>
);

const PlaceholderImage = () => (
  <View className="w-52 h-80 rounded-xl bg-gray-300 self-center" />
);
