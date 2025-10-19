import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { DetailsCard } from "@/components/common/DetailsCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/loaders/Loader";
import { PrimaryButton } from "@/components/common/buttons/PrimaryButton";
import { UserProfileEditForm } from "@/components/entities/user/UserProfileEditForm";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import { SexTypes } from "@/constants/users";
import { UserDataForEditing } from "@/types/users";
import { Heading } from "@/components/common/typography/Heading";
import { IconButton } from "@/components/common/buttons/IconButton";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useIsFocused();

  const {
    data: userProfile,
    isLoading,
    error,
  } = useQueryWithFocus({
    queryKey: ["userProfile"],
    queryFn: () => APIService.users.getProfile(),
  });

  // Reset editing state when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      setIsEditing(false);
    }
  }, [isFocused]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const getEditFormData = (): UserDataForEditing => {
    if (!userProfile) {
      return {
        fullName: "",
        email: "",
        password: "",
        sex: null,
        dateOfBirth: null,
      };
    }

    return {
      fullName: userProfile.fullName,
      email: userProfile.email,
      password: null, // Don't pre-fill password for security
      sex: userProfile.sex,
      dateOfBirth: userProfile.dateOfBirth
        ? new Date(userProfile.dateOfBirth)
        : null,
    };
  };

  if (isEditing) {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            marginTop: Spacings.STANDART,
          }}
        >
          <View style={styles.editFormHeader}>
            <IconButton
              iconName={"arrow-back"}
              onPress={handleCancelEdit}
              color={AppColors.ACCENT}
            />
            <Heading
              style={{
                textAlign: "center",
              }}
            >
              {LanguageService.translate("Edit Profile")}
            </Heading>
            <View />
          </View>
          <UserProfileEditForm
            initialData={getEditFormData()}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
          />
        </View>
      </ScrollView>
    );
  }

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
        <View style={styles.actions}>
          <PrimaryButton
            title={LanguageService.translate("Edit Profile")}
            onPress={handleEditClick}
            style={styles.editButton}
          />
        </View>
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
  actions: {
    marginTop: Spacings.STANDART,
  },
  editButton: {
    // marginBottom: Spacings.SMALL,
    backgroundColor: AppColors.ACCENT,
  },
  editActions: {
    // marginTop: Spacings.STANDART,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  cancelButton: {
    flex: 1,
    maxWidth: 200,
  },
  editFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacings.STANDART,
    marginBottom: Spacings.STANDART,
  },
});
