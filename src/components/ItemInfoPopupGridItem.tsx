import { View, Text, Image } from 'react-native'
import React from 'react'

const ItemInfoPopupGridItem = ({items, post}) => {
    return (
        <View className="flex-row inset-0">
          {items.map((item, index) => {
            return (
              <View
                key={index}
                className="flex-fit bg-white w-32 p-4 m-2 rounded-lg shadow-lg"
              >
                <Image
                  source={{ uri: item.googleItem?.thumbnail }}
                  className="w-24 h-24 rounded-lg"
                />
                <Text className="font-semibold mt-2" numberOfLines={1}>
                  {item.googleItem?.title || item.item_id}
                </Text>
                {/* Add more item details as needed */}
              </View>
            );
          })}
        </View>
      );
    }
    
export default ItemInfoPopupGridItem