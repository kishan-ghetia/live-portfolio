import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "../components/ui/AppButton";
import { AppText } from "../components/ui/AppText";
import { useStockDetailViewModel } from "../hooks/useStockDetailViewModel";
import type { RootStackParamList } from "../navigation/types";
import { space } from "../theme";
import { changeTone, formatChange, formatMoney, formatVolume } from "../utils/money";
import { calcAveragePaise } from "../utils/pnl";

type Props = NativeStackScreenProps<RootStackParamList, "StockDetail">;

export function StockDetailScreen({ route }: Props) {
  const { quote, dayChange, holding, position, canBuy, canSell } = useStockDetailViewModel(
    route.params.symbol,
  );
  const insets = useSafeAreaInsets();
  const changePaise = dayChange?.changePaise ?? null;
  const pnlPaise = position?.pnlPaise ?? null;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        {holding && (
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
        )}
        <View style={styles.actions}>
          <AppButton
            label="Buy"
            variant="buy"
            disabled={!canBuy}
            onPress={() => {}}
            style={styles.action}
          />
          <AppButton
            label="Sell"
            variant="sell"
            disabled={!canSell}
            onPress={() => {}}
            style={styles.action}
          />
        </View>
      </View>
    </View>
  );
}

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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.lg, gap: space.lg },
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
