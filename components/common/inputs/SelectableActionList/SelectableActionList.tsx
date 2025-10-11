import React, { useCallback, useImperativeHandle, useRef } from "react";
import type {
  SelectableActionListOption,
  SelectableActionListProps,
} from "@/components/common/inputs/SelectableActionList/types";

import ActionSheet, {
  type ActionSheetRef,
  FlatList,
} from "react-native-actions-sheet";
import { type ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";
import { ReactMemoWithGeneric } from "@/utils/types/ReactMemoWithGeneric";

const SelectableActionList = <OptionId extends string = string>({
  title,
  ref,
  options,
  onSelect,
}: SelectableActionListProps<OptionId>) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useImperativeHandle(ref, () => {
    return {
      show() {
        actionSheetRef.current?.show();
      },
    };
  }, []);

  const handleSelect = useCallback(
    (id: OptionId) => {
      onSelect(id);
      actionSheetRef.current?.hide();
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({
      item: { id, title },
    }: ListRenderItemInfo<SelectableActionListOption<OptionId>>) => {
      return (
        <TouchableOpacity style={styles.item} onPress={() => handleSelect(id)}>
          <Text style={styles.itemText}>{title}</Text>
        </TouchableOpacity>
      );
    },
    [handleSelect],
  );

  const keyExtractor = useCallback(
    ({ id }: SelectableActionListOption) => id,
    [],
  );

  return (
    <ActionSheet ref={actionSheetRef}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.list}
      />
    </ActionSheet>
  );
};

export default ReactMemoWithGeneric(SelectableActionList);
