// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        // 'sans' di-override agar dimulai dengan Poppins, diikuti oleh font default lainnya.
        // Ini adalah cara yang lebih "Tailwind" untuk menetapkan font default.
        'sans': ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // ...
}