"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import createEmotionCache from "@/lib/createEmotionCache";

// Create MUI theme with light green primary color
let theme = createTheme({
  palette: {
    primary: {
      main: "#1A4D2E", // Deep Forest Green
      light: "#2E8B57",
      dark: "#0F2E1B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D4AF37", // Gold/Bronze
      light: "#F4D06F",
      dark: "#997C22",
      contrastText: "#1A4D2E",
    },
    background: {
      default: "#FAF9F6", // Cream/Off-White
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#5A5A5A",
    },
    success: {
      main: "#2E8B57",
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    divider: "rgba(212, 175, 55, 0.2)", // Subtle gold divider
  },
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1A4D2E",
    },
    h2: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1A4D2E",
    },
    h3: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1A4D2E",
    },
    h4: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#1A4D2E",
    },
    h5: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1A4D2E",
    },
    subtitle1: {
      fontFamily: '"Lato", sans-serif',
      fontSize: "1rem",
      color: "#5A5A5A",
    },
    body1: {
      fontFamily: '"Lato", sans-serif',
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "50px", // Pill shape
          padding: "8px 24px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(26, 77, 46, 0.2)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A4D2E",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "#F4F1EA",
          color: "#1A4D2E",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(26, 77, 46, 0.1)",
            borderColor: "rgba(212, 175, 55, 0.3)", // Subtle gold border on hover
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            retry: false,
          },
        },
      }),
  );

  // Only create emotion cache on client side
  const [emotionCache] = useState(() => {
    if (typeof window !== "undefined") {
      return createEmotionCache();
    }
    return null;
  });

  const content = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  // Only use CacheProvider on client side
  if (emotionCache) {
    return <CacheProvider value={emotionCache}>{content}</CacheProvider>;
  }

  return content;
}
