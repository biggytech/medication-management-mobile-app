import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import type { UserFromApi } from "@/types/users";

export default function PatientsPage() {
  const {
    data: patients,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PATIENTS.LIST],
    queryFn: () => APIService.patients.getPatients(),
  });

  const renderPatientCard = ({ item }: { item: UserFromApi }) => (
    <TouchableOpacity style={styles.patientCard}>
      <View style={styles.patientContent}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.fullName}</Text>
          <Text style={styles.patientEmail}>{item.email}</Text>
          {item.dateOfBirth && (
            <Text style={styles.patientDateOfBirth}>
              {LanguageService.translate("Date of Birth")}: {item.dateOfBirth}
            </Text>
          )}
          {item.sex && (
            <Text style={styles.patientSex}>
              {LanguageService.translate("Sex")}:{" "}
              {LanguageService.translate(item.sex)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {LanguageService.translate("No patients found")}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {LanguageService.translate(
          "Patients will appear here when they register with you",
        )}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <InlineLoader isLoading={isLoading} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          text={LanguageService.translate("Failed to load patients")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {patients?.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={patients || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPatientCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  listContainer: {
    padding: Spacings.STANDART,
  },
  patientCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 12,
    padding: Spacings.STANDART,
    marginBottom: Spacings.SMALL,
    shadowColor: AppColors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  patientEmail: {
    fontSize: FontSizes.STANDART,
    color: AppColors.SECONDARY,
    marginBottom: Spacings.SMALL,
  },
  patientDateOfBirth: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  patientSex: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacings.BIG,
  },
  emptyStateTitle: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  emptyStateSubtitle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.SECONDARY,
    textAlign: "center",
    lineHeight: 22,
  },
});
