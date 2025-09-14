import React from "react";
import { Text } from "@/components/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, View, StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

const Medicines: React.FC = () => {
  // Action when the floating button is pressed
  const handlePress = () => {
    alert("Floating Button Pressed!");
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    // padding: 20,
    // justifyContent: "center",
    // alignItems: "center",
  },
  // title: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "white",
  // },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    // elevation: 5, // For Android shadow
    // shadowColor: "#000", // For iOS shadow
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
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
