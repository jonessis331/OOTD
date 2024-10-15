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
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "~/src/providers/AuthProvider";
import { log, logIncomingData } from "~/src/utils/config";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as WebBrowser from "expo-web-browser";
import Button from "~/src/components/Button";
import PieceComponent from "~/src/components/PieceComponent";
import { uploadImage, makeImagePublic } from "~/src/lib/cloudinary";
import { detectItems, getDeepTags } from "~/src/lib/lykdat";
import { fetchGoogleLensResults } from "~/src/lib/googlelens";
import { scrapUrl, scrapUrlWithBeeScraper } from "~/src/lib/scraperapi";
import { generateTags, generateTagsTwo } from "~/src/lib/openai";
import { createCompleteOutfitData } from "~/src/lib/dataprocess";
import {
  DetectedItem,
  normalizeItemName,
  OutfitMetadata,
} from "~/src/utils/dataTypes";
import deepTagsMock from "~/mock_data/deep_tags.json";
import googleLensMock from "~/mock_data/google_lens_response.json";
import mockDetectedItems from "~/mock_data/detected_items.json";
import mockResponse from "~/mock_data/mock_response.json";
import { fetchAndParseWebpage, fetchProductInfo } from "~/src/lib/experiment";
import { useMockData } from "~/src/utils/config";
type ImageUrl = string;
export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | "">(""); // New state for public_id
  const [items, setItems] = useState<DetectedItem[]>([]); // Detected items array
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: any }>({}); // Store selected tags
  const [isLoading, setIsLoading] = useState(false); // Loading state for the entire process
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
    logIncomingData({ detectedItems, imageUrl }, "processDetectedItems"); // Log incoming data
    log.info("Entering processDetectedItems function");
    const enrichedItems: DetectedItem[] = [];
    for (const item of detectedItems) {
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
      let googleLensResults, tags;
      try {
        if (useMockData) {
          googleLensResults = googleLensMock;
          //tags = deepTagsMock;
        } else {
          //googleLensResults = googleLensMock;
          //tags = deepTagsMock;
          googleLensResults = await fetchGoogleLensResults(cropUrl);
          //tags = await getDeepTags(cropUrl);
        }
        enrichedItems.push({
          cropUrl,
          ...item,
          //similarItems: [],
          similarItems: googleLensResults.visual_matches || [], // Add similarItems to each detected item
          bounding_box: item.bounding_box,
          tags: [],
        });
      } catch (error) {
        log.error(`Error processing item ${item.name}:`, error);
        enrichedItems.push({
          ...item,
          similarItems: [],
          tags: [],
        }); // Fallback if an error occurs
      } finally {
        log.info("leaving processDetectedItem");
      }
    }
    return enrichedItems;
  };
  const handleItemSelect = (selectedTagsForItem: any) => {
    logIncomingData(selectedTagsForItem, "handleItemSelect"); // Log incoming data
    log.info("(handleItemSelct) Selected Tags For Item:", selectedTagsForItem); // Debugging line

    setSelectedTags((prevTags) => {
      const updatedTags = {
        ...prevTags,
        [selectedTagsForItem.itemId]: {
          ...prevTags[selectedTagsForItem.itemId], // Preserve existing tags if any
          ...selectedTagsForItem.tags, // Merge new tags
          googleItem: selectedTagsForItem.googleItem, // Ensure googleItem is included
        },
      };
      //log.info("Updated Tags:", JSON.stringify(updatedTags, null, 6)); // Debugging line
      log.info("leaving handleItemSelect");
      return updatedTags;
    });
  };
  const pickImage = async () => {
    log.info("Entering pickImage function"); // Log added
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    logIncomingData(result, "pickImage"); // Log incoming data
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
          "after processDetectedItems back in PickImage"
        );
        //log.info(typeof(JSON.stringify(enrichedItems, null, 2)))
        //log.info(typeof(enrichedItems))
        // log.info("enrichedItems", JSON.stringify(enrichedItems, null, 2));
        setItems(enrichedItems);
      } catch (error) {
        Alert.alert("Error getting detected items");
      } finally {
        log.info("leaving pickImage");
        setIsLoading(false); // End loading
      }
    }
  };
  const createPost = async () => {
    logIncomingData({ imageUrl, publicId, items, selectedTags }, "createPost"); // Log incoming data
    if (!imageUrl) {
      return;
    }
    try {
      await makeImagePublic(publicId);
      logIncomingData(
        {
          items: JSON.stringify(items),
          imageUrl,
          selectedTags: JSON.stringify(selectedTags),
        },
        "before createCompleteOutfit"
      );
      //console.warn(user?.id, "user id")
      await createCompleteOutfitData(
        items,
        imageUrl,
        publicId,
        selectedTags,
        user?.id
      );
    } catch (error) {
      Alert.alert("Error making image public");
    } finally {
      log.info("leaving createPost");
    }
  };
  const handleCancel = () => {
    log.info("Entering handleCancel function"); // Log added
    setImage(null);
    setImageUrl(null);
    setPublicId(""); // Clear the public_id
    setItems([]); // Clear detected items
    setSelectedTags({}); // Clear selected tags
  };
  const handleTest = async () => {
    log.info("Entering handleTest function"); // Log added
    const productOuputParse = fetchProductInfo(
      "https://www.amazon.com/Adriana-Degreas-Metallic-Shoulder-Feathers/dp/B09X8CZRX6"
    );
    // if (productOuputParse) {
    //   console.log("Brand", productOuputParse.brand);
    //   console.log("Materials", productOuputParse.materialTags);
    //   console.log("Other Tags", productOuputParse.otherTags);
    // }
    const parseResponse = await fetchAndParseWebpage(
      "https://www.amazon.com/Adriana-Degreas-Metallic-Shoulder-Feathers/dp/B09X8CZRX6"
    );
    log.info("Brand", parseResponse.brand);
    log.info("Materials", parseResponse.materialTags);
    log.info("Other Tags", parseResponse.otherTags);
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-dvw aspect-[2/3] rounded-2xl"
            />
          ) : (
            <PlaceholderImage />
          )}
          <Text onPress={pickImage} className="text-blue-500 font-bold mt-5">
            Change
          </Text>
          <Pressable
            className="w-5 aspect-square bg-zinc-950"
            onPress={handleTest}
          />
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="What is on your mind"
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
        <Button width="100%" title="Share" onPress={createPost} />
        <Button width="100%" title="Cancel" onPress={handleCancel} />
      </View>
    </ScrollView>
  );
}
const LoadingIndicator = () => (
  <View className="flex items-center">
    <ActivityIndicator size="large" color="#0000ff" />
    <Text className="mt-2">Analyzing image...</Text>
  </View>
);
const PlaceholderImage = () => (
  <View className="w-52 h-80 rounded-xl bg-gray-300" />
);
