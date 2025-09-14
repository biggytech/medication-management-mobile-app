import React from "react";
import { Screen } from "@/components/Screen";
import { Title } from "@/components/typography/Title";
import { LanguageService } from "@/services/language/LanguageService";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { getNewMedicineSchema } from "@/validation/medicine";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";

const NewMedicine: React.FC = () => {
  const handleSubmit = async (data: { title: string }) => {
    await APIService.medicines.add(data);
    router.replace(AppScreens.MEDICINES);
  };

  return (
    <Screen>
      <Title>{LanguageService.translate("Add New Medicine")}</Title>
      <Form
        getSchema={getNewMedicineSchema}
        onSubmit={handleSubmit}
        submitText={LanguageService.translate("Add")}
      >
        {({ data, setValue, errors }) => (
          <>
            <Input
              placeholder={LanguageService.translate("Title")}
              value={data["title"]}
              onChangeText={(text) => setValue("title", text)}
              error={errors["title"]}
            />
          </>
        )}
      </Form>
    </Screen>
  );
};

export default NewMedicine;
