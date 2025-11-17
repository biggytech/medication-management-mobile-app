import React from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { DoctorDetails } from "@/components/entities/doctor/DoctorDetails";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { GradientHeader } from "@/components/common/GradientHeader";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import { Spacings } from "@/constants/styling/spacings";
import { Button } from "@/components/common/buttons/Button";
import { useToaster } from "@/hooks/ui/useToaster";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";

export default function DoctorDetailsPage() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const queryClient = useQueryClient();
  const { showSuccess } = useToaster();

  const {
    data: doctor,
    isLoading,
    error,
  } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.DOCTORS.DETAILS, doctorId],
    queryFn: () => APIService.doctors.getById(Number(doctorId)),
    enabled: !!doctorId,
  });

  const { data: myDoctors, isLoading: isLoadingMyDoctors } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
    queryFn: () => APIService.patients.getMyDoctors(),
  });

  // Check if current doctor is already in my doctors list
  const isMyDoctor =
    myDoctors?.patients.some(
      (myDoctor) => myDoctor.doctor.id === Number(doctorId),
    ) ?? false;

  const { data: relationshipStatus } = useQueryWithFocus({
    queryKey: [QUERY_KEYS.PATIENTS.RELATIONSHIP_STATUS, doctorId],
    queryFn: () => APIService.patients.getRelationshipStatus(Number(doctorId)),
    enabled: !!doctorId && !isMyDoctor,
  });

  const becomePatientMutation = useMutation({
    mutationFn: (doctorId: number) =>
      APIService.patients.becomePatient(doctorId),
    onSuccess: () => {
      // Invalidate and refetch my doctors list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DOCTORS.DETAILS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.RELATIONSHIP_STATUS, doctorId],
      });
      // Show success toast
      showSuccess(LanguageService.translate("Request sent successfully"));
    },
  });

  const removeDoctorMutation = useMutation({
    mutationFn: (doctorId: number) =>
      APIService.patients.removeDoctor(doctorId),
    onSuccess: () => {
      // Invalidate and refetch my doctors list and doctor details
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DOCTORS.DETAILS, doctorId],
      });
      // Show success toast
      showSuccess(LanguageService.translate("Doctor removed successfully"));
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (doctorId: number) =>
      APIService.patients.cancelRequest(doctorId),
    onSuccess: () => {
      // Invalidate and refetch relationship status and my doctors list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.RELATIONSHIP_STATUS, doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PATIENTS.MY_DOCTORS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DOCTORS.DETAILS, doctorId],
      });
      // Show success toast
      showSuccess(LanguageService.translate("Request canceled successfully"));
    },
  });

  // Check if there's a pending request
  const isPending = relationshipStatus?.status === "pending";

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

  const handleBecomePatient = () => {
    if (doctorId) {
      becomePatientMutation.mutate(Number(doctorId));
    }
  };

  const handleRemoveDoctor = () => {
    if (doctorId) {
      removeDoctorMutation.mutate(Number(doctorId));
    }
  };

  const handleStartChat = () => {
    if (doctor) {
      router.push(`/chat/${doctor.user.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <DoctorDetails doctor={doctor} />
      {!isLoadingMyDoctors && (
        <View style={styles.buttonContainer}>
          {!isMyDoctor ? (
            <>
              {isPending ? (
                <Button
                  text={LanguageService.translate("Cancel Request")}
                  onPress={() => cancelRequestMutation.mutate(Number(doctorId))}
                  disabled={cancelRequestMutation.isPending}
                  color={AppColors.NEGATIVE}
                />
              ) : (
                <Button
                  text={LanguageService.translate("Add as My Doctor")}
                  onPress={handleBecomePatient}
                  disabled={becomePatientMutation.isPending}
                  color={AppColors.POSITIVE}
                />
              )}
            </>
          ) : (
            <Button
              text={LanguageService.translate("Remove from My Doctors")}
              onPress={handleRemoveDoctor}
              disabled={removeDoctorMutation.isPending}
              color={AppColors.NEGATIVE}
            />
          )}
          {isMyDoctor && (
            <View style={styles.chatButtonContainer}>
              <Button
                text={LanguageService.translate("Start Chat")}
                onPress={handleStartChat}
                color={AppColors.PRIMARY}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  buttonContainer: {
    padding: Spacings.STANDART,
    backgroundColor: AppColors.BACKGROUND,
  },
  chatButtonContainer: {
    marginTop: Spacings.SMALL,
  },
});
