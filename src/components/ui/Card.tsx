import { StyleSheet, View, type ViewProps } from "react-native";
import { type Palette, radius, space, useThemedStyles } from "../../theme";

export function Card({ style, ...rest }: ViewProps) {
  const styles = useThemedStyles(createStyles);

  return <View style={[styles.card, style]} {...rest} />;
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: space.lg,
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  });
