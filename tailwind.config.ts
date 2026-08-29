import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: {
            50: "#FCF6F6",
            100: "#F7EAEA",
            200: "#F1D7D7",
            300: "#E8B8B8", // Primary Dusty Pink
            400: "#D99E9E",
            500: "#C78282",
            600: "#B06565",
            700: "#8E4B4B",
            800: "#6C3838",
            900: "#4D2626",
            DEFAULT: "#E8B8B8",
          },
          sage: {
            50: "#F5F7F4",
            100: "#E8ECE6",
            200: "#D4DDD0",
            300: "#BDCBB7",
            400: "#A7B89F", // Primary Sage Green
            500: "#8FA386",
            600: "#758A6D",
            700: "#5B6C55",
            800: "#424F3E",
            900: "#2B3428",
            DEFAULT: "#A7B89F",
          },
          cream: {
            50: "#FFFFFF",
            100: "#FDFCFA",
            200: "#FAF7F2",
            300: "#F9F6EF", // Primary Cream
            400: "#F2ECE0",
            500: "#E8DFC E",
            600: "#D3C6B1",
            700: "#B7A890",
            800: "#91836E",
            900: "#6A5E4E",
            DEFAULT: "#F9F6EF",
          },
          brown: {
            50: "#FAF7F5",
            100: "#F2EBE7",
            200: "#E3D5CD",
            300: "#CBB6AA",
            400: "#A28477",
            500: "#7A5B4F", // Primary Warm Brown
            600: "#65493E",
            700: "#50382E",
            800: "#3D2A23",
            900: "#2B1D18",
            DEFAULT: "#7A5B4F",
          },
          beige: {
            50: "#FAF8F5",
            100: "#F3EFE9",
            200: "#E9E2D8",
            300: "#D7C9B8", // Primary Beige
            400: "#C4B29E",
            500: "#AE9983",
            600: "#927D69",
            700: "#726151",
            800: "#53463B",
            900: "#372E26",
            DEFAULT: "#D7C9B8",
          },
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
          subtle: "var(--surface-subtle)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(122, 91, 79, 0.04)",
        card: "0 4px 20px -2px rgba(122, 91, 79, 0.08)",
        elevated: "0 12px 32px -4px rgba(122, 91, 79, 0.12)",
        glow: "0 0 25px rgba(232, 184, 184, 0.35)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
