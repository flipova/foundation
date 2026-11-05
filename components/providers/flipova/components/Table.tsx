import React from 'react';
import { Text, View } from 'react-native';
import { tableRecipe, type TableProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

const cell = (node: React.ReactNode, style: object) =>
  typeof node === 'string' || typeof node === 'number' ? <Text style={style as never}>{node}</Text> : node;

export function Table({ columns, rows, caption, testID }: TableProps) {
  const t = useResolvedTheme();
  const r = tableRecipe(t);
  return (
    <View testID={testID} accessibilityRole={'table' as never} style={r.container as never}>
      {caption ? <Text style={r.caption as never}>{caption}</Text> : null}
      <View style={r.headRow as never}>
        {columns.map((c) => (
          <View key={c.key} style={r.head(c.align) as never}>
            <Text style={r.headLabel as never}>{c.label}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={r.row(i === rows.length - 1) as never}>
          {columns.map((c) => (
            <View key={c.key} style={r.cell(c.align) as never}>
              {cell(row[c.key], r.cellLabel)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
