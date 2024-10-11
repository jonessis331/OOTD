import { View, Text, Image, TouchableOpacity, Linking, Pressable } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
const goToWeb = (item: any) => {
  console.warn(item.googleItem);
 
}
const PrettyPopup = ({ item }: { item: any }) => {
  return (
    <View className="self-center w-72 h-96 bg-['#B6C2CE'] rounded-3xl shadow-md shadow-slate-950">
    <View className = "flex-row bg-['#4D766E'] h-['63%'] rounded-t-3xl">
      <Image
        source={{ uri: item.item_image_url }}
        style={{ width: '90%', height: '90%', resizeMode: 'contain', borderRadius: 30, marginLeft: '1%', marginTop: '10%'}}
      />
      <Pressable onPress={async () => await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")}>
      <AntDesign name = "infocirlceo" size = {20} color = "black" style = {{marginLeft: -10, marginTop: 10, marginBottom: 10}}/>
      </Pressable>
    </View>
      
      <Text className = "ml-[8%] mt-2 text-['#323232'] text-xl font-bold max-w-[76%]" numberOfLines={2}>{item.googleItem?.title}</Text>
     
      <View className = "flex-row">
        <View className = "ml-[8%] w-[66%]">  
           <Text className = "mt-2 w-full first-letter:text-black text-xl font-normal">{item.googleItem?.source}</Text>
        </View>
        <Text className = " mt-4 first-letter:text-black text-xl font-medium">{item.googleItem?.description}</Text>
        <TouchableOpacity className = "z-50" onPress={async () => await WebBrowser.openBrowserAsync("https://www.google.com/?client=safari")}>
        <Image source = {{uri: item.googleItem?.thumbnail}} style = {{width: 50, height: 50, marginTop: 4, borderRadius: 15}}/>
        </TouchableOpacity>
      </View>
    </View>
  ) 
}

export default PrettyPopup