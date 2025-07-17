<script>
	import { onMount } from 'svelte';

	// based on suggestions from:
	// Inclusive Components by Heydon Pickering https://inclusive-components.design/collapsible-sections/
	export let headerText;
	export let headerTextClose;
	let expanded = true;
	onMount(() => {
		setTimeout(() => {
			expanded = false;
		}, 1000);
	});
</script>

<div class=" mb-3 collapsible">
	<h6 class="mb-0 text-white">
		<button
			aria-expanded={expanded}
			class="text-white relative flex justify-between items-center w-full p-1 font-semibold text-left transition-all ease-in cursor-pointer rounded-t-1 group text-dark-500"
			on:click={() => (expanded = !expanded)}
		>
			<span>
				{@html expanded ? headerTextClose : headerText}
			</span>
			<div class="flex justify-center items-center">
				<span class="{expanded ? 'rotate-180' : ''} m-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="M20 8.25L12.5 15.75L5 8.25"
							stroke="#E5E7EB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<span class="{!expanded ? 'hidden' : ''} rounded border p-2 m-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
					>
						<path
							d="M11.25 3.375L8.25 6.375L5.25 7.5L4.125 8.625L9.375 13.875L10.5 12.75L11.625 9.75L14.625 6.75M6.75 11.25L3.375 14.625M10.875 3L15 7.125"
							stroke="#F9FAFB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</div>
		</button>
	</h6>
	<div
		class="{expanded
			? 'flex-col'
			: 'hidden'} overscroll-contain h-80 transition-all duration-300 ease-in-out"
	>
		<slot></slot>
	</div>
</div>
