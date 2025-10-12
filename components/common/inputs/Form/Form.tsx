import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import {
  type DataForValidation,
  validateObject,
} from "@/utils/validation/validateObject";
import { AppColors } from "@/constants/styling/colors";
import { Button } from "@/components/common/buttons/Button";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { deepen } from "@/utils/objects/deepen";
import { styles } from "@/components/common/inputs/Form/styles";
import type { FormProps } from "@/components/common/inputs/Form/types";
import { ReactMemoWithGeneric } from "@/utils/types/ReactMemoWithGeneric";

const Form = <T extends DataForValidation = DataForValidation>({
  ref,
  getSchema,
  children,
  style,
  onSubmit,
  onSubmitDisabled,
  submitText,
  isDisabled = false,
  shouldShowLoader = true,
  initialData,
}: FormProps<T>) => {
  const [data, setData] = useState<Partial<T>>(initialData ?? {});
  const [touchedFields, setTouchedFields] = useState<
    Partial<{
      [key in keyof T]: boolean;
    }>
  >({});

  const deepenedData = useMemo(() => deepen(data), [data]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationResult = validateObject(
    getSchema(),
    touchedFields,
    deepenedData,
  );

  const isButtonDisabled = isDisabled || isLoading || !validationResult.isValid;

  const setValue = useCallback((field: keyof T, value: any) => {
    setData((data) => ({ ...data, [field]: value }));
  }, []);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedFields((data) => ({ ...data, [field]: true }));
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await onSubmit?.(deepenedData as Required<T>);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onSubmitDisabled?.(isButtonDisabled);
  }, [isButtonDisabled, onSubmitDisabled]);

  useImperativeHandle(ref, () => {
    return {
      getData() {
        return deepenedData;
      },
    };
  }, [deepenedData]);

  return (
    <View style={[styles.form, style]}>
      {children({
        data: deepenedData,
        setValue,
        setTouched,
        ...validationResult,
      })}
      {onSubmit && submitText && (
        <Button
          text={submitText}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
      )}
      {shouldShowLoader && <InlineLoader isLoading={isLoading} />}
    </View>
  );
};

export default ReactMemoWithGeneric(Form);
