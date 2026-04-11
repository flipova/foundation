/**
 * AnimationSection — Configure node animation preset, trigger, easing, duration.
 */
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { AnimationConfig } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import { C, ANIM_PRESETS, ANIM_TRIGGERS, ANIM_EASINGS } from './constants';

interface Props {
  animation: AnimationConfig | undefined;
  nodeId: string;
  onChange: (anim: AnimationConfig | undefined) => void;
}

const DEFAULT_ANIM: AnimationConfig = {
  preset: 'fadeIn',
  trigger: 'onMount',
  duration: 300,
  delay: 0,
  easing: 'ease',
};

const AnimationSection: React.FC<Props> = ({ animation, onChange }) => {
  const preset = animation?.preset || 'none';

  const setPreset = (p: string) => {
    if (p === 'none') { onChange(undefined); return; }
    onChange({ ...(animation || DEFAULT_ANIM), preset: p as any });
  };

  const upd = (patch: Partial<AnimationConfig>) =>
    onChange({ ...(animation || DEFAULT_ANIM), ...patch });

  return (
    <View style={s.root}>
      {/* Preset grid */}
      <Text style={s.label}>Preset</Text>
      <View style={s.presetGrid}>
        {ANIM_PRESETS.map(p => (
          <Pressable key={p} style={[s.presetBtn, preset === p && s.presetBtnOn]} onPress={() => setPreset(p)}>
            <Text style={[s.presetText, preset === p && s.presetTextOn]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      {animation && (
        <>
          {/* Trigger */}
          <Text style={s.label}>Trigger</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
            {ANIM_TRIGGERS.map(t => (
              <Pressable key={t} style={[s.chip, animation.trigger === t && s.chipOn]} onPress={() => upd({ trigger: t })}>
                <Text style={[s.chipText, animation.trigger === t && s.chipTextOn]}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Easing */}
          <Text style={s.label}>Easing</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
            {ANIM_EASINGS.map(e => (
              <Pressable key={e} style={[s.chip, animation.easing === e && s.chipOn]} onPress={() => upd({ easing: e })}>
                <Text style={[s.chipText, animation.easing === e && s.chipTextOn]}>{e}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Duration + Delay */}
          <View style={s.durationRow}>
            <View style={{ flex: 1 }}>
              <SmartInput label="Duration (ms)" value={animation.duration} onChange={v => upd({ duration: Number(v) || 300 })} propType="number" />
            </View>
            <View style={{ flex: 1 }}>
              <SmartInput label="Delay (ms)" value={animation.delay} onChange={v => upd({ delay: Number(v) || 0 })} propType="number" />
            </View>
          </View>

          {/* State expression — only for onState trigger */}
          {animation.trigger === 'onState' && (
            <SmartInput
              label="State expression"
              value={animation.stateExpression || ''}
              onChange={v => upd({ stateExpression: v })}
              propType="string"
              isExpression
              placeholder="$state.isVisible"
            />
          )}
        </>
      )}

      {!animation && (
        <Text style={s.hint}>Select a preset to configure animation</Text>
      )}
    </View>
  );
};

export default AnimationSection;

const s = StyleSheet.create({
  root: { gap: 8 },
  label: { color: C.muted, fontSize: 9, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.5 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  presetBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  presetBtnOn: { backgroundColor: C.accent, borderColor: C.accent },
  presetText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  presetTextOn: { color: '#fff' },
  row: { gap: 3 },
  chip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  chipTextOn: { color: '#fff' },
  durationRow: { flexDirection: 'row', gap: 8 },
  hint: { color: C.muted, fontSize: 9, fontStyle: 'italic' },
});
