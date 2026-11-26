import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "../components/ui/AppText";
import { useStockDetailViewModel } from "../hooks/useStockDetailViewModel";
import type { RootStackParamList } from "../navigation/types";
import { space } from "../theme";
import { changeTone, formatChange, formatMoney, formatVolume } from "../utils/money";

type Props = NativeStackScreenProps<RootStackParamList, "StockDetail">;

export function StockDetailScreen({ route }: Props) {
  const { quote, dayChange } = useStockDetailViewModel(route.params.symbol);
  const changePaise = dayChange?.changePaise ?? null;

  return (
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
  content: { padding: space.lg, gap: space.lg },
  header: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  left: { flex: 1, gap: 2 },
  right: { flex: 1, justifyContent: "space-between", paddingVertical: space.xs },
  priceLine: { flexDirection: "row", justifyContent: "flex-end", gap: space.sm },
});
