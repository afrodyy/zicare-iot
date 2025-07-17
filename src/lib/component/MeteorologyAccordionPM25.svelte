<script>
	import { expandedAccordion } from '$lib/index';
	import { afterUpdate } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/themes/dark.css'; // Load dark theme
	import '$src/flatpickr-custom.css'; // Custom styles
	import moment from 'moment';
	import { getLast30MinuteInterval, handleSweetAlert } from '$lib/index';
	import FilterAndExportDashboardChart from '$lib/component/FilterAndExportDashboardChart.svelte';

	export let meteorology;
	export let title;
	export let latestMeasurementMet;
	export let chartId;
	export let showChart;
	export let separatorClass;
	export let handleAccordion = () => {};
	export let setMeteorologyEl = () => {};
	export let updateMeasurementData = () => {};
	// export let exportData = () => {};

	let meteorologyEl;
	let dateEl;
	let flatpickrInstance;
	$: dateRange = []; // To track the selected dates

	$: if (dateEl && !flatpickrInstance) {
		// Initialize Flatpickr
		flatpickrInstance = flatpickr(dateEl, {
			mode: 'range',
			defaultDate: dateRange, // Set default date range
			dateFormat: 'd M y', // Match your placeholder
			onReady: (selectedDates, dateStr, instance) => {
				// Custom styling fix for Flatpickr (optional)
				instance.calendarContainer.children[0].children[1].children[0].children[0].style.webkitAppearance =
					'none';
			},
			onChange: (selectedDates, dateStr, instance) => {
				// If the first date is selected
				if (selectedDates.length === 1) {
					const firstDate = selectedDates[0];

					// Set maxDate for the second date to 6 days after the first date
					const maxDate = new Date(firstDate);
					maxDate.setDate(maxDate.getDate() + 6);

					// Update Flatpickr's maxDate dynamically
					instance.set('maxDate', maxDate);
				} else if (selectedDates.length === 2) {
					// Validate if the second date exceeds the range
					const [firstDate, secondDate] = selectedDates;
					const maxDate = new Date(firstDate);
					maxDate.setDate(maxDate.getDate() + 6);

					if (secondDate > maxDate) {
						// Reset the second date if it exceeds the limit
						handleSweetAlert(
							'error',
							'The second date cannot be more than 6 days from the first date.'
						);
						instance.clear(); // Clear the range selection
					}

					// Handle date change logic
					changeDate(selectedDates);
				}
			}
		});
	} else {
		flatpickrInstance = undefined;
	}

	$: if ($expandedAccordion === meteorology) setMeteorologyEl(meteorology, meteorologyEl);

	async function changeDate(date) {
		dateRange = date;

		if (dateRange.length === 2) {
			const startDate = moment(dateRange[0]);
			const endDate = moment(dateRange[1]);

			// Current time
			const now = moment();

			// Function to get the nearest past 30-minute interval
			const getLast30MinuteInterval = (date) => {
				const minutes = date.minutes();
				const roundedMinutes = minutes >= 30 ? 30 : 0; // Either 30 or 0
				return date.clone().minutes(roundedMinutes).seconds(0).milliseconds(0);
			};

			// Get the last 30-minute interval based on the current time
			const last30MinuteInterval = getLast30MinuteInterval(now);

			// Apply the calculated time to the selected date
			const adjustedStartDate = startDate
				.clone()
				.hours(last30MinuteInterval.hours())
				.minutes(last30MinuteInterval.minutes())
				.seconds(0)
				.milliseconds(0);
			const adjustedEndDate = endDate
				.clone()
				.hours(last30MinuteInterval.hours())
				.minutes(last30MinuteInterval.minutes())
				.seconds(0)
				.milliseconds(0);

			updateMeasurementData(
				meteorology,
				adjustedStartDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
				adjustedEndDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
			);
		}
	}

	afterUpdate(() => {
		if (dateRange.length === 0) {
			// Initialize default date range
			const utcDates = [moment.utc().subtract(6, 'days'), moment.utc()];

			// Convert to local JavaScript Date objects
			dateRange = utcDates.map((date) => getLast30MinuteInterval(date).toDate());
		}
	});
</script>

