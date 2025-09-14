import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Screen } from "@/components/Screen";

const Medicines: React.FC = () => {
  // open single medicine
  // router.push({
  //   pathname: AppScreens.MEDICINES_SINGLE,
  //   params: { medicine: "adsfkjd" },
  // });

  const handlePress = () => {
    router.push(AppScreens.MEDICINES_NEW);
  };

  // Sample data for the list
  // const data = Array.from({ length: 50 }, (_, index) => ({
  //   id: index.toString(),
  //   title: `Item ${index + 1}`,
  // }));

  // Render each item in the FlatList
  // const renderItem = ({ item }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{item.title}</Text>
  //   </View>
  // );

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

      {/* Scrollable List */}
      {/*<FlatList*/}
      {/*  data={data}*/}
      {/*  keyExtractor={(item) => item.id}*/}
      {/*  renderItem={renderItem}*/}
      {/*  contentContainerStyle={styles.list}*/}
      {/*/>*/}
    </Screen>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  // list: {
  //   padding: 10,
  // },
  // item: {
  //   // backgroundColor: colors.secondary, // Replace with your secondary color
  //   padding: 10,
  //   marginVertical: 8,
  //   borderRadius: 8,
  //   width: "100%",
  // },
});

export default Medicines;
