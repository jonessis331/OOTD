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
const PAGE_WIDTH = width;
const colors = [
  "#26292E",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
 
export default function TestFunction() {
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
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: PAGE_WIDTH, height: PAGE_WIDTH * 0.6 }}
            resizeMode="cover"
          />
        )}
      />
 
      <Pagination.Basic
        progress={progress}
        data={colors}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        containerStyle={{ gap: 5, marginBottom: 10 }}
        onPress={onPressPagination}
      />
 
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={colors.map((color) => ({ color }))}
        dotStyle={{
          width: 25,
          height: 4,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        activeDotStyle={{
          overflow: "hidden",
        }}
        containerStyle={[
          isVertical
            ? {
                position: "absolute",
                width: 25,
                right: 5,
                top: 40,
              }
            : undefined,
          {
            gap: 10,
            marginBottom: 10,
          },
        ]}
        horizontal={!isVertical}
        onPress={onPressPagination}
      />
 
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={colors.map((color) => ({ color }))}
        size={20}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
        }}
        containerStyle={[
          isVertical
            ? {
                position: "absolute",
                width: 20,
                right: 5,
                top: 40,
              }
            : undefined,
          {
            gap: 5,
            marginBottom: 10,
          },
        ]}
        horizontal={!isVertical}
        onPress={onPressPagination}
      />
 
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={colors.map((color) => ({ color }))}
        size={20}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        containerStyle={[
          isVertical
            ? {
                position: "absolute",
                width: 20,
                right: 5,
                top: 40,
              }
            : undefined,
          {
            gap: 5,
            marginBottom: 10,
          },
        ]}
        horizontal={!isVertical}
        renderItem={(item) => (
          <View
            style={{
              backgroundColor: item.color,
              flex: 1,
            }}
          />
        )}
        onPress={onPressPagination}
      />
 
      <Pagination.Custom<{ color: string }>
        progress={progress}
        data={colors.map((color) => ({ color }))}
        size={20}
        dotStyle={{
          borderRadius: 16,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        activeDotStyle={{
          borderRadius: 8,
          width: 40,
          height: 30,
          overflow: "hidden",
          backgroundColor: 'black',
        }}
        containerStyle={[
          isVertical
            ? {
                position: "absolute",
                width: 20,
                right: 5,
                top: 40,
              }
            : undefined,
            {
              gap: 5,
              marginBottom: 10,
              alignItems: "center",
            },
        ]}
        horizontal={!isVertical}
        onPress={onPressPagination}
        customReanimatedStyle={(progress, index, length) => {
          let val = Math.abs(progress - index);
          if (index === 0 && progress > length - 1) {
            val = Math.abs(progress - length);
          }
 
          return {
            transform: [
              {
                translateY: interpolate(
                  val,
                  [0, 1],
                  [10, 0],
                  Extrapolation.CLAMP,
                ),
              }
            ]
          }
        }}
      />
 
      <Pagination.Custom<{ color: string }>
        progress={progress}
        data={colors.map((color) => ({ color }))}
        size={20}
        dotStyle={{
          borderRadius: 16,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        activeDotStyle={{
          borderRadius: 8,
          width: 40,
          height: 30,
          overflow: "hidden",
        }}
        containerStyle={[
          isVertical
            ? {
                position: "absolute",
                width: 20,
                right: 5,
                top: 40,
              }
            : undefined,
            {
              gap: 5,
              alignItems: "center",
            },
        ]}
        horizontal={!isVertical}
        onPress={onPressPagination}
        customReanimatedStyle={(progress, index, length) => {
          let val = Math.abs(progress - index);
          if (index === 0 && progress > length - 1) {
            val = Math.abs(progress - length);
          }
 
          return {
            transform: [
              {
                translateY: interpolate(
                  val,
                  [0, 1],
                  [10, 0],
                  Extrapolation.CLAMP,
                ),
              }
            ]
          }
        }}
        renderItem={(item) => (
          <View
            style={{
              backgroundColor: item.color,
              flex: 1,
            }}
          />
        )}
      />

    </View>
  );
}
 