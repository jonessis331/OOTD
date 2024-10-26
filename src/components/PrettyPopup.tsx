// PrettyPopup.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const PrettyPopup = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: item?.item_image_url }} style={styles.image} />
        <Pressable
          onPress={async () =>
            await WebBrowser.openBrowserAsync(item?.googleItem?.link)
          }
          style={styles.infoButton}
        >
          <AntDesign name="infocirlceo" size={20} color="black" />
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item?.googleItem?.title}
      </Text>

      <View style={styles.descriptionRow}>
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceText}>{item?.googleItem?.source}</Text>
        </View>
        <Text style={styles.descriptionText}>
          {item?.googleItem?.description}
        </Text>
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={async () =>
            await WebBrowser.openBrowserAsync(item?.googleItem?.link)
          }
        >
          <Image
            source={{ uri: item?.googleItem?.thumbnail }}
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 400,
    backgroundColor: "#B6C2CE",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 0,
    zIndex: 1002, // Ensure it's above the overlay
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#4D766E",
    height: "63%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
    borderRadius: 30,
    marginLeft: "1%",
    marginTop: "10%",
  },
  infoButton: {
    alignSelf: "flex-start",
    marginLeft: -10,
    marginTop: 10,
    marginBottom: 10,
    padding: 5, // Increase touchable area
  },
  title: {
    marginLeft: "8%",
    marginTop: 10,
    color: "#323232",
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: "76%",
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  sourceContainer: {
    marginLeft: "8%",
    width: "66%",
  },
  sourceText: {
    marginTop: 2,
    width: "100%",
    color: "#323232",
    fontSize: 18,
    fontWeight: "normal",
  },
  descriptionText: {
    marginTop: 4,
    color: "#323232",
    fontSize: 18,
    fontWeight: "500",
    flex: 1, // Allow text to take available space
  },
  thumbnailContainer: {
    marginRight: 20,
    zIndex: 1003, // Ensure it's above other elements
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
});

export default PrettyPopup;
