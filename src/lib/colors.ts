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
	50: '#fff',
	100: '#fff',
	200: '#fff',
	300: '#fff',
	400: '#fff',
	500: '#fff',
	600: '#fff',
	700: '#fff',
	800: '#fff',
	900: '#fff',
	950: '#fff'
};

const black: ColorCodes = {
	50: '#000',
	100: '#000',
	200: '#000',
	300: '#000',
	400: '#000',
	500: '#000',
	600: '#000',
	700: '#000',
	800: '#000',
	900: '#000',
	950: '#000'
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
