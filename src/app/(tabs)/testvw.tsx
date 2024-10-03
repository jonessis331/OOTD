import * as React from "react";
import { View, Dimensions, Image} from "react-native";
import { useSharedValue, interpolate, Extrapolation } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import posts from '~/assets/data/posts.json'
 
// import { SBItem } from "../../components/SBItem";
// import SButton from "../../components/SButton";
// import { ElementsText, window } from "../../constants";
const { width, height } = Dimensions.get("window");
const PAGE_WIDTH = width ;
const IMAGE_WIDTH = PAGE_WIDTH * 0.6; // Adjust the size of the main image
const colors = [
  "#26292E",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
 
export default function testvw() {
  const [isVertical, setIsVertical] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [pagingEnabled, setPagingEnabled] = React.useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = React.useState<boolean>(true);
  const progress = useSharedValue<number>(0);
  const baseOptions = isVertical
    ? ({
        vertical: true,
        width: PAGE_WIDTH * 0.86,
        height: PAGE_WIDTH * 0.6,
      } as const)
    : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.6,
      } as const);
 
  const ref = React.useRef<ICarouselInstance>(null);
 
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
 
  return (
    <View 
      style={{
        alignItems: "center",
      }}
    >
      <Carousel
        ref={ref}
        {...baseOptions}
        style={{
          width: PAGE_WIDTH, 
          backgroundColor: 'yellow'
          
        }}
        data = {posts}
        loop
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        autoPlay={autoPlay}
        autoPlayInterval={1500}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 300,
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: PAGE_WIDTH*.3, height: PAGE_WIDTH * 0.6,}}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
}
 
