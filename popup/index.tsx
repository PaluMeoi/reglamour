import "@mantine/core/styles.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { App } from "~popup/App"
import { ThemeProvider } from "~theme"

const queryClient = new QueryClient()

function IndexPopup() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default IndexPopup
