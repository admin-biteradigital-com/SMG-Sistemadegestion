/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // SMG Brand Palette based on the Logo
                brand: {
                    brown: '#3E2723', // Dark borders/text
                    clay: '#A1887F',  // Lighter earth tones
                    cream: '#FFF8E1', // Background/Sky
                    teal: '#26A69A',  // Water/Lake - Primary Action
                    orange: '#FF7043', // Mountains - Highlights
                },
                // Mapping semantic names to brand colors
                primary: {
                    50: '#E0F2F1',
                    100: '#B2DFDB',
                    500: '#26A69A', // Brand Teal
                    600: '#00897B',
                    700: '#00796B',
                    800: '#00695C',
                    900: '#004D40',
                }
            }
        },
    },
    plugins: [],
}
