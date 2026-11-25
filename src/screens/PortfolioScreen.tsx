import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "../components/ui/AppText";
import { usePortfolioViewModel } from "../hooks/usePortfolioViewModel";
import { space } from "../theme";

export function PortfolioScreen() {
  const state = usePortfolioViewModel();

  return (
    <View style={styles.container}>
      <AppText weight="semibold" style={styles.status}>
        Status: {state.status}
      </AppText>
      {state.status === "error" && <AppText tone="loss">{state.message}</AppText>}
      {state.status === "ready" && (
        <ScrollView>
          <AppText variant="caption" tone="muted" style={styles.json}>
            {JSON.stringify({ summary: state.summary, rows: state.rows }, null, 2)}
          </AppText>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: space.lg },
  status: { marginBottom: space.sm },
  json: { fontFamily: "monospace" },
});
