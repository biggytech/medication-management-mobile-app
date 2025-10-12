import React from "react";
import { View } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/common/inputs/Input";
import {
  getNewMedicineDoseSchema,
  getNewMedicineEndDateSchema,
  getNewMedicineFormSchema,
  getNewMedicineNotesSchema,
  getNewMedicineScheduleSchema,
  getNewMedicineTitleSchema,
} from "@/validation/medicine";
import { SelectableList } from "@/components/common/inputs/SelectableList";
import { DatePicker } from "@/components/common/inputs/DatePicker";
import { TimePicker } from "@/components/common/inputs/TimePicker";
import { TimesEditor } from "@/components/common/inputs/TimesEditor";
import { DaysOfWeekPicker } from "@/components/common/inputs/DaysOfWeekPicker";
import { NumberInput } from "@/components/common/inputs/NumberInput";
import { Text } from "@/components/common/typography/Text";
import { TextArea } from "@/components/common/inputs/TextArea";
import { ScheduleService } from "@/services/schedules/ScheduleService";
import { getFormOptions } from "./utils";
import { type MedicineData, type MedicineSchedule } from "@/types/medicines";
import { Gap } from "@/components/common/markup/Gap";
import type { WizardScreen } from "@/components/common/Wizard/types";
import { styles } from "@/components/entities/medicine/MedicineWizard/styles";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import {
  DEFAULT_SCHEDULE_NOTIFICATION_TIME,
  ScheduleTypes,
} from "@/constants/schedules";
import { getScheduleTypeOptions } from "@/utils/schedules/getScheduleTypeOptions";

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
    const scheduleTypeOptions = getScheduleTypeOptions();

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
          const schedule: MedicineSchedule =
            (data.schedule as any) ?? ScheduleService.getDefaultSchedule();

          const setType = (type: ScheduleTypes) => {
            const updatedSchedule = ScheduleService.getScheduleForType(
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
                onSelect={(id) => setType(id as ScheduleTypes)}
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
          const schedule: MedicineSchedule =
            (data.schedule as any) ?? ScheduleService.getDefaultSchedule();

          const setSchedule = (key: keyof MedicineSchedule, value: any) => {
            const next = { ...schedule, [key]: value } as MedicineSchedule;
            setValue("schedule", next);
          };

          return (
            <View style={styles.screen}>
              {schedule.type === ScheduleTypes.EVERY_DAY && (
                <>
                  <NumberInput
                    value={schedule.notificationTimes.length || 1}
                    onChange={(n: number) => {
                      const times = schedule.notificationTimes.slice(0, n);
                      while (times.length < n)
                        times.push(DEFAULT_SCHEDULE_NOTIFICATION_TIME);
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

              {schedule.type === ScheduleTypes.EVERY_OTHER_DAY && (
                <>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      📅 {LanguageService.translate("Next dose date")}
                    </Text>
                  </View>
                  <DatePicker
                    placeholder={LanguageService.translate("Next dose date")}
                    value={schedule.nextTakeDate}
                    onChange={(d) => setSchedule("nextTakeDate", d)}
                    minDate={new Date()}
                    allowSkip={false}
                    error={errors["schedule.nextTakeDate"]}
                    onBlur={() => setTouched("schedule.nextTakeDate")}
                  />
                  <Gap />
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

              {schedule.type === ScheduleTypes.EVERY_X_DAYS && (
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
                    value={schedule.nextTakeDate}
                    onChange={(d) => setSchedule("nextTakeDate", d)}
                    minDate={new Date()}
                    allowSkip={false}
                    error={errors["schedule.nextTakeDate"]}
                    onBlur={() => setTouched("schedule.nextTakeDate")}
                  />
                  <Gap />
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

              {schedule.type === ScheduleTypes.SPECIFIC_WEEK_DAYS && (
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
                  <Gap />
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

              {schedule.type === ScheduleTypes.ONLY_AS_NEEDED && (
                <Text>{LanguageService.translate("No schedule details")}</Text>
              )}
            </View>
          );
        },
      },
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
  }
}
