import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


const SmallItem = ({ item }) => {
    const tags = item?.tags || {}; // Ensure tags is defined
    const deepTags = tags?.deepTags || {};
    const openAITags = tags?.openAITags || {};
    console.warn(item, "item")
    const brand = openAITags?.openTagsTwo?.['brand name'] || item.openAITags?.scraped_tags?.brand_name || 'No Brand'; 
    
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.item_image_url }} style={styles.image} />
      <Text style={styles.title}>{item.name || item.title || 'No Name'}</Text>
    <Text style={styles.brand}>{brand}</Text>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100, // Adjust width as needed
    alignItems: 'center',
    margin: 5,
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

export default SmallItem;