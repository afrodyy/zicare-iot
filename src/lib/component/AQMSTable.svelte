<script>
	import { isLoading } from '$lib/index';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import moment from 'moment';

	export let totalItems, paginatedAqmses, currentPage, entriesShown, iconCheck, iconDanger;

	let table;
	let thCount;

	onMount(() => {
		thCount = table.querySelectorAll('thead tr th').length;
	});
</script>

<div class="max-w-full overflow-auto scrollbar">
	<table bind:this={table} class="min-w-full text-left">
		<thead>
			<tr>
				<th
					class="sticky top-0 w-14 p-3 bg-gt-color-dark-2 rounded-l-lg font-medium text-sm text-gt-color-gray text-center"
					>No.</th
				>
				<th
					class="sticky top-0 p-3 bg-gt-color-dark-2 font-medium text-sm text-gt-color-gray text-left text-nowrap"
					>Waktu</th
				>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">PM10</th>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">PM2.5</th>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">SO2</th>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">CO</th>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">O3</th>
				<th class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 font-medium text-sm text-end">NO2</th>
				<th
					class="sticky top-0 w-28 p-3 bg-gt-color-dark-2 rounded-r-lg font-medium text-sm text-end"
					>HC</th
				>
			</tr>
		</thead>
		<tbody>
			{#if totalItems > 0}
				{#each paginatedAqmses as aqms, index}
					<tr class="border-b border-gt-color-dark-3-transparent">
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
							>{index + ((currentPage - 1) * entriesShown + 1)}.</td
						>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-gt-color-gray text-nowrap"
						>
							{moment(aqms.waktu).format('YYYY-MM-DD HH:mm:ss')}
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_pm10 === '11'}
									{aqms.pm10}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_pm25 === '11'}
									{aqms.pm25}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_so2 === '11'}
									{aqms.so2}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_co === '11'}
									{aqms.co}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_o3 === '11'}
									{aqms.o3}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_no2 === '11'}
									{aqms.no2}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-center text-gt-color-gray"
						>
							<div class="flex flex-row justify-end items-center">
								{#if aqms.stat_hc === '11'}
									{aqms.hc}
									<div class="ml-3">{@html iconCheck}</div>
								{:else}
									<div class="ml-3">{@html iconDanger}</div>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			{:else}
				<tr class="border-b border-gt-color-dark-3-transparent">
					<td
						in:fade={{ duration: 200 }}
						colspan={thCount}
						class="p-3.5 font-light text-sm text-gt-color-gray text-center">Data tidak ditemukan</td
					>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
