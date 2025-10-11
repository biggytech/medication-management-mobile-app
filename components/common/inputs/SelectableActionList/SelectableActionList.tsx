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
import type { SelectableListOption } from "@/components/common/inputs/SelectableList/types";

const SelectableActionList: React.FC<SelectableActionListProps> = ({
  title,
  ref,
  options,
  onSelect,
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useImperativeHandle(ref, () => {
    return {
      show() {
        actionSheetRef.current?.show();
      },
    };
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      actionSheetRef.current?.hide();
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item: { id, title } }: ListRenderItemInfo<SelectableListOption>) => {
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

export default React.memo(SelectableActionList);
