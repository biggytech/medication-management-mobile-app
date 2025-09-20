import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  type NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import type { NativeScrollEvent } from "react-native/Libraries/Components/ScrollView/ScrollView";
import type { WizardProps } from "./types";
import { styles } from "./styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacings } from "@/constants/styling/spacings";
import { Heading } from "@/components/typography/Heading";
import { Form, type FormInterface } from "@/components/inputs/Form";
import {
  type DataForValidation,
  validateObject,
} from "@/utils/validation/validateObject";
import { ReactMemoWithGeneric } from "@/utils/types/reactMemoWithGeneric";

const Wizard = <T extends DataForValidation = DataForValidation>({
  screens,
  onCancel,
  onSubmit,
}: WizardProps<T>) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const formRef = useRef<FormInterface<T> | null>(null);

  const scrollX = useAnimatedValue(0);
  const { width: windowWidth } = useWindowDimensions();
  const singleScreenWidth = windowWidth;

  const handlePrevClick = useCallback(() => {
    Keyboard.dismiss();

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
    Keyboard.dismiss();

    const nextScreenIndex = screens[activeScreenIndex + 1]
      ? activeScreenIndex + 1
      : -1;

    if (nextScreenIndex === -1) {
      const formData = formRef.current?.getData();
      if (formData) {
        return onSubmit(formData as Required<T>);
      }
    }

    scrollViewRef.current?.scrollTo({
      x: nextScreenIndex * singleScreenWidth,
      animated: true,
    });
  }, [activeScreenIndex, onSubmit, screens, singleScreenWidth]);

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

  const handleSubmitDisabled = useCallback((isDisabled: boolean) => {
    setIsSubmitDisabled(isDisabled);
  }, []);

  const hasPrev = activeScreenIndex !== 0;
  const hasNext = activeScreenIndex !== screens.length - 1;

  const activeScreenTitle = screens[activeScreenIndex]?.title ?? null;

  const getValidationSchema = screens[activeScreenIndex]?.getValidationSchema;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {!hasPrev && (
          <TouchableOpacity onPress={onCancel}>
            <Ionicons
              name="close"
              size={Spacings.BIG}
              color={AppColors.WHITE}
            />
          </TouchableOpacity>
        )}
        {hasPrev && (
          <TouchableOpacity onPress={handlePrevClick}>
            <Ionicons
              name="arrow-back"
              size={Spacings.BIG}
              color={AppColors.WHITE}
            />
          </TouchableOpacity>
        )}
        {hasNext && (
          <TouchableOpacity
            disabled={isSubmitDisabled}
            onPress={handleNextClick}
          >
            <Ionicons
              name="arrow-forward"
              size={Spacings.BIG}
              color={isSubmitDisabled ? AppColors.GREY : AppColors.WHITE}
            />
          </TouchableOpacity>
        )}
        {!hasNext && (
          <TouchableOpacity
            disabled={isSubmitDisabled}
            onPress={handleNextClick}
          >
            <Ionicons
              name="checkmark"
              size={Spacings.BIG}
              color={isSubmitDisabled ? AppColors.GREY : AppColors.WHITE}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.header}>
        <Heading style={styles.title}>{activeScreenTitle}</Heading>
      </View>
      <View style={styles.progressBarContainer}>
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
      </View>
      <View style={styles.content}>
        <Form
          ref={formRef}
          getSchema={getValidationSchema}
          onSubmitDisabled={handleSubmitDisabled}
          shouldShowLoader={false}
        >
          {({ data, setValue, setTouched, isValid, errors }) => (
            <Animated.ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.screens}
              horizontal
              pagingEnabled
              scrollEnabled={false}
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
              {screens.map(({ key, getValidationSchema, node }) => (
                <View
                  key={key}
                  style={[
                    styles.screen,
                    {
                      width: singleScreenWidth,
                    },
                  ]}
                >
                  <View style={styles.node}>
                    {node({
                      data,
                      setValue,
                      setTouched,
                      isValid,
                      errors,
                      onScreenSubmit: () => {
                        const immediateData = formRef.current?.getData();
                        if (immediateData) {
                          const { isValid: isValidImmediate } = validateObject(
                            getValidationSchema(),
                            {},
                            immediateData,
                          );
                          if (isValidImmediate) {
                            handleNextClick();
                          }
                        }
                      },
                    })}
                  </View>
                </View>
              ))}
            </Animated.ScrollView>
          )}
        </Form>
      </View>
    </View>
  );
};

export default ReactMemoWithGeneric(Wizard);
