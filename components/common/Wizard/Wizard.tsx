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
import { Heading } from "@/components/common/typography/Heading";
import { Form } from "@/components/common/inputs/Form";
import {
  type DataForValidation,
  validateObject,
} from "@/utils/validation/validateObject";
import { ReactMemoWithGeneric } from "@/utils/types/ReactMemoWithGeneric";
import type { AnyObject } from "yup";
import type { FormInterface } from "@/components/common/inputs/Form/types";
import { IconButton } from "@/components/common/buttons/IconButton";
import {
  debounceSubmission,
  isSubmissionInProgress,
} from "@/components/common/Wizard/utils";
import { SUBMISSION_COOLDOWN_MS } from "@/components/common/Wizard/constants";
import { OverlayLoader } from "@/components/common/loaders/OverlayLoader";

const Wizard = <T extends DataForValidation = DataForValidation>({
  screens,
  onCancel,
  onSubmit,
  initialData,
  onSubmissionStart,
  onSubmissionComplete,
}: WizardProps<T>) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const lastSubmissionTimeRef = useRef<number>(0);

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

  const handleNextClick = useCallback(
    async (formData?: Partial<AnyObject>) => {
      // Prevent double submission by checking if already submitting
      if (isSubmissionInProgress(isSubmitting)) {
        return;
      }

      // Check cooldown period to prevent rapid successive clicks
      const now = Date.now();
      if (now - lastSubmissionTimeRef.current < SUBMISSION_COOLDOWN_MS) {
        return;
      }

      Keyboard.dismiss();

      const nextScreenIndex = screens[activeScreenIndex + 1]
        ? activeScreenIndex + 1
        : -1;

      // If this is the final screen, handle submission with debouncing
      if (nextScreenIndex === -1) {
        const immediateData = formData || formRef.current?.getData();
        if (immediateData) {
          // Update last submission time
          lastSubmissionTimeRef.current = now;

          // Call submission start callback
          onSubmissionStart?.();

          // Use debounced submission to prevent rapid double clicks
          try {
            await debounceSubmission(
              () => onSubmit(immediateData as Required<T>),
              setIsSubmitting,
            );
            onSubmissionComplete?.(true);
          } catch (error) {
            onSubmissionComplete?.(false);
            throw error;
          }
        }
      }

      scrollViewRef.current?.scrollTo({
        x: nextScreenIndex * singleScreenWidth,
        animated: true,
      });
    },
    [
      activeScreenIndex,
      onSubmit,
      screens,
      singleScreenWidth,
      isSubmitting,
      onSubmissionStart,
      onSubmissionComplete,
    ],
  );

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

  // Enhanced disabled state that includes submission state
  const isButtonDisabled = isSubmitDisabled || isSubmitting;

  const getValidationSchema = screens[activeScreenIndex]?.getValidationSchema;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {!hasPrev && <IconButton onPress={onCancel} iconName={"close"} />}
        {hasPrev && (
          <IconButton onPress={handlePrevClick} iconName={"arrow-back"} />
        )}
        <TouchableOpacity
          disabled={isButtonDisabled}
          onPress={() => handleNextClick()}
        >
          <Ionicons
            name={hasNext ? "arrow-forward" : "checkmark"}
            size={Spacings.BIG}
            color={isButtonDisabled ? AppColors.GREY : AppColors.WHITE}
          />
        </TouchableOpacity>
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
          initialData={initialData}
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
                      onScreenSubmit: async (formData?: Partial<AnyObject>) => {
                        // Prevent double submission at screen level
                        if (isSubmissionInProgress(isSubmitting)) {
                          return;
                        }

                        // Check cooldown period to prevent rapid successive clicks
                        const now = Date.now();
                        if (
                          now - lastSubmissionTimeRef.current <
                          SUBMISSION_COOLDOWN_MS
                        ) {
                          return;
                        }

                        const immediateData =
                          formData || formRef.current?.getData();
                        if (immediateData) {
                          const { isValid: isValidImmediate } = validateObject(
                            getValidationSchema(),
                            {},
                            immediateData,
                          );
                          if (isValidImmediate) {
                            await handleNextClick(immediateData);
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
      {isSubmitting && <OverlayLoader />}
    </View>
  );
};

export default ReactMemoWithGeneric(Wizard);
