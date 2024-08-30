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

import { useNavigation } from '@react-navigation/native';


import { logger } from "react-native-logs";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as WebBrowser from 'expo-web-browser';
import Button from "~/src/components/Button";
import PieceComponent from "~/src/components/PieceComponent";
import { uploadImage, makeImagePublic } from "~/src/lib/cloudinary";
import { detectItems, getDeepTags } from "~/src/lib/lykdat";
import { fetchGoogleLensResults } from "~/src/lib/googlelens";
import { scrapUrl, scrapUrlWithBeeScraper } from "~/src/lib/scraperapi";
import { generateTags, generateTagsTwo } from "~/src/lib/openai";
import { createCompleteOutfitData } from "~/src/lib/dataprocess";
import { DetectedItem, OutfitMetadata } from "~/src/utils/dataTypes";
import deepTagsMock from "~/mock_data/deep_tags.json";
import googleLensMock from "~/mock_data/google_lens_response.json";
import mockDetectedItems from "~/mock_data/detected_items.json";
import mockResponse from "~/mock_data/mock_response.json";

import { fetchAndParseWebpage, fetchProductInfo } from "~/src/lib/experiment";
import { useMockData } from '~/src/utils/config';

type ImageUrl = string;
var log = logger.createLogger();


export default function New() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<DetectedItem[]>([]); // Detected items array
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: any }>({}); // Store selected tags
  const [isLoading, setIsLoading] = useState(false); // Loading state for the entire process


  
  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const processDetectedItems = async (
    detectedItems: DetectedItem[],
    imageUrl: ImageUrl
  ): Promise<DetectedItem[]> => {
    log.info("Entering processDetectedItems function"); // Log added
    const enrichedItems: DetectedItem[] = [];

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

      let googleLensResults, tags;
      try {
        if (useMockData) {
          googleLensResults = googleLensMock;
          tags = deepTagsMock;
        } else {
          googleLensResults = await fetchGoogleLensResults(cropUrl);
          tags = await getDeepTags(cropUrl);
        }

        enrichedItems.push({
          cropUrl,
          ...item,
          similarItems: [], 
          //similarItems: googleLensResults.visual_matches || [], // Add similarItems to each detected item
          tags,
        });
      } catch (error) {
        log.error(`Error processing item ${item.name}:`, error);
        enrichedItems.push({
          ...item,
          similarItems: [],
          tags: [],
        }); // Fallback if an error occurs
      }
    }

    return enrichedItems;
  };

  const handleItemSelect = (selectedTagsForItem: any) => {
    log.info("Selected Tags For Item:", selectedTagsForItem); // Debugging line

    setSelectedTags(prevTags => {
      const updatedTags = {
        ...prevTags,
        [selectedTagsForItem.itemId]: {
          ...prevTags[selectedTagsForItem.itemId], // Preserve existing tags if any
          ...selectedTagsForItem.tags, // Merge new tags
        }
      };
      log.info("Updated Tags:", JSON.stringify(updatedTags, null, 6)); // Debugging line
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
      const response = useMockData ? mockResponse : await uploadImage(manipResult.uri);
      setImageUrl(response.secure_url);

      setIsLoading(true); // Start loading
      try {
        // Choose whether to use mock detected items or actual detection
        const detectedItemsResponse = useMockData ? mockDetectedItems : await detectItems(response.secure_url);
        
        const enrichedItems = await processDetectedItems(
          detectedItemsResponse.data.detected_items,
          response.secure_url
        );
        log.info(typeof(JSON.stringify(enrichedItems, null, 2)))
        log.info(typeof(enrichedItems))
        log.info("enrichedItems", JSON.stringify(enrichedItems, null, 2));
        setItems(enrichedItems);
      } catch (error) {
        Alert.alert("Error getting detected items");
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };


  const createPost = async () => {
    log.info("Entering createPost function"); // Log added

    if (!imageUrl) {
      return;
    }
    try {
      //await makeImagePublic(imageUrl);
      log.info(JSON.stringify(items), imageUrl, JSON.stringify(selectedTags))
      await createCompleteOutfitData(items, imageUrl, selectedTags);
    } catch (error) {
      Alert.alert("Error making image public");
    }
  };

  const handleCancel = () => {
    log.info("Entering handleCancel function"); // Log added
    setImage(null);
    setImageUrl(null);
    setItems([]); // Clear detected items
    setSelectedTags({}); // Clear selected tags
  };

  const handleTest = async () => {
    const productOuputParse = fetchProductInfo('https://www.amazon.com/Adriana-Degreas-Metallic-Shoulder-Feathers/dp/B09X8CZRX6');
    // if (productOuputParse) {
    //   console.log("Brand", productOuputParse.brand);
    //   console.log("Materials", productOuputParse.materialTags);
    //   console.log("Other Tags", productOuputParse.otherTags);
    // }

    const parseResponse = await fetchAndParseWebpage('https://www.amazon.com/Adriana-Degreas-Metallic-Shoulder-Feathers/dp/B09X8CZRX6');
    log.info("Brand", parseResponse.brand);
    log.info("Materials", parseResponse.materialTags);
    log.info("Other Tags", parseResponse.otherTags);
  };

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
          <Pressable className="w-5 aspect-square bg-zinc-950" onPress={handleTest}>
          </Pressable>
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
            <PieceComponent key={index} item={item} onItemSelect={handleItemSelect} />
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


// const handleSelect = async (link: string) => {
  
//   try {
//     const data = await scrapUrl(link);
//     // //console.log('scraped data', JSON.stringify(data)); 
//     //const mock_data = mockScrapeData;
//     try {
//       const scraped_tags = await generateTags(data);
//       //console.log('scraped tags',  JSON.stringify(scraped_tags))
      
//     } catch (error) {
//       //console.error('error tagging scraped:', error);
      
//     }
    

//   } catch (error) {
//     //console.error('error during scraping:', error);
//   }
// };

// const PieceComponent = ({ item }: { item: DetectedItem }) => {

//   const navigation = useNavigation()
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [itemSelected, setItemSelected] = useState();




//   return (
//     <View style={{ marginTop: 20 }}>
//       <View className="flex-row items-center w-full bg-gray-200 rounded-full p-2">
//         <Pressable onPress={() => setIsExpanded(!isExpanded)}>
//           <View className="flex-row gap-3 items-center">
//             <Image
//               source={{ uri: item.cropUrl }}
//               className="w-10 aspect-square rounded-full"
//             />
//             <Text className="font-serif font-extrabold">
//               {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
//             </Text>
//             <TextInput className = "w-11 items-center bg-white">

//             </TextInput>
//           </View>
//         </Pressable>
//         <Pressable
//           className = "ml-auto"
//           onPress={async () =>
//             await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")
//           }
          
//           // save webpage last open url and toggle is manual to flag for deep tag additional call
//         >
//           <View className="w-12 aspect-square rounded-full bg-slate-800 ml-2"></View>
//         </Pressable>
//       </View>

//       {isExpanded && (
//         <View>
//           <View className="flex flex-row flex-wrap">
//             {item.similarItems && item.similarItems.length > 0 ? (
//               item.similarItems.map((similarItem, index) => (
//                 <View key={index} style={{ width: "45%", margin: "2.5%" }}>
//                   <Pressable
//                     onPress={async () =>
//                       await WebBrowser.openBrowserAsync(similarItem.link)
//                     }
//                   >
//                     <Image
//                       source={{ uri: similarItem.thumbnail }}
//                       className="w-[100%] aspect-square rounded-lg"
//                     />
//                   </Pressable>
//                   <Text numberOfLines={2} ellipsizeMode="tail">
//                     {similarItem.title}
//                   </Text>
//                   <Text>{similarItem.source}</Text>
//                   <Button
//                     width="100%"
//                     title="Select"
//                     onPress={() => { 
//                       handleSelect(similarItem.link)
//                       setIsExpanded(!isExpanded);
//                     }}
//                   />
//                 </View>
//               ))
//             ) : (
//               <Text>No similar items found</Text>
//             )}
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };