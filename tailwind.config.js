/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/*
    - Sets up all the needed classes for layout
    - These are all the parts that makeup tailwind selectors
    *** This could all technically come from the model,
    JSON from the model is where I got all these values. ***
*/

// Reusable concepts for building safe-list
const breakPoints = ['xxs', 'xs', 'md', 'lg', 'xl', '2xl', '3xl'];
const displayAttrs = [
    'grid',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
    'grid-cols-none',
    'grid-cols-subgrid',
    'hidden',
    'block',
    'float-start',
    'float-end',
    'float-right',
    'float-left',
    'float-none',
    'inline-block',
    'flex',
    'inline-flex',
    'flex-nowrap',
    'flex-wrap',
    'flex-col',
    'flex-row',
    'justify-start',
    'justify-end',
    'justify-center',
    'justify-between',
    'justify-around',
    'justify-evenly',
    'justify-stretch',
    'justify-normal',
    'items-start',
    'items-end',
    'items-center',
    'items-baseline',
    'items-stretch',
    'content-center',
    'content-start',
    'content-end',
    'content-between',
    'content-around',
    'content-evenly',
    'content-baseline',
    'content-stretch',
    'content-normal',
    'self-auto',
    'self-start',
    'self-end',
    'self-center',
    'self-stretch',
    'self-baseline'
];
const measurementsStatic = [
    '0',
    'px',
    '0.5',
    '1',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '20',
    '24',
    '28',
    '32',
    '36',
    '40',
    '44',
    '48',
    '52',
    '56',
    '60',
    '64',
    '68',
    '72',
    '76',
    '80',
    '84',
    '88',
    '92',
    '96'
];
const measurementsRelative = [
    'auto',
    'full',
    'screen',
    'min',
    'max',
    'fit',
    'svw',
    'svh',
    'lvw',
    'lvh',
    'dvw',
    'dvh',
    '1/12',
    '2/12',
    '3/12',
    '4/12',
    '5/12',
    '6/12',
    '7/12',
    '8/12',
    '9/12',
    '10/12',
    '11/12'
];

const positions = ['top', 'right', 'bottom', 'left'];
const positionTypes = ['relative', 'absolute', 'fixed', 'sticky'];

// Standardized function to map all concepts
const conceptMap = ({
    append = '',
    connector = '-',
    prefixes = [''],
    suffixes = ['']
}) => prefixes.flatMap(prefix => suffixes.flatMap(suffix => (!prefix ? `${append}${suffix}` : `${append}${prefix}${connector}${suffix}`)));

/*
    These are safe-list values that are always available.
    Until I figure out a better way
*/
// Colors
const colorsBase = conceptMap({
    prefixes: ['bg', 'text', 'fill', 'stroke'],
    suffixes: [
        'blue-500',
        'rocket-primary-dark',
        'rocket-primary-darker',
        'rocket-primary-dark-highlight',
        'rocket-primary-medium',
        'rocket-primary-light',
        'rocket-primary-extra-light',
        'rocket-primary-lighter',
        'rocket-primary-inactive',
        'rocket-gray-dark',
        'rocket-gray-medium',
        'rocket-gray-light',
        'rocket-secondary-dark',
        'rocket-secondary-medium',
        'rocket-secondary-light',
        'rocket-accent-1-dark',
        'rocket-accent-1-medium',
        'rocket-accent-1-light',
        'rocket-accent-2-dark',
        'rocket-accent-2-medium',
        'rocket-accent-2-light',
        'rocket-accent-3-dark',
        'rocket-accent-3-medium',
        'rocket-accent-3-light',
        'rocket-accent-4-dark',
        'rocket-accent-4-medium',
        'rocket-accent-4-light',
        'rocket-accent-5-medium',
        'rocket-accent-6-medium',
        'rocket-accent-7-medium',
        'rocket-success-dark',
        'rocket-success-medium',
        'rocket-success-light',
        'rocket-warning-dark',
        'rocket-warning-medium',
        'rocket-warning-light',
        'rocket-white-dark',
        'rocket-white-medium',
        'rocket-white-hover',
        'rocket-title-dark'
    ]
});
const colorMap = [
    ...colorsBase,
    ...conceptMap({
        connector: ':',
        prefixes: ['hover'],
        suffixes: colorsBase
    }),
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: colorsBase
    })];

// Dimensions
const dimensions = conceptMap({
    prefixes: ['w', 'min-w', 'max-w', 'h', 'min-h', 'max-h', 'basis'],
    suffixes: [...measurementsStatic, ...measurementsRelative]
});
const dimensionsMap = [
    ...dimensions,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: dimensions
    })
];
const contentSizes = conceptMap({
    prefixes: ['w', 'max-w', 'min-w'],
    suffixes: ['content-size']
});
const contentSizesMap = [
    ...contentSizes,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: contentSizes
    })
];

const displayMap = [
    ...displayAttrs,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: displayAttrs
    })
];

// Gap
const gaps = conceptMap({
    prefixes: ['gap'],
    suffixes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40]
});
const gapMap = [
    ...gaps,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: gaps
    })
];

