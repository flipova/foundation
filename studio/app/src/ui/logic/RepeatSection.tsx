/**
 * RepeatSection — Configure list mode on a node.
 * Source must be a $state.alias pointing to an array.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TreeNode } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import { C } from './constants';
import type { ItemField } from './useLogicContext';

interface Props {
  node: TreeNode;
  itemFields: ItemField[];
  onChange: (repeat: TreeNode['repeatBinding']) => void;
}

const RepeatSection: React.FC<Props> = ({ node, itemFields, onChange }) => {
  const repeat = node.repeatBinding;

  // Flatten nested fields for SmartInput
  const flatFields: ItemField[] = React.useMemo(() => {
    const result: ItemField[] = [];
    const flatten = (fields: ItemField[]) => {
      for (const f of fields) {
        result.push(f);
        if (f.children) flatten(f.children);
      }
    };
    flatten(itemFields);
    return result;
  }, [itemFields]);

  return (
    <View style={s.root}>
      <SmartInput
        label="Data source (must be a list)"
        value={repeat?.source || ''}
        onChange={v => onChange(v ? { source: v, keyProp: repeat?.keyProp || 'id' } : undefined)}
        propType="string"
        isExpression
        placeholder="$state.users"
      />

      {repeat && (
        <>
          <SmartInput
            label="Unique key field (used to identify each item)"
            value={repeat.keyProp}
            onChange={v => onChange({ ...repeat, keyProp: v })}
            propType="string"
            itemFields={flatFields.length > 0 ? flatFields : undefined}
            placeholder="id"
          />

          {flatFields.length > 0 ? (
            <View style={s.fieldsBox}>
              <View style={s.fieldsHeader}>
                <Feather name="check-circle" size={11} color={C.cyan} />
                <Text style={s.fieldsTitle}>Available item fields</Text>
              </View>
              <Text style={s.fieldsDesc}>
                Each child element can use these fields directly in "What it shows".
              </Text>
              <View style={s.fieldsList}>
                {itemFields.map(f => (
                  <View key={f.key}>
                    <View style={s.fieldChip}>
                      <Text style={s.fieldKey}>{f.key}</Text>
                      <Text style={s.fieldType}>{f.type}</Text>
                      <Text style={s.fieldPreview} numberOfLines={1}>{f.preview}</Text>
                    </View>
                    {f.children && f.children.length > 0 && (
                      <View style={s.subFields}>
                        {f.children.map(c => (
                          <View key={c.key} style={s.subFieldChip}>
                            <Feather name="corner-down-right" size={8} color={C.muted} />
                            <Text style={s.subFieldKey}>{c.key}</Text>
                            <Text style={s.fieldType}>{c.type}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={s.emptyFields}>
              <Feather name="loader" size={11} color={C.muted} />
              <Text style={s.emptyFieldsText}>
                Point to a $state variable that contains a list to see its fields here.
              </Text>
            </View>
          )}

          <Pressable style={s.removeBtn} onPress={() => onChange(undefined)}>
            <Feather name="x" size={10} color={C.muted} />
            <Text style={s.removeBtnText}>Remove list mode</Text>
          </Pressable>
        </>
      )}

      {!repeat && (
        <Text style={s.hint}>
          Point to a list variable (e.g. $state.users) to repeat this element for each item.
        </Text>
      )}
    </View>
  );
};

export default RepeatSection;

const s = StyleSheet.create({
  root: { gap: 8 },
  fieldsBox: { backgroundColor: 'rgba(34,211,238,0.04)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(34,211,238,0.2)', padding: 10, gap: 6 },
  fieldsHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fieldsTitle: { color: C.cyan, fontSize: 10, fontWeight: '700' },
  fieldsDesc: { color: C.muted, fontSize: 9, lineHeight: 13 },
  fieldsList: { gap: 4 },
  fieldChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34,211,238,0.08)', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4 },
  fieldKey: { color: C.cyan, fontSize: 9, fontWeight: '700', fontFamily: 'monospace' as any },
  fieldType: { color: C.muted, fontSize: 8, backgroundColor: C.bg, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  fieldPreview: { color: C.text, fontSize: 9, flex: 1 },
  subFields: { paddingLeft: 16, gap: 2, marginTop: 2 },
  subFieldChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2 },
  subFieldKey: { color: '#67e8f9', fontSize: 8, fontFamily: 'monospace' as any },
  emptyFields: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 6 },
  emptyFieldsText: { color: C.muted, fontSize: 9, fontStyle: 'italic', flex: 1, lineHeight: 13 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  removeBtnText: { color: C.muted, fontSize: 9 },
  hint: { color: C.muted, fontSize: 9, fontStyle: 'italic', lineHeight: 13 },
});
