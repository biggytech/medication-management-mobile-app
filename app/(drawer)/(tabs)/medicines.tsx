import React, { useCallback, useMemo, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "@/components/common/buttons/Button";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Screen } from "@/components/common/markup/Screen";
import { APIService } from "@/services/APIService";
import type { MedicineFromApi } from "@/types/medicines";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { MedicineListItem } from "@/components/entities/medicine/MedicineListItem";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { paddingStyles } from "@/assets/styles/spacings";
import { Input } from "@/components/common/inputs/Input";
import { Dropdown } from "react-native-element-dropdown";
import { LanguageService } from "@/services/language/LanguageService";
import { MedicineForms } from "@/constants/medicines";
import { Spacings } from "@/constants/styling/spacings";
import { transparentColor } from "@/utils/ui/transparentColor";

interface MedicineFormOption {
  label: string;
  value: MedicineForms | null;
}

const MedicinesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<MedicineForms | null>(null);
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  const { data: medicines, isFetching } = useQueryWithFocus<MedicineFromApi[]>({
    queryKey: ["medicines"],
    queryFn: () => APIService.medicines.list(),
  });

  // Create filter options with "All" option
  const formFilterOptions: MedicineFormOption[] = useMemo(() => {
    const allOption: MedicineFormOption = {
      label: LanguageService.translate("All"),
      value: null,
    };
    const formOptions: MedicineFormOption[] = Object.values(MedicineForms).map(
      (form) => ({
        label: LanguageService.translate(form),
        value: form,
      }),
    );
    return [allOption, ...formOptions];
  }, []);

  // Filter medicines based on search query and selected form
  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];

    return medicines.filter((medicine) => {
      // Filter by search query (case-insensitive title match)
      const matchesSearch =
        searchQuery.trim() === "" ||
        medicine.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Filter by medicine form
      const matchesForm =
        selectedForm === null || medicine.form === selectedForm;

      return matchesSearch && matchesForm;
    });
  }, [medicines, searchQuery, selectedForm]);

  const handleAddNewMedicinePress = useCallback(() => {
    router.push(AppScreens.MEDICINES_NEW);
  }, []);

  const handleMedicinePress = useCallback((id: MedicineFromApi["id"]) => {
    router.push({
      pathname: AppScreens.MEDICINES_SINGLE,
      params: { medicineId: id },
    });
  }, []);

  const renderMedicineItem = useCallback(
    ({ item }: { item: MedicineFromApi }) => (
      <MedicineListItem
        alwaysShowDates
        medicine={item}
        onPress={handleMedicinePress}
      />
    ),
    [handleMedicinePress],
  );

  if (isFetching) {
    return <BlockingLoader />;
  }

  return (
    medicines && (
      <Screen>
        <View style={styles.filtersContainer}>
          <Input
            placeholder={LanguageService.translate("Search")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            containerStyle={styles.searchInputContainer}
          />
          <Dropdown
            style={[
              styles.filterDropdown,
              isFilterFocused && styles.focusedFilterDropdown,
            ]}
            placeholderStyle={styles.filterPlaceholderStyle}
            selectedTextStyle={styles.filterSelectedTextStyle}
            containerStyle={styles.filterDropdownContainer}
            iconStyle={styles.filterIconStyle}
            itemContainerStyle={styles.filterItemContainerStyle}
            itemTextStyle={styles.filterItemTextStyle}
            data={formFilterOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={LanguageService.translate("Filter by type")}
            value={selectedForm}
            onFocus={() => setIsFilterFocused(true)}
            onBlur={() => setIsFilterFocused(false)}
            onChange={(option) => setSelectedForm(option.value)}
          />
        </View>

        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedicineItem}
          contentContainerStyle={paddingStyles.small}
        />

        <Button
          color={AppColors.POSITIVE}
          style={styles.floatingButton}
          onPress={handleAddNewMedicinePress}
          text={<Ionicons size={FontSizes.HUGE} name="add" />}
          rounded
          elevated
        />
      </Screen>
    )
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    gap: Spacings.SMALL,
    paddingHorizontal: Spacings.SMALL,
    paddingTop: Spacings.SMALL,
    paddingBottom: Spacings.SMALL,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    width: "100%",
  },
  filterDropdown: {
    height: 42,
    borderColor: transparentColor(AppColors.SECONDARY, 0.5),
    borderWidth: 2,
    borderRadius: 2,
    paddingHorizontal: Spacings.SMALL,
    minWidth: 150,
    marginTop: -1,
  },
  focusedFilterDropdown: {
    borderColor: transparentColor(AppColors.ACCENT, 0.5),
  },
  filterPlaceholderStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.DARKGREY,
    fontFamily: Fonts.DEFAULT,
  },
  filterSelectedTextStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
  filterDropdownContainer: {},
  filterIconStyle: {
    width: 20,
    height: 20,
  },
  filterItemContainerStyle: {},
  filterItemTextStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default MedicinesScreen;
