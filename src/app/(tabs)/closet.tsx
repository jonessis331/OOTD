import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "~/src/lib/supabase";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import InfoSheet from "~/src/components/InfoSheet";
import RectangleComponent from '~/src/components/RectangleComponent';

// Inside your Closet component's return statement

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7; // Make the item width 70% of the screen width for better visibility

export default function Closet() {
  const [tops, setTops] = useState<any[]>([]);
  const [bottoms, setBottoms] = useState<any[]>([]);
  const [shoes, setShoes] = useState<any[]>([]);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);
  const [showRectangle, setShowRectangle] = useState(false);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const addItem = () => {
    setShowRectangle(!showRectangle);
  };

  const fetchOutfits = async () => {
    try {
      const { data, error } = await supabase.from("outfits").select("*");

      if (error) {
        console.error("Error fetching outfits:", error);
        return;
      }

      setTops(getCategoryItems(["top", "shirt", "jacket"], data));
      setBottoms(getCategoryItems(["bottom", "shorts", "pants"], data));
      setShoes(getCategoryItems(["shoe"], data));
      
      // Filter for accessories and other items that are NOT tops, bottoms, or shoes
      const excludedCategories = ["top", "shirt", "bottom", "shorts", "pants", "shoe"];
      const allItems = data.flatMap(outfit => outfit.items);
      const filteredAccessories = allItems.filter(item => !excludedCategories.includes(item.item_id));
      
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

  const renderItem = (item: any, setCurrentIndex: Function, index: number) => {
    return (
      <View>
        <View style={[styles.itemContainer, { width: ITEM_WIDTH }]}>
          <Image
            source={{ uri: item.item_image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
       
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showRectangle && <RectangleComponent items={accessories} />}
      {tops.length > 0 &&
      bottoms.length > 0 &&
      shoes.length > 0 &&
      currentTopIndex >= 0 &&
      currentTopIndex < tops.length &&
      currentBottomIndex >= 0 &&
      currentBottomIndex < bottoms.length &&
      currentShoeIndex >= 0 &&
      currentShoeIndex < shoes.length ? (
        <View className='m-4 rounded-xl  bg-white border-black shadow-lg shadow-slate-800 gap-4'>
          <InfoSheet item={tops[currentTopIndex]} />
          <InfoSheet item={bottoms[currentBottomIndex]} />
          <InfoSheet item={shoes[currentShoeIndex]} />
        </View>
      ) : (
        <Text>No item selected</Text>
      )}

      {tops.length > 0 && (
        <FlatList
          data={tops}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.item_image_url }} style={styles.image} />
            </View>
          )}
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          snapToAlignment="center"
          onScroll={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentTopIndex(index);
          }}
        />
      )}

      
      {bottoms.length > 0 && (
         <FlatList
         data={bottoms}
         horizontal
         keyExtractor={(item, index) => index.toString()}
         renderItem={({ item }) => (
           <View style={styles.itemContainer}>
             <Image source={{ uri: item.item_image_url }} style={styles.image} />
           </View>
         )}
         snapToInterval={width}
         decelerationRate="fast"
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={{ alignItems: 'center' }}
         snapToAlignment="center"
         onScroll={(event) => {
           const index = Math.round(
             event.nativeEvent.contentOffset.x / width
           );
           setCurrentBottomIndex(index);
         }}
       />
      )}


      {shoes.length > 0 && (
        <View>
         <FlatList
          data={shoes}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.item_image_url }} style={styles.image} />
            </View>
          )}
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          snapToAlignment="center"
          onScroll={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentShoeIndex(index);
          }}
        />
        </View>
      )}

      <Text className="pl-2 font-mono font-semibold">Accessories</Text>
      <FlatList
        data={accessories}
        horizontal
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Fallback to index if no id
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
          </View>
        )}
        ListHeaderComponent={
          <TouchableOpacity className="bg-slate-50" onPress={addItem}>
            <FontAwesome
              name="plus-circle"
              size={25}
              color="black"
              backgroundColor="white"
            />
          </TouchableOpacity>
        }
        ListHeaderComponentStyle={{ height: "auto", padding: 1, marginLeft: 10, marginBottom: 4 }}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "white",
    padding: 0,
    marginTop: 'auto'
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    position: 'absolute',
    right: 200,
    marginBottom: 0,
  },
  flatListContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: (width - ITEM_WIDTH) / 2, // Center the first item
    paddingRight: (width - ITEM_WIDTH) / 2, // Center the last item
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: 'white'
  },
  itemContainer: {
    width: width, // Full width of the screen
    alignItems: 'center', // Center the image horizontally
    justifyContent: 'center', // Center the image vertically
    backgroundColor: "white",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginVertical: 5,
    // Shadow properties for iOS
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2, // Vertical offset
    },
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 5, // Radius of the shadow
    // Android shadow properties
    elevation: 5, // Elevation for Android
  },
  bubble: {
    width: 50,
    aspectRatio: 4/4,
    position: 'absolute', // Position the bubble absolutely
    top: -60, // Adjust as needed to place it above the image
    left: '48%', // Center horizontally
    transform: [{ translateX: 30 }], // Adjust for centering
    backgroundColor: 'purple', // Bubble background color
    padding: 8, // Bubble padding
    borderRadius: 40, // Bubble border radius
    zIndex: 1, // Ensure the bubble is on a higher z-axis
  },
  flatList: {
    height: 30,
    flexGrow: 0,
    backgroundColor: "white",
  },
});
