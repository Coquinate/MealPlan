import baseConfig from "@coquinate/config/tailwind"

/** @type {import("tailwindcss").Config} */
export default {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
