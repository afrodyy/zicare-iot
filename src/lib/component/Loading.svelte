<script>
	import { fade } from 'svelte/transition';
</script>

<div
	transition:fade={{ duration: 200 }}
	class="absolute w-full h-full z-50 bg-gt-color-dark/10 bg-blend-overlay flex justify-center items-center"
>
	<svg
		width="1em"
		height="1em"
		stroke-width="0"
		class="animate-spin h-10 w-10"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		><path
			opacity="0.2"
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
			fill="currentColor"
		></path><path
			d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z"
			fill="currentColor"
		></path><path
			d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
			fill="currentColor"
		></path></svg
	>
</div>
