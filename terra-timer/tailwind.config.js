/** @type {import('tailwindcss').Config} */

import Forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/layerchart/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				'surface-100': 'rgb(50 50 50 / <alpha-value>)',
				'surface-200': 'rgb(100 100 100 / <alpha-value>)',
				'surface-300': 'rgb(200 200 200 / <alpha-value>)',
				'surface-content': 'rgb(255 255 255 / <alpha-value>)',
				danger: 'rgb(255 70 70 / <alpha-value>)'
			}
		}
	},
	plugins: [Forms]
};
