// CategoryImageComponent.tsx

import React, { useRef, useEffect } from "react";
import {
  Animated,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";
import InfoSheet from "~/src/components/InfoSheet";

const { width, height } = Dimensions.get("window");

interface CategoryImageComponentProps {
  categories: string[];
  currentItems: { [category: string]: any };
  focusedCategory: string | null;
}

const images = {
  "default.png": require("~/assets/default.png"),
  "top.png": require("~/assets/top.png"),
  "bottoms.png": require("~/assets/bottoms.png"),
  "shoes.png": require("~/assets/shoes.png"),
  "bottoms_and_tops.png": require("~/assets/bottoms_and_tops.png"),
  "bottoms_and_shoes.png": require("~/assets/bottoms_and_shoes.png"),
  "top_and_shoes.png": require("~/assets/top_and_shoes.png"),
  "bottoms_top_and_shoes.png": require("~/assets/bottoms_top_and_shoes.png"),
};

const getImageFilename = (categories: string[]) => {
  const hasTops = categories.includes("tops");
  const hasBottoms = categories.includes("bottoms");
  const hasShoes = categories.includes("shoes");

  // No categories selected
  if (!hasTops && !hasBottoms && !hasShoes) {
    return "default.png";
  }

  // All categories selected
  if (hasTops && hasBottoms && hasShoes) {
    return "bottoms_top_and_shoes.png";
  }

  // Two categories selected
  if (hasTops && hasBottoms) {
    return "bottoms_and_tops.png";
  }
  if (hasBottoms && hasShoes) {
    return "bottoms_and_shoes.png";
  }
  if (hasTops && hasShoes) {
    return "top_and_shoes.png";
  }

  // One category selected
  if (hasTops) {
    return "top.png";
  }
  if (hasBottoms) {
    return "bottoms.png";
  }
  if (hasShoes) {
    return "shoes.png";
  }

  // Default fallback
  return "default.png";
};

const CategoryImageComponent: React.FC<CategoryImageComponentProps> = ({
  categories,
  currentItems,
  focusedCategory,
}) => {
  const imageFilename = getImageFilename(categories);
  const imageSource = images[imageFilename];

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const zoomRegions = {
    default: {
      scale: 1,
      focalX: 0.5,
      focalY: 0.5,
    },
    tops: {
      scale: 1.75,
      focalX: 0.7,
      focalY: 0.4,
    },
    bottoms: {
      scale: 1.75,
      focalX: 0.3,
      focalY: 0.6,
    },
    shoes: {
      scale: 1.75,
      focalX: 0.8,
      focalY: 0.65,
    },
  };

  useEffect(() => {
    let region = zoomRegions["default"];
    let animationDelay = 0;

    if (focusedCategory && zoomRegions[focusedCategory]) {
      region = zoomRegions[focusedCategory];
    } else {
      // Delay zooming out when focusedCategory becomes null
      animationDelay = 1000; // Hold zoomed-in view for 1 second
    }

    const { scale: toScale, focalX, focalY } = region;

    const toTranslateX = (0.5 - focalX) * width * (toScale - 1);
    const toTranslateY = (0.5 - focalY) * height * (toScale - 1);

    Animated.parallel([
      Animated.timing(scale, {
        toValue: toScale,
        duration: 600,
        delay: animationDelay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: toTranslateX,
        duration: 600,
        delay: animationDelay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: toTranslateY,
        duration: 600,
        delay: animationDelay,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [focusedCategory]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={imageSource}
        style={[
          styles.image,
          {
            transform: [{ scale }, { translateX }, { translateY }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Overlay active items */}
      {categories.includes("tops") && currentItems["tops"] && (
        <Animated.View
          style={[
            styles.overlayTop,
            {
              transform: [{ scale }, { translateX }, { translateY }],
            },
          ]}
        >
          <View style={[styles.shrunkCard, styles.cardTop]}>
            <InfoSheet item={currentItems["tops"]} />
          </View>
        </Animated.View>
      )}
      {categories.includes("bottoms") && currentItems["bottoms"] && (
        <Animated.View
          style={[
            styles.overlayBottom,
            {
              transform: [{ scale }, { translateX }, { translateY }],
            },
          ]}
        >
          <View style={[styles.shrunkCard, styles.cardBottom]}>
            <InfoSheet item={currentItems["bottoms"]} />
          </View>
        </Animated.View>
      )}
      {categories.includes("shoes") && currentItems["shoes"] && (
        <Animated.View
          style={[
            styles.overlayShoes,
            {
              transform: [{ scale }, { translateX }, { translateY }],
            },
          ]}
        >
          <View style={[styles.shrunkCard, styles.cardShoe]}>
            <InfoSheet item={currentItems["shoes"]} />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.4, // Adjust as needed
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensure content doesn't spill out
  },
  image: {
    width: width,
    height: "100%",
  },
  itemImage: {
    width: width,
    height: "10%",
    resizeMode: "contain",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    width: width,
    height: "100%",
  },
  overlayBottom: {
    position: "absolute",
    top: 0,
    width: width,
    height: "100%",
  },
  overlayShoes: {
    position: "absolute",
    top: 0,
    width: width,
    height: "100%",
  },
  shrunkCard: {
    transform: [{ scale: 0.5 }],
    //position: "absolute",
  },
  cardTop: {
    left: 140,
    top: 30,
  },
  cardBottom: {
    //transform: [{ scaleX: -1 }], // Flips the component horizontally
    right: 70,
    top: 140,
  },
  cardShoe: {
    top: 270,
    left: 140,
  },
});

export default CategoryImageComponent;
