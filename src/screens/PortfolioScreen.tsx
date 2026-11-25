import { ScrollView, Text, View } from "react-native";
import { usePortfolioViewModel } from "../hooks/usePortfolioViewModel";
import { useAppTheme } from "../theme";

export function PortfolioScreen() {
  const { colors } = useAppTheme();
  const state = usePortfolioViewModel();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 8 }}>
        Status: {state.status}
      </Text>
      {state.status === "error" && (
        <Text style={{ color: colors.loss }}>{state.message}</Text>
      )}
      {state.status === "ready" && (
        <ScrollView>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: "monospace",
              fontSize: 11,
            }}
          >
            {JSON.stringify(
              { summary: state.summary, rows: state.rows },
              null,
              2,
            )}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
