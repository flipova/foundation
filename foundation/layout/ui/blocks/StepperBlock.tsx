/**
 * StepperBlock — Multi-step progress indicator with labels and active state.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("StepperBlock")!;

export interface Step { label: string; description?: string; }

export interface StepperBlockProps {
  steps?: Step[]; currentStep?: number; orientation?: "horizontal" | "vertical";
  accentColor?: string; completedColor?: string; background?: string;
  showLabels?: boolean; showDescriptions?: boolean; size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 24, md: 32, lg: 40 };

const StepperBlock: React.FC<StepperBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<StepperBlockProps>;
  const { steps = [], currentStep, orientation, accentColor, completedColor, showLabels, showDescriptions, size } = props;
  const accent = accentColor || theme.primary;
  const completed = completedColor || theme.primary;
  const nodeSize = SIZE_MAP[size] ?? 32;
  const isH = orientation !== "vertical";

  return (
    <View style={[s.root, isH ? s.rootH : s.rootV]}>
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        const nodeBg = isDone ? completed : isActive ? accent : theme.muted;
        const textColor = isDone || isActive ? "#fff" : theme.mutedForeground;
        return (
          <View key={i} style={[s.stepWrap, isH ? s.stepWrapH : s.stepWrapV]}>
            {i > 0 && (
              <View style={[isH ? s.lineH : s.lineV, { backgroundColor: i <= currentStep ? completed : theme.border }]} />
            )}
            <View style={[s.node, { width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2, backgroundColor: nodeBg }]}>
              {isDone
                ? <Feather name="check" size={nodeSize * 0.45} color="#fff" />
                : <Text style={[s.nodeText, { color: textColor, fontSize: nodeSize * 0.38 }]}>{i + 1}</Text>
              }
            </View>
            {showLabels && (
              <View style={s.labelWrap}>
                <Text style={[s.label, { color: isActive ? accent : theme.foreground }]}>{step.label}</Text>
                {showDescriptions && step.description ? <Text style={[s.desc, { color: theme.mutedForeground }]}>{step.description}</Text> : null}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default StepperBlock;

const s = StyleSheet.create({
  root: {},
  rootH: { flexDirection: "row", alignItems: "flex-start" },
  rootV: { flexDirection: "column" },
  stepWrap: { alignItems: "center" },
  stepWrapH: { flex: 1, flexDirection: "column", alignItems: "center" },
  stepWrapV: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  lineH: { position: "absolute", top: 16, left: "-50%", right: "50%", height: 2, zIndex: 0 },
  lineV: { position: "absolute", top: 0, left: 15, width: 2, height: "100%", zIndex: 0 },
  node: { alignItems: "center", justifyContent: "center", zIndex: 1 },
  nodeText: { fontWeight: "700" },
  labelWrap: { marginTop: 6, alignItems: "center" },
  label: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  desc: { fontSize: 10, textAlign: "center", marginTop: 2 },
});
