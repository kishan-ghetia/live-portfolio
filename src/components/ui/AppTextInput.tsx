import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { font, type Palette, radius, space, useAppTheme, useThemedStyles } from "../../theme";

export function AppTextInput({ style, ...rest }: TextInputProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <TextInput placeholderTextColor={colors.textMuted} style={[styles.input, style]} {...rest} />
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
  });
