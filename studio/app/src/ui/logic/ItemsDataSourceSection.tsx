/**
 * ItemsDataSourceSection — Configure a data source on an items-mode layout node.
 * Replaces the generic RepeatSection for layouts that use an array slot (mode: 'items').
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TreeNode } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import { C } from './constants';

interface Props {
  node: TreeNode;
  onChange: (repeat: TreeNode['repeatBinding']) => void;
}

const ItemsDataSourceSection: React.FC<Props> = ({ node, onChange }) => {
  const repeat = node.repeatBinding;

  return (
    <View style={s.root}>
      <SmartInput
        label="Data source (must be a list)"
        value={repeat?.source || ''}
        onChange={v => onChange(v ? { source: v, keyProp: repeat?.keyProp || 'id' } : undefined)}
        propType="string"
        isExpression
        placeholder="$state.products"
      />

      {repeat && (
        <>
          <SmartInput
            label="Key field"
            value={repeat.keyProp}
            onChange={v => onChange({ ...repeat, keyProp: v })}
            propType="string"
            placeholder="id"
          />
          <Pressable onPress={() => onChange(undefined)} style={s.removeBtn}>
            <Feather name="x" size={10} color={C.muted} />
            <Text style={s.removeBtnText}>Remove data source</Text>
          </Pressable>
        </>
      )}

      {!repeat && (
        <Text style={s.hint}>
          Connect a list variable to render one item per record. Use $state.alias pointing to an array.
        </Text>
      )}
    </View>
  );
};

export default ItemsDataSourceSection;

const s = StyleSheet.create({
  root: { gap: 8 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  removeBtnText: { color: C.muted, fontSize: 9 },
  hint: { color: C.muted, fontSize: 9, fontStyle: 'italic', lineHeight: 13 },
});
