import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";

interface AvatarProps {
  name: string;
  photoUrl?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  photoUrl,
  size = 50,
}) => {
  const initials = name.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    backgroundColor: AppColors.LIGHT_GRAY,
  },
  initials: {
    fontWeight: "bold",
    color: AppColors.WHITE,
  },
});
