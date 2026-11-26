import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "../components/ui/AppButton";
import { AppText } from "../components/ui/AppText";
import { AppTextInput } from "../components/ui/AppTextInput";
import { type PillOption, Pills } from "../components/ui/Pills";
import { useTradeViewModel } from "../hooks/useTradeViewModel";
import type { RootStackParamList } from "../navigation/types";
import { space } from "../theme";
import { formatMoney } from "../utils/money";
import type { TradeSide } from "../utils/trade";

type Props = NativeStackScreenProps<RootStackParamList, "TradeSheet">;

const SIDE_OPTIONS: PillOption<TradeSide>[] = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

export function TradeSheetScreen({ route, navigation }: Props) {
  const { symbol } = route.params;
  const insets = useSafeAreaInsets();
  const {
    side,
    setSide,
    qtyText,
    changeQty,
    price,
    heldQty,
    error,
    estimatePaise,
    canConfirm,
    confirm,
  } = useTradeViewModel(symbol, route.params.side);

  const onConfirm = () => {
    if (confirm()) navigation.goBack();
  };

  return (
    <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.titleRow}>
        <AppText variant="heading">
          {side === "buy" ? "Buy" : "Sell"} {symbol}
        </AppText>
        <AppText variant="caption" tone="muted" tabular>
          Live {formatMoney(price ?? null)}
        </AppText>
      </View>

      <Pills options={SIDE_OPTIONS} value={side} onChange={setSide} />

      <View style={styles.field}>
        <AppText variant="caption" tone="muted">
          Quantity
        </AppText>
        <AppTextInput
          value={qtyText}
          onChangeText={changeQty}
          placeholder="0"
          keyboardType="number-pad"
          autoFocus
        />
        <AppText variant="caption" tone={error ? "loss" : "muted"}>
          {error ?? `You hold ${heldQty}`}
        </AppText>
      </View>

      <View style={styles.estimate}>
        <AppText tone="muted">Estimated value</AppText>
        <AppText weight="semibold" tabular>
          {formatMoney(estimatePaise)}
        </AppText>
      </View>

      <AppButton
        label={side === "buy" ? "Confirm buy" : "Confirm sell"}
        variant={side}
        disabled={!canConfirm}
        onPress={onConfirm}
        style={styles.confirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: space.lg, gap: space.lg },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  field: { gap: space.xs },
  estimate: { flexDirection: "row", justifyContent: "space-between" },
  confirm: { minHeight: 44 },
});
