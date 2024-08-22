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
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as WebBrowser from 'expo-web-browser';
import Button from "~/src/components/Button";
import { uploadImage, makeImagePublic } from "~/src/lib/cloudinary";
import { detectItems, getDeepTags } from "~/src/lib/lykdat";
import { fetchGoogleLensResults } from "~/src/lib/googlelens";
import deepTagsMock from "~/mock_data/deep_tags.json";
import googleLensMock from "~/mock_data/google_lens_response.json";
import mockDetectedItems from "~/mock_data/detected_items.json";
import mockResponse from "~/mock_data/mock_response.json";

type BoundingBox = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type SimilarItem = {
  link: string;
  source: string;
  title: string;
  thumbnail: string;
};

type DetectedItem = {
  area: number;
  bounding_box: BoundingBox;
  category: string;
  detection_confidence: number;
  name: string;
  similarItems?: SimilarItem[]; // Adding similarItems to DetectedItem
  cropUrl?: string;
};

type ImageUrl = string;

export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<DetectedItem[]>([]); // Detected items array
  const [isLoading, setIsLoading] = useState(false); // Loading state for the entire process

  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Resize the image to ensure it is under 3MB
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Adjust the width as needed
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipResult.uri);
      //const response = await uploadImage(manipResult.uri);
      const response = mockResponse;

      //setImageUrl(response.secure_url);
      setImageUrl(mockResponse.secure_url);

      setIsLoading(true); // Start loading
      try {
        //const detectedItemsResponse = await detectItems(response.secure_url);
        const detectedItemsResponse = mockDetectedItems;
        const enrichedItems = await processDetectedItems(
          detectedItemsResponse.data.detected_items,
          response.secure_url
        );
        //console.log("enrichedItems", JSON.stringify(enrichedItems, null, 2));
        setItems(enrichedItems);
        //console.log(enrichedItems)
      } catch (error) {
        Alert.alert("Error getting detected items");
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  const processDetectedItems = async (
    detectedItems: DetectedItem[],
    imageUrl: ImageUrl
  ): Promise<DetectedItem[]> => {
    const enrichedItems = [];

    for (const item of detectedItems) {
      const { bounding_box } = item;
      const cropUrl = `${imageUrl.replace(
        "/upload/",
        `/upload/c_crop,w_${Math.round(
          Math.abs(bounding_box.left * 800 - bounding_box.right * 800)
        )},h_${Math.round(bounding_box.bottom * 800)},x_${Math.round(
          bounding_box.left * 800
        )},y_${Math.round(bounding_box.top * 800)}/`
      )}`;

      try {
        //const googleLensResults = await fetchGoogleLensResults(cropUrl);
        const googleLensResults = googleLensMock;
        //const tags = await getDeepTags(cropUrl);
        const tags = deepTagsMock;

        enrichedItems.push({
          cropUrl,
          ...item,
          similarItems: googleLensResults.visual_matches || [], // Add similarItems to each detected item
          tags,
        });
      } catch (error) {
        console.error(`Error processing item ${item.name}:`, error);
        enrichedItems.push({
          ...item,
          similarItems: [],
          tags: [],
        }); // Fallback if an error occurs
      }
    }

    return enrichedItems;
  };

  const createPost = async () => {
    if (!imageUrl) {
      return;
    }
    try {
      await makeImagePublic(imageUrl);
      // Save the post in database (functionality can be added here)
      console.log("image url:", imageUrl);
    } catch (error) {
      Alert.alert("Error making image public");
    }
  };

  const handleCancel = () => {
    setImage(null);
    setImageUrl(null);
    setItems([]); // Clear detected items
  };

  // WebBrowser

  // const [result, setResult] = useState(null);

  // const _handlePressButtonAsync = async () => {
  //   let result = await WebBrowser.openBrowserAsync('https://expo.dev');
  //   setResult(result);
  // };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {isLoading ? (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Analyzing image...</Text>
        </View>
      ) : (
        <>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 300, borderRadius: 10 }}
            />
          ) : (
            <View
              style={{
                width: 200,
                height: 300,
                borderRadius: 10,
                backgroundColor: "#d3d3d3",
              }}
            />
          )}
          <Text
            onPress={pickImage}
            style={{ color: "#1E90FF", fontWeight: "bold", marginTop: 20 }}
          >
            Change
          </Text>
          <TextInput
            value={caption}
            onChangeText={(newValue) => setCaption(newValue)}
            placeholder="What is on your mind"
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: 10,
              borderRadius: 20,
              marginTop: 20,
            }}
          />
          {items.map((item, index) => (
            <PieceComponent key={index} item={item} />
          ))}
        </>
      )}
      <View style={{ marginTop: 20, width: "100%" }}>
        <Button width="100%" title="Share" onPress={createPost} />
        <Button width="100%" title="Cancel" onPress={handleCancel} />
      </View>
    </ScrollView>
  );
}

const PieceComponent = ({ item }: { item: DetectedItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemSelected, setItemSelected] = useState();

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
          </View>
        </Pressable>
        <Pressable
          className = "ml-auto"
          onPress={async () =>
            await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")
          }
        >
          <View className="w-12 aspect-square bg-slate-800 ml-2"></View>
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
                    onPress={() => setIsExpanded(!isExpanded)}
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
