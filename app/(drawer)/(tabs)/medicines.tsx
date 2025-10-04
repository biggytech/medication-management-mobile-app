import React, { useCallback, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "@/components/common/buttons/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Screen } from "@/components/common/markup/Screen";
import { APIService } from "@/services/APIService";
import type { MedicineFromApi } from "@/types/medicines";
import { Text } from "@/components/common/typography/Text";
import { LocalNotificationsDebugger } from "@/components/common/notifications/LocalNotificationsDebugger";
import { FEATURE_FLAGS } from "@/constants/featureFlags";

const MedicinesScreen: React.FC = () => {
  // TODO: use query library
  const [medicines, setMedicines] = useState<MedicineFromApi[]>([]);

  console.log("list", medicines);

  useEffect(() => {
    APIService.medicines.list().then(setMedicines);
  }, []);

  const handleAddNewMedicinePress = () => {
    router.push(AppScreens.MEDICINES_NEW);
  };

  const handleMedicinePress = useCallback(({ id }: MedicineFromApi) => {
    router.push({
      pathname: AppScreens.MEDICINES_SINGLE,
      params: { medicineId: id },
    });
  }, []);

  // TODO: stylize items
  const renderItem = ({ item }: { item: MedicineFromApi }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleMedicinePress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color={AppColors.WHITE} />
    </TouchableOpacity>
  );

  return (
    <Screen>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          FEATURE_FLAGS.SHOW_LOCAL_NOTIFICATIONS_DEBUGGER ? (
            <LocalNotificationsDebugger />
          ) : null
        }
      />

      <Button
        color={AppColors.POSITIVE}
        style={styles.floatingButton}
        onPress={handleAddNewMedicinePress}
        text={<Ionicons size={FontSizes.HUGE} name="add" />}
        rounded
        elevated
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  list: {
    padding: 10,
  },
  item: {
    backgroundColor: AppColors.SECONDARY,
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: AppColors.WHITE,
  },
});

export default MedicinesScreen;
