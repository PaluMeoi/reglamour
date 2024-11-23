import "@mantine/core/styles.css";
import { ThemeProvider } from "~theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "~popup/App";

const queryClient = new QueryClient();

function IndexPopup() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default IndexPopup;
