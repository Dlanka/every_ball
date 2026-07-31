/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        umpire: {
          dark: "#0b0f19",
          card: "#151c2c",
          border: "#232e42",
          accent: "#38bdf8", // vibrant sky blue
          dot: "#22c55e",   // vibrant green for legal ball
          wide: "#f59e0b",  // amber for wide
          noball: "#ec4899",// pink/red for no ball
          wicket: "#ef4444",// sharp red for wicket
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.4s ease-in-out 1',
      }
    },
  },
  plugins: [],
}
