import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Screen } from "@/components/Screen";
import { APIService } from "@/services/APIService";
import type { Medicine } from "@/types/medicines";
import { Text } from "@/components/typography/Text";

const Medicines: React.FC = () => {
  // open single medicine
  // router.push({
  //   pathname: AppScreens.MEDICINES_SINGLE,
  //   params: { medicine: "adsfkjd" },
  // });

  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    APIService.medicines.list().then(setMedicines);
  }, []);

  const handlePress = () => {
    router.push(AppScreens.MEDICINES_NEW);
  };

  // TODO: stylize items
  const renderItem = ({ item }: { item: Medicine }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <Screen>
      <Button
        color={AppColors.POSITIVE}
        style={styles.floatingButton}
        onPress={handlePress}
        text={<Ionicons size={FontSizes.HUGE} name="add" />}
        rounded
        elevated
      />

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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
  },
  title: {
    color: AppColors.WHITE,
  },
});

export default Medicines;
