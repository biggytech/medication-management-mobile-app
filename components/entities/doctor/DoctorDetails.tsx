import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import type { DoctorFromApi } from "@/types/doctors";
import { GradientHeader } from "@/components/common/GradientHeader";
import { transparentColor } from "@/utils/ui/transparentColor";
import { darkenHexColor } from "@/utils/ui/darkenHexColor";
import { IconButton } from "@/components/common/buttons/IconButton";
import { router } from "expo-router";
import { getAbsolutePhotoUrl } from "@/utils/ui/getAbsolutePhotoUrl";

interface DoctorDetailsProps {
  doctor: DoctorFromApi;
}

export const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <GradientHeader
        colors={[
          transparentColor(AppColors.PRIMARY, 0.5),
          transparentColor(AppColors.SECONDARY, 0.5),
          transparentColor(AppColors.ACCENT, 0.4),
        ]}
        left={
          <IconButton onPress={() => router.back()} iconName={"arrow-back"} />
        }
      >
        {/* Doctor Photo */}
        {doctor.photoUrl && (
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: getAbsolutePhotoUrl(doctor.photoUrl),
              }}
              style={styles.photo}
            />
          </View>
        )}

        {/* Doctor Name */}
        <View style={styles.doctorNameContainer}>
          <Text style={styles.doctorName}>{doctor.user.fullName}</Text>
        </View>
      </GradientHeader>
      <View style={styles.content}>
        {/* Main Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              {LanguageService.translate("Specialization")}
            </Text>
            <Text style={styles.sectionValue}>{doctor.specialisation}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              {LanguageService.translate("Place of Work")}
            </Text>
            <Text style={styles.sectionValue}>{doctor.placeOfWork}</Text>
          </View>

          {doctor.phone && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>
                {LanguageService.translate("Phone")}
              </Text>
              <Text style={styles.sectionValue}>{doctor.phone}</Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              {LanguageService.translate("Email")}
            </Text>
            <Text style={styles.sectionValue}>{doctor.user.email}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  content: {
    padding: Spacings.STANDART,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: Spacings.BIG,
    marginTop: Spacings.BIG,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.LIGHT_GRAY,
    borderWidth: 3,
    borderColor: AppColors.ACCENT,
  },
  doctorNameContainer: {},
  doctorName: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: darkenHexColor(AppColors.ACCENT, 0.3),
    textAlign: "center",
    marginBottom: Spacings.BIG,
  },
  infoCard: {
    marginTop: Spacings.SMALL,
  },
  infoSection: {
    marginBottom: Spacings.STANDART,
  },
  sectionTitle: {
    fontSize: FontSizes.SMALL,
    fontWeight: "600",
    color: AppColors.SECONDARY,
    marginBottom: Spacings.SMALL,
  },
  sectionValue: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    lineHeight: 22,
  },
});
