const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /.+(warning|info|error|success|reject).*/
    }
  ],
  theme: {
    extend: {
      colors: {
        warning: colors.amber["300"],
        info: colors.sky["200"],
        error: colors.rose["400"],
        success: colors.green["300"],
        reject: colors.rose["400"]
      }
    }
  },
  plugins: [],
}
