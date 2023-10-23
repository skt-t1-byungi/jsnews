/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                brand: ['var(--font-poiret-one)'],
            },
            maxWidth: {
                container: '1280px',
            },
            colors: {
                // https://colors.muz.li/palette/434e56/f2f3f2/fae914/98a6b0/846b4c
                // https://colors.muz.li/palette/234155/e3e3e4/585a5c/6cb1a4/acca3d
                'limed-spruce': {
                    50: '#f4f6f7',
                    100: '#e3e8ea',
                    200: '#cad3d7',
                    300: '#a5b3bb',
                    400: '#798d97',
                    500: '#5d717d',
                    600: '#50606a',
                    700: '#434e56',
                    800: '#3e464c',
                    900: '#373d42',
                    950: '#21262b',
                },
                concrete: {
                    50: '#f7f8f7',
                    100: '#f2f3f2',
                    200: '#daddda',
                    300: '#babfba',
                    400: '#959c94',
                    500: '#788077',
                    600: '#616960',
                    700: '#4f554f',
                    800: '#434943',
                    900: '#3c3f3b',
                    950: '#272a27',
                },
                lemon: {
                    50: '#fdfee8',
                    100: '#fcfec3',
                    200: '#fdfe8a',
                    300: '#fdf747',
                    400: '#fae914',
                    500: '#ead008',
                    600: '#caa304',
                    700: '#a17607',
                    800: '#855c0e',
                    900: '#714b12',
                    950: '#422806',
                },
                'gull-gray': {
                    50: '#f8fafa',
                    100: '#f2f4f5',
                    200: '#e7ebed',
                    300: '#d4dbde',
                    400: '#bac5cb',
                    500: '#98a6b0',
                    600: '#8694a1',
                    700: '#73808e',
                    800: '#616c76',
                    900: '#505962',
                    950: '#343b41',
                },
                shadow: {
                    50: '#f6f5f0',
                    100: '#e9e5d8',
                    200: '#d4ccb4',
                    300: '#bbad89',
                    400: '#a89367',
                    500: '#998159',
                    600: '#846b4c',
                    700: '#6a533e',
                    800: '#5a4639',
                    900: '#4f3e34',
                    950: '#2c211c',
                },
                tarawera: {
                    50: '#eff9fc',
                    100: '#d7eff6',
                    200: '#b4e0ed',
                    300: '#80c9e0',
                    400: '#45a8cb',
                    500: '#2a8cb0',
                    600: '#257195',
                    700: '#245c7a',
                    800: '#264d64',
                    900: '#234155',
                    950: '#122a3a',
                },
                acapulco: {
                    50: '#f3faf8',
                    100: '#d9eee9',
                    200: '#b2ddd2',
                    300: '#83c5b6',
                    400: '#6cb1a4',
                    500: '#408c7f',
                    600: '#317066',
                    700: '#2b5a54',
                    800: '#264945',
                    900: '#233e3a',
                    950: '#102322',
                },
                bahia: {
                    50: '#f9fbea',
                    100: '#f0f5d2',
                    200: '#e0eda9',
                    300: '#cadf77',
                    400: '#acca3d',
                    500: '#95b42e',
                    600: '#748f21',
                    700: '#586d1e',
                    800: '#48571d',
                    900: '#3d4b1c',
                    950: '#1f290a',
                },
            },
        },
    },
    plugins: [],
}
