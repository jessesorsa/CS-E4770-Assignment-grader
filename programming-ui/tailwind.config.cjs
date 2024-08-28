/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto']
      },
    },
  },
  content: ["./src/**/*.{js,svelte}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

}
