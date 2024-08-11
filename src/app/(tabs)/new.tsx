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
import { cld, uploadImage, makeImagePublic } from "~/src/lib/cloudinary";
import { searchImage } from "~/src/lib/lykdat";
import { getDeepTags } from "~/src/lib/lykdatTags"; // Import the getDeepTags function

export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState(null);
  const [deepTags, setDeepTags] = useState(null);

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
      setImagePublicId(response.public_id);
      setImageUrl(response.secure_url);

      // Search for similar images using the URL from Cloudinary
      try {
        const results = await searchImage(response.secure_url);
        setSearchResults(results);
        console.log("Results:", JSON.stringify(results, null, 2));
      } catch (error) {
        Alert.alert("Error searching image");
      }

      // Get deep tags using the URL from Cloudinary
      try {
        const tags = await getDeepTags(response.secure_url);
        setDeepTags(tags);
        console.log("Deep Tags:", JSON.stringify(tags, null, 2));
      } catch (error) {
        Alert.alert("Error getting deep tags");
      }
    }
  };

  const createPost = async () => {
    if (!imagePublicId) {
      return;
    }
    // Make the image public
    try {
      await makeImagePublic(imagePublicId);
      // save the post in database
      console.log("image id:", imagePublicId);
    } catch (error) {
      Alert.alert("Error making image public");
    }
  };

  const handleCancel = async () => {
    setImage(null);
    setImagePublicId(null);
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
        className="bg-white w-full p-3"
      />
      <View className="mt-auto w-full">
        <Button title="Share" onPress={createPost} />
        <Button title="Cancel" onPress={handleCancel} />
      </View>
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
    </View>
  );
}