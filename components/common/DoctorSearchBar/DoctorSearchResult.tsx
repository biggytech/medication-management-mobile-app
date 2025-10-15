import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { styles } from "./styles";
import type { DoctorSearchResultProps } from "./types";

const DoctorSearchResult: React.FC<DoctorSearchResultProps> = ({
  doctor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress}>
      <Text style={styles.doctorName}>{doctor.user.fullName}</Text>
      <Text style={styles.doctorSpecialization}>
        {LanguageService.translate("Specialization")}: {doctor.specialisation}
      </Text>
      <Text style={styles.doctorPlace}>
        {LanguageService.translate("Place of Work")}: {doctor.placeOfWork}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(DoctorSearchResult);
