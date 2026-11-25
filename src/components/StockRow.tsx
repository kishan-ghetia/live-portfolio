import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { usePortfolioStore } from "../store/portfolioStore";
import { usePriceStore } from "../store/priceStore";
import { type Palette, space, useThemedStyles } from "../theme";
import { changeTone, formatChange, formatMoney } from "../utils/money";
import { calcAveragePaise, calcDayChange, calcHolding } from "../utils/pnl";
import { AppText } from "./ui/AppText";

export const ROW_HEIGHT = 64;

export function getStockRowLayout(_data: ArrayLike<string> | null | undefined, index: number) {
  return { length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index };
}

interface StockRowProps {
  symbol: string;
  mode: "holding" | "quote";
  onPress?: (symbol: string) => void;
}

function StockRowView({ symbol, mode, onPress }: StockRowProps) {
  const styles = useThemedStyles(createStyles);
  const quote = usePriceStore((s) => s.quotes[symbol]);
  const holding = usePortfolioStore((s) =>
    mode === "holding" ? s.holdings.find((h) => h.symbol === symbol) : undefined,
  );

  let subtitle: string | null = null;
  let changePaise: number | null = null;
  let changePct: number | null = null;

  if (mode === "holding" && holding) {
    const values = calcHolding(holding, quote);
    subtitle = `${holding.qty} × ${formatMoney(calcAveragePaise(holding))}`;
    changePaise = values?.pnlPaise ?? null;
    changePct = values?.pnlPct ?? null;
  } else {
    const day = calcDayChange(quote);
    changePaise = day?.changePaise ?? null;
    changePct = day?.changePct ?? null;
  }

  return (
    <Pressable
      onPress={onPress ? () => onPress(symbol) : undefined}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View>
        <AppText variant="title">{symbol}</AppText>
        {subtitle !== null && (
          <AppText variant="caption" tone="muted" tabular>
            {subtitle}
          </AppText>
        )}
      </View>
      <View style={styles.right}>
        <AppText weight="semibold" tabular>
          {formatMoney(quote?.ltp ?? null)}
        </AppText>
        <AppText variant="caption" tone={changeTone(changePaise)} tabular>
          {formatChange(changePaise, changePct)}
        </AppText>
      </View>
    </Pressable>
  );
}

export const StockRow = memo(StockRowView);

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      height: ROW_HEIGHT,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: space.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    right: { alignItems: "flex-end" },
    pressed: { opacity: 0.6 },
  });
