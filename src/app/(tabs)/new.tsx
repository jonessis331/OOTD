import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Button from "~/src/components/Button";
import { uploadImage, makeImagePublic } from "~/src/lib/cloudinary";
import { searchImage, detectItems, getDeepTags } from "~/src/lib/lykdat";


type BoundingBox = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type DetectedItem = {
  area: number;
  bounding_box: BoundingBox;
  category: string;
  detection_confidence: number;
  name: string;
};

type ImageUrl = string;

function deepStringify(obj: any, space: number = 2): string {
  const cache = new Set();
  const jsonString = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  }, space);
  cache.clear();
  return jsonString;
}

export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState(null);
  const [deepTags, setDeepTags] = useState(null);

  const [items, setItems] = useState<DetectedItem[]>([]); // Initialize as an empty array

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
      const response = await uploadImage(manipResult.uri);
      setImageUrl(response.secure_url);

      try {
        const items = await detectItems(response.secure_url);
        setItems(items.data.detected_items);
        console.log("Items:", JSON.stringify(items, null, 2));
        processDetectedItems(items.data.detected_items, response.secure_url);
      } catch (error) {
        Alert.alert("Error getting detected items");
      }

      // Search for similar images using the URL from Cloudinary
      // try {
      //   const results = await searchImage(response.secure_url);
      //   setSearchResults(results);
      //  // console.log("Results:", JSON.stringify(results, null, 2));
      // } catch (error) {
      //   Alert.alert("Error searching image");
      // }
      // Get deep tags using the URL from Cloudinary
      // try {
      //   const tags = await getDeepTags(response.secure_url);
      //   setDeepTags(tags);
      //   console.log("Deep Tags:", JSON.stringify(tags, null, 2));
      // } catch (error) {
      //   Alert.alert("Error getting deep tags");
      // }
    }
  };

  const processDetectedItems = async (detectedItems: DetectedItem[], imageUrl: ImageUrl) => {
    if (!detectedItems.length || !imageUrl) return;
    console.log("Item Count:", detectItems.length)

    for (const item of detectedItems) {
      const { bounding_box } = item;
      const cropUrl = `${imageUrl.replace('/upload/', `/upload/c_crop,w_${Math.round(bounding_box.right * 800)},h_${Math.round(bounding_box.bottom * 800)},x_${Math.round(bounding_box.left * 800)},y_${Math.round(bounding_box.top * 800)}/`)}`;
      console.log("crop url:", cropUrl);

      // Perform specific search and tag checks for each cropped image
      try {
        const results = await searchImage(cropUrl);
        //console.log(`Search results for ${item.name}:`, deepStringify(results));
        console.log(`Search results for ${item.name}`);
      } catch (error) {
        console.error(`Error searching image for ${item.name}:`, error);
      }

      try {
        const tags = await getDeepTags(cropUrl);
        //console.log(`Deep tags for ${item.name}:`, deepStringify(tags));
        console.log(`Deep Tags for ${item.name}`);
      } catch (error) {
        console.error(`Error getting deep tags for ${item.name}:`, error);
      }
    }
  };

  const createPost = async () => {
    if (!imageUrl) {
      return;
    }
    // Make the image public
    try {
      await makeImagePublic(imageUrl);
      // save the post in database
      console.log("image url:", imageUrl);
    } catch (error) {
      Alert.alert("Error making image public");
    }
  };

  const handleCancel = async () => {
    setImage(null);
    setImageUrl(null);
  };

  return (
    <View className="p-3 items-center flex-1">
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-52 aspect-[3/4] rounded-lg"
        />
      ) : (
        <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
      )}
      <Text onPress={pickImage} className="text-blue-500 font-semibold m-5">
        Change
      </Text>
      <TextInput
        value={caption}
        onChangeText={(newValue) => setCaption(newValue)}
        placeholder="What is on your mind"
        className="bg-white w-72 p-3 rounded-full"
      />
      {searchResults && (
        <View>
          <Text>Results:</Text>
          {/* Render search results here */}
        </View>
      )}
      {deepTags && (
        <View>
          <Text>Deep Tags:</Text>
          {/* Render deep tags here */}
        </View>
      )}
      <View className="mt-auto w-full">
        <Button title="Share" onPress={createPost} />
        <Button title="Cancel" onPress={handleCancel} />
      </View>
      
    </View>
  );
}