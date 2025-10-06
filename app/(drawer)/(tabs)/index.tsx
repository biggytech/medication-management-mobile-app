import React, { useCallback, useState } from "react";
import { RemoteNotificationsDebugger } from "@/components/common/notifications/RemoteNotificationsDebugger";
import { Screen } from "@/components/common/markup/Screen";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
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

const HomeScreen: React.FC = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const { data: medicines, isLoading } = useQueryWithFocus<MedicineFromApi[]>({
    queryKey: ["medicines-by-date", activeDate],
    queryFn: () => APIService.medicines.listByDate(activeDate),
  });

  const handleMedicinePress = useCallback((id: MedicineFromApi["id"]) => {
    // TODO:
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MedicineFromApi }) => (
      <MedicineListItem
        medicine={item}
        onPress={handleMedicinePress}
        shortDoseDate
      />
    ),
    [handleMedicinePress],
  );

  if (isLoading) {
    return <BlockingLoader />;
  }

  return (
    medicines && (
      <Screen>
        <Last7Days activeDate={activeDate} onActiveDateChange={setActiveDate} />
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[paddingStyles.small]}
          ListHeaderComponent={
            FEATURE_FLAGS.SHOW_REMOTE_NOTIFICATIONS_DEBUGGER ? (
              <RemoteNotificationsDebugger />
            ) : null
          }
          ListEmptyComponent={
            <View style={positioningStyles.centered}>
              <Text>{LanguageService.translate("No records")}</Text>
            </View>
          }
        />
      </Screen>
    )
  );
};

export default HomeScreen;
