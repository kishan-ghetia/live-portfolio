import { Component, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { font, radius, space, useAppTheme } from "../theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) return <ErrorFallback onRetry={this.reset} />;
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: space.md,
        padding: space.xl,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.text, fontSize: font.lg, fontWeight: "600" }}>
        Something went wrong
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: font.md, textAlign: "center" }}>
        The app hit an unexpected error. Try again to reload the screen.
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: space.sm,
          paddingHorizontal: space.lg,
          borderRadius: radius.sm,
        }}
      >
        <Text style={{ color: colors.onPrimary, fontSize: font.md, fontWeight: "600" }}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
