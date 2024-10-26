import React from "react";
import { Image, Text, View } from "react-native";

const DetailScreenTwo = ({ items, selectedItem }) => {
  return (
    <View className="bg-[#B6C2CE] w-[70%] h-[65%] rounded-3xl shadow-xl shadow-black">
      <View className="absolute top-0 rounded-t-3xl m-5 mb-10">
        <Image
          source={{ uri: selectedItem.item_image_url }}
          className="w-60 h-60 rounded-xl"
        />
      </View>

      <View className="absolute top-1/2 mt-auto bg-[#688990] w-full h-80 rounded-b-3xl -z-20  ">
        <Text className="font-serif font-bold text-[#323232] mt-12 ml-3">
          {selectedItem.googleItem?.title}
        </Text>
        {items.map((item, index) => (
          <View
            key={index}
            className="flex items-center h-max flex-row rounded-b-3xl mb-2"
          >
            <Text
              className="ml-3 font-serif font-thin max-w-52 text-[#FAFBFD] flex-shrink"
              numberOfLines={2}
            >
              {item.googleItem?.title}
            </Text>
            <Image
              source={{ uri: item.googleItem?.thumbnail }}
              className="w-16 h-16 ml-auto mr-5 rounded-xl flex-shrink-0"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default DetailScreenTwo;
