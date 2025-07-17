<script>
	import { fade, fly } from 'svelte/transition';
	import { showComparisonStation, expandedAccordion } from '$lib/index';

	export let metric;
	export let selectedValue;
	export let comparisonValue;
	export let handleAccordion = () => {};
	export let chartId;
	export let chartDataLength;
	export let separatorClass;
</script>

<div class="flex flex-col w-full gap-2 {metric === 'hc' ? 'pb-3' : ''}">
	{#if $expandedAccordion !== metric}
		<div
			on:click={() =>
				$expandedAccordion === metric ? ($expandedAccordion = '') : handleAccordion(metric)}
			in:fly={{ y: -50, duration: 150 }}
			role="presentation"
			class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
		>
			<!-- Kiri -->
			<div class="flex flex-row gap-4">
				<span class="w-12 font-normal text-base text-gt-color-gray">{metric.toUpperCase()}</span>

				<div class="flex flex-col gap-1.5">
					<div class="flex flex-row gap-2 items-center">
						<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
						<span class="text-base font-normal text-gt-color-gray">{selectedValue}</span>

						<span class="text-xs font-normal text-gt-color-gray">µg/Nm3</span>
					</div>

					{#if $showComparisonStation}
						<div class="flex flex-row gap-2 items-center">
							<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
							<span class="text-base font-normal text-gt-color-gray">{comparisonValue}</span>

							<span class="text-xs font-normal text-gt-color-gray">µg/Nm3</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Kanan -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5 text-gt-color-gray"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		</div>
	{/if}

	{#if $expandedAccordion === metric}
		<div
			in:fly={{ y: 50, duration: 150 }}
			class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
		>
			<!-- Atas -->
			<div class="flex flex-row w-full gap-4 items-center justify-between">
				<div
					on:click={() =>
						$expandedAccordion === metric ? ($expandedAccordion = '') : handleAccordion(metric)}
					role="presentation"
					class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
				>
					<span class="font-normal text-base text-gt-color-gray">{metric.toUpperCase()}</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gt-color-gray rotate-180"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			{#if chartDataLength > 0}
				<div class="flex flex-row gap-2 items-center pl-3">
					<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
					<span class="font-medium text-sm text-gt-color-gray">Chart</span>
				</div>

				<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
					<div id={chartId} class="relative w-full h-52 bg-gt-color-gray bg-opacity-20 rounded-md">
						<div
							class="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
							style="background: linear-gradient(to bottom, #1E1E1F, #D43B3B, #DDAD31, #159BC3, #2F9E5E);"
						></div>
					</div>
				</div>
			{:else}
				<div in:fade={{ y: 50, duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
					<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
					<span class="font-medium text-sm text-gt-color-gray"
						>Tidak ada data untuk ditampilkan di grafik</span
					>
				</div>
			{/if}
		</div>
	{/if}
</div>
