import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { Text } from "@/components/common/typography/Text";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import DoctorSearchResult from "./DoctorSearchResult";
import { styles } from "./styles";
import type { DoctorSearchBarProps } from "./types";
import { AppColors } from "@/constants/styling/colors";

const DoctorSearchBar: React.FC<DoctorSearchBarProps> = ({
  onDoctorSelect,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);
  const animatedWidth = useRef(new Animated.Value(55)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // Animate width and opacity when expanded state changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: isExpanded ? 250 : 55,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, animatedWidth, animatedOpacity]);

  const {
    data: doctorsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.DOCTORS.LIST, searchQuery],
    queryFn: () => APIService.doctors.list({ name: searchQuery }),
    enabled: searchQuery.length > 0,
  });

  const handleSearchFocus = useCallback(() => {
    setIsExpanded(true);
    setShowResults(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // Delay hiding results to allow for selection
    setTimeout(() => {
      setShowResults(false);
      setIsExpanded(false);
    }, 150);
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setShowResults(text.length > 0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setShowResults(false);
    setIsExpanded(false);
    inputRef.current?.blur();
  }, []);

  const handleContainerPress = useCallback(() => {
    // If not expanded, expand it
    if (!isExpanded) {
      setIsExpanded(true);
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleDoctorSelect = useCallback(
    (doctor: any) => {
      onDoctorSelect?.(doctor);
      setSearchQuery("");
      setShowResults(false);
      setIsExpanded(false);
      inputRef.current?.blur();
    },
    [onDoctorSelect],
  );

  const doctors = doctorsData?.doctors || [];

  return (
    <View style={styles.container} ref={containerRef}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleContainerPress}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.searchContainer,
            isExpanded ? styles.expandedSearchContainer : {},
            { width: animatedWidth },
          ]}
        >
          <TouchableOpacity onPress={handleContainerPress}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={[
                styles.searchIcon,
                isExpanded ? styles.searchIconExpanded : {},
              ]}
            />
          </TouchableOpacity>
          <Animated.View style={{ flex: 1, opacity: animatedOpacity }}>
            <TextInput
              ref={inputRef}
              style={[styles.searchInput]}
              placeholder={
                placeholder ||
                LanguageService.translate("Search for doctors...")
              }
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              returnKeyType="search"
              placeholderTextColor={AppColors.WHITE}
            />
          </Animated.View>
          {searchQuery.length > 0 && (
            <Animated.View style={{ opacity: animatedOpacity }}>
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearIcon}
              >
                <Ionicons
                  style={styles.clearIconImage}
                  name="close-circle-outline"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {searchQuery.length > 0 && showResults && (
        <View style={styles.resultsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <InlineLoader isLoading={true} />
              </View>
            ) : doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <DoctorSearchResult
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => handleDoctorSelect(doctor)}
                />
              ))
            ) : searchQuery.length > 0 ? (
              <Text style={styles.noResults}>
                {LanguageService.translate("No doctors found")}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default React.memo(DoctorSearchBar);
