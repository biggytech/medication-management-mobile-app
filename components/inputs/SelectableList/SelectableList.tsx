import React, { useCallback } from "react";

import type {
  SelectableListOption,
  SelectableListProps,
} from "@/components/inputs/SelectableList/types";
import {
  FlatList,
  View,
  type ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/typography/Text";
import { styles } from "@/components/inputs/SelectableList/styles";

const SelectableList: React.FC<SelectableListProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  const renderItem = useCallback(
    ({ item: { id, title } }: ListRenderItemInfo<SelectableListOption>) => {
      const isActive = id === selectedId;

      return (
        <TouchableOpacity
          style={[styles.item, isActive ? styles.activeItem : {}]}
          onPress={() => onSelect(id)}
        >
          <Text style={styles.itemText}>{title}</Text>
        </TouchableOpacity>
      );
    },
    [onSelect, selectedId],
  );

  const keyExtractor = useCallback(({ id }: SelectableListOption) => id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default React.memo(SelectableList);
