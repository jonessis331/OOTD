import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import InfoSheet from './InfoSheet';


const SmallItemImageOnly = ({ item }) => {
    const tags = item?.tags || {}; // Ensure tags is defined
    const deepTags = tags?.deepTags || {};
    const openAITags = tags?.openAITags || {};
    //console.warn(item, "item")
    const brand = openAITags?.openTagsTwo?.['brand name'] || item.openAITags?.scraped_tags?.brand_name || ''; 
    
  return (
    <View style={styles.container}>
      <View>
      <Image source={{ uri:  item.item_image_url }} style={styles.image} />
     </View>
    {/* <Text style={styles.brand}>{brand}</Text> */}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50, // Adjust width as needed
    alignItems: 'center',
    margin: 5,
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 12,
    color: 'gray',
  },
});

export default SmallItemImageOnly;