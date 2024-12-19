import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);
const tailwindColors = fullConfig.theme.colors;

export type ColorCodes = {
	50: string;
	100: string;
	200: string;
	300: string;
	400: string;
	500: string;
	600: string;
	700: string;
	800: string;
	900: string;
	950: string;
};
export type Color = { codes: ColorCodes; name: string; light: boolean };

const white: ColorCodes = {
	50: '#ffffff',
	100: '#ffffff',
	200: '#ffffff',
	300: '#ffffff',
	400: '#ffffff',
	500: '#ffffff',
	600: '#ffffff',
	700: '#ffffff',
	800: '#ffffff',
	900: '#ffffff',
	950: '#ffffff'
};

const black: ColorCodes = {
	50: '#000000',
	100: '#000000',
	200: '#000000',
	300: '#000000',
	400: '#000000',
	500: '#000000',
	600: '#000000',
	700: '#000000',
	800: '#000000',
	900: '#000000',
	950: '#000000'
};

const brown: ColorCodes = {
	50: tailwindColors.amber[900],
	100: tailwindColors.amber[900],
	200: tailwindColors.amber[900],
	300: tailwindColors.amber[900],
	400: tailwindColors.amber[900],
	500: tailwindColors.amber[900],
	600: tailwindColors.amber[900],
	700: tailwindColors.amber[900],
	800: tailwindColors.amber[900],
	900: tailwindColors.amber[900],
	950: tailwindColors.amber[900]
};

export const colors: Color[] = [
	{ name: 'White', codes: white, light: true },
	{ name: 'Pink', codes: tailwindColors.fuchsia, light: false },
	{ name: 'Red', codes: tailwindColors.red, light: false },
	{ name: 'Orange', codes: tailwindColors.orange, light: false },
	{ name: 'Yellow', codes: tailwindColors.yellow, light: false },
	{ name: 'Green', codes: tailwindColors.green, light: false },
	{ name: 'Blue', codes: tailwindColors.blue, light: false },
	{ name: 'Gray', codes: tailwindColors.gray, light: false },
	{ name: 'Brown', codes: brown, light: false },
	{ name: 'Black', codes: black, light: false }
];
