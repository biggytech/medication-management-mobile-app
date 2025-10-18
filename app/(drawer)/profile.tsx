import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { DetailsCard } from "@/components/common/DetailsCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/loaders/Loader";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import { SexTypes } from "@/constants/users";

export default function ProfilePage() {
  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => APIService.users.getProfile(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorMessage
        text={LanguageService.translate("Failed to load profile")}
      />
    );
  }

  if (!userProfile) {
    return (
      <ErrorMessage
        text={LanguageService.translate("No profile data available")}
      />
    );
  }

  const formatDateOfBirth = (dateString: string | null) => {
    if (!dateString) return LanguageService.translate("Not specified");
    return ddmmyyyyFromDate(new Date(dateString));
  };

  const formatSex = (sex: SexTypes | null) => {
    if (!sex) return LanguageService.translate("Not specified");
    return LanguageService.translate(sex);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <DetailsCard
          items={[
            {
              key: "fullName",
              iconName: "person",
              label: LanguageService.translate("Full Name"),
              value: userProfile.fullName,
            },
            {
              key: "email",
              iconName: "mail",
              label: LanguageService.translate("Email"),
              value: userProfile.email,
            },
            {
              key: "sex",
              iconName: "male-female",
              label: LanguageService.translate("Sex"),
              value: formatSex(userProfile.sex),
            },
            {
              key: "dateOfBirth",
              iconName: "calendar",
              label: LanguageService.translate("Date of Birth"),
              value: formatDateOfBirth(userProfile.dateOfBirth),
            },
            {
              key: "userId",
              iconName: "key",
              label: LanguageService.translate("User ID"),
              value: userProfile.id.toString(),
            },
            {
              key: "uuid",
              iconName: "finger-print",
              label: LanguageService.translate("UUID"),
              value: userProfile.uuid,
            },
            {
              key: "accountType",
              iconName: "shield-checkmark",
              label: LanguageService.translate("Account Type"),
              value: userProfile.isGuest
                ? LanguageService.translate("Guest Account")
                : LanguageService.translate("Registered Account"),
            },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  content: {
    padding: Spacings.STANDART,
    gap: Spacings.STANDART,
  },
});
