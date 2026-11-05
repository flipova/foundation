import React from 'react';
import { SectionList as RNSectionList, Text } from 'react-native';
import { headingRecipe, type SectionListProps } from '../../contract';
import { useResolvedTheme } from '../provider';

export function SectionList(p: SectionListProps) {
  const t = useResolvedTheme();
  const head = headingRecipe({ level: 4 }, t);
  return (
    <RNSectionList
      testID={p.testID}
      sections={p.sections}
      keyExtractor={p.keyExtractor ?? ((_, i) => String(i))}
      renderItem={({ item, index }) => <>{p.renderItem(item, index)}</>}
      renderSectionHeader={({ section }) => (
        <Text accessibilityRole="header" style={head as never}>
          {section.title}
        </Text>
      )}
    />
  );
}
