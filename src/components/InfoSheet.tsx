import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

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
    `${brand}\n`,
    `${material}\n`,
    `${style}\n`,
    `Color: ${highestConfidenceColor?.name} \n`,
    `Occasion: ${occasion}\n`,
    `Category: ${category}\n`,
    
    `Features: ${labelsText}`
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topHalf} />
      <View style={styles.bottomHalf} />
      {/* <View className="absolute top-0 left-0 w-20 h-20 shadow-xl shadow-black"/> */}
      
      <Image
        source={{ uri: thumbnail }}
        style={styles.image}
      />
      {/* <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[ 'transparent','gray']}
        //opacity={0.3}
        style={{ position: 'absolute', bottom: -30, left: 0, right: 230, height: 140, zIndex: 10, borderRadius: 10}}
      /> */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title || "Item Name"}
        </Text>
        <Text style={styles.bulletPoints} numberOfLines={3}>
          {bulletPoints}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 0,
    marginLeft: 100,
    marginRight: 20,
    
    // borderColor: 'black',
    // borderWidth: 2,
    // borderRadius: 10,
    height: 90,
    padding: 10,
    position: 'relative',
    flexDirection: 'column', // Change to column for vertical layout
    alignItems: 'center',
    shadowRadius: 10,
    shadowOpacity: 0.9,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 3 },
  },
  topHalf: {
    ...StyleSheet.absoluteFillObject,
    height: '40%',
    backgroundColor: '#4D766E',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // shadowRadius: 0,
    // shadowOpacity: 0.9,
    // shadowColor: 'black',
    // shadowOffset: { width: 10, height: 20 }
  },
  bottomHalf: {
    ...StyleSheet.absoluteFillObject,
    top: '40%',
    backgroundColor: '#B6C2CE',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#4D766E',
    position: 'absolute',
    top: -25,
    left: -50,
    zIndex: 1,
    // borderWidth: 4,
    // borderColor: '#323232',
    

  },
  infoContainer: {
    position: 'absolute',
    top: -15,
    left: -30,
    zIndex: 20,
    marginTop: 20, // Adjust this value based on the image height and padding
    marginLeft: 100,
  },
  title: {
    fontFamily: '-tahoma',
    fontWeight: 'bold',
    fontSize: 17,
    color: '#FAFBFD',
  },
  bulletPoints: {
    marginTop: 5,
    zIndex: 20,
    fontFamily: 'serif',
    fontSize: 12,
  },
});

export default InfoSheet;
