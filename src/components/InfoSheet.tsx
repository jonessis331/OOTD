import { View, Text, Image } from 'react-native';
import React from 'react';

const InfoSheet = ({ item }) => {
  if (!item) return null; // Return null if item is undefined
  console.log(JSON.stringify(item, null, 2))
  const tags = item?.tags || {}; // Ensure tags is defined
  const deepTags = tags?.deepTags || {};
  const openAITags = tags?.openAITags || {};

  // Get the highest confidence color
  const highestConfidenceColor = deepTags?.colors?.reduce(
    (prev, current) => (current.confidence > prev.confidence ? current : prev),
    { name: 'unknown color', hex_code: '#000000', confidence: 0 }
  );
  
  const material = openAITags?.openTagsTwo?.material || openAITags?.scraped_tags?.material || 'unknown material';

  // Join the occasions if it's an array
  const occasionArray = openAITags?.openTagsOne?.occasion || openAITags?.openTagsTwo?.occasion || openAITags?.scraped_tags?.occasion || [];
  const occasion = Array.isArray(occasionArray) ? occasionArray.join(', ') : 'various occasions';

  const brand = openAITags?.openTagsOne?.brand_name ||openAITags?.openTagsTwo?.['brand name'] || openAITags?.scraped_tags?.brand_name || 'a renowned brand';
  const category = openAITags?.openTagsOne?.category || openAITags?.openTagsTwo?.category || openAITags?.scraped_tags?.category || 'fashion category';
  const style = openAITags?.openTagsOne?.style ||openAITags?.openTagsTwo?.style || openAITags?.scraped_tags?.style || 'a stylish piece';

  // Get labels with high confidence (> 0.8)
  const relevantLabels = deepTags?.labels?.filter(label => label.confidence > 0.8) || [];
  const labelsText = relevantLabels.map(label => label.name).join(', ');
  const thumbnail = item?.googleItem?.thumbnail
  const title = item?.googleItem?.title || openAITags?.openTagsOne?.name_of_item || openAITags?.openTagsTwo?.name_of_item || openAITags?.scraped_tags?.title
  const link = item.googleItem?.link
  
  // Construct the info paragraph
  //const infoParagraph = `This item is a ${material} ${style}, featuring a ${highestConfidenceColor.name} color (Hex: ${highestConfidenceColor.hex_code}), perfect for ${occasion}. It belongs to the ${category} category, made by ${brand}. Notably, it includes features like ${labelsText}.`;
  
  const bulletPoints = [
    `Material: ${material}\n`,
    `Style: ${style}\n`,
    `Color: ${highestConfidenceColor?.name} \n`,
    `Occasion: ${occasion}\n`,
    `Category: ${category}\n`,
    `Brand: ${brand}\n`,
    `Features: ${labelsText}`
  ];

  return (
    <View className="bg-slate-500">
      <Text className="font-mono font-bold text-xl" numberOfLines={1}>
        {title || "Item Name"}
      </Text>
      <View className="flex-row items-center rounded-xl w-full">
        <Text className="font-mono text-xs w-50" numberOfLines={3}>
          {bulletPoints}
        </Text>
        {/* <View
          style={{
            // Width of the square
            width: 50,
            marginLeft: 'auto',
            paddingRight: 10,
            height: 50, // Height of the square
            backgroundColor: "#" + highestConfidenceColor?.hex_code, // Set background color to the hex code
            marginTop: 10, // Space above the square
          }}
        /> */}
        
          <Image
            source={{ uri: thumbnail }}
            style={{ width: 50, height: 50, borderRadius: 10, marginLeft: 'auto'}}
          />
        
      </View>
    </View>
  );
}

export default InfoSheet;
