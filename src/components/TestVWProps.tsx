import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width;

interface TestVWProps {
  items: { image_url: string }[];
  onIndexChange: (index: number) => void;
  renderItem: (item: { image_url: string }) => JSX.Element;
}

const TestVW: React.FC<TestVWProps> = ({ items, onIndexChange, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  // Handle index changes safely
  const handleIndexChange = (absoluteProgress: number, relativeProgress: number) => {
    const newIndex = Math.round(relativeProgress); // Use only relative progress for index calculation
    console.log("Relative Progress:", relativeProgress); // Debug log

    // Ensure we are not repeatedly setting the same index
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onIndexChange(newIndex); // Notify parent component
    }
  };

  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: 100
  };

  return (
    <View 
      style={{
        alignItems: "center",
        //backgroundColor: "green"
      }}
    >
      <Carousel
        ref={ref}
        {...baseOptions}
        data={items}
        loop
        pagingEnabled
        snapEnabled
        autoPlay={false}
        //onProgressChange={(_, relativeProgress) => handleIndexChange(0, relativeProgress)} // Only pass relative progress for now
        //onProgressChange = {progress}
        //onSnapToItem = {index}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 260,
        }}
        renderItem={({ item }) => renderItem(item)}
      />
    </View>
  );
};

export default TestVW;
