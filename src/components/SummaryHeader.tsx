import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { space } from "../theme";
import type { PortfolioSummary } from "../types/portfolio";
import { formatMoney, formatPct } from "../utils/money";
import { AppText } from "./ui/AppText";
import { Card } from "./ui/Card";

function toneOf(value: number) {
  return value > 0 ? "gain" : value < 0 ? "loss" : "muted";
}

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.line}>
      <AppText tone="muted">{label}</AppText>
      {children}
    </View>
  );
}

export function SummaryHeader({ summary }: { summary: PortfolioSummary }) {
  const { valuePaise, investedPaise, pnlPaise, pnlPct, dayChangePaise, dayChangePct } = summary;
  const unpriced = summary.unpricedSymbols;

  return (
    <Card style={styles.container}>
      <View style={styles.totals}>
        <View>
          <AppText tone="muted">Invested</AppText>
          <AppText variant="heading" tabular>
            {formatMoney(investedPaise)}
          </AppText>
        </View>
        <View style={styles.right}>
          <AppText tone="muted">Current</AppText>
          <AppText variant="heading" tabular>
            {formatMoney(valuePaise)}
          </AppText>
        </View>
      </View>

      <View style={styles.lines}>
        <Line label="Total P&L">
          <AppText tone={toneOf(pnlPaise)} tabular>
            {formatMoney(pnlPaise, true)} · {formatPct(pnlPct)}
          </AppText>
        </Line>
        <Line label="Today's P&L">
          <AppText tone={toneOf(dayChangePaise)} tabular>
            {formatMoney(dayChangePaise, true)} · {formatPct(dayChangePct)}
          </AppText>
        </Line>
      </View>

      {unpriced.length > 0 && (
        <AppText tone="muted">
          Excludes {unpriced.length} unpriced holding{unpriced.length === 1 ? "" : "s"}:{" "}
          {unpriced.join(", ")}
        </AppText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.xs },
  totals: { flexDirection: "row", justifyContent: "space-between" },
  right: { alignItems: "flex-end" },
  lines: { gap: space.sm, marginVertical: space.md },
  line: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
