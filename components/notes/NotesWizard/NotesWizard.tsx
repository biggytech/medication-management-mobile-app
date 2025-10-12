import React from "react";
import { View } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { TextArea } from "@/components/common/inputs/TextArea";
import type { WizardScreen } from "@/components/common/Wizard/types";

import { styles } from "./styles";
import { getNotableEntityNotesSchema } from "@/validation/notes";

export class NotesWizard {
  static getNotesScreen(): WizardScreen {
    return {
      key: "notes",
      title: LanguageService.translate("🗒️ Do you want to add notes?"),
      getValidationSchema: getNotableEntityNotesSchema,
      node: ({ data, setValue, onScreenSubmit, errors, setTouched }) => (
        <>
          <View style={styles.screen}>
            <TextArea
              placeholder={LanguageService.translate("Notes")}
              value={data["notes"]}
              onChangeText={(text) => setValue("notes", text)}
              onBlur={() => setTouched("notes")}
              error={errors["notes"]}
              onSubmitEditing={() => onScreenSubmit()}
              returnKeyType="done"
            />
          </View>
        </>
      ),
    };
  }
}
