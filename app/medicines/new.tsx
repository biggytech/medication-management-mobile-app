import React, { useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/Input";
import {
  getNewMedicineFormSchema,
  getNewMedicineTitleSchema,
} from "@/validation/medicine";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/Wizard";
import { View } from "react-native";
import type { WizardScreen } from "@/components/Wizard/types";
import { Screen } from "@/components/Screen";

const NewMedicine: React.FC = () => {
  const handleSubmit = async (data: { title: string }) => {
    await APIService.medicines.add(data);
    router.replace(AppScreens.MEDICINES);
  };

  const screens: WizardScreen[] = useMemo(() => {
    return [
      {
        key: "title",
        title: LanguageService.translate(
          "💊 What is the title of the medicine?",
        ),
        getValidationSchema: getNewMedicineTitleSchema,
        node: ({ data, setValue, errors }) => (
          <View>
            <>
              <Input
                placeholder={LanguageService.translate("Title")}
                value={data["title"]}
                onChangeText={(text) => setValue("title", text)}
                error={errors["title"]}
              />
            </>
          </View>
        ),
      },
      {
        key: "form",
        title: LanguageService.translate(
          "💉 What form does the medicine come in?",
        ),
        getValidationSchema: getNewMedicineFormSchema,
        node: ({ data, setValue, errors }) => (
          <View>
            <>
              <Input
                placeholder={LanguageService.translate("Form")}
                value={data["form"]}
                onChangeText={(text) => setValue("form", text)}
                error={errors["form"]}
              />
            </>
          </View>
        ),
      },
    ];
  }, []);

  return (
    <Screen>
      <Wizard screens={screens} />
    </Screen>
  );
};

export default NewMedicine;
