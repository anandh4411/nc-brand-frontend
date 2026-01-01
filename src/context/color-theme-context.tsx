import { createContext, useContext, useEffect, useState } from "react";

type ColorTheme = "red" | "blue";

type ColorThemeProviderProps = {
  children: React.ReactNode;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
};

type ColorThemeProviderState = {
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const initialState: ColorThemeProviderState = {
  colorTheme: "red",
  setColorTheme: () => null,
};

const ColorThemeProviderContext =
  createContext<ColorThemeProviderState>(initialState);

const colorThemes = {
  red: {
    light: {
      primary: "oklch(0.577 0.245 27.325)",
      primaryForeground: "oklch(0.985 0.016 17.38)",
      ring: "oklch(0.577 0.245 27.325)",
      sidebarPrimary: "oklch(0.577 0.245 27.325)",
      sidebarPrimaryForeground: "oklch(0.985 0.016 17.38)",
      sidebarRing: "oklch(0.577 0.245 27.325)",
      chart1: "oklch(0.577 0.245 27.325)",
      chart2: "oklch(0.68 0.18 27.325)",
      chart3: "oklch(0.50 0.28 27.325)",
      chart4: "oklch(0.78 0.12 27.325)",
      chart5: "oklch(0.45 0.30 27.325)",
    },
    dark: {
      primary: "oklch(0.577 0.245 27.325)",
      primaryForeground: "oklch(0.985 0.016 17.38)",
      ring: "oklch(0.577 0.245 27.325)",
      sidebarPrimary: "oklch(0.577 0.245 27.325)",
      sidebarPrimaryForeground: "oklch(0.985 0.016 17.38)",
      sidebarRing: "oklch(0.577 0.245 27.325)",
      chart1: "oklch(0.577 0.245 27.325)",
      chart2: "oklch(0.68 0.18 27.325)",
      chart3: "oklch(0.50 0.28 27.325)",
      chart4: "oklch(0.78 0.12 27.325)",
      chart5: "oklch(0.45 0.30 27.325)",
    },
  },
  blue: {
    light: {
      primary: "oklch(0.623 0.214 259.815)",
      primaryForeground: "oklch(0.97 0.014 254.604)",
      ring: "oklch(0.623 0.214 259.815)",
      sidebarPrimary: "oklch(0.623 0.214 259.815)",
      sidebarPrimaryForeground: "oklch(0.97 0.014 254.604)",
      sidebarRing: "oklch(0.623 0.214 259.815)",
      chart1: "oklch(0.623 0.214 259.815)",
      chart2: "oklch(0.72 0.16 259.815)",
      chart3: "oklch(0.55 0.26 259.815)",
      chart4: "oklch(0.82 0.12 259.815)",
      chart5: "oklch(0.48 0.30 259.815)",
    },
    dark: {
      primary: "oklch(0.546 0.245 262.881)",
      primaryForeground: "oklch(0.379 0.146 265.522)",
      ring: "oklch(0.488 0.243 264.376)",
      sidebarPrimary: "oklch(0.546 0.245 262.881)",
      sidebarPrimaryForeground: "oklch(0.379 0.146 265.522)",
      sidebarRing: "oklch(0.488 0.243 264.376)",
      chart1: "oklch(0.546 0.245 262.881)",
      chart2: "oklch(0.65 0.20 262.881)",
      chart3: "oklch(0.48 0.28 262.881)",
      chart4: "oklch(0.75 0.15 262.881)",
      chart5: "oklch(0.42 0.32 262.881)",
    },
  },
};

export function ColorThemeProvider({
  children,
  defaultColorTheme = "red",
  storageKey = "textilehub-ui-color-theme",
  ...props
}: ColorThemeProviderProps) {
  const [colorTheme, _setColorTheme] = useState<ColorTheme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as ColorTheme;
      return stored === "red" || stored === "blue" ? stored : defaultColorTheme;
    } catch {
      return defaultColorTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyColorTheme = (theme: ColorTheme) => {
      // Ensure the theme exists before applying
      if (!colorThemes[theme]) return;

      const isDark = root.classList.contains("dark");
      const colors = colorThemes[theme][isDark ? "dark" : "light"];

      // Apply the color theme variables
      root.style.setProperty("--primary", colors.primary);
      root.style.setProperty("--primary-foreground", colors.primaryForeground);
      root.style.setProperty("--ring", colors.ring);
      root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
      root.style.setProperty(
        "--sidebar-primary-foreground",
        colors.sidebarPrimaryForeground
      );
      root.style.setProperty("--sidebar-ring", colors.sidebarRing);

      // Apply chart colors
      root.style.setProperty("--chart-1", colors.chart1);
      root.style.setProperty("--chart-2", colors.chart2);
      root.style.setProperty("--chart-3", colors.chart3);
      root.style.setProperty("--chart-4", colors.chart4);
      root.style.setProperty("--chart-5", colors.chart5);
    };

    applyColorTheme(colorTheme);

    // Listen for theme changes to update colors accordingly
    const observer = new MutationObserver(() => {
      applyColorTheme(colorTheme);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [colorTheme]);

  const setColorTheme = (theme: ColorTheme) => {
    try {
      localStorage.setItem(storageKey, theme);
      _setColorTheme(theme);
    } catch {
      // Handle localStorage errors silently
      _setColorTheme(theme);
    }
  };

  const value = {
    colorTheme,
    setColorTheme,
  };

  return (
    <ColorThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ColorThemeProviderContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeProviderContext);

  if (context === undefined)
    throw new Error("useColorTheme must be used within a ColorThemeProvider");

  return context;
};

export { colorThemes };
export type { ColorTheme };
