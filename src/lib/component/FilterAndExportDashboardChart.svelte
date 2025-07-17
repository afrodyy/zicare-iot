<script>
	import { fade } from 'svelte/transition';

	export let dateEl;
	export let exportFunction = () => {};
	export let exportDisabled;
	export let aqms;

	let temporary = true;
</script>

<div class="flex flex-row w-full gap-1.5 items-center">
	<!-- Date Picker -->
	<div
		class="flex flex-row flex-1 gap-2 p-1 rounded-md border border-gt-color-dark-3-transparent bg-gt-color-dark-transparent hover:bg-slate-800 items-center focus-within:ring-1 focus-within:ring-indigo-300 focus-within:shadow focus-within:shadow-indigo-300/25 ease-in-out duration-150"
	>
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M4.0625 1.25V2.9375M11.9375 1.25V2.9375M1.25 13.0625V4.625C1.25 3.69302 2.00552 2.9375 2.9375 2.9375H13.0625C13.9945 2.9375 14.75 3.69302 14.75 4.625V13.0625M1.25 13.0625C1.25 13.9945 2.00552 14.75 2.9375 14.75H13.0625C13.9945 14.75 14.75 13.9945 14.75 13.0625M1.25 13.0625V7.4375C1.25 6.50552 2.00552 5.75 2.9375 5.75H13.0625C13.9945 5.75 14.75 6.50552 14.75 7.4375V13.0625"
				stroke="#E5E7EB"
				stroke-width="1.125"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>

		<!-- Flatpickr Input -->
		<input
			bind:this={dateEl}
			type="text"
			id="dateEl"
			placeholder="22 Feb 24 - 22 Feb 24"
			class="flatpickr-input w-full bg-transparent font-normal text-gt-color-gray text-xs text-nowrap focus:outline-none"
		/>
	</div>
	<!-- End of Date Picker -->

	<!-- Download Button -->
	{#if !temporary}
		<button
			in:fade={{ duration: 200 }}
			on:click={() => {
				if (!exportDisabled) {
					exportFunction(aqms);
				}
			}}
			type="button"
			class="flex flex-row gap-2 p-1 rounded-md {!exportDisabled
				? 'bg-gt-color-dark-transparent hover:bg-slate-800'
				: 'bg-gt-color-dark-3-transparent cursor-default'}  border border-gt-color-dark-3-transparent items-center ease-in-out duration-150"
		>
			<span
				class="font-normal text-xs {!exportDisabled
					? 'text-gt-color-gray'
					: 'text-gt-color-gray-3'} text-nowrap">Unduh Data</span
			>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-4 {!exportDisabled ? 'text-gt-color-gray' : 'text-gt-color-gray-3'}"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</button>
	{/if}
	<!-- End of Download Button -->
</div>
