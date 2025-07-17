/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/sweetalert2/src/sweetalert2.js'],
	theme: {
		extend: {
			colors: {
				'gt-color-primary': '#3758F9',
				'gt-color-primary-transparent': '#3758F9CC',
				'gt-color-primary-hover': '#324FE1',
				'gt-color-success-5': '#B4E87B',
				'gt-color-success-7': '#60B527',
				'gt-color-warning': '#FBBF24',
				'gt-color-danger': '#FF3932',
				'gt-color-bluelight-2': '#8099EC',
				'gt-color-dark': '#111928',
				'gt-color-dark-transparent': '#111928CC',
				'gt-color-dark-2': '#1F2A37',
				'gt-color-dark-2-transparent': '#1F2A37CC',
				'gt-color-dark-3': '#374151',
				'gt-color-dark-3-transparent': '#374151CC',
				'gt-color-dark-4': '#4B5563',
				'gt-color-dark-5': '#1D2534',
				'gt-color-dark-6': '#6B7280',
				'gt-color-gray': '#F9FAFB',
				'gt-color-gray-3': '#E5E7EB',
				'gt-color-cyan': '#2F3949'
			}
		}
	},
	plugins: []
};
