import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from "react-native";
import { font, type Palette, radius, space, useAppTheme, useThemedStyles } from "../../theme";
import { AppText } from "./AppText";

interface AppTextInputProps extends TextInputProps {
  onClear?: () => void;
}

export function AppTextInput({ style, onClear, ...rest }: AppTextInputProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, onClear && styles.inputWithClear, style]}
        {...rest}
      />
      {onClear && (
        <Pressable
          onPress={onClear}
          hitSlop={space.sm}
          accessibilityRole="button"
          accessibilityLabel="Clear"
          style={styles.clear}
        >
          <AppText tone="muted">✕</AppText>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    input: {
      height: 44,
      paddingHorizontal: space.lg,
      borderRadius: radius.md,
      backgroundColor: colors.chip,
      color: colors.text,
      fontSize: font.md,
    },
    inputWithClear: { paddingRight: 44 },
    clear: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 44,
      alignItems: "center",
      justifyContent: "center",
    },
  });
