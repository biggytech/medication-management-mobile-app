import React from "react";
import { StyleSheet, View } from "react-native";
import { DoctorSearchBar } from "@/components/common/DoctorSearchBar";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import type { DoctorFromApi } from "@/types/doctors";

interface DoctorSearchHeaderProps {
  onDoctorSelect?: (doctor: DoctorFromApi) => void;
}

const DoctorSearchHeader: React.FC<DoctorSearchHeaderProps> = ({
  onDoctorSelect,
}) => {
  const handleDoctorSelect = (doctor: DoctorFromApi) => {
    onDoctorSelect?.(doctor);
    // You can add navigation logic here if needed
    console.log("Selected doctor:", doctor);
  };

  return (
    <View style={styles.container}>
      <DoctorSearchBar
        onDoctorSelect={handleDoctorSelect}
        placeholder={LanguageService.translate("Search for doctors...")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.PRIMARY,
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    minWidth: 200,
    maxWidth: 300,
    flex: 1,
  },
});

export default React.memo(DoctorSearchHeader);
