<script>
	export let strokeWidth = 1.5;
	export let customClass = 'size-6';
	export let condition = false;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width={strokeWidth}
	stroke="currentColor"
	class="{customClass} {condition ? 'rotate-180' : ''} duration-150"
>
	<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
