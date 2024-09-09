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
    <View className = "rounded-xl bg-white border border-slate-600">
      <Text className="font-mono font-bold text-xl">{title || 'Item Name'}</Text>
      <View className = "flex-row grid-rows-2 rounded-xl   w-full"> 
      <Text className="font-mono text-xs w-80" numberOfLines={7}>
        {bulletPoints}
      </Text>
      <View style={{
        left: -10,
        width: 50, // Width of the square
        height: 50, // Height of the square
        backgroundColor: '#'+ highestConfidenceColor?.hex_code, // Set background color to the hex code
        marginTop: 0, // Space above the square
      }} />
      <Image source={{ uri: thumbnail }} style={{ width: 50, height: 50 }} />
      </View>
      
    </View>
  );
}

export default InfoSheet;