// Margin and Padding
const marginPadding = conceptMap({
    prefixes: ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'],
    suffixes: measurementsStatic
});
const marginPaddingMap = [
    ...marginPadding,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: marginPadding
    })
];
const autoMargins = conceptMap(
    {
        prefixes: ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my'],
        suffixes: ['auto']
    }
);
const autoMarginsMap = [
    ...autoMargins,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: autoMargins
    })
];

// Positioning
const positionsNegative = conceptMap({
    append: '-',
    prefixes: positions,
    suffixes: measurementsStatic
});
const positionsPositive = conceptMap({
    prefixes: positions,
    suffixes: measurementsStatic
});
const positionsMap = [
    ...positionTypes,
    ...positionsNegative,
    ...positionsPositive,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: [...positionTypes, ...positionsNegative, ...positionsPositive]
    })
];

// zIndex
const zIndexes = conceptMap({
    prefixes: ['z'],
    suffixes: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
});
const zIndexesNegative = conceptMap({
    append: '-',
    prefixes: ['z'],
    suffixes: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
});
const zIndexMap = [
    ...zIndexes,
    ...zIndexesNegative,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: zIndexes
    })
];

const orderClasses = [
    'order-none',
    'order-first',
    'order-last',
    'order-1',
    'order-2',
    'order-3',
    'order-4',
    'order-5',
    'order-6',
    'order-7',
    'order-8',
    'order-9'
];
const orderMap = [
    ...orderClasses,
    ...conceptMap({
        connector: ':',
        prefixes: breakPoints,
        suffixes: orderClasses
    })
];

module.exports = {
    mode: 'jit',
    content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            translate: {
                'half': '50%',
                '-half': '-50%'
            },
            boxShadow: {
                'rocket-modal': '0px 5px 10px 0 rgba(0, 0, 0, 0.05), 0px 5px 10px 10px rgba(0, 0, 0, 0.05)',
                '0002px-07': '0 0 0 2px rgba(0,0,0,.07)'
            },
            lineClamp: {
                '7': '7',
                '8': '8',
                '9': '9',
                '10': '10'
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90'
            },
            colors: {
                /* PRIMARY */
                'rocket-primary-dark': 'var(--primary-dark)',
                'rocket-primary-darker': 'var(--primary-darker)',
                'rocket-primary-dark-highlight': 'var(--primary-dark-highlight)',
                'rocket-primary-medium': 'var(--primary-medium)',
                'rocket-primary-light': 'var(--primary-light)',
                'rocket-primary-extra-light': 'var(--primary-extra-light)',
                'rocket-primary-lighter': 'var(--white-hover)',
                'rocket-primary-inactive': 'var(--primary-inactive)',
                'blue-500': 'var(--blue-500)'
            },
            gap: {
                '02': '40px',
                '03': '42px',
                '04': '40px'
            },
            gridTemplateColumns: {
                '2-fit': 'repeat(auto-fit, minmax(0, 579px))',
                '3-fit': 'repeat(auto-fit, minmax(0, 372px))',
                '4-fit': 'repeat(auto-fit, minmax(0, 270px))'
            },
            spacing: {
                '68': '17rem',
                '76': '19rem',
                '84': '21rem',
                '88': '22rem',
                '92': '23rem'
            },
            width: {
                'content-size': '1200px'
            },
            maxWidth: {
                'content-size': '1200px'
            },
            height: {
                '1/12': '8.333333%',
                '2/12': '16.666667%',
                '3/12': '25%',
                '4/12': '33.333333%',
                '5/12': '41.666667%',
                '6/12': '50%',
                '7/12': '58.333333%',
                '8/12': '66.666667%',
                '9/12': '75%',
                '10/12': '83.333333%',
                '11/12': '91.666667%'
            }

        },
        screens: {
            xxs: '200px',
            xs: '475px',
            xl: '1300px',
            '2xl': '1600px',
            '3xl': '1932px',
            ...defaultTheme.screens
        },
        fontSize: {
            xxs: '0.2rem',
            xs: '0.5rem',
            sm: '0.8rem',
            base: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem'
        }
    }
    /*
        Tailwind no longer supports the `safelist. Instead, use the @source inline('{-,}z-{10..90..10}'); syntax in CSS
        files to pre-generate any classes you'll need dynamically
    */
    // safelist: [
    //     /* supports layout and colors across responsive sizes) */
    //     ...Array.from(new Set([
    //         ...orderMap,
    //         ...colorMap,
    //         ...dimensionsMap,
    //         ...displayMap,
    //         ...contentSizesMap,
    //         ...gapMap,
    //         ...marginPaddingMap,
    //         ...autoMarginsMap,
    //         ...positionsMap,
    //         ...zIndexMap
    //     ])),
    //     /* Border Radius */
    //     'rounded',
    //     'rounded-sm',
    //     'rounded-md',
    //     'rounded-lg',
    //     'rounded-xl',
    //     'rounded-2xl',
    //     'rounded-3xl',
    //     'rounded-full',
    //     /* grid */
    //     'gap-02',
    //     'gap-03',
    //     'gap-04',
    //     'md:grid-cols-2',
    //     'md:grid-cols-3',
    //     'md:grid-cols-4',
    //     'grid-cols-2-fit',
    //     'grid-cols-3-fit',
    //     'grid-cols-4-fit',
    //     'translate-y-half',
    //     '-translate-y-half',
    //     'translate-x-half',
    //     '-translate-x-half'
    // ]
};
