/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {
        colors: {
          'frc-blue': '213 82% 55%',
          'frc-slate': '215 20% 65%',
        }
      },
    },
    plugins: [],
  }