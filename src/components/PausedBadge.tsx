import { StyleSheet, View } from "react-native";
import { usePriceStore } from "../store/priceStore";
import { type Palette, radius, space, useThemedStyles } from "../theme";
import { AppText } from "./ui/AppText";

export function PausedBadge() {
  const styles = useThemedStyles(createStyles);
  const ready = usePriceStore((s) => s.status === "ready");
  const paused = usePriceStore((s) => s.feedStatus === "paused");

  if (!ready) return null;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, paused ? styles.pausedDot : styles.liveDot]} />
      <AppText
        variant="caption"
        weight="semibold"
        tone={paused ? "warning" : "gain"}
        style={styles.label}
      >
        {paused ? "Prices Paused" : "Prices Live"}
      </AppText>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: space.xs, marginRight: space.md },
    dot: { width: 8, height: 8, borderRadius: radius.pill },
    liveDot: { backgroundColor: colors.gain },
    pausedDot: { backgroundColor: colors.warning },
    label: { width: 88 },
  });
