<script>
	import { afterUpdate } from 'svelte';

	export let customClass;
	export let direction = null;

	afterUpdate(() => {
		if (direction) {
			if (direction >= 0 && direction <= 45) {
				customClass += ' rotate-[225deg]';
			} else if (direction >= 45 && direction <= 90) {
				customClass += ' rotate-[270deg]';
			} else if (direction >= 90 && direction <= 135) {
				customClass += ' rotate-[315deg]';
			} else if (direction >= 135 && direction <= 180) {
				customClass += '';
			} else if (direction >= 180 && direction <= 225) {
				customClass += ' rotate-[45deg]';
			} else if (direction >= 225 && direction <= 270) {
				customClass += ' rotate-[90deg]';
			} else if (direction >= 270 && direction <= 315) {
				customClass += ' rotate-[135deg]';
			} else if (direction >= 315 && direction <= 360) {
				customClass += ' rotate-[180deg]';
			}
		}
	});
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" class={customClass}>
	<path
		d="M11.4705 3.50261C11.7621 3.37572 11.9078 3.31227 11.9973 3.34014C12.0749 3.36429 12.1356 3.42433 12.1601 3.50101C12.1884 3.58946 12.1244 3.73373 11.9965 4.02225L8.36543 12.2105C8.24993 12.4709 8.19218 12.6012 8.11144 12.641C8.04133 12.6756 7.95884 12.6756 7.88872 12.641C7.80798 12.6012 7.75023 12.4709 7.63473 12.2105L4.00367 4.02225C3.87572 3.73373 3.81174 3.58946 3.84002 3.50101C3.86454 3.42433 3.92531 3.36429 4.00287 3.34014C4.09233 3.31227 4.23811 3.37572 4.52968 3.5026L7.83941 4.94295C7.8986 4.9687 7.92819 4.98158 7.95893 4.98667C7.98618 4.99118 8.01399 4.99118 8.04123 4.98667C8.07197 4.98158 8.10157 4.9687 8.16075 4.94295L11.4705 3.50261Z"
		fill="#879CB2"
		stroke="#879CB2"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
