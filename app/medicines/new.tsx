import React, { useCallback, useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/inputs/Input";
import {
  getNewMedicineDoseSchema,
  getNewMedicineFormSchema,
  getNewMedicineTitleSchema,
  getNewMedicineEndDateSchema,
  getNewMedicineScheduleSchema,
} from "@/validation/medicine";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/Wizard";
import { StyleSheet, View } from "react-native";
import type { WizardScreen } from "@/components/Wizard/types";
import { Screen } from "@/components/Screen";
import {
  DEFAULT_MEDICINE_NOTIFICATION_TIME,
  MedicationScheduleOption,
  MedicineForms,
} from "@/constants/medicines";
import { type NewMedicine, type MedicationSchedule } from "@/types/medicines";
import { DatePicker } from "@/components/inputs/DatePicker";
import { SelectableList } from "@/components/inputs/SelectableList";
import type { SelectableListOption } from "@/components/inputs/SelectableList/types";
import { TimePicker } from "@/components/inputs/TimePicker";
import { TimesEditor } from "@/components/inputs/TimesEditor";
import { DaysOfWeekPicker } from "@/components/inputs/DaysOfWeekPicker";
import { NumberInput } from "@/components/inputs/NumberInput";
import { camelCaseToSnakeCaseObject } from "@/utils/objects/camelCaseToSnakeCaseObject";
import { Text } from "@/components/typography/Text";
import { MedicineScheduleService } from "@/services/medicines/MedicineScheduleService";

const NewMedicineScreen: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    await APIService.medicines.add(
      camelCaseToSnakeCaseObject(data) as NewMedicine,
    );
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

  const scheduleTypeOptions: SelectableListOption[] = useMemo(
    () =>
      Object.values(MedicationScheduleOption).map((value) => ({
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
              onSubmitEditing={() => onScreenSubmit()}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={3}
              returnKeyType="next"
            />
          </View>
        ),
      },
      {
        key: "scheduleType",
        title: LanguageService.translate(
          "⏰ How should we schedule reminders?",
        ),
        getValidationSchema: getNewMedicineScheduleSchema,
        node: ({ data, setValue, onScreenSubmit }) => {
          const schedule: MedicationSchedule =
            (data.setting as any)?.schedule ??
            MedicineScheduleService.getDefaultSchedule();

          const setType = (type: MedicationScheduleOption) => {
            const updatedSchedule = MedicineScheduleService.getScheduleForType(
              schedule,
              type,
            );
            setValue("setting.schedule", updatedSchedule);
            onScreenSubmit();
          };

          return (
            <View style={styles.screen}>
              <SelectableList
                options={scheduleTypeOptions}
                selectedId={schedule.type}
                onSelect={(id) => setType(id as MedicationScheduleOption)}
              />
            </View>
          );
        },
      },
      {
        key: "scheduleDetails",
        title: LanguageService.translate("⚙️ Schedule details"),
        getValidationSchema: getNewMedicineScheduleSchema,
        node: ({ data, setValue, errors, setTouched }) => {
          const schedule: MedicationSchedule =
            (data.setting as any)?.schedule ??
            MedicineScheduleService.getDefaultSchedule();

          const setSchedule = (key: keyof MedicationSchedule, value: any) => {
            const next = { ...schedule, [key]: value } as MedicationSchedule;
            setValue("setting.schedule", next);
          };

          return (
            <View style={styles.screen}>
              {schedule.type === MedicationScheduleOption.EVERY_DAY && (
                <>
                  <NumberInput
                    value={schedule.notificationTimes.length || 1}
                    onChange={(n: number) => {
                      const times = schedule.notificationTimes.slice(0, n);
                      while (times.length < n)
                        times.push(DEFAULT_MEDICINE_NOTIFICATION_TIME);
                      setSchedule("notificationTimes", times);
                    }}
                    min={1}
                    max={12}
                    label={LanguageService.translate("Times per day")}
                    onBlur={() =>
                      setTouched("setting.schedule.notificationTimes")
                    }
                    error={errors["setting.schedule.notificationTimes"]}
                  />
                  <TimesEditor
                    values={schedule.notificationTimes}
                    onChange={(vals: string[]) =>
                      setSchedule("notificationTimes", vals)
                    }
                    min={1}
                    max={12}
                    label={LanguageService.translate("Notification times")}
                  />
                </>
              )}

              {schedule.type === MedicationScheduleOption.EVERY_OTHER_DAY && (
                <>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      📅 {LanguageService.translate("Next dose date")}
                    </Text>
                  </View>
                  <DatePicker
                    placeholder={LanguageService.translate("Next dose date")}
                    value={schedule.nextDoseDate}
                    onChange={(d) => setSchedule("nextDoseDate", d)}
                    minDate={new Date()}
                    allowSkip={false}
                    error={errors["setting.schedule.nextDoseDate"]}
                    onBlur={() => setTouched("setting.schedule.nextDoseDate")}
                  />
                  <TimePicker
                    value={schedule.notificationTimes[0] || null}
                    onChange={(t: string | null) =>
                      setSchedule("notificationTimes", t ? [t] : [])
                    }
                    placeholder={LanguageService.translate("Reminder time")}
                    allowClear={false}
                    error={errors["setting.schedule.notificationTimes"]}
                    onBlur={() =>
                      setTouched("setting.schedule.notificationTimes")
                    }
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type === MedicationScheduleOption.EVERY_X_DAYS && (
                <>
                  <NumberInput
                    value={schedule.everyXDays || 1}
                    onChange={(x: number) => setSchedule("everyXDays", x)}
                    min={1}
                    max={365}
                    label={LanguageService.translate("Every X days (1-365)")}
                    onBlur={() => setTouched("setting.schedule.everyXDays")}
                    error={errors["setting.schedule.everyXDays"]}
                  />
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      📅 {LanguageService.translate("Next dose date")}
                    </Text>
                  </View>
                  <DatePicker
                    placeholder={LanguageService.translate("Next dose date")}
                    value={schedule.nextDoseDate}
                    onChange={(d) => setSchedule("nextDoseDate", d)}
                    minDate={new Date()}
                    allowSkip={false}
                    error={errors["setting.schedule.nextDoseDate"]}
                    onBlur={() => setTouched("setting.schedule.nextDoseDate")}
                  />
                  <TimePicker
                    value={schedule.notificationTimes[0] || null}
                    onChange={(t: string | null) =>
                      setSchedule("notificationTimes", t ? [t] : [])
                    }
                    placeholder={LanguageService.translate("Reminder time")}
                    allowClear={false}
                    error={errors["setting.schedule.notificationTimes"]}
                    onBlur={() =>
                      setTouched("setting.schedule.notificationTimes")
                    }
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type ===
                MedicationScheduleOption.SPECIFIC_WEEK_DAYS && (
                <>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      📅 {LanguageService.translate("Select days of the week")}
                    </Text>
                  </View>
                  <DaysOfWeekPicker
                    values={schedule.daysOfWeek || []}
                    onChange={(vals: number[]) =>
                      setSchedule("daysOfWeek", vals)
                    }
                  />
                  <TimePicker
                    value={schedule.notificationTimes[0] || null}
                    onChange={(t: string | null) =>
                      setSchedule("notificationTimes", t ? [t] : [])
                    }
                    placeholder={LanguageService.translate("Reminder time")}
                    allowClear={false}
                    error={errors["setting.schedule.notificationTimes"]}
                    onBlur={() =>
                      setTouched("setting.schedule.notificationTimes")
                    }
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type === MedicationScheduleOption.ONLY_AS_NEEDED &&
                null}
            </View>
          );
        },
      },
      {
        key: "endDate",
        title: LanguageService.translate("📅 When do you plan to finish?"),
        getValidationSchema: getNewMedicineEndDateSchema,
        node: ({ data, setValue, onScreenSubmit, errors, setTouched }) => (
          <>
            <View style={styles.screen}>
              <DatePicker
                placeholder={LanguageService.translate("End date")}
                value={data.setting?.endDate as Date | null}
                onChange={(val: Date | null) => {
                  setValue("setting.endDate", val);
                }}
                minDate={new Date()}
                allowSkip
                onSkipClick={() => {
                  setValue("setting.endDate", null);
                  onScreenSubmit({
                    ...data,
                    setting: {
                      ...data.setting,
                      endDate: null,
                    },
                  });
                }}
                error={errors["setting.endDate"]}
                onBlur={() => setTouched("setting.endDate")}
              />
            </View>
          </>
        ),
      },
    ];
  }, [formOptions, scheduleTypeOptions]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen>
      <Wizard
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
  labelContainer: {
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
});

export default NewMedicineScreen;
