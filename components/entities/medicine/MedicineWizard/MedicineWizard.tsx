import React from "react";
import { View } from "react-native";
import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/common/inputs/Input";
import {
  getCountSchema,
  getNewMedicineDoseSchema,
  getNewMedicineFormSchema,
  getNewMedicineTitleSchema,
} from "@/validation/medicine";
import { SelectableList } from "@/components/common/inputs/SelectableList";
import { Text } from "@/components/common/typography/Text";
import { getFormOptions } from "./utils";
import { type MedicineData } from "@/types/medicines";
import type { WizardScreen } from "@/components/common/Wizard/types";
import { styles } from "@/components/entities/medicine/MedicineWizard/styles";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { ScheduleWizard } from "@/components/schedules/ScheduleWizard";
import { NotesWizard } from "@/components/notes/NotesWizard";
import { Link } from "@/components/common/buttons/Link";

/**
 * Shared medicine wizard screens configuration
 * Contains all the wizard screens for both creating and editing medicines
 */
export class MedicineWizard {
  /**
   * Get all wizard screens for medicine creation/editing
   */
  static getScreens(): WizardScreen[] {
    const formOptions = getFormOptions();

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
              onSubmitEditing={() => onScreenSubmit()}
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
      ScheduleWizard.getScheduleTypeScreen(),
      ScheduleWizard.getScheduleDetailsScreen(),
      {
        key: "dose",
        title: LanguageService.translate("🧮 How much do you need to take?"),
        getValidationSchema: getNewMedicineDoseSchema,
        node: ({ data, setValue, errors, onScreenSubmit, setTouched }) => (
          <View style={styles.screen}>
            <View style={styles.row}>
              <Input
                placeholder={LanguageService.translate("Dose")}
                value={String(data.schedule?.dose ?? "")}
                onChangeText={(text) => setValue("schedule.dose", text)}
                onBlur={() => setTouched("schedule.dose")}
                error={errors["schedule.dose"]}
                onSubmitEditing={() => onScreenSubmit()}
                keyboardType="numeric"
                inputMode="numeric"
                maxLength={3}
                returnKeyType="next"
              />
              <Text style={styles.label}>
                {getMedicineDoseText(data as MedicineData)}
              </Text>
            </View>
          </View>
        ),
      },
      {
        key: "count",
        title: LanguageService.translate("💊 How many do you have?"),
        getValidationSchema: () =>
          yup.object().shape({
            count: getCountSchema(),
          }),
        node: ({ data, setValue, errors, onScreenSubmit, setTouched }) => (
          <View style={styles.screen}>
            <View style={styles.row}>
              <Input
                placeholder={LanguageService.translate("Count")}
                value={String(data.count ?? "")}
                onChangeText={(text) => setValue("count", text)}
                onBlur={() => setTouched("count")}
                error={errors["count"]}
                onSubmitEditing={() => onScreenSubmit()}
                keyboardType="numeric"
                inputMode="numeric"
                maxLength={4}
                returnKeyType="next"
              />
              <Text style={styles.label}>
                {getMedicineDoseText(data as MedicineData)}
              </Text>
            </View>
            <Link
              text={LanguageService.translate("Skip")}
              onPress={() => {
                onScreenSubmit();
              }}
            />
          </View>
        ),
      },
      ScheduleWizard.getScheduleEndDateScreen(),
      NotesWizard.getNotesScreen(),
    ];
  }
}
