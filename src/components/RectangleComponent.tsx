import React from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import SmallItem from './SmallItem';

const { width, height } = Dimensions.get('window');

const RectangleComponent = ({ items }) => {
  return (
    
    <View style={styles.rectangle} > 
    <TextInput className = 'w-full h-9 bg-white opacity-50'>

    </TextInput>
    <ScrollView className= 'flex-fit'>
      {items.map((item, index) => (
        <SmallItem key={index} item={item} /> // Render SmallItem for each item
      ))}
    </ScrollView>
    <TouchableOpacity className = 'bg-slate-600'>

    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    width: width * 0.75, // 3/4 of the screen width
    height: height * 0.75, // 3/4 of the screen height
    backgroundColor: 'lightgray', // Change color as needed
    position: 'absolute', // Position it absolutely if needed
    top: height * 0.0, // Center it vertically
    left: width * 0.01, // Center it horizontally
    zIndex: 1, // Ensure it appears above other components
    padding: 10,
  },
});

export default RectangleComponent;