/** @type {import('tailwindcss').Config} */
// Generated from tokens.json. The palette is closed on purpose: only these colors exist in the project.
// Requires Tailwind 3.3 or newer (logical utilities: ms-*, me-*, ps-*, pe-*, start-*, end-*, text-start).
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      ink: {
        0: '#FFFFFF',
        25: '#FAFBFE',
        50: '#F4F6FB',
        100: '#E9EDF6',
        200: '#D5DBEA',
        300: '#B4BDD6',
        400: '#8892B0',
        500: '#646E8F',
        600: '#4A5473',
        700: '#343D5A',
        800: '#1F2742',
        900: '#0F1530',
      },
      primary: {
        50: '#EEF3FF',
        100: '#DCE6FF',
        200: '#BACDFF',
        300: '#8DABFF',
        400: '#5C82FF',
        500: '#3A62FA',
        600: '#2548E0',
        700: '#1C37B3',
        800: '#172C8A',
        900: '#121F61',
      },
      accent: {
        50: '#FFF4E8',
        100: '#FFE4C7',
        200: '#FFC98F',
        300: '#FFAA57',
        400: '#FF8A2A',
        500: '#F26D0A',
        600: '#C95406',
        700: '#9E4005',
      },
      success: {
        50: '#E7F8EF',
        100: '#C4EDD9',
        500: '#12A66A',
        600: '#0B8A57',
        700: '#07693F',
      },
      warning: {
        50: '#FFF6E0',
        100: '#FFE7A8',
        500: '#F5A30B',
        600: '#C98100',
        700: '#8F5A00',
      },
      danger: {
        50: '#FFEBEE',
        100: '#FFCDD3',
        500: '#E5484D',
        600: '#C62F36',
        700: '#9A1F26',
      },
      info: {
        50: '#E6F4FF',
        100: '#C2E3FF',
        500: '#1D8FEB',
        600: '#0A6CC4',
        700: '#064E91',
      },
      chart: {
        c1: '#3A62FA',
        c2: '#0FB5A6',
        c3: '#FF8A2A',
        c4: '#E0489A',
        c5: '#7C5CFC',
        c6: '#6FC12A',
      },
      page: '#F4F6FB',
      surface: '#FFFFFF',
      subtle: '#E9EDF6',
      line: {
        DEFAULT: '#D5DBEA',
        strong: '#8892B0',
      },
      fg: {
        DEFAULT: '#0F1530',
        secondary: '#4A5473',
        muted: '#646E8F',
      },
    },
    fontFamily: { sans: ['Heebo', 'Assistant', 'Segoe UI', 'Arial', 'sans-serif'] },
    fontSize: {
      display: [
        '36px',
        {
          lineHeight: '44px',
          fontWeight: '700',
        },
      ],
      h1: [
        '28px',
        {
          lineHeight: '36px',
          fontWeight: '700',
        },
      ],
      h2: [
        '22px',
        {
          lineHeight: '30px',
          fontWeight: '600',
        },
      ],
      h3: [
        '18px',
        {
          lineHeight: '26px',
          fontWeight: '600',
        },
      ],
      'body-lg': [
        '16px',
        {
          lineHeight: '24px',
          fontWeight: '400',
        },
      ],
      body: [
        '14px',
        {
          lineHeight: '22px',
          fontWeight: '400',
        },
      ],
      'body-strong': [
        '14px',
        {
          lineHeight: '22px',
          fontWeight: '600',
        },
      ],
      label: [
        '13px',
        {
          lineHeight: '18px',
          fontWeight: '500',
        },
      ],
      caption: [
        '12px',
        {
          lineHeight: '18px',
          fontWeight: '400',
        },
      ],
      'mono-num': [
        '14px',
        {
          lineHeight: '22px',
          fontWeight: '500',
        },
      ],
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
      DEFAULT: '8px',
    },
    boxShadow: {
      xs: '0px 1px 2px 0px #0F153014',
      sm: '0px 2px 6px -1px #0F15301F',
      md: '0px 6px 16px -4px #0F153026',
      lg: '0px 16px 32px -8px #0F153033',
    },
    extend: {
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        4.5: '18px',
      },
      ringColor: { DEFAULT: '#3A62FA' },
      // Component sizes that have no spacing step: the check box and radio (18), the tab underline,
      // the drawer and the dialogs.
      borderWidth: { 3: '3px' },
      width: { drawer: '420px' },
      maxWidth: { 'modal-s': '480px', 'modal-m': '640px' },
    },
  },
  plugins: [],
};
