import { Text, View } from "react-native";
import { usePriceStore } from "../store/priceStore";
import { font, radius, space, useAppTheme } from "../theme";

export function PausedBadge() {
  const { colors } = useAppTheme();
  const ready = usePriceStore((s) => s.status === "ready");
  const paused = usePriceStore((s) => s.feedStatus === "paused");

  if (!ready) return null;

  const color = paused ? colors.warning : colors.gain;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space.xs,
        marginRight: space.md,
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: radius.pill, backgroundColor: color }} />
      <Text
        style={{
          width: 88,
          color,
          fontSize: font.sm,
          lineHeight: font.sm,
          fontWeight: "600",
          includeFontPadding: false,
        }}
      >
        {paused ? "Prices Paused" : "Prices Live"}
      </Text>
    </View>
  );
}
