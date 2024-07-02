/** @type {import('tailwindcss').Config} */

import Forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/layerchart/**/*.{svelte,js}'],
	theme: {
		extend: {}
	},
	plugins: [Forms]
};
