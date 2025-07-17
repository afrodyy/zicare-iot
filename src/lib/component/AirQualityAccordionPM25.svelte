<script>
	import { afterUpdate, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import {
		expandedAccordion,
		getLast30MinuteInterval,
		getLast60MinuteInterval,
		handleSweetAlert
	} from '$lib/index';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/themes/dark.css';
	import '$src/flatpickr-custom.css';
	import moment from 'moment';

	export let metric;
	export let selectedValue;
	export let selectedConcentrateValue = null;
	export let chartId;
	export let chartDataLength;
	export let selectedTimeRange = 'daily';
	export let separatorClass = 'bg-gt-color-cyan';
	export let updateMeasurementData = () => {};
	export let handleAccordion = () => {};

	let metricName = '';
	let metricNumber = '';

	let dateEl;
	$: dateRange = []; // To track the selected dates

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
				metric,
				adjustedStartDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
				adjustedEndDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
			);
		}
	}

	onMount(() => {
		$expandedAccordion = 'pm25';
	});

	afterUpdate(() => {
		metricName = metric.replace(/\d+/g, '');
		metricNumber = metric.match(/\d+/g);

		if (dateRange.length === 0) {
			// Initialize default date range
			const utcDates = [moment.utc().subtract(6, 'days'), moment.utc()];

			// Convert to local JavaScript Date objects
			dateRange = utcDates.map((date) => getLast30MinuteInterval(date).toDate());
		}

		if (dateEl) {
			// Initialize Flatpickr
			flatpickr(dateEl, {
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
					}

					// Handle date change logic
					changeDate(selectedDates);
				}
			});
		}

		if (selectedTimeRange === 'daily') {
			updateMeasurementData(
				metric,
				getLast60MinuteInterval(moment().subtract(1, 'months')).format('YYYY-MM-DDTHH:mm:ss.SSS') +
					'Z',
				getLast60MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
			);
		} else {
			updateMeasurementData(
				metric,
				getLast60MinuteInterval(moment().subtract(3, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') +
					'Z',
				getLast60MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
			);
		}
	});
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
				<div class="flex flex-col gap-1.5">
					<div class="flex flex-row gap-2 items-center">
						<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
						<span class="text-base font-normal text-gt-color-gray">{selectedValue}</span>
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
	{:else}
		<div in:fade={{ duration: 250 }} class="flex flex-col gap-3">
			<div class="flex flex-row w-full gap-4 items-center justify-between">
				<div
					on:click={() =>
						$expandedAccordion === metric ? ($expandedAccordion = '') : handleAccordion(metric)}
					role="presentation"
					class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
				>
					<span class="font-normal text-base text-gt-color-gray">Air Quality</span>

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

			<div class="flex flex-col gap-3">
				<!-- Chart Title -->
				<div class="flex flex-col gap-1">
					<div class="flex flex-row gap-2 py-1.5">
						<button
							on:click={() => (selectedTimeRange = 'daily')}
							type="button"
							class="w-full py-1.5 {selectedTimeRange === 'daily'
								? 'bg-gt-color-dark-3'
								: ''} hover:bg-gt-color-dark-3-transparent rounded-lg text-sm text-gt-color-gray ease-in-out duration-150"
							>Daily</button
						>
						<button
							on:click={() => (selectedTimeRange = 'hourly')}
							type="button"
							class="w-full py-1.5 {selectedTimeRange === 'hourly'
								? 'bg-gt-color-dark-3'
								: ''} hover:bg-gt-color-dark-3-transparent rounded-lg text-sm text-gt-color-gray ease-in-out duration-150"
							>Hourly</button
						>
					</div>
				</div>
				<!-- End of Chart Title -->

				{#if chartDataLength > 0}
					<div in:fade={{ y: 50, duration: 200 }} class="flex flex-col gap-3">
						<div
							id={chartId}
							class="relative w-full h-52 bg-gt-color-dark-3 bg-opacity-20 rounded-md"
						></div>
					</div>
				{:else}
					<div
						in:fade={{ y: 50, duration: 200 }}
						class="flex flex-row gap-2 items-center pl-3 mt-4"
					>
						<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
						<span class="font-medium text-sm text-gt-color-gray"
							>Tidak ada data untuk ditampilkan di grafik</span
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
