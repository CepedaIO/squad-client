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
    screens: {
      sm: '320px',
      md: '375px',
      lg: '425px',
      xl: '768px',
      '2xl': '1024px',
      '3xl': '1440px',
      '4k':' 2560px'
    },
    extend: {
      colors: {
        primary: colors.stone["600"],
        warning: colors.amber["300"],
        info: colors.sky["200"],
        error: colors.rose["400"],
        success: colors.green["300"],
        reject: colors.rose["400"],
        hint: colors.gray["400"]
      }
    }
  },
  plugins: [],
}
