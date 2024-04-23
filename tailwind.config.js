const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Aquí defines tus temas personalizados
        primary: {
          ...colors.blue,
          DEFAULT: colors.blue[900]
        },
        accent: {
          ...colors.slate,
          DEFAULT: colors.slate[800]
        },
        warn: {
          ...colors.red,
          DEFAULT: colors.red[600]
        },
        'on-warn': {
          500: colors.red['50']
        },
        teal: {
          ...colors.teal,
          DEFAULT: colors.teal[600]
        },
        rose: {
          ...colors.rose
        },
        purple: {
          ...colors.purple,
          DEFAULT: colors.purple[600]
        },
        amber: {
          ...colors.amber
        }
      }
    }
  }
};
