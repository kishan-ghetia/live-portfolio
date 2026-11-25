import { StyleSheet, Text, type TextProps } from "react-native";
import { font, type Palette, useThemedStyles } from "../../theme";

type Variant = "display" | "heading" | "title" | "body" | "caption" | "label";
type Tone = "default" | "muted" | "gain" | "loss" | "warning" | "onPrimary";

interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  weight?: "regular" | "semibold";
  tabular?: boolean;
}

export function AppText({
  variant = "body",
  tone = "default",
  weight = "regular",
  tabular = false,
  style,
  ...rest
}: AppTextProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        styles[tone],
        weight === "semibold" && styles.semibold,
        tabular && styles.tabular,
        style,
      ]}
      {...rest}
    />
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    base: { includeFontPadding: false },
    display: { fontSize: font.xxl, lineHeight: 34, fontWeight: "700" },
    heading: { fontSize: font.xl, lineHeight: 26, fontWeight: "600" },
    title: { fontSize: font.lg, lineHeight: 22, fontWeight: "600" },
    body: { fontSize: font.md, lineHeight: 20 },
    caption: { fontSize: font.sm, lineHeight: 16 },
    label: { fontSize: font.xs, lineHeight: 14 },
    default: { color: colors.text },
    muted: { color: colors.textMuted },
    gain: { color: colors.gain },
    loss: { color: colors.loss },
    warning: { color: colors.warning },
    onPrimary: { color: colors.onPrimary },
    semibold: { fontWeight: "600" },
    tabular: { fontVariant: ["tabular-nums"] },
  });
