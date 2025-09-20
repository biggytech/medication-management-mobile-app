import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  useAnimatedValue,
  useWindowDimensions,
  View,
  type NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { SCREEN_PADDING } from "@/components/Screen";
import type { NativeScrollEvent } from "react-native/Libraries/Components/ScrollView/ScrollView";
import type { WizardProps } from "./types";
import { styles } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacings } from "@/constants/styling/spacings";

const Wizard: React.FC<WizardProps> = ({ screens }) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollX = useAnimatedValue(0);
  const { width: windowWidth } = useWindowDimensions();
  const singleScreenWidth = windowWidth - SCREEN_PADDING * 2;

  const handlePrevClick = useCallback(() => {
    const prevScreenIndex = screens[activeScreenIndex - 1]
      ? activeScreenIndex - 1
      : -1;

    if (prevScreenIndex === -1) return;

    scrollViewRef.current?.scrollTo({
      x: prevScreenIndex * singleScreenWidth,
      animated: true,
    });
  }, [activeScreenIndex, screens, singleScreenWidth]);

  const handleNextClick = useCallback(() => {
    const nextScreenIndex = screens[activeScreenIndex + 1]
      ? activeScreenIndex + 1
      : -1;

    if (nextScreenIndex === -1) return;

    scrollViewRef.current?.scrollTo({
      x: nextScreenIndex * singleScreenWidth,
      animated: true,
    });
  }, [activeScreenIndex, screens, singleScreenWidth]);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = nativeEvent.contentOffset.x;
      const activeScreenIndex =
        Math.round(scrollPosition / singleScreenWidth) ===
        scrollPosition / singleScreenWidth
          ? scrollPosition / singleScreenWidth
          : -1;

      if (activeScreenIndex === -1) return;

      setActiveScreenIndex(activeScreenIndex);
    },
    [singleScreenWidth],
  );

  const hasPrev = activeScreenIndex !== 0;
  const hasNext = activeScreenIndex !== screens.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={
            !hasPrev
              ? {
                  opacity: 0,
                }
              : {}
          }
          disabled={!hasPrev}
          onPress={handlePrevClick}
        >
          <Ionicons
            name="arrow-back"
            size={Spacings.BIG}
            color={AppColors.WHITE}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            !hasNext
              ? {
                  opacity: 0,
                }
              : {}
          }
          disabled={!hasNext}
          onPress={handleNextClick}
        >
          <Ionicons
            name="arrow-forward"
            size={Spacings.BIG}
            color={AppColors.WHITE}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progress,
            {
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, singleScreenWidth * (screens.length - 1)],
                    outputRange: [
                      (-singleScreenWidth * (screens.length - 1)) /
                        screens.length,
                      0,
                    ],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <View style={styles.content}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.screens}
          horizontal
          pagingEnabled
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
              listener: handleScroll,
            },
          )}
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
        >
          {screens.map(({ key, node }) => (
            <View
              key={key}
              style={[
                styles.screen,
                {
                  width: singleScreenWidth,
                },
              ]}
            >
              <View style={styles.node}>{node}</View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default React.memo(Wizard);
