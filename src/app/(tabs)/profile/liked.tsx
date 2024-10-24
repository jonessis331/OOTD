// app/(tabs)/profile/liked.tsx
import React, { useState } from "react";
import { View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import LikedOutfits from "~/src/components/LikedOutfits";
import LikedItems from "~/src/components/LikedItems";

export default function LikedScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <SegmentedControl
        values={["Outfits", "Items"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        style={{ margin: 10 }}
      />
      {selectedIndex === 0 ? <LikedOutfits /> : <LikedItems />}
    </View>
  );
}
