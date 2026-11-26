import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TickChart } from "../components/TickChart";
import { AppButton } from "../components/ui/AppButton";
import { AppText } from "../components/ui/AppText";
import { Card } from "../components/ui/Card";
import { useStockDetailViewModel } from "../hooks/useStockDetailViewModel";
import type { RootStackParamList } from "../navigation/types";
import { usePriceStore } from "../store/priceStore";
import { space } from "../theme";
import type { Holding } from "../types/portfolio";
import { changeTone, formatChange, formatMoney, formatVolume } from "../utils/money";
import { calcAveragePaise, calcDayChange, calcHolding } from "../utils/pnl";

type Props = NativeStackScreenProps<RootStackParamList, "StockDetail">;

export function StockDetailScreen({ route, navigation }: Props) {
  const { symbol } = route.params;
  const { holding, canBuy, canSell } = useStockDetailViewModel(symbol);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <PriceHeader symbol={symbol} />
        <Card>
          <TickChart symbol={symbol} />
        </Card>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        {holding && <Position holding={holding} />}
        <View style={styles.actions}>
          <AppButton
            label="Buy"
            variant="buy"
            disabled={!canBuy}
            onPress={() => navigation.navigate("TradeSheet", { symbol, side: "buy" })}
            style={styles.action}
          />
          <AppButton
            label="Sell"
            variant="sell"
            disabled={!canSell}
            onPress={() => navigation.navigate("TradeSheet", { symbol, side: "sell" })}
            style={styles.action}
          />
        </View>
      </View>
    </View>
  );
}

const PriceHeader = memo(function PriceHeader({ symbol }: { symbol: string }) {
  const quote = usePriceStore((s) => s.quotes[symbol]);
  const dayChange = calcDayChange(quote);
  const changePaise = dayChange?.changePaise ?? null;

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <AppText variant="display" tabular>
          {formatMoney(quote?.ltp ?? null)}
        </AppText>
        <AppText tone={changeTone(changePaise)} tabular>
          {formatChange(changePaise, dayChange?.changePct ?? null)}
          <AppText tone="muted"> today</AppText>
        </AppText>
        <AppText variant="caption" tone="muted" tabular>
          Prev close {formatMoney(quote?.prevClose ?? null)} · Vol{" "}
          {formatVolume(quote?.volume ?? null)}
        </AppText>
      </View>
      <View style={styles.right}>
        <PriceLine label="O" value={formatMoney(quote?.open ?? null)} />
        <PriceLine label="H" value={formatMoney(quote?.high ?? null)} />
        <PriceLine label="L" value={formatMoney(quote?.low ?? null)} />
      </View>
    </View>
  );
});

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.priceLine}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="caption" weight="semibold" tabular>
        {value}
      </AppText>
    </View>
  );
}

const Position = memo(function Position({ holding }: { holding: Holding }) {
  const quote = usePriceStore((s) => s.quotes[holding.symbol]);
  const position = calcHolding(holding, quote);
  const pnlPaise = position?.pnlPaise ?? null;

  return (
    <View style={styles.position}>
      <View>
        <AppText variant="title">Your position</AppText>
        <AppText variant="caption" tone="muted" tabular>
          {holding.qty} × {formatMoney(calcAveragePaise(holding))}
        </AppText>
      </View>
      <View style={styles.positionRight}>
        <AppText weight="semibold" tabular>
          {formatMoney(position?.valuePaise ?? null)}
        </AppText>
        <AppText variant="caption" tone={changeTone(pnlPaise)} tabular>
          {formatChange(pnlPaise, position?.pnlPct ?? null)}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: space.lg, gap: space.xl },
  header: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  left: { flex: 1, gap: 2 },
  right: { gap: space.xs, paddingTop: space.xs },
  priceLine: { flexDirection: "row", justifyContent: "flex-end", gap: space.sm },
  position: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  positionRight: { alignItems: "flex-end" },
  footer: { gap: space.md, paddingHorizontal: space.lg, paddingTop: space.sm },
  actions: { flexDirection: "row", gap: space.md },
  action: { flex: 1, minHeight: 44 },
});
