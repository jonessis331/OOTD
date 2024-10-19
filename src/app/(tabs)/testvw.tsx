import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";

const { width, height } = Dimensions.get("window");

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

const CategoryImageComponent: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [currentItems, setCurrentItems] = useState<{ [category: string]: any }>(
    {
      tops: null,
      bottoms: null,
      shoes: null,
    }
  );
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);

  // Example data for currentItems
  const exampleItems = {
    tops: {
      item_image_url:
        "https://via.placeholder.com/400x600/FF0000/FFFFFF?text=Top",
    },
    bottoms: {
      item_image_url:
        "https://via.placeholder.com/400x600/00FF00/FFFFFF?text=Bottom",
    },
    shoes: {
      item_image_url:
        "https://via.placeholder.com/400x600/0000FF/FFFFFF?text=Shoes",
    },
  };

  // Function to toggle categories for testing
  const toggleCategory = (category: string) => {
    setCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });

    // Update currentItems with example data when category is added
    setCurrentItems((prevItems) => {
      if (categories.includes(category)) {
        // Remove the item
        return { ...prevItems, [category]: null };
      } else {
        // Add the item
        return { ...prevItems, [category]: exampleItems[category] };
      }
    });
  };

  // Function to simulate focusing on a category
  const focusCategory = (category: string | null) => {
    setFocusedCategory(category);
  };

  const imageFilename = getImageFilename(categories);
  const imageSource = images[imageFilename];

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const zoomRegions = {
    default: {
      scale: 1,
      translateX: 0,
      translateY: 0,
    },
    tops: {
      scale: 1.5,
      translateX: 0,
      translateY: -height * 0.1,
    },
    bottoms: {
      scale: 1.5,
      translateX: 0,
      translateY: 0,
    },
    shoes: {
      scale: 1.5,
      translateX: 0,
      translateY: height * 0.1,
    },
  };

  useEffect(() => {
    let region = zoomRegions["default"];
    if (focusedCategory && zoomRegions[focusedCategory]) {
      region = zoomRegions[focusedCategory];
    }

    Animated.parallel([
      Animated.timing(scale, {
        toValue: region.scale,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: region.translateX,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: region.translateY,
        duration: 300,
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
          <Image
            source={{ uri: currentItems["tops"].item_image_url }}
            style={styles.itemImage}
          />
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
          <Image
            source={{ uri: currentItems["bottoms"].item_image_url }}
            style={styles.itemImage}
          />
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
          <Image
            source={{ uri: currentItems["shoes"].item_image_url }}
            style={styles.itemImage}
          />
        </Animated.View>
      )}

      {/* Buttons to toggle categories */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            categories.includes("tops") && styles.buttonActive,
          ]}
          onPress={() => toggleCategory("tops")}
          onLongPress={() => focusCategory("tops")}
          onPressOut={() => focusCategory(null)}
        >
          <Text style={styles.buttonText}>Toggle Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            categories.includes("bottoms") && styles.buttonActive,
          ]}
          onPress={() => toggleCategory("bottoms")}
          onLongPress={() => focusCategory("bottoms")}
          onPressOut={() => focusCategory(null)}
        >
          <Text style={styles.buttonText}>Toggle Bottoms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            categories.includes("shoes") && styles.buttonActive,
          ]}
          onPress={() => toggleCategory("shoes")}
          onLongPress={() => focusCategory("shoes")}
          onPressOut={() => focusCategory(null)}
        >
          <Text style={styles.buttonText}>Toggle Shoes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.6, // Adjust as needed
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensure content doesn't spill out
  },
  image: {
    width: width,
    height: "70%",
  },
  itemImage: {
    width: width,
    height: "100%",
    resizeMode: "contain",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    width: width,
    height: "70%",
  },
  overlayBottom: {
    position: "absolute",
    top: 0,
    width: width,
    height: "70%",
  },
  overlayShoes: {
    position: "absolute",
    top: 0,
    width: width,
    height: "70%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4D766E",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: "#2D4F46",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CategoryImageComponent;
