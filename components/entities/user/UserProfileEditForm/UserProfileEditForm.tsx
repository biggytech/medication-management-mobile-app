import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { getUserProfileEditSchema } from "@/validation/user";
import { SexTypes } from "@/constants/users";
import { Form } from "@/components/common/inputs/Form";
import { Input } from "@/components/common/inputs/Input";
import { DatePicker } from "@/components/common/inputs/DatePicker";
import { Text } from "@/components/common/typography/Text";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { UserDataForEditing } from "@/types/users";
import { useToaster } from "@/hooks/ui/useToaster";
import { FontSizes } from "@/constants/styling/fonts";
import { useAuthSession } from "@/providers/AuthProvider";

interface UserProfileEditFormProps {
  initialData: Omit<UserDataForEditing, "isGuest">;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserProfileEditForm: React.FC<UserProfileEditFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { setCurrentUser } = useAuthSession();
  const queryClient = useQueryClient();
  const toaster = useToaster();

  const sexOptions = useMemo(
    () => [
      {
        id: SexTypes.MALE,
        title: LanguageService.translate(SexTypes.MALE),
      },
      {
        id: SexTypes.FEMALE,
        title: LanguageService.translate(SexTypes.FEMALE),
      },
    ],
    [],
  );

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserDataForEditing) =>
      APIService.users.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toaster.showSuccess(
        LanguageService.translate("Profile updated successfully"),
      );
      onSuccess?.();
    },
    onError: (error) => {
      toaster.showError(LanguageService.translate("Failed to update profile"));
      console.error("Profile update error:", error);
    },
  });

  const handleSubmit = async (data: Omit<UserDataForEditing, "isGuest">) => {
    const result = await updateProfileMutation.mutateAsync(data);
    setCurrentUser({
      fullName: result.fullName,
      isGuest: result.isGuest,
      id: result.id,
      isDoctor: result.isDoctor,
    });
  };

  return (
    <View style={styles.container}>
      <Form
        getSchema={getUserProfileEditSchema}
        initialData={initialData}
        onSubmit={handleSubmit}
        submitText={LanguageService.translate("Save Changes")}
        isDisabled={updateProfileMutation.isPending}
      >
        {({ data, setValue, setTouched, errors, isValid }) => (
          <View style={styles.formContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {LanguageService.translate("Full Name")}
              </Text>
              <Input
                placeholder={LanguageService.translate("Full Name")}
                value={data.fullName || ""}
                onChangeText={(text) => setValue("fullName", text)}
                onBlur={() => setTouched("fullName")}
                error={errors.fullName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {LanguageService.translate("Email")}
              </Text>
              <Input
                placeholder={LanguageService.translate("Email")}
                value={data.email || ""}
                onChangeText={(text) => setValue("email", text)}
                onBlur={() => setTouched("email")}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {LanguageService.translate("Password")}
              </Text>
              <Input
                placeholder={LanguageService.translate("Password")}
                value={data.password || ""}
                onChangeText={(text) => setValue("password", text)}
                onBlur={() => setTouched("password")}
                error={errors.password}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                {LanguageService.translate("Sex")}
              </Text>
              <View style={styles.sexPicker}>
                {sexOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sexOption,
                      data.sex === option.id && styles.sexOptionSelected,
                    ]}
                    onPress={() => setValue("sex", option.id)}
                  >
                    <Text
                      style={[
                        styles.sexOptionText,
                        data.sex === option.id && styles.sexOptionTextSelected,
                      ]}
                    >
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.sex && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.sex}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {LanguageService.translate("Date of Birth")}
              </Text>
              <DatePicker
                value={data.dateOfBirth}
                onChange={(date) => setValue("dateOfBirth", date)}
                onBlur={() => setTouched("dateOfBirth")}
                placeholder={LanguageService.translate("Date of Birth")}
                minDate={new Date(1900, 0, 1)}
                allowSkip={false}
                showTodayButton={false}
                error={errors.dateOfBirth}
                style={[styles.input, styles.dateOfBirth]}
              />
            </View>
          </View>
        )}
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
    // backgroundColor: "red",
  },
  formContent: {
    // padding: Spacings.STANDART,
    gap: Spacings.SMALL,
  },
  inputContainer: {
    // marginBottom: Spacings.SMALL,
  },
  input: {
    // marginTop: 4,
    width: 250,
  },
  dateOfBirth: {
    marginBottom: Spacings.STANDART,
  },
  section: {
    marginBottom: Spacings.SMALL,
  },
  label: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    marginBottom: Spacings.SMALL,
    color: AppColors.FONT,
  },
  sexPicker: {
    flexDirection: "row",
    gap: Spacings.SMALL,
  },
  sexOption: {
    flex: 1,
    padding: Spacings.SMALL,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.LIGHT_GRAY,
    backgroundColor: AppColors.WHITE,
    alignItems: "center",
  },
  sexOptionSelected: {
    borderColor: AppColors.ACCENT,
    backgroundColor: AppColors.LIGHT_GRAY,
  },
  sexOptionText: {
    fontSize: 14,
    color: AppColors.FONT,
  },
  sexOptionTextSelected: {
    color: AppColors.ACCENT,
    fontWeight: "600",
  },
  errorContainer: {
    marginTop: Spacings.SMALL,
  },
  errorText: {
    color: AppColors.NEGATIVE,
    fontSize: 12,
  },
});
