import { Pressable, StyleSheet, View } from "react-native";
import { type Palette, radius, space, useThemedStyles } from "../../theme";
import { AppText } from "./AppText";

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillsProps<T extends string> {
  options: readonly PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Pills<T extends string>({ options, value, onChange }: PillsProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.pill, selected && styles.selected]}
          >
            <AppText weight="semibold" tone={selected ? "onPrimary" : "muted"}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row", gap: space.sm },
    pill: {
      paddingVertical: space.sm,
      paddingHorizontal: space.lg,
      borderRadius: radius.pill,
      backgroundColor: colors.chip,
    },
    selected: { backgroundColor: colors.primary },
  });
