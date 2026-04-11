/**
 * TagInputBlock — Input field that creates removable tags/chips on Enter.
 */
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("TagInputBlock")!;

export interface TagInputBlockProps {
  tags?: string[]; placeholder?: string; label?: string; maxTags?: number;
  background?: string; tagColor?: string; borderRadius?: string;
  onChange?: (tags: string[]) => void;
}

const TagInputBlock: React.FC<TagInputBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<TagInputBlockProps>;
  const { tags: externalTags, placeholder, label, maxTags, background, tagColor, onChange } = props;
  const [inputValue, setInputValue] = useState("");
  const [internalTags, setInternalTags] = useState<string[]>(externalTags || []);
  const tags = externalTags ?? internalTags;
  const accent = tagColor || theme.primary;

  const addTag = () => {
    const val = inputValue.trim();
    if (!val || tags.includes(val) || tags.length >= maxTags) return;
    const next = [...tags, val];
    setInternalTags(next);
    onChange?.(next);
    setInputValue("");
  };

  const removeTag = (i: number) => {
    const next = tags.filter((_, idx) => idx !== i);
    setInternalTags(next);
    onChange?.(next);
  };

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={[s.container, { backgroundColor: background || theme.input, borderColor: theme.border }]}>
        <View style={s.tags}>
          {tags.map((tag, i) => (
            <View key={i} style={[s.tag, { backgroundColor: accent + "20", borderColor: accent + "40" }]}>
              <Text style={[s.tagText, { color: accent }]}>{tag}</Text>
              <Pressable onPress={() => removeTag(i)} style={s.tagRemove}>
                <Feather name="x" size={10} color={accent} />
              </Pressable>
            </View>
          ))}
          <TextInput
            style={[s.input, { color: theme.foreground, minWidth: 80 }]}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addTag}
            placeholder={tags.length === 0 ? placeholder : ""}
            placeholderTextColor={theme.mutedForeground}
            blurOnSubmit={false}
          />
        </View>
      </View>
      {maxTags && <Text style={[s.count, { color: theme.mutedForeground }]}>{tags.length}/{maxTags}</Text>}
    </View>
  );
};

export default TagInputBlock;

const s = StyleSheet.create({
  root: { gap: 6 },
  label: { fontSize: 12, fontWeight: "500" },
  container: { borderWidth: 1, borderRadius: 10, padding: 8, minHeight: 44 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: "500" },
  tagRemove: { padding: 1 },
  input: { fontSize: 13, flex: 1, paddingVertical: 2 },
  count: { fontSize: 10, textAlign: "right" },
});
