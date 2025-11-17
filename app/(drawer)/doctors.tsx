import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { APIService } from "@/services/APIService";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { router } from "expo-router";
import type { MyDoctorFromApi, DoctorFromApi } from "@/types/doctors";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { getAbsolutePhotoUrl } from "@/utils/ui/getAbsolutePhotoUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/buttons/Button";
import { useToaster } from "@/hooks/ui/useToaster";

interface PendingRequest {
  id: number;
  userId: number;
  doctorId: number;
  status: string;
  doctor: DoctorFromApi;
}

export default function DoctorsListPage() {
  const queryClient = useQueryClient();
  const { showSuccess } = useToaster();

  const {
    data: myDoctors,
    isLoading,
    error,
  } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
    queryFn: () => APIService.patients.getMyDoctors(),
  });

  const {
    data: pendingRequests,
    isLoading: isLoadingPending,
    error: pendingError,
  } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.MY_PENDING_REQUESTS],
    queryFn: () => APIService.patients.getMyPendingRequests(),
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (doctorId: number) =>
      APIService.patients.cancelRequest(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.MY_PENDING_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
      });
      showSuccess(LanguageService.translate("Request canceled successfully"));
    },
  });

  const handleDoctorPress = (doctorId: number) => {
    router.push(`/doctors/${doctorId}`);
  };

  const renderDoctorCard = ({ item }: { item: MyDoctorFromApi }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(item.doctor.id)}
    >
      <View style={styles.doctorContent}>
        {item.doctor.photoUrl && (
          <Image
            source={{
              uri: getAbsolutePhotoUrl(item.doctor.photoUrl),
            }}
            style={styles.doctorPhoto}
          />
        )}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.doctor.user.fullName}</Text>
          <Text style={styles.specialization}>
            {item.doctor.specialisation}
          </Text>
          <Text style={styles.placeOfWork}>{item.doctor.placeOfWork}</Text>
          {item.doctor.phone && (
            <Text style={styles.phone}>{item.doctor.phone}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPendingRequestCard = (request: PendingRequest) => (
    <View style={styles.pendingRequestCard}>
      <TouchableOpacity
        style={styles.pendingRequestContent}
        onPress={() => handleDoctorPress(request.doctor.id)}
      >
        {request.doctor.photoUrl && (
          <Image
            source={{
              uri: getAbsolutePhotoUrl(request.doctor.photoUrl),
            }}
            style={styles.doctorPhoto}
          />
        )}
        <View style={styles.pendingRequestInfo}>
          <Text style={styles.doctorName}>{request.doctor.user.fullName}</Text>
          <Text style={styles.specialization}>
            {request.doctor.specialisation}
          </Text>
          <Text style={styles.placeOfWork}>{request.doctor.placeOfWork}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.pendingRequestActions}>
        <Button
          text={LanguageService.translate("Cancel Request")}
          onPress={() => cancelRequestMutation.mutate(request.doctor.id)}
          disabled={cancelRequestMutation.isPending}
          color={AppColors.NEGATIVE}
          size={FontSizes.SMALL}
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {LanguageService.translate("No doctors found")}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {LanguageService.translate("Add doctors to your list to see them here")}
      </Text>
    </View>
  );

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
          text={LanguageService.translate("Failed to load doctors")}
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
                {renderPendingRequestCard(request)}
              </View>
            ))}
          </View>
        )}

        <View style={styles.approvedSection}>
          <Text style={styles.sectionTitle}>
            {LanguageService.translate("My Doctors")}
          </Text>
          {myDoctors?.patients.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={myDoctors?.patients || []}
              keyExtractor={(item) => item.doctor.id.toString()}
              renderItem={renderDoctorCard}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
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
    marginBottom: Spacings.SMALL,
  },
  pendingRequestInfo: {
    flex: 1,
  },
  pendingRequestActions: {
    alignItems: "flex-end",
  },
  listContainer: {
    padding: Spacings.STANDART,
  },
  doctorCard: {
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
  doctorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.LIGHT_GRAY,
    marginRight: Spacings.STANDART,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  specialization: {
    fontSize: FontSizes.STANDART,
    color: AppColors.SECONDARY,
    marginBottom: Spacings.SMALL,
  },
  placeOfWork: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  phone: {
    fontSize: FontSizes.SMALL,
    color: AppColors.SECONDARY,
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
