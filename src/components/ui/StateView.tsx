import { ActivityIndicator, StyleSheet, View } from "react-native";
import { space, useAppTheme } from "../../theme";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

interface StateViewProps {
  variant: "loading" | "error" | "empty";
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateView({ variant, message, actionLabel, onAction }: StateViewProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {variant === "loading" && <ActivityIndicator color={colors.textMuted} />}
      <AppText tone={variant === "error" ? "loss" : "muted"} style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <AppButton label={actionLabel} variant="secondary" onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
    padding: space.xl,
  },
  message: { textAlign: "center" },
});
