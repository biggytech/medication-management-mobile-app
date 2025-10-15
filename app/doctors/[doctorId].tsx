import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { DoctorDetails } from "@/components/entities/doctor/DoctorDetails";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { GradientHeader } from "@/components/common/GradientHeader";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";

export default function DoctorDetailsPage() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();

  const {
    data: doctor,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.DOCTORS.DETAILS, doctorId],
    queryFn: () => APIService.doctors.getById(Number(doctorId)),
    enabled: !!doctorId,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <GradientHeader>
          <Text>{LanguageService.translate("Doctor Details")}</Text>
        </GradientHeader>
        <InlineLoader isLoading={isLoading} />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          text={LanguageService.translate("Failed to load doctor details")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DoctorDetails doctor={doctor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
});
