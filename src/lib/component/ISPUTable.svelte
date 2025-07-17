<script>
	import { goto } from '$app/navigation';
	import moment from 'moment';
	import { fade } from 'svelte/transition';

	export let mainContentHeight, showConcentrate, ispus, paginatedIspus, currentPage, entriesShown;

	function generateQueryURL(ispu) {
		const query = new URLSearchParams({
			id_stasiun: ispu.id_stasiun,
			tipe_stasiun: ispu.tipe_stasiun,
			waktu: ispu.waktu
		}).toString();
		return `/data-ispu/validate?${query}`;
	}
</script>

<div
	class="w-full max-w-full overflow-y-auto scrollbar rounded-lg mb-3"
	style="height: {mainContentHeight}px;"
>
	<table class="w-full max-w-full overflow-y-auto scrollbar text-left text-gt-color-gray">
		<thead>
			<tr>
				<th
					class="sticky top-0 w-14 bg-gt-color-dark-2 p-3 rounded-l-lg font-medium text-center text-sm"
					>No.</th
				>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm">Waktu</th>
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">PM10</th
				>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>PM10μg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
					>PM2.5</th
				>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>PM2.5μg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">SO2</th>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>SO2μg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">CO</th>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>COμg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">O3</th>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>O3μg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">NO2</th>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>NO2μg</th
					>
				{/if}
				<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm">HC</th>
				{#if showConcentrate}
					<th class="sticky top-0 w-28 bg-gt-color-dark-2 p-3 font-medium text-right text-sm"
						>HCμg</th
					>
				{/if}
				<th class="sticky top-0 w-36 bg-gt-color-dark-2 p-3 rounded-r-lg font-medium text-sm"
					>Validasi</th
				>
			</tr>
		</thead>
		<tbody>
			{#if ispus.length > 0}
				{#each paginatedIspus as ispu, index}
					<tr class="border-b border-gt-color-dark-3-transparent">
						<td class="p-3 font-light text-center text-sm"
							>{index + ((currentPage - 1) * entriesShown + 1)}.</td
						>
						<td class="p-3 font-light text-sm"
							>{moment(ispu.waktu).format('YYYY-MM-DD HH:mm:ss')}</td
						>
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.pm10}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.pm10_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-primary">{ispu.pm25}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.pm25_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.so2}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.so2_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.co}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.co_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.o3}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.o3_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.no2}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.no2_val}</td
							>
						{/if}
						<td class="p-3 font-light text-right text-sm text-gt-color-success-5">{ispu.hc}</td>
						{#if showConcentrate}
							<td class="p-3 font-light text-right text-sm text-gt-color-success-5"
								>{ispu.hc_val}</td
							>
						{/if}
						<td class="p-3">
							{#if ispu.is_filter === 0}
								<span
									in:fade={{ duration: 150 }}
									class="bg-gt-color-danger font-light text-sm text-white py-0.5 px-1.5 rounded-md"
									>No</span
								>
							{:else}
								<div class="flex flex-row gap-1 items-center">
									<span
										in:fade={{ duration: 150 }}
										class="bg-gt-color-success-7 font-light text-sm text-white py-0.5 px-1.5 rounded-md"
										>Yes</span
									>
									<a
										in:fade={{ duration: 150 }}
										href={generateQueryURL(ispu)}
										on:click={(e) => {
											e.preventDefault(); // Prevent default navigation
											goto(generateQueryURL(ispu)); // Use `goto` for navigation
										}}
										class="flex flex-row w-fit gap-1 py-0.5 px-1.5 bg-gt-color-primary hover:bg-gt-color-primary-hover rounded-md items-center"
									>
										<span class=" text-sm text-white">Validasi</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
											/>
										</svg>
									</a>
								</div>
							{/if}
						</td>
					</tr>
				{/each}
			{:else}
				<tr class="border-b border-gt-color-dark-3-transparent">
					{#if showConcentrate}
						<td colspan="16" class="p-3.5 font-light text-sm text-gt-color-gray text-center"
							>Data tidak ditemukan</td
						>
					{:else}
						<td colspan="10" class="p-3.5 font-light text-sm text-gt-color-gray text-center"
							>Data tidak ditemukan</td
						>
					{/if}
				</tr>
			{/if}
		</tbody>
	</table>
</div>
