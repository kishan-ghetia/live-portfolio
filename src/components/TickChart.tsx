import { memo, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Polygon, Polyline, Stop } from "react-native-svg";
import { useTickHistory } from "../hooks/useTickHistory";
import { space, useAppTheme } from "../theme";
import { calcChangeSince, toChartShape } from "../utils/chart";
import { changeTone, formatChange } from "../utils/money";
import { AppText } from "./ui/AppText";

function TickChartView({ symbol }: { symbol: string }) {
  const { colors } = useAppTheme();
  const { openPrice, prices } = useTickHistory(symbol);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const { width, height } = size;
  const shape = openPrice === null ? null : toChartShape(prices, openPrice, width, height);
  const change = calcChangeSince(openPrice, prices[prices.length - 1]);
  const changePaise = change?.changePaise ?? null;
  const color = changePaise !== null && changePaise < 0 ? colors.loss : colors.gain;

  const points = shape?.points ?? [];
  const first = points[0];
  const last = points[points.length - 1];
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = first && last ? `${line} ${last.x},${height} ${first.x},${height}` : "";

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <AppText variant="caption" tone="muted">
          Since you opened
        </AppText>
        <AppText variant="caption" tone={changeTone(changePaise)} tabular>
          {formatChange(changePaise, change?.changePct ?? null)}
        </AppText>
      </View>
      <View style={styles.chart} onLayout={onLayout}>
        {shape && first && last ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.25} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Line
              x1={0}
              y1={shape.openY}
              x2={width}
              y2={shape.openY}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <Polygon points={area} fill="url(#fill)" />
            <Polyline
              points={line}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <Circle cx={last.x} cy={last.y} r={3.5} fill={color} />
          </Svg>
        ) : (
          <AppText tone="muted">Waiting for ticks…</AppText>
        )}
      </View>
    </View>
  );
}

export const TickChart = memo(TickChartView);

const styles = StyleSheet.create({
  container: { gap: space.sm },
  labels: { flexDirection: "row", justifyContent: "space-between" },
  chart: { aspectRatio: 1.8, alignItems: "center", justifyContent: "center" },
});
