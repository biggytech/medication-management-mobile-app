import React from "react";
import { Text } from "@/components/typography/Text";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";

const Medicine: React.FC = () => {
  const { medicine } = useLocalSearchParams();

  return (
    <Screen>
      <Text>Single Medicine: {medicine}</Text>
    </Screen>
  );
};

export default Medicine;
