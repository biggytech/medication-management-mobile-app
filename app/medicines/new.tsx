import React, { useCallback, useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/inputs/Input";
import {
  getNewMedicineDoseSchema,
  getNewMedicineFormSchema,
  getNewMedicineTitleSchema,
  getNewMedicineEndDateSchema,
  getNewMedicineScheduleSchema,
  getNewMedicineNotesSchema,
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
  MedicineScheduleTypes,
  MedicineForms,
  MEDICINE_SCHEDULE_TYPE_LABELS,
} from "@/constants/medicines";
import { type NewMedicine, type MedicationSchedule } from "@/types/medicines";
import { DatePicker } from "@/components/inputs/DatePicker";
import { SelectableList } from "@/components/inputs/SelectableList";
import type { SelectableListOption } from "@/components/inputs/SelectableList/types";
import { TimePicker } from "@/components/inputs/TimePicker";
import { TimesEditor } from "@/components/inputs/TimesEditor";
import { DaysOfWeekPicker } from "@/components/inputs/DaysOfWeekPicker";
import { NumberInput } from "@/components/inputs/NumberInput";
import { Text } from "@/components/typography/Text";
import { MedicineScheduleService } from "@/services/medicines/MedicineScheduleService";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { TextArea } from "@/components/inputs/TextArea";
import { Spacings } from "@/constants/styling/spacings";

const NewMedicineScreen: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    // Add medicine to backend
    const medicineData = data as unknown as NewMedicine;
    await APIService.medicines.add(medicineData);

    // Schedule local push notifications for the medicine
    // Only schedule notifications for emulated devices as per requirements
    if (FEATURE_FLAGS.SCHEDULE_LOCAL_PUSH_NOTIFICATIONS) {
      await NotificationSchedulingService.scheduleMedicineNotifications(
        medicineData,
      );
      console.log("✅ Medication notifications scheduled successfully");
    }

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
      Object.values(MedicineScheduleTypes).map((value) => ({
        title: LanguageService.translate(MEDICINE_SCHEDULE_TYPE_LABELS[value]),
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
        key: "scheduleType",
        title: LanguageService.translate(
          "⏰ How should we schedule reminders?",
        ),
        getValidationSchema: getNewMedicineScheduleSchema,
        node: ({ data, setValue, onScreenSubmit }) => {
          const schedule: MedicationSchedule =
            (data.schedule as any) ??
            MedicineScheduleService.getDefaultSchedule();

          const setType = (type: MedicineScheduleTypes) => {
            const updatedSchedule = MedicineScheduleService.getScheduleForType(
              schedule,
              type,
            );
            setValue("schedule", updatedSchedule);
            onScreenSubmit();
          };

          return (
            <View style={styles.screen}>
              <SelectableList
                options={scheduleTypeOptions}
                selectedId={schedule.type}
                onSelect={(id) => setType(id as MedicineScheduleTypes)}
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
            (data.schedule as any) ??
            MedicineScheduleService.getDefaultSchedule();

          const setSchedule = (key: keyof MedicationSchedule, value: any) => {
            const next = { ...schedule, [key]: value } as MedicationSchedule;
            setValue("schedule", next);
          };

          return (
            <View style={styles.screen}>
              {schedule.type === MedicineScheduleTypes.EVERY_DAY && (
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
                    max={6}
                    label={LanguageService.translate("Times per day")}
                    onBlur={() => setTouched("schedule.notificationTimes")}
                    error={errors["schedule.notificationTimes"]}
                  />
                  <TimesEditor
                    values={schedule.notificationTimes}
                    onChange={(vals: string[]) =>
                      setSchedule("notificationTimes", vals)
                    }
                    min={1}
                    max={6}
                    label={LanguageService.translate("Notification times")}
                    style={styles.timeEditor}
                  />
                </>
              )}

              {schedule.type === MedicineScheduleTypes.EVERY_OTHER_DAY && (
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
                    error={errors["schedule.nextDoseDate"]}
                    onBlur={() => setTouched("schedule.nextDoseDate")}
                  />
                  <TimePicker
                    value={schedule.notificationTimes[0] || null}
                    onChange={(t: string | null) =>
                      setSchedule("notificationTimes", t ? [t] : [])
                    }
                    placeholder={LanguageService.translate("Reminder time")}
                    allowClear={false}
                    error={errors["schedule.notificationTimes"]}
                    onBlur={() => setTouched("schedule.notificationTimes")}
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type === MedicineScheduleTypes.EVERY_X_DAYS && (
                <>
                  <NumberInput
                    value={schedule.everyXDays || 1}
                    onChange={(x: number) => setSchedule("everyXDays", x)}
                    min={1}
                    max={365}
                    label={LanguageService.translate("Every X days (1-365)")}
                    onBlur={() => setTouched("schedule.everyXDays")}
                    error={errors["schedule.everyXDays"]}
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
                    error={errors["schedule.nextDoseDate"]}
                    onBlur={() => setTouched("schedule.nextDoseDate")}
                  />
                  <TimePicker
                    value={schedule.notificationTimes[0] || null}
                    onChange={(t: string | null) =>
                      setSchedule("notificationTimes", t ? [t] : [])
                    }
                    placeholder={LanguageService.translate("Reminder time")}
                    allowClear={false}
                    error={errors["schedule.notificationTimes"]}
                    onBlur={() => setTouched("schedule.notificationTimes")}
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type === MedicineScheduleTypes.SPECIFIC_WEEK_DAYS && (
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
                    error={errors["schedule.notificationTimes"]}
                    onBlur={() => setTouched("schedule.notificationTimes")}
                    label={LanguageService.translate("Reminder time")}
                  />
                </>
              )}

              {schedule.type === MedicineScheduleTypes.ONLY_AS_NEEDED && null}
            </View>
          );
        },
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
              value={data.schedule?.dose}
              onChangeText={(text) => setValue("schedule.dose", text)}
              onBlur={() => setTouched("schedule.dose")}
              error={errors["schedule.dose"]}
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
        key: "endDate",
        title: LanguageService.translate("📅 When do you plan to finish?"),
        getValidationSchema: getNewMedicineEndDateSchema,
        node: ({ data, setValue, onScreenSubmit, errors, setTouched }) => (
          <>
            <View style={styles.screen}>
              <DatePicker
                placeholder={LanguageService.translate("End date")}
                value={data.schedule?.endDate as Date | null}
                onChange={(val: Date | null) => {
                  setValue("schedule.endDate", val);
                }}
                minDate={new Date()}
                allowSkip
                onSkipClick={() => {
                  setValue("schedule.endDate", null);
                  onScreenSubmit({
                    ...data,
                    schedule: {
                      ...data.schedule,
                      endDate: null,
                    },
                  });
                }}
                error={errors["schedule.endDate"]}
                onBlur={() => setTouched("schedule.endDate")}
              />
            </View>
          </>
        ),
      },
      {
        key: "notes",
        title: LanguageService.translate("🗒️ Do you want to add notes?"),
        getValidationSchema: getNewMedicineNotesSchema,
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
  timeEditor: {
    flex: 1,
    marginTop: Spacings.SMALL,
  },
});

export default NewMedicineScreen;
