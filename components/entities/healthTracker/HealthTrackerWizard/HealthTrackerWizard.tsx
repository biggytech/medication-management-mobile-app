import React from "react";
import { View } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { SelectableList } from "@/components/common/inputs/SelectableList";
import { getNewHealthTrackerTypeSchema } from "@/validation/healthTrackers";
import { getHealthTrackerTypeOptions } from "./utils";
import type { WizardScreen } from "@/components/common/Wizard/types";
import { styles } from "@/components/entities/healthTracker/HealthTrackerWizard/styles";
import { ScheduleWizard } from "@/components/schedules/ScheduleWizard";
import { NotesWizard } from "@/components/notes/NotesWizard";
import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { getAvailableHealthTrackerTypes } from "@/utils/entities/healthTrackers/getAvailableHealthTrackerTypes";

/**
 * Shared health tracker wizard screens configuration
 * Contains all the wizard screens for both creating and editing health trackers
 */
export class HealthTrackerWizard {
  static getTypeScreen(
    existingTrackers: HealthTrackerFromApi[] = [],
  ): WizardScreen {
    // Get available health tracker types (filter out existing ones)
    const availableTypes = getAvailableHealthTrackerTypes(existingTrackers);
    const healthTrackerTypeOptions = getHealthTrackerTypeOptions().filter(
      (option) => availableTypes.includes(option.id as any),
    );

    return {
      key: "type",
      title: LanguageService.translate("🏥 What would you like to track?"),
      getValidationSchema: getNewHealthTrackerTypeSchema,
      node: ({ data, setValue, errors, onScreenSubmit }) => (
        <View style={styles.screen}>
          <SelectableList
            options={healthTrackerTypeOptions}
            selectedId={data["type"]}
            onSelect={(id) => {
              setValue("type", id);
              onScreenSubmit(); // Auto-submit when type is selected
            }}
          />
        </View>
      ),
    };
  }

  static getScheduleAndNotesScreens(): WizardScreen[] {
    return [
      ScheduleWizard.getScheduleTypeScreen(),
      ScheduleWizard.getScheduleDetailsScreen(),
      ScheduleWizard.getScheduleEndDateScreen(),
      NotesWizard.getNotesScreen(),
    ];
  }
}
