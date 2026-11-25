import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { space } from "../theme";
import { usePortfolioSummary } from "../hooks/usePortfolioViewModel";
import { changeTone, formatChange, formatMoney } from "../utils/money";
import { AppText } from "./ui/AppText";
import { Card } from "./ui/Card";

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.line}>
      <AppText tone="muted">{label}</AppText>
      {children}
    </View>
  );
}

export function SummaryHeader() {
  const summary = usePortfolioSummary();
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
          <AppText tone={changeTone(pnlPaise)} tabular>
            {formatChange(pnlPaise, pnlPct)}
          </AppText>
        </Line>
        <Line label="Today's P&L">
          <AppText tone={changeTone(dayChangePaise)} tabular>
            {formatChange(dayChangePaise, dayChangePct)}
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
