import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/common/Screen";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/Button";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppScreens } from "@/constants/navigation";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import { useQuery } from "@tanstack/react-query";
import { formatScheduleInfo } from "@/utils/formatters/medicine/formatScheduleInfo";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/ui/getMedicineDoseText";
import { LinearGradient } from "expo-linear-gradient";
import { fontSizesStyles } from "@/assets/styles/fonts";
import { Heading } from "@/components/common/typography/Heading";
import { Round } from "@/components/common/Round";
import type { DetailsCardItem } from "@/components/common/DetailsCard/types";
import { DetailsCard } from "@/components/common/DetailsCard";

const MedicineScreen: React.FC = () => {
  const { medicineId } = useLocalSearchParams<{
    medicineId: string;
  }>();

  const { data: medicine = null, isLoading: loading } = useQuery({
    queryKey: ["medicine", medicineId],
    queryFn: () => APIService.medicines.get(parseInt(medicineId, 10)),
  });

  const handleEdit = () => {
    router.push({
      pathname: AppScreens.MEDICINES_EDIT,
      params: { medicineId },
    });
  };

  const detailsItems: DetailsCardItem[] = useMemo(() => {
    if (!medicine) return [] as DetailsCardItem[];

    const items = [
      {
        key: "form",
        iconName: "medical",
        label: LanguageService.translate("Form"),
        value: LanguageService.translate(medicine.form),
      },
      {
        key: "schedule",
        iconName: "time",
        label: LanguageService.translate("Schedule"),
        value: formatScheduleInfo(medicine.schedule),
      },
      {
        key: "dose",
        iconName: "fitness",
        label: LanguageService.translate("Dose"),
        value: `${medicine.schedule.dose} ${getMedicineDoseText(medicine)}`,
      },
    ];

    if (medicine.schedule.endDate) {
      items.push({
        key: "endDate",
        iconName: "calendar",
        label: LanguageService.translate("End Date"),
        value: ddmmyyyyFromDate(new Date(medicine.schedule.endDate)),
      });
    }

    if (medicine.notes) {
      items.push({
        key: "notes",
        iconName: "document-text",
        label: LanguageService.translate("Notes"),
        value: medicine.notes,
      });
    }

    return items;
  }, [medicine]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text>{LanguageService.translate("Loading...")}</Text>
        </View>
      </Screen>
    );
  }

  if (!medicine) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text>{LanguageService.translate("Medicine not found")}</Text>
        </View>
      </Screen>
    );
  }

  return (
    medicine && (
      <Screen>
        {/*TODO: add back button here or to header of the navigation*/}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <LinearGradient
            colors={[AppColors.PRIMARY, AppColors.SECONDARY]}
            style={styles.header}
          >
            <Round>
              <Text style={[fontSizesStyles.huge]}>
                {getMedicineEmoji(medicine)}
              </Text>
            </Round>
            <Heading style={styles.title}>{medicine.title}</Heading>
          </LinearGradient>

          <DetailsCard items={detailsItems} />

          <View style={styles.actionsContainer}>
            <Button
              color={AppColors.PRIMARY}
              onPress={handleEdit}
              text={LanguageService.translate("Edit")}
              style={styles.editButton}
            />
          </View>
        </ScrollView>
      </Screen>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: Spacings.BIG,
    alignItems: "center",
  },
  title: {
    color: AppColors.WHITE,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  subtitle: {
    color: AppColors.GREY,
    fontSize: FontSizes.STANDART,
  },
  actionsContainer: {
    marginTop: Spacings.BIG,
  },
  editButton: {
    width: "100%",
  },
});

export default MedicineScreen;
