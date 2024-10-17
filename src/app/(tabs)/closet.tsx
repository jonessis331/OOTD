import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  ScrollView,
  Animated, // Import Animated
  Easing, // Import Easing
} from "react-native";
import {} from "react-native-reanimated-carousel";
import React, { useState, useEffect } from "react";
import { supabase } from "~/src/lib/supabase";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import InfoSheet from "~/src/components/InfoSheet";
import RectangleComponent from "~/src/components/RectangleComponent";
import SmallItemImageOnly from "~/src/components/SmallItem";
import ItemInfoPopups from "~/src/components/ItemInfoPopups";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import PrettyPopup from "~/src/components/PrettyPopup";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";
import { interpolate, useSharedValue } from "react-native-reanimated";
import RNFadedScrollView from "rn-faded-scrollview";
import { LinearGradient } from "expo-linear-gradient";
import TestVW from "~/src/components/TestVWProps";
import { cld } from "~/src/lib/cloudinary";
import { AdvancedImage } from "cloudinary-react-native";
const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7; // Make the item width 70% of the screen width for better visibility
const Stack = createStackNavigator();

const ClosetScreen = ({ navigation }) => {
  const [tops, setTops] = useState<any[]>([]);
  const [bottoms, setBottoms] = useState<any[]>([]);
  const [shoes, setShoes] = useState<any[]>([]);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);
  const [showRectangle, setShowRectangle] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [pressedItem, setPressedItem] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value
  const topProgress = useSharedValue(0);
  const bottomProgress = useSharedValue(0);
  const shoeProgress = useSharedValue(0);

  useEffect(() => {
    fetchOutfits();
  }, []);

  useEffect(() => {
    if (pressedItem) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [pressedItem]);

  const addPage = () => {
    navigation.navigate("Accessories", { accessories, onAdd: handleAddItem });
  };

  const fetchOutfits = async () => {
    try {
      const { data, error } = await supabase
        .from("outfits")
        .select("*")
        .order("date_created", { ascending: false });

      if (error) {
        console.error("Error fetching outfits:", error);
        return;
      }

      setTops(getCategoryItems(["top", "shirt", "jacket"], data));
      setBottoms(getCategoryItems(["bottom", "shorts", "pants"], data));
      setShoes(getCategoryItems(["shoe"], data));

      // Filter for accessories and other items that are NOT tops, bottoms, or shoes
      const excludedCategories = [
        "top",
        "shirt",
        "bottom",
        "shorts",
        "pants",
        "shoe",
      ];
      const allItems = data.flatMap((outfit) => outfit.items);
      const filteredAccessories = allItems.filter(
        (item) => !excludedCategories.includes(item.item_id)
      );

      setAccessories(filteredAccessories); // Set accessories to the filtered items
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  };

  const getCategoryItems = (categories: string[], outfits: any[] = []) => {
    return outfits.reduce((items: any[], outfit) => {
      const categoryItems = outfit.items.filter((item: any) =>
        categories.includes(item.item_id)
      );
      return [...items, ...categoryItems];
    }, []);
  };

  const handleAddItem = (item: any) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
    setAccessories((prevAccessories) => [...prevAccessories, item]); // Add this line
    setShowRectangle(false);
  };

  const handleItemPress = (item: any) => {
    setPressedItem(item);
  };

  const handleRemoveItem = (item: any) => {
    setSelectedItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  const renderItem = (item: any, setCurrentIndex: Function, index: number) => {
    const image = cld.image(
      item.tags?.deepTags?.googleItem?.n_background_thumbnail ||
        item.item_image_url
    );
    console.log(item?.tags?.deepTags?.googleItem?.n_background_thumbnail);
    return (
      <View>
        <TouchableOpacity onPress={() => handleItemPress(item)}>
          <View style={styles.itemContainer}>
            <AdvancedImage
              cldImg={image}
              // source={{
              //   uri:
              //     item.tags?.deepTags?.googleItem?.n_background_thumbnail ||
              //     item.item_image_url,
              // }}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const createOutfit = () => {
    const outfit = {
      top: tops[currentTopIndex],
      bottom: bottoms[currentBottomIndex],
      shoes: shoes[currentShoeIndex],
      accessories: selectedItems,
    };
    console.log("Created Outfit:", JSON.stringify(outfit));
  };

  const headerHeight = 100;
  const scale = 0.9;
  const RIGHT_OFFSET = width * (1 - scale);
  const ITEM_HEIGHT = 120;
  const PAGE_HEIGHT = height - headerHeight;

  const animationStyle: TAnimationStyle = React.useCallback(
    (value: number) => {
      "worklet";

      const translateY = interpolate(
        value,
        [-1, 0, 1],
        [-ITEM_HEIGHT, 0, ITEM_HEIGHT]
      );
      const right = interpolate(
        value,
        [-1, -0.2, 1],
        [RIGHT_OFFSET / 2, RIGHT_OFFSET, RIGHT_OFFSET / 3]
      );
      return {
        transform: [{ translateY }],
        right,
      };
    },
    [RIGHT_OFFSET]
  );

  const renderCarouselItem = ({ item, index }) => {
    return (
      <View key={index} className="flex-1  justify-center px-4">
        <InfoSheet item={item.item} />
        {item.type === "selected" && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.item)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const carouselData = [
    { type: "top", item: tops[currentTopIndex] },
    { type: "bottom", item: bottoms[currentBottomIndex] },
    { type: "shoes", item: shoes[currentShoeIndex] },
    ...(selectedItems.length > 0
      ? selectedItems.map((selectedItem) => ({
          type: "selected",
          item: selectedItem,
        }))
      : []),
  ];

  return (
    <View style={{ flex: 1 }}>
      {pressedItem && (
        <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
          <BlurView intensity={20} style={styles.blurView}>
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setPressedItem(null)}
            />
            <PrettyPopup item={pressedItem} />
          </BlurView>
        </Animated.View>
      )}

      <ScrollView style={styles.container}>
        {showRectangle && (
          <RectangleComponent
            items={accessories}
            onClose={addPage}
            onAdd={handleAddItem}
          />
        )}
        {tops.length > 0 &&
        bottoms.length > 0 &&
        shoes.length > 0 &&
        currentTopIndex >= 0 &&
        currentTopIndex < tops.length &&
        currentBottomIndex >= 0 &&
        currentBottomIndex < bottoms.length &&
        currentShoeIndex >= 0 &&
        currentShoeIndex < shoes.length ? (
          <View className="m-0 mb-0 rounded-x">
            {/* <ScrollView showsVerticalScrollIndicator={false} className = 'w-full h-[44%] mt-3 mb-9 '> */}

            <Carousel
              data={carouselData}
              renderItem={renderCarouselItem}
              sliderWidth={width}
              itemWidth={ITEM_WIDTH}
              layout={"default"}
              customAnimation={animationStyle}
              vertical
              loop={false}
              pagingEnabled={false}
              height={ITEM_HEIGHT * 3.7}
              style={StyleSheet.absoluteFillObject}
            />

            {/* <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
              colors={[ 'transparent','#688990']}
              

              style={{ position: 'absolute', bottom: -450, left: 0, right: 0, height: 200, width: width }}
            />  */}
          </View>
        ) : (
          <Text>No item selected</Text>
        )}
        <View className="mt-[90%]">
          {tops.length > 0 && (
            <TestVW
              items={tops}
              onIndexChange={setCurrentTopIndex}
              renderItem={renderItem}
            />
          )}

          {bottoms.length > 0 && (
            <TestVW
              items={bottoms}
              onIndexChange={setCurrentBottomIndex}
              renderItem={renderItem}
            />
          )}

          {shoes.length > 0 && (
            <TestVW
              items={shoes}
              onIndexChange={setCurrentShoeIndex}
              renderItem={renderItem}
            />
          )}
        </View>

        <Text className="pl-2 mt-7 font-mono font-semibold">Accessories</Text>
        <FlatList
          data={accessories}
          horizontal
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          } // Fallback to index if no id
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: item.item_image_url }}
                style={{ width: 30, height: 30 }}
              />
            </View>
          )}
          ListHeaderComponent={
            <TouchableOpacity className="w-64 h-64 " onPress={addPage}>
              <FontAwesome
                name="plus-circle"
                size={20}
                color="black"
                backgroundColor="#688990"
              />
            </TouchableOpacity>
          }
          ListHeaderComponentStyle={{
            height: "100%",
            padding: 1,
            marginLeft: 10,
            marginBottom: 4,
          }}
          style={styles.flatList}
        />

        <TouchableOpacity
          onPress={createOutfit}
          style={styles.createOutfitButton}
        >
          <Text style={styles.createOutfitButtonText}>Create Outfit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const AccessoriesScreen = ({ route, navigation }) => {
  const { accessories, onAdd, addPage } = route.params;

  return (
    <RectangleComponent items={accessories} onClose={addPage} onAdd={onAdd} />
  );
};