<div class="flex flex-col w-full gap-2 {meteorology === 'tekanan-udara' ? 'pb-3' : ''}">
	{#if meteorology === 'windrose'}
		<div class="flex flex-col w-full gap-2 pb-3">
			<!-- <div
				in:fly={{ y: 50, duration: 150 }}
				class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
			>
				<div class="flex w-full gap-3 rounded-lg">
					<FilterAndExportDashboardChart
						bind:dateEl
						exportFunction={exportData}
						exportDisabled={!showChart}
						aqms={meteorology}
					/>
				</div>
			</div> -->

			{#if showChart}
				<!-- Chart Container -->
				<div bind:this={meteorologyEl} in:fade={{ duration: 150 }} class="flex flex-col">
					<div id={chartId} class="w-full h-96"></div>
				</div>
				<!-- End of Chart Container -->
			{:else}
				<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3 mt-3">
					<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
					<span class="font-medium text-sm text-gt-color-gray"
						>Tidak ada data untuk ditampilkan di grafik</span
					>
				</div>
			{/if}
		</div>
	{:else}
		{#if $expandedAccordion !== meteorology}
			<div
				on:click={() =>
					$expandedAccordion === meteorology
						? ($expandedAccordion = '')
						: handleAccordion(meteorology)}
				role="presentation"
				class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
			>
				<!-- Kiri -->
				<div class="flex flex-row gap-4">
					<span class="w-28 font-normal text-base text-gt-color-gray">{title}</span>
					<div class="flex flex-col gap-1.5">
						<div class="flex flex-row gap-2 items-center">
							<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
							<span class="text-base font-normal text-gt-color-gray">{latestMeasurementMet}</span>
							{#if meteorology === 'arah-angin'}
								<div
									class="w-1.5 h-1.5 rounded-full border border-gt-color-gray self-start mt-1"
								></div>
							{:else if meteorology === 'curah-hujan'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">mm/h</span>
							{:else if meteorology === 'kecepatan-angin'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">m/s</span>
							{:else if meteorology === 'kelembaban'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">%</span>
							{:else if meteorology === 'solar-radius'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
									>watt/m<sup>2</sup></span
								>
							{:else if meteorology === 'suhu'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">°C</span>
							{:else if meteorology === 'tekanan-udara'}
								<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">mBar</span>
							{/if}
						</div>
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

		{#if $expandedAccordion === meteorology}
			<div
				in:fly={{ y: 50, duration: 150 }}
				class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
			>
				<!-- Atas -->
				<div class="flex flex-row w-full gap-4 items-center justify-between">
					<div
						on:click={() =>
							$expandedAccordion === meteorology
								? ($expandedAccordion = '')
								: handleAccordion(meteorology)}
						role="presentation"
						class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
					>
						<span class="font-normal text-base text-gt-color-gray">{title}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5 text-gt-color-gray {$expandedAccordion === meteorology
								? 'rotate-180'
								: ''} ease-in-out duration-150"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					</div>

					<!-- Pin Icon -->
					<!-- <div
					class="p-1 rounded-md bg-gt-color-dark bg-opacity-80 border border-gt-color-dark-3-transparent"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9.25 1.375L6.25 4.375L3.25 5.5L2.125 6.625L7.375 11.875L8.5 10.75L9.625 7.75L12.625 4.75M4.75 9.25L1.375 12.625M8.875 1L13 5.125"
							stroke="#F9FAFB"
							stroke-width="1"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div> -->
					<!-- End of Pin Icon -->
				</div>

				<!-- Bawah -->
				<!-- {#if showChart} -->
				<!-- <div class="flex w-full gap-3 rounded-lg">
					<FilterAndExportDashboardChart
						bind:dateEl
						exportFunction={exportData}
						exportDisabled={!showChart}
						aqms={meteorology}
					/>
				</div> -->
				<!-- {/if} -->
			</div>

			{#if showChart}
				<!-- Chart Container -->
				<div bind:this={meteorologyEl} in:fade={{ duration: 150 }} class="flex flex-col gap-3">
					<div id={chartId} class="w-full h-52"></div>
				</div>
				<!-- End of Chart Container -->
			{:else}
				<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
					<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
					<span class="font-medium text-sm text-gt-color-gray"
						>Tidak ada data untuk ditampilkan di grafik</span
					>
				</div>
			{/if}
		{/if}
	{/if}
</div>

{#if meteorology !== 'windrose' && meteorology !== 'tekanan-udara'}
	<hr class="border-gt-color-dark-3-transparent" />
{/if}
