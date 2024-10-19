import * as React from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import {
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import posts from "~/assets/data/posts.json";

const { width, height } = Dimensions.get("window");
// import { SBItem } from "../../components/SBItem";
// import SButton from "../../components/SButton";
// import { ElementsText, window } from "../../constants";
// const { width, height } = Dimensions.get("window");
// const PAGE_WIDTH = width ;
// const IMAGE_WIDTH = PAGE_WIDTH * 0.6; // Adjust the size of the main image
// const colors = [
//   "#26292E",
//   "#899F9C",
//   "#B3C680",
//   "#5C6265",
//   "#F5D399",
//   "#F1F1F1",
// ];

// export default function testvw() {
//   const [isVertical, setIsVertical] = React.useState(false);
//   const [autoPlay, setAutoPlay] = React.useState(false);
//   const [pagingEnabled, setPagingEnabled] = React.useState<boolean>(true);
//   const [snapEnabled, setSnapEnabled] = React.useState<boolean>(true);
//   const progress = useSharedValue<number>(0);
//   const baseOptions = isVertical
//     ? ({
//         vertical: true,
//         width: PAGE_WIDTH * 0.86,
//         height: PAGE_WIDTH * 0.6,
//       } as const)
//     : ({
//         vertical: false,
//         width: PAGE_WIDTH,
//         height: PAGE_WIDTH * 0.6,
//       } as const);

//   const ref = React.useRef<ICarouselInstance>(null);

//   const onPressPagination = (index: number) => {
//     ref.current?.scrollTo({
//       /**
//        * Calculate the difference between the current index and the target index
//        * to ensure that the carousel scrolls to the nearest index
//        */
//       count: index - progress.value,
//       animated: true,
//     });
//   };

//   return (
//     <View
//       style={{
//         alignItems: "center",
//         backgroundColor: "green"
//       }}
//     >
//       <Carousel
//         ref={ref}
//         {...baseOptions}
//         style={{
//           width: PAGE_WIDTH,

//           backgroundColor: 'yellow'

//         }}
//         data = {posts}
//         loop
//         pagingEnabled={pagingEnabled}
//         snapEnabled={snapEnabled}
//         autoPlay={autoPlay}
//         autoPlayInterval={1500}
//         onProgressChange={progress}
//         mode="parallax"
//         modeConfig={{
//           parallaxScrollingScale: 0.9,
//           parallaxScrollingOffset: 300,
//         }}
//         renderItem={({ item }) => (
//           <View style={{ width: PAGE_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
//             <Image
//               source={{ uri: item.image_url }}
//               style={{ width: PAGE_WIDTH * 0.3, height: PAGE_WIDTH * 0.3 }}
//               resizeMode="cover"
//             />
//           </View>
//         )}

//       />
//     </View>
//   );
// }

interface CategoryImageComponentProps {
  categories: string[];
}

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

const CategoryImageComponent: React.FC<CategoryImageComponentProps> = ({
  categories,
}) => {
  const imageFilename = getImageFilename(categories);
  const imageSource = images[imageFilename];

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.4, // Adjust as needed
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width,
    height: "100%",
  },
});

export default CategoryImageComponent;