export default function Closet() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="ClosetScreen">
        <Stack.Screen
          name="something"
          options={{ headerShown: false }}
          component={ClosetScreen}
        />
        <Stack.Screen
          name="Accessories"
          options={{ headerShown: false, headerTransparent: true }}
          component={AccessoriesScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#688990",
    padding: 0,
  },
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure it is above other elements
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    right: 200,
    marginBottom: 0,
  },
  flatListContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft: (width - ITEM_WIDTH) / 2, // Center the first item
    // paddingRight: (width - ITEM_WIDTH) / 2, // Center the last item
    // //backgroundColor: "black",
    //borderWidth: 1,
    //borderColor: 'black',
  },
  itemContainer: {
    width: width, // Full width of the screen
    alignItems: "center", // Center the image horizontally
    justifyContent: "center", // Center the image vertically
    marginTop: 0,
    //backgroundColor: 'red',

    //backgroundColor: "transparent",
  },
  flatListMain: {
    flex: 1,
    backgroundColor: "transparent", // Make the FlatList background transparent
  },

  image: {
    width: 95,
    height: 95,
    borderRadius: 10,
    //   marginVertical: 0,
    //   //Shadow properties for iOS
    //   shadowColor: 'black',
    //   shadowOffset: {
    //     width: 10,
    //     height: 20, // Vertical offset
    //   },
    //   shadowOpacity: 0.9, // Opacity of the shadow
    //   shadowRadius: 10, // Radius of the shadow
    //   // Android shadow properties
    //   elevation: 10, // Elevation for Android
    //  //borderWidth: 2,
    //   //borderColor: '#FAFBFD',
  },
  bubble: {
    width: 50,
    aspectRatio: 4 / 4,
    position: "absolute", // Position the bubble absolutely
    top: -60, // Adjust as needed to place it above the image
    left: "48%", // Center horizontally
    transform: [{ translateX: 30 }], // Adjust for centering
    backgroundColor: "purple", // Bubble background color
    padding: 8, // Bubble padding
    borderRadius: 40, // Bubble border radius
    zIndex: 1, // Ensure the bubble is on a higher z-axis
  },
  flatList: {
    height: 40,
    flexGrow: 0,
    backgroundColor: "#688990",
  },
  createOutfitButton: {
    backgroundColor: "#4D766E",
    alignSelf: "center",
    width: "50%",
    padding: 5,
    height: 30,
    borderRadius: 30,
    alignItems: "center",
    //marginBottom: 10,
  },
  createOutfitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: 220,
    right: 40,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 15,
    maxHeight: 40,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
});
