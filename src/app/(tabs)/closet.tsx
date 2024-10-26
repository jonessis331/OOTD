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
  Easing,
  TouchableWithoutFeedback, // Import Easing
} from "react-native";
import {} from "react-native-reanimated-carousel";
import React, { useState, useEffect, useRef } from "react";
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
import { cld, removeBackground } from "~/src/lib/cloudinary";
import { AdvancedImage } from "cloudinary-react-native";
//import { removeBackground } from "react-native-background-remover";
import {
  backgroundRemoval,
  dropShadow,
} from "@cloudinary/url-gen/actions/effect";
import { Picker } from "@react-native-picker/picker";
import CategoryImageComponent from "~/src/components/CategoryImageComponent";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SafeAreaView } from "react-native";
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
  const [currentIndices, setCurrentIndices] = useState({});
  const [currentItems, setCurrentItems] = useState({});
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const [showRectangle, setShowRectangle] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [pressedItem, setPressedItem] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value
  const topProgress = useSharedValue(0);
  const bottomProgress = useSharedValue(0);
  const shoeProgress = useSharedValue(0);
  const [categories, setCategories] = useState<string[]>([]); // To store selected categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // For dropdown selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
  const [isDragActive, setIsDragActive] = useState(false);
  const screenOpacity = isDragActive ? 0.5 : 1;
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashRef = useRef<View>(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false);

  const toggleRemoveMode = () => {
    setIsRemoveMode((prevState) => !prevState);
  };

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

  const handleAddCategory = (category: string) => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories((prev) => [...prev, selectedCategory]);

      // Initialize current index and item for the new category
      let data = [];
      switch (selectedCategory) {
        case "tops":
          data = tops;
          break;
        case "bottoms":
          data = bottoms;
          break;
        case "shoes":
          data = shoes;
          break;
        default:
          data = [];
          break;
      }

      if (data.length > 0) {
        setCurrentIndices((prev) => ({ ...prev, [selectedCategory]: 0 }));
        setCurrentItems((prev) => ({ ...prev, [selectedCategory]: data[0] }));
      }
    }
    setIsDropdownOpen(false); // Close dropdown after selection
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
    if (selectedItems.length === 0) {
      console.log("isempty");
      toggleRemoveMode();
    }
  };

  // const updateCarouselData = () => {
  //   setCarouselData(
  //     [
  //       tops[currentTopIndex]
  //         ? { type: "top", item: tops[currentTopIndex] }
  //         : null,
  //       bottoms[currentBottomIndex]
  //         ? { type: "bottom", item: bottoms[currentBottomIndex] }
  //         : null,
  //       shoes[currentShoeIndex]
  //         ? { type: "shoes", item: shoes[currentShoeIndex] }
  //         : null,
  //       ...(selectedItems.length > 0
  //         ? selectedItems.map((selectedItem) => ({
  //             type: "selected",
  //             item: selectedItem,
  //           }))
  //         : []),
  //     ].filter(Boolean)
  //   ); // Filter out null values to avoid issues
  // };
  const handleIndexChange = React.useCallback(
    (category: string, index: number, selectedItem: any) => {
      setCurrentIndices((prev) => ({ ...prev, [category]: index }));
      setCurrentItems((prev) => ({ ...prev, [category]: selectedItem }));
    },
    []
  );

  // Trigger the update when indices change
  // useEffect(() => {
  //   updateCarouselData();
  // }, [currentTopIndex, currentBottomIndex, currentShoeIndex, selectedItems]);

  const renderCategoryCarousel = (category: string) => {
    let data = [];
    switch (category) {
      case "tops":
        data = tops;
        break;
      case "bottoms":
        data = bottoms;
        break;
      case "shoes":
        data = shoes;
        break;
      default:
        break;
    }

    return (
      <View key={category}>
        {/* <Text>{category}</Text> */}

        <TestVW
          items={data}
          onIndexChange={(index, selectedItem) =>
            handleIndexChange(category, index, selectedItem)
          }
          onScrollBegin={() => {
            setFocusedCategory(category);
          }}
          onScrollEnd={() => {
            // Delay resetting focusedCategory to null
            setTimeout(() => {
              setFocusedCategory(null);
            }, 1000); // Hold zoomed-in view for 1 second after scrolling ends
          }}
          renderItem={renderItem}
        />
        {/* Add a remove button */}
        {isRemoveMode && (
          <View style={styles.removeButtonWrapper}>
            <Pressable
              onPress={() => handleRemoveCategory(category)}
              style={styles.smallRemoveButton}
            >
              <Text style={styles.removeButtonText}>-</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };
  // Remove a category
  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.filter(
        (category) => category !== categoryToRemove
      );

      // Check if the categories array is empty after the removal
      if (updatedCategories.length === 0) {
        toggleRemoveMode(); // Call this when no categories are left
      }

      return updatedCategories;
    });

    setCurrentIndices((prev) => {
      const updatedIndices = { ...prev };
      delete updatedIndices[categoryToRemove];
      return updatedIndices;
    });

    setCurrentItems((prev) => {
      const updatedItems = { ...prev };
      delete updatedItems[categoryToRemove];
      return updatedItems;
    });
  };

  const renderItem = (item: any, setCurrentIndex: Function, index: number) => {
    let image = null;
    // const backgroundRemovedImageURI = removeBackground(
    //   item?.googleItem?.n_background_thumbnail
    // );
    if (item?.googleItem?.n_background_thumbnail) {
      const imgUrl = `https://res.cloudinary.com/dmhfubcfi/image/upload/f_auto,q_auto/${item?.googleItem?.n_background_thumbnail}`;
      //image = removeBackground(imgUrl); <- THIS FUNCTION WORKS BUT SHOULDNT BE CALLED HERE
      // THIS WHOLE FUNCTION NEEDS TO BE REDONE, but I believe I am now processeing the thumnbail and removing backgorund
      // and then storing it, so all I should have to do is just retreive it
      // its uploaded when a new item is uploaded
      //console.log(image);
      image = cld
        .image(item.googleItem?.n_background_thumbnail)
        .effect(backgroundRemoval())
        .format("png") // Ensure the format supports transparency
        .effect(dropShadow().azimuth(183).elevation(70).spread(60));
    }

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => handleItemPress(item)}>
          <View style={styles.itemContainer}>
            {item?.googleItem?.n_background_thumbnail ? (
              <AdvancedImage cldImg={image} style={styles.image} />
            ) : (
              <Image
                source={{ uri: item.item_image_url }}
                style={styles.image}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
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

  // const animationStyle: TAnimationStyle = React.useCallback(
  //   (value: number) => {
  //     "worklet";

  //     const translateY = interpolate(
  //       value,
  //       [-1, 0, 1],
  //       [-ITEM_HEIGHT, 0, ITEM_HEIGHT]
  //     );
  //     const right = interpolate(
  //       value,
  //       [-1, -0.2, 1],
  //       [RIGHT_OFFSET / 2, RIGHT_OFFSET, RIGHT_OFFSET / 3]
  //     );
  //     return {
  //       transform: [{ translateY }],
  //       right,
  //     };
  //   },
  //   [RIGHT_OFFSET]
  // );

  const renderCarouselItem = ({ data, index }) => {
    const { type, item } = data;
    return (
      <View
        key={index}
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}
      >
        {item && <InfoSheet item={item} />}
        {type === "selected" && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const carouselData = categories
    .map((category) => {
      const item = currentItems[category];
      if (item) {
        return { type: category, item: item };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFCF1" }}>
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
      {isDropdownOpen && (
        <View style={styles.dropdownOverlay}>
          <BlurView intensity={50} style={styles.dropdownBlurView}>
            <View style={styles.dropdownContent}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {/* <Picker.Item label="Select Category" value={null} /> */}
                <Picker.Item label="Tops" value="tops" />
                <Picker.Item label="Bottoms" value="bottoms" />
                <Picker.Item label="Shoes" value="shoes" />
              </Picker>
              <TouchableOpacity
                onPress={handleAddCategory}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      )}

      <ScrollView style={styles.container}>
        {showRectangle && (
          <RectangleComponent
            items={accessories}
            onClose={addPage}
            onAdd={handleAddItem}
          />
        )}
        <CategoryImageComponent
          categories={categories}
          currentItems={currentItems}
          focusedCategory={focusedCategory}
        />
        <View style={styles.toolbar}>
          {/* horizontal toolbar with smallRemoveButton styling buttons for toggleRemoveMode, same buttonstyle for a Add category button , and a create outfit button 
          there should be two of the buttons on either side the order is 
          for now just put a no function one and then the toggleRemoveMode, and then on the other side we do add category then createOutfit, I want to put Icons in most of these smallRemoveButton sytle */}
          {/* Left Side Buttons */}
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => {
                /* No function */
                // generateOutfit(); // this eventually with trigger animated carousels and calculate compatibility of users items recommending outfit
              }}
            >
              <FontAwesome name="question" size={15} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => toggleRemoveMode()}
            >
              <FontAwesome name="trash" size={15} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Right Side Buttons */}
          {/* {!isDropdownOpen && ( */}
          <View style={styles.toolbarRight}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => setIsDropdownOpen((prev) => !prev)}
            >
              <FontAwesome name="plus" size={15} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => createOutfit()}
            >
              <FontAwesome name="check" size={15} color="gray" />
            </TouchableOpacity>
          </View>
          {/* )} */}
        </View>
        <View className="mt-[8%]">
          {/* {tops.length > 0 && (
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
            /> */}
          {/* )} */}

          {/* Render Carousels based on selected categories */}
          {categories.map((category) => renderCategoryCarousel(category))}
        </View>
        {/* <Text className="pl-2 mt-7 font-mono font-semibold">Accessories</Text>
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

        {/* <TouchableOpacity
          onPress={createOutfit}
          style={styles.createOutfitButton}
        >
          <Text style={styles.createOutfitButtonText}>Create Outfit</Text>
        </TouchableOpacity> */}
      </ScrollView>
      {/* {isDragActive && (
        <View style={styles.trashContainer} ref={trashRef}>
          <FontAwesome
            name="trash"
            size={40}
            color={isOverTrash ? "red" : "gray"}
          />
        </View>
      )} */}
    </SafeAreaView>
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
    backgroundColor: "#FFFCF1",
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
    //backgroundColor: "red",

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
    // backgroundColor: "green",
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
    // position: "absolute",
    // top: 220,
    // right: 40,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 15,
    maxHeight: 40,
  },
  toolbar: {
    // borderTopWidth: 1,
    // borderBottomWidth: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 44, // Adjusted as per your requirement
    backgroundColor: "#FFFCF1",
    paddingHorizontal: 10,
    shadowColor: "black", // Shadow color
    shadowOffset: {
      width: 0, // Horizontal shadow offset
      height: 4, // Vertical shadow offset
    },
    shadowOpacity: 0.5, // Shadow opacity (0 to 1)
    shadowRadius: 3.84, // Shadow blur radius
    // Android shadow (elevation)
    elevation: 5, // Higher number means stronger shadow
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    height: 30,
    width: 30,
    borderRadius: 20,
    marginHorizontal: 5,
  },

  smallRemoveButton: {
    //position: "absolute",
    bottom: 0,
    //justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "darkred",
    opacity: 10,
    height: 280,
    width: 390,
    borderRadius: 180,
    borderColor: "maroon",
    borderWidth: 20,
    // shadowRadius: 30,
    // shadowColor: "black",
    // shadowOffset: 20,
  },
  removeButtonWrapper: {
    position: "absolute",
    //backgroundColor: "green",
    bottom: 10,
    borderRadius: 190,
    alignItems: "center",
    alignSelf: "center",
    height: 70,
    overflow: "hidden",
    opacity: 0.3,
  },
  removeButtonText: {
    alignContent: "center",
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    marginVertical: "auto",
    backgroundColor: "#4D766E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background for overlay effect
    //justifyContent: "center",
    //alignItems: "center",
  },
  dropdownBlurView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContent: {
    width: "70%", // Adjust this to fit within the black lines
    minHeight: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    //alignItems: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
    color: "black",
  },
});
