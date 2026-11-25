import { usePriceStore } from "../store/priceStore";
import { startFeedBridge } from "./feedBridge";
import { startFeedWatchdog } from "./feedWatchdog";
import { createSimulatedSocket } from "./simulatedSocket";

export function startLiveFeed(): () => void {
  const socket = createSimulatedSocket(() => usePriceStore.getState().quotes);
  const stopBridge = startFeedBridge(socket);
  const stopWatchdog = startFeedWatchdog(socket);
  socket.connect();

  return () => {
    socket.disconnect();
    stopWatchdog();
    stopBridge();
  };
}
