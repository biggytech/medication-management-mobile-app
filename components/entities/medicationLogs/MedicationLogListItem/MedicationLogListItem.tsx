import React from "react";
import { View } from "react-native";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import type { MedicationLogListItemProps } from "@/components/entities/medicationLogs/MedicationLogListItem/types";
import { LanguageService } from "@/services/language/LanguageService";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { MedicationLogTypes } from "@/types/medicationLogs";

const MedicationLogListItem: React.FC<MedicationLogListItemProps> = ({
  medicationLog,
}) => {
  const { medicine } = medicationLog;

  const isTaken = medicationLog.type === MedicationLogTypes.TAKEN;

  return (
    <View style={[styles.item, isTaken ? styles.taken : {}]}>
      <View style={styles.left}>
        <Round shadow small approved={isTaken}>
          <Text>{getMedicineEmoji(medicine)}</Text>
        </Round>
      </View>
      <View>
        <Text style={styles.title}>{medicine.title}</Text>
        {isTaken && (
          <Text style={[styles.subTitle, styles.takenText]}>
            {LanguageService.translate("Taken")}:{" "}
            {hhmmFromDate(new Date(medicationLog.date))}
          </Text>
        )}
      </View>
    </View>
  );
};

export default React.memo(MedicationLogListItem);
