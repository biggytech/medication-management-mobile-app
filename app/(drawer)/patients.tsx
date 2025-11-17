import React, { useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APIService } from "@/services/APIService";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { PatientReportModal } from "@/components/common/PatientReportModal";
import { useCurrentLanguage } from "@/hooks/language/useCurrentLanguage";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import { showError } from "@/utils/ui/showError";
import { showSuccess } from "@/utils/ui/showSuccess";
import type { UserFromApi } from "@/types/users";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/common/inputs/Input";

interface PendingRequest {
  id: number;
  userId: number;
  doctorId: number;
  status: string;
  user: UserFromApi;
}

export default function PatientsPage() {
  const queryClient = useQueryClient();

  const {
    data: patients,
    isLoading,
    error,
  } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.LIST],
    queryFn: () => APIService.patients.getPatients(),
  });

  const {
    data: pendingRequests,
    isLoading: isLoadingPending,
    error: pendingError,
  } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.PENDING_REQUESTS],
    queryFn: () => APIService.patients.getPendingRequests(),
  });

  const approveMutation = useMutation({
    mutationFn: (patientId: number) =>
      APIService.patients.approvePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.PENDING_REQUESTS],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATIENTS.LIST] });
      showSuccess(LanguageService.translate("Patient request approved"));
    },
    onError: () => {
      showError(LanguageService.translate("Failed to approve request"));
    },
  });

  const declineMutation = useMutation({
    mutationFn: (patientId: number) =>
      APIService.patients.declinePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.PENDING_REQUESTS],
      });
      showSuccess(LanguageService.translate("Patient request declined"));
    },
    onError: () => {
      showError(LanguageService.translate("Failed to decline request"));
    },
  });

  const { currentLanguage } = useCurrentLanguage();
  const [selectedPatient, setSelectedPatient] = useState<UserFromApi | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePatientPress = (patient: UserFromApi) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleSendReport = async (startDate: Date, endDate: Date) => {
    if (!selectedPatient || !currentLanguage) return;

    setIsSendingReport(true);
    try {
      await APIService.patientReports.sendToDoctorForPatient({
        startDate: yyyymmddFromDate(startDate),
        endDate: yyyymmddFromDate(endDate),
        language: currentLanguage,
        userId: selectedPatient.id,
      });

      showSuccess(LanguageService.translate("Report sent successfully"));
      handleCloseModal();
    } catch (error) {
      showError(LanguageService.translate("Failed to send report"));
    } finally {
      setIsSendingReport(false);
    }
  };

  const renderPatientCard = ({ item }: { item: UserFromApi }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => handlePatientPress(item)}
    >
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

  const renderPendingRequestCard = ({ item }: { item: PendingRequest }) => (
    <View style={styles.pendingRequestCard}>
      <View style={styles.pendingRequestContent}>
        <View style={styles.pendingRequestInfo}>
          <Text style={styles.pendingRequestName}>{item.user.fullName}</Text>
          <Text style={styles.pendingRequestEmail}>{item.user.email}</Text>
        </View>
        <View style={styles.pendingRequestActions}>
          <Button
            text={LanguageService.translate("Approve")}
            onPress={() => approveMutation.mutate(item.id)}
            disabled={approveMutation.isPending}
            color={AppColors.POSITIVE}
            size={FontSizes.SMALL}
          />
          <View style={styles.buttonSpacing} />
          <Button
            text={LanguageService.translate("Decline")}
            onPress={() => declineMutation.mutate(item.id)}
            disabled={declineMutation.isPending}
            color={AppColors.NEGATIVE}
            size={FontSizes.SMALL}
          />
        </View>
      </View>
    </View>
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

  // Filter patients based on search query
  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    if (!searchQuery.trim()) return patients;

    const query = searchQuery.toLowerCase().trim();
    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query),
    );
  }, [patients, searchQuery]);

  if (isLoading || isLoadingPending) {
    return (
      <View style={styles.container}>
        <InlineLoader isLoading={isLoading || isLoadingPending} />
      </View>
    );
  }

  if (error || pendingError) {
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pendingRequests && pendingRequests.patients.length > 0 && (
          <View style={styles.pendingSection}>
            <Text style={styles.sectionTitle}>
              {LanguageService.translate("Pending Requests")}
            </Text>
            {pendingRequests.patients.map((request) => (
              <View key={request.id}>
                {renderPendingRequestCard({ item: request })}
              </View>
            ))}
          </View>
        )}

        <View style={styles.approvedSection}>
          <Text style={styles.sectionTitle}>
            {LanguageService.translate("My Patients")}
          </Text>
          {patients && patients.length > 0 && (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Ionicons
                  name="search"
                  size={20}
                  color={AppColors.SECONDARY}
                  style={styles.searchIcon}
                />
                <Input
                  style={styles.searchInput}
                  placeholder={LanguageService.translate("Search patients...")}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  containerStyle={styles.searchInputContainer}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={styles.clearButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={AppColors.SECONDARY}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          {patients?.length === 0 ? (
            renderEmptyState()
          ) : filteredPatients.length === 0 && searchQuery.trim() ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                {LanguageService.translate("No patients found")}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {LanguageService.translate("Try adjusting your search query")}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPatients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPatientCard}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      <PatientReportModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSendReport={handleSendReport}
        patientName={selectedPatient?.fullName || ""}
        isLoading={isSendingReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  scrollContent: {
    padding: Spacings.STANDART,
  },
  pendingSection: {
    marginBottom: Spacings.BIG,
  },
  approvedSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.STANDART,
  },
  pendingRequestCard: {
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
    borderLeftWidth: 4,
    borderLeftColor: AppColors.ACCENT,
  },
  pendingRequestContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pendingRequestInfo: {
    flex: 1,
    marginRight: Spacings.STANDART,
  },
  pendingRequestName: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  pendingRequestEmail: {
    fontSize: FontSizes.STANDART,
    color: AppColors.SECONDARY,
  },
  pendingRequestActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpacing: {
    width: Spacings.SMALL,
  },
  listContainer: {
    padding: Spacings.STANDART,
  },
  patientCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 12,
    padding: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    marginBottom: Spacings.SMALL,
    // shadowColor: AppColors.BLACK,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    borderBottomWidth: 1,
    borderColor: AppColors.SECONDARY,
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
  searchContainer: {
    marginBottom: Spacings.STANDART,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.SMALL / 2,
  },
  searchIcon: {
    marginRight: Spacings.SMALL,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
    padding: 0,
    height: 36,
  },
  searchInputContainer: {
    marginBottom: 0,
    flex: 1,
    width: undefined,
  },
  clearButton: {
    marginLeft: Spacings.SMALL,
    padding: Spacings.SMALL / 2,
  },
});
