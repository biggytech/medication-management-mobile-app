import React, { useState } from "react";
import { Screen } from "@/components/Screen";
import { Title } from "@/components/typography/Title";
import { LanguageService } from "@/services/language/LanguageService";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { validateObject } from "@/utils/validation/validateObject";
import { getNewMedicineSchema } from "@/validation/medicine";

const NewMedicine: React.FC = () => {
  const [title, setTitle] = useState<string>("");

  const { isValid, errors } = validateObject(getNewMedicineSchema(), {
    title,
  });

  const isButtonDisabled = !isValid;

  return (
    <Screen>
      <Title>{LanguageService.translate("Add New Medicine")}</Title>
      <Form>
        <Input
          autoFocus
          placeholder={LanguageService.translate("Title")}
          value={title}
          onChangeText={(text) => setTitle(text.trim())}
          error={errors["title"]}
        />
      </Form>
    </Screen>
  );
};

export default NewMedicine;
