import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";
import { LanguageService } from "@/services/language/LanguageService";
import { APIService } from "@/services/APIService";
import { styles } from "./styles";
import type { DoctorSelectionModalProps } from "./types";
import type { MyDoctorFromApi } from "@/types/doctors";

export const DoctorSelectionModal: React.FC<DoctorSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelectDoctor,
}) => {
  const [doctors, setDoctors] = useState<MyDoctorFromApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadDoctors();
    }
  }, [isVisible]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await APIService.patients.getMyDoctors();
      setDoctors(response.patients);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("doctors", doctors);

  const handleSelectDoctor = (doctor: MyDoctorFromApi) => {
    onSelectDoctor(doctor);
    onClose();
  };

  const renderDoctorItem = (item: MyDoctorFromApi) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => handleSelectDoctor(item)}
      key={item.doctorId.toString()}
    >
      {/*{console.log("item", item.doctor.user.fullName)}*/}
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.doctor.user.fullName}</Text>
        <Text style={styles.doctorSpecialization}>
          {item.doctor.specialisation}
        </Text>
        <Text style={styles.doctorPlaceOfWork}>{item.doctor.user.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {LanguageService.translate("No doctors available")}
      </Text>
    </View>
  );

  return (
    <ModalWithBackDrop
      title={LanguageService.translate("Select Doctor")}
      onClose={onClose}
      isLoading={isLoading}
      // disableScrollView={true}
    >
      <View style={styles.container}>
        {doctors.length > 0 && (
          <>
            <Text style={styles.description}>
              {LanguageService.translate(
                "Choose a doctor to send the report to",
              )}
            </Text>
            <ScrollView style={styles.doctorsList}>
              {doctors.map(renderDoctorItem)}
            </ScrollView>
          </>
        )}
        {!doctors.length && renderEmptyState()}
      </View>
    </ModalWithBackDrop>
  );
};
