import React, { useMemo } from "react";
import { Screen } from "@/components/Screen";
import { Title } from "@/components/typography/Title";
import { LanguageService } from "@/services/language/LanguageService";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { getNewMedicineSchema } from "@/validation/medicine";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/Wizard";

const NewMedicine: React.FC = () => {
  const handleSubmit = async (data: { title: string }) => {
    await APIService.medicines.add(data);
    router.replace(AppScreens.MEDICINES);
  };

  const screens = useMemo(() => {
    return [
      {
        key: "title-form",
        node: (
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
        ),
      },
      {
        key: "other-form",
        node: (
          <Form
            getSchema={getNewMedicineSchema}
            onSubmit={handleSubmit}
            submitText={LanguageService.translate("Add")}
          >
            {({ data, setValue, errors }) => (
              <>
                <Input
                  placeholder={LanguageService.translate("Kuku")}
                  value={data["title"]}
                  onChangeText={(text) => setValue("title", text)}
                  error={errors["title"]}
                />
              </>
            )}
          </Form>
        ),
      },
      {
        key: "3-form",
        node: (
          <Form
            getSchema={getNewMedicineSchema}
            onSubmit={handleSubmit}
            submitText={LanguageService.translate("Add")}
          >
            {({ data, setValue, errors }) => (
              <>
                <Input
                  placeholder={LanguageService.translate("3rd")}
                  value={data["title"]}
                  onChangeText={(text) => setValue("title", text)}
                  error={errors["title"]}
                />
              </>
            )}
          </Form>
        ),
      },
    ];
  }, []);

  return (
    <Screen>
      <Title>{LanguageService.translate("Add New Medicine")}</Title>
      <Wizard screens={screens} />
    </Screen>
  );
};

export default NewMedicine;
