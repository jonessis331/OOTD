import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const DetailScreenTwo = ({ items, selectedItem, onClose }) => {
  return (
    <Pressable style={styles.fullContainer} onPress={onClose}>
      {/* Popup Container */}
      <View style={styles.popupContainer}>
        {/* Top Section - Image and Info Button */}
        <View style={styles.topSection}>
          <Image
            source={{ uri: selectedItem.item_image_url }}
            style={styles.image}
          />
          <Pressable
            onPress={async () =>
              await WebBrowser.openBrowserAsync(selectedItem?.googleItem?.link)
            }
            style={styles.infoButton}
          >
            <AntDesign name="infocirlceo" size={20} color="black" />
          </Pressable>
        </View>

        {/* Bottom Section - Description and Thumbnails */}
        <View style={styles.bottomSection}>
          <Text style={styles.titleText}>{selectedItem.googleItem?.title}</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText} numberOfLines={2}>
                {item.googleItem?.title}
              </Text>
              <Pressable
                onPress={async () =>
                  await WebBrowser.openBrowserAsync(item?.googleItem?.link)
                }
              >
                <Image
                  source={{ uri: item.googleItem?.thumbnail }}
                  style={styles.thumbnail}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default DetailScreenTwo;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#B6C2CE",
    width: "80%",
    height: "50%",
    borderRadius: 24,
    overflow: "hidden", // To ensure rounded corners for the two sections
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B6C2CE", // Top section color
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  infoButton: {
    marginLeft: "auto",
    alignSelf: "flex-start",
    padding: 5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#FFFCF1", // Bottom section color
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#323232",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    flex: 1,
    color: "gray",
    fontSize: 14,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
