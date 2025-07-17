<script>
	import { goto } from '$app/navigation';
	import Pagination from '$lib/component/Pagination.svelte';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import {
		isPm25App,
		isLoading,
		mainContainerHeight,
		headerHeight,
		componentsGap,
		handleSweetAlert
	} from '$lib/index';
	import { fade, fly } from 'svelte/transition';
	import AqmsTablePm25 from '$lib/component/AQMSTablePM25.svelte';
	import moment from 'moment';

	let accessToken = '';
	let userRole = '';

	$: startDate = '';
	$: endDate = '';

	$: formattedStartDate = '';
	$: formattedEndDate = '';

	$: masterStations = [];
	$: selectedMasterStation = {};

	$: aqmses = [];
	$: unpaginatedAqms = [];
	$: paginatedAqmses = [];
	$: masterRooms = masterStations;

	let containerContentHeight;
	let resizeObserver;
	let entriesShownOptions = [10, 25, 50, 75, 100];

	$: currentPage = 1;
	$: timeInterval = '30 Minutes';
	$: entriesShown = 25;
	$: entriesShownOpen = false;
	$: hasNextPage = false;
	$: hasPreviousPage = false;
	$: totalItems = 0;
	$: totalPages = 0;
	$: getPages = [];

	$: validation = {};

	let metrics = ['pm10', 'pm25', 'so2', 'co', 'o3', 'no2', 'hc'];

	$: chartInstance = null;
	$: chartData = {};
	$: {
		metrics.forEach((metric) => {
			chartData[metric] = [];
		});
	}

	let masterRooms = [];

	const getMasterStation = async () => {
		const tipe_station = $isPm25App ? 'dlh_dki_pm25' : null;

		try {
			const response = await axios.get('/api/master/station', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			masterStations = await response.data.data.station;
			masterStations = masterStations.filter((station) => {
				return station.tipe_station === 'lowcost' || station.tipe_station === 'dlh_dki_pm25';
			});
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang');
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	const getAQMS1Sec = async () => {
		$isLoading = true;

		try {
			const response = await axios.get('/api/aqms/measurementsec', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedMasterStation.id,
					tipe_stasiun: selectedMasterStation.type,
					date_from: formattedStartDate,
					date_to: formattedEndDate,
					page: currentPage,
					size: entriesShown
				}
			});

			aqmses = response.data.data.aqms_1_sec; // Load all data
			totalItems = response.data.data.count; // Total items from the response
			// currentPage = 1;

			if (aqmses.length > 0) {
				const matchingStation = masterStations.find((station) => {
					return station.id_station === selectedMasterStation.id;
				});

				tableFields = matchingStation.parameters.split(',');
			}

			updatePaginatedData(); // Paginate data
			fetchPages(); // Update pages

			$isLoading = false;
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang');
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	const getAQMS1Min = async () => {
		$isLoading = true;

		try {
			const response = await axios.get('/api/aqms/measurement1', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedMasterStation.id,
					tipe_stasiun: selectedMasterStation.type,
					date_from: formattedStartDate,
					date_to: formattedEndDate,
					page: currentPage,
					size: entriesShown
				}
			});

			aqmses = response.data.data.aqms_1_min; // Load all data
			totalItems = response.data.data.count; // Total items from the response

			if (aqmses.length > 0) {
				const matchingStation = masterStations.find((station) => {
					return station.id_station === selectedMasterStation.id;
				});

				tableFields = matchingStation.parameters.split(',');
			}

			updatePaginatedData(); // Paginate data
			fetchPages(); // Update pages

			$isLoading = false;
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang');
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	const getAQMS5Min = async () => {
		$isLoading = true;

		try {
			const response = await axios.get('/api/aqms/measurement5', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedMasterStation.id,
					tipe_stasiun: selectedMasterStation.type,
					date_from: formattedStartDate,
					date_to: formattedEndDate,
					page: currentPage,
					size: entriesShown
				}
			});

			aqmses = response.data.data.aqms_5_min; // Load all data
			totalItems = response.data.data.count; // Total items from the response
			// currentPage = 1;

			if (aqmses.length > 0) {
				const matchingStation = masterStations.find((station) => {
					return station.id_station === selectedMasterStation.id;
				});

				tableFields = matchingStation.parameters.split(',');
			}

			updatePaginatedData(); // Paginate data
			fetchPages(); // Update pages

			$isLoading = false;
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang');
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	const getAQMS30Min = async (paginate = true) => {
		$isLoading = true;
		metrics.forEach((metric) => {
			chartData[metric] = [];
		});

		let page = null;
		let size = null;

		if (paginate) {
			page = currentPage;
			size = entriesShown;
		}

		try {
			const response = await axios.get('/api/aqms/measurement30min', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedMasterStation.id,
					tipe_stasiun: selectedMasterStation.type,
					date_from: formattedStartDate,
					date_to: formattedEndDate,
					page,
					size
				}
			});

			if (paginate) {
				aqmses = await response.data.data.aqms_30_min; // Load all data
				totalItems = await response.data.data.count; // Total items from the response

				if (aqmses.length > 0) {
					const matchingStation = masterStations.find((station) => {
						return station.id_station === selectedMasterStation.id;
					});

					tableFields = matchingStation.parameters.split(',');
				}

				updatePaginatedData(); // Paginate data
				fetchPages(); // Update pages
			} else {
				unpaginatedAqms = await response.data.data.aqms_30_min;

				if (response.data.data.count > 0) {
					if (chartInstance) {
						chartInstance.dispose();
						chartInstance = null;
					}

					await generateChartData(unpaginatedAqms);

					const chartdiv = document.getElementById('chartdiv');

					if (chartdiv) defMeteorologyTrendLineChart();
				}
			}

			$isLoading = false;
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang');
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	function getISODateWithStartOfDay(date) {
		// Set the time to the start of the day
		date.setUTCHours(0, 0, 0, 0);
		return date.toISOString();
	}

	function setDefaultDate() {
		// Get today's date
		const today = new Date();

		// Get the date 6 days ago
		const sixDaysAgo = new Date();
		sixDaysAgo.setUTCDate(today.getUTCDate() - 6);

		// Format the dates
		formattedStartDate = getISODateWithStartOfDay(sixDaysAgo);
		formattedEndDate = getISODateWithStartOfDay(today);
	}

	async function goToPage(page) {
		$isLoading = true;
		currentPage = page;

		await handleTimeInterval(timeInterval);
	}

	function updatePaginatedData() {
		const start = (currentPage - 1) * entriesShown;
		const end = start + entriesShown;
		paginatedAqmses = aqmses;
	}

	function fetchPages() {
		// Calculate the total number of pages
		totalPages = Math.ceil(totalItems / entriesShown);

		if (totalPages <= 5) {
			getPages = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			if (currentPage <= 3) {
				getPages = [1, 2, 3, '...', totalPages];
			} else if (currentPage >= totalPages - 2) {
				getPages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
			} else {
				getPages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
			}
		}

		// Set navigation buttons
		hasPreviousPage = currentPage > 1;
		hasNextPage = currentPage < totalPages;
		$isLoading = false;
	}

	async function handleTimeInterval(interval) {
		if (startDate === '') {
			validation.field = 'startDate';
			validation.message = 'Pilih tanggal mulai terlebih dahulu!';
			handleSweetAlert('error', validation.message);
		} else if (endDate === '') {
			validation.field = 'endDate';
			validation.message = 'Pilih tanggal akhir terlebih dahulu!';
			handleSweetAlert('error', validation.message);
		} else {
			timeInterval = interval;

			if (timeInterval === '1 Second') {
				await getAQMS1Sec();
			} else if (timeInterval === '1 Minute') {
				await getAQMS1Min();
				// await getAQMS1Min(false);
			} else if (timeInterval === '5 Minutes') {
				await getAQMS5Min();
				// await getAQMS5Min(false);
			} else if (timeInterval === '30 Minutes') {
				await getAQMS30Min();
				await getAQMS30Min(false);
			}
		}

		timeIntervalOpen = false;
	}

	async function handleEntriesShown(entries) {
		if (paginatedAqmses.length > 0) {
			entriesShown = entries;
			currentPage = 1;

			if (timeInterval === '1 Second') {
				await getAQMS1Sec();
			} else if (timeInterval === '1 Minute') {
				await getAQMS1Min();
				// await getAQMS1Min(false);
			} else if (timeInterval === '5 Minutes') {
				await getAQMS5Min();
				// await getAQMS5Min(false);
			} else if (timeInterval === '30 Minutes') {
				await getAQMS30Min();
				await getAQMS30Min(false);
			}
		} else {
			entriesShown = entries;
		}
	}

	function updateContainerContentHeight() {
		let mainContentHeight;

		mainContainerHeight.subscribe((value) => {
			mainContentHeight = value - $headerHeight - $componentsGap * 2 - 4;
		});

		return mainContentHeight;
	}

	function generateDateTime(startDate, endDate, intervalMinutes) {
		const dateTime = [];
		const start = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
		const end = moment(endDate, 'YYYY-MM-DD HH:mm:ss');

		while (start <= end) {
			dateTime.push(start.format('YYYY-MM-DD HH:mm:ss'));
			start.add(intervalMinutes, 'minutes');
		}

		return dateTime;
	}

	async function generateChartData(rawDatas) {
		const datas = rawDatas;
		const startDateTime = moment(datas.at(-1).waktu).format('YYYY-MM-DD HH:mm:ss');
		const endDateTime = moment(datas.at(0).waktu).format('YYYY-MM-DD HH:mm:ss');
		const timeInterval = 30;
		const dateTimeIntervals = generateDateTime(startDateTime, endDateTime, timeInterval);

		for (let i = 0; i < dateTimeIntervals.length; i++) {
			const matchingDateTime = await datas.find((item) => {
				return moment(item.waktu).format('YYYY-MM-DD HH:mm:ss') === dateTimeIntervals[i] || null;
			});

			if (matchingDateTime) {
				const date = new Date(matchingDateTime.waktu);

				if ($isPm25App) {
					chartData['pm25'].push({
						date: date.getTime(),
						value: parseFloat(matchingDateTime['pm25'])
					});
				} else {
					metrics.forEach((metric) =>
						chartData[metric].push({
							date: date.getTime(),
							value: parseFloat(matchingDateTime[metric])
						})
					);
				}
			} else if (matchingDateTime === undefined) {
				const utcDate =
					moment(dateTimeIntervals[i]).subtract('7', 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS') +
					'Z';
				const date = new Date(utcDate);

				if ($isPm25App) {
					chartData['pm25'].push({
						date: date.getTime(),
						value: 0
					});
				} else {
					metrics.forEach((metric) =>
						chartData[metric].push({
							date: date.getTime(),
							value: 0
						})
					);
				}
			}
		}
	}

	async function getMasterRoom() {
		try {
			const response = await fetch('/master-room.json');

			if (!response.ok) {
				throw Error('Master room not found');
			}

			masterRooms = await response.json();
			totalItems = masterRooms.length;
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		resizeObserver = new ResizeObserver(() => {
			containerContentHeight = updateContainerContentHeight();
		});

		resizeObserver.observe(document.querySelector('.main-content'));

		accessToken = localStorage.getItem('accessToken');
		userRole = localStorage.getItem('role');
		setDefaultDate();

		if (accessToken !== '' && accessToken !== null) {
			if (userRole.includes('admin-pm25')) {
				$isPm25App = true;
			}

			await getMasterStation();
			await getMasterRoom();
		} else {
			goto('/');
		}

		if (!$isPm25App) {
			timeOptions = ['1 Second', '1 Minute', '30 Minutes'];
		}
	});
</script>

<svelte:head>
	<title>ZiCare Hospital Air Quality Monitoring System | Master Room</title>
</svelte:head>

<!-- Main Content -->
<div
	in:fade={{ duration: 200 }}
	class="main-content flex flex-col gap-4 p-4 pb-3 bg-gt-color-dark-transparent bg-opacity-80 border border-gt-color-dark-3 rounded-lg shadow shadow-black overflow-auto"
	style="height: {containerContentHeight}px;"
>
	<!-- Table Title -->
	<div class="flex items-center justify-between">
		<div class="flex flex-row gap-2 font-medium text-lg items-center">Master Room</div>

		<div class="flex flex-row gap-4 items-center">
			<!-- Entries Shown -->
			<button
				on:click={() => (entriesShownOpen = !entriesShownOpen)}
				type="button"
				class="relative flex rounded-lg border-gt-color-dark-3 border focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150 items-center"
			>
				<div class="p-2 bg-gt-color-dark-2 rounded-s-lg items-center">
					<span class="font-normal text-sm text-gt-color-gray">Entries Shown</span>
				</div>

				<div
					class="flex flex-row gap-4 p-2 bg-gt-color-dark bg-opacity-80 rounded-e-lg items-center"
				>
					<span class="font-normal text-sm text-gt-color-gray">{entriesShown}</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4 text-gt-color-gray"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>

				{#if entriesShownOpen}
					<div
						transition:fly={{ y: 25, duration: 150 }}
						class="absolute top-10 right-0 z-10 w-16 origin-top-right rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
						tabindex="-1"
					>
						<div class="py-1" role="none">
							{#each entriesShownOptions as entriesShownOption, index}
								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(entriesShownOption)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown ===
									entriesShownOption
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="entries-shown-{index + 1}">{entriesShownOption}</a
								>
							{/each}
						</div>
					</div>
				{/if}
			</button>
			<!-- Entries Shown -->
		</div>
	</div>
	<!-- End of Table Title -->

	<!-- Data AQMS Table -->
	<AqmsTablePm25 {totalItems} bind:masterRooms {currentPage} {entriesShown} />
	<!-- End of Data AQMS Table -->

	<!-- <div class="mt-auto flex flex-col gap-3">
		<Pagination
			isLoading={$isLoading}
			datas={paginatedAqmses}
			limit={entriesShown}
			{totalItems}
			{currentPage}
			{hasNextPage}
			{hasPreviousPage}
			{getPages}
			{goToPage}
		/>
	</div> -->
</div>
<!-- Main Content -->
