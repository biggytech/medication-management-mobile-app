import React, { useCallback, useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/inputs/Input";
import {
  getNewMedicineDoseSchema,
  getNewMedicineFormSchema,
  getNewMedicineTitleSchema,
  getNewMedicineEndDateSchema,
} from "@/validation/medicine";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/Wizard";
import { StyleSheet, View } from "react-native";
import type { WizardScreen } from "@/components/Wizard/types";
import { Screen } from "@/components/Screen";
import { SelectableList } from "@/components/inputs/SelectableList";
import type { SelectableListOption } from "@/components/inputs/SelectableList/types";
import { MedicineForms } from "@/constants/medicines";
import type { NewMedicine } from "@/types/medicines";
import { DatePicker } from "@/components/inputs/DatePicker";

const NewMedicineScreen: React.FC = () => {
  const handleSubmit = useCallback(async (data: NewMedicine) => {
    await APIService.medicines.add(data);
    router.replace(AppScreens.MEDICINES);
  }, []);

  const formOptions: SelectableListOption[] = useMemo(
    () =>
      Object.values(MedicineForms).map((value) => ({
        title: LanguageService.translate(value),
        id: value,
      })),
    [],
  );

  const screens: WizardScreen[] = useMemo(() => {
    return [
      {
        key: "title",
        title: LanguageService.translate(
          "💊 What is the title of the medicine?",
        ),
        getValidationSchema: getNewMedicineTitleSchema,
        node: ({ data, setValue, setTouched, onScreenSubmit, errors }) => (
          <View style={styles.screen}>
            <Input
              placeholder={LanguageService.translate("Title")}
              value={data["title"]}
              onChangeText={(text) => setValue("title", text)}
              onBlur={() => setTouched("title")}
              error={errors["title"]}
              onSubmitEditing={onScreenSubmit}
              returnKeyType="next"
            />
          </View>
        ),
      },
      {
        key: "form",
        title: LanguageService.translate(
          "💉 What form does the medicine come in?",
        ),
        getValidationSchema: getNewMedicineFormSchema,
        node: ({ data, setValue, errors, onScreenSubmit }) => (
          <View style={styles.screen}>
            <SelectableList
              options={formOptions}
              selectedId={data["form"]}
              onSelect={(id) => {
                setValue("form", id);
              }}
            />
          </View>
        ),
      },
      {
        key: "dose",
        title: LanguageService.translate(
          "\uD83E\uDDEE How much do you need to take?",
        ),
        getValidationSchema: getNewMedicineDoseSchema,
        node: ({ data, setValue, errors, onScreenSubmit, setTouched }) => (
          <View style={styles.screen}>
            <Input
              placeholder={LanguageService.translate("Dose")}
              value={data.setting?.dose}
              onChangeText={(text) => setValue("setting.dose", text)}
              onBlur={() => setTouched("setting.dose")}
              error={errors["setting.dose"]}
              onSubmitEditing={onScreenSubmit}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={3}
              returnKeyType="next"
            />
          </View>
        ),
      },
      {
        key: "endDate",
        title: LanguageService.translate("📅 When do you plan to finish?"),
        getValidationSchema: getNewMedicineEndDateSchema,
        node: ({ data, setValue }) => (
          <View style={styles.screen}>
            <DatePicker
              placeholder={LanguageService.translate("End date")}
              value={data.setting?.endDate as Date | null}
              onChange={(val: Date | null) => {
                setValue("setting.endDate", val);
              }}
              minDate={new Date()}
              allowClear
            />
          </View>
        ),
      },
    ];
  }, [formOptions]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen>
      <Wizard<NewMedicine>
        onCancel={handleGoBack}
        onSubmit={handleSubmit}
        screens={screens}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
});

export default NewMedicineScreen;
