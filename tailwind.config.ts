
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}","./src/app/**/*.{ts,tsx}","./src/components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;
