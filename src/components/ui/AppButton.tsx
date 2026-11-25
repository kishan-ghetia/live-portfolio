import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { type Palette, radius, space, useAppTheme, useThemedStyles } from "../../theme";
import { AppText } from "./AppText";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "buy" | "sell";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: AppButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const blocked = disabled || loading;
  const contentColor = {
    primary: colors.onPrimary,
    secondary: colors.text,
    buy: colors.onAccent,
    sell: colors.onAccent,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : (
        <AppText weight="semibold" style={{ color: contentColor }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    base: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: space.sm,
      paddingHorizontal: space.lg,
      borderRadius: radius.sm,
      minHeight: 36,
    },
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.chip },
    buy: { backgroundColor: colors.gain },
    sell: { backgroundColor: colors.loss },
    pressed: { opacity: 0.7 },
    disabled: { opacity: 0.4 },
  });
