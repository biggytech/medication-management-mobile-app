import React, { useCallback, useMemo, useState } from "react";
import { Screen } from "@/components/common/markup/Screen";
import { FlatList, View } from "react-native";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import type { MedicineFromApi } from "@/types/medicines";
import { APIService } from "@/services/APIService";
import { MedicineListItem } from "@/components/entities/medicine/MedicineListItem";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { paddingStyles } from "@/assets/styles/spacings";
import { Last7Days } from "@/components/common/Last7Days";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { positioningStyles } from "@/assets/styles/positioning";
import { DoseTrackingModal } from "@/components/entities/medicine/DoseTrackingModal";
import { isDueOrOverdueToday } from "@/utils/entities/medicine/isDueOrOverdueToday";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import type { MedicationLogFromApi } from "@/types/medicationLogs";
import { MedicationLogListItem } from "@/components/entities/medicationLogs/MedicationLogListItem";
import { isMedicine } from "@/utils/entities/medicine/isMedicine";
import { isMedicationLog } from "@/utils/entities/medicationLogs/isMedicationLog";

const HomeScreen: React.FC = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [activeMedicine, setActiveMedicine] = useState<MedicineFromApi | null>(
    null,
  );

  const { data: medicines, isFetching: isMedicinesFetching } =
    useQueryWithFocus<MedicineFromApi[]>({
      queryKey: [QUERY_KEYS.MEDICINES.BY_DATE, activeDate],
      queryFn: () => APIService.medicines.listByDate(activeDate),
    });

  const { data: medicationLogs, isFetching: isMedicationLogsFetching } =
    useQueryWithFocus<MedicationLogFromApi[]>({
      queryKey: [QUERY_KEYS.MEDICATION_LOGS.BY_DATE, activeDate],
      queryFn: () => APIService.medicationLogs.listByDate(activeDate),
    });

  const renderItem = useCallback(
    ({ item }: { item: MedicineFromApi | MedicationLogFromApi }) => {
      if (isMedicine(item)) {
        const isPressable = isDueOrOverdueToday(item);

        return (
          <MedicineListItem
            medicine={item}
            isPressable={isPressable}
            onPress={(pressedId) =>
              setActiveMedicine(
                medicines?.find(({ id }) => id === pressedId) ?? null,
              )
            }
            shortDoseDate
          />
        );
      } else if (isMedicationLog(item)) {
        return <MedicationLogListItem medicationLog={item} />;
      }

      return <View></View>;
    },
    [medicines],
  );

  const dataCombined: (MedicineFromApi | MedicationLogFromApi)[] = useMemo(
    () => [...(medicines ?? []), ...(medicationLogs ?? [])],
    [medicines, medicationLogs],
  );

  const keyExtractor = useCallback(
    (item: MedicineFromApi | MedicationLogFromApi) => {
      if (isMedicine(item)) {
        return `medicine-${item.id}`;
      } else {
        return `medication-log-${item.id}`;
      }
    },
    [],
  );

  const isFetching = isMedicinesFetching || isMedicationLogsFetching;

  return (
    <Screen>
      <Last7Days activeDate={activeDate} onActiveDateChange={setActiveDate} />
      {isFetching && <BlockingLoader />}
      {medicines && !isFetching && (
        <FlatList
          data={dataCombined}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[paddingStyles.small]}
          ListEmptyComponent={
            <View style={positioningStyles.centered}>
              <Text>{LanguageService.translate("No records")}</Text>
            </View>
          }
        />
      )}
      {activeMedicine && (
        <DoseTrackingModal
          medicine={activeMedicine}
          onClose={() => setActiveMedicine(null)}
        />
      )}
    </Screen>
  );
};

export default HomeScreen;
