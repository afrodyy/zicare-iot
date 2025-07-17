<script>
	import { fade, fly } from 'svelte/transition';
	import { isPm25App, formMode, showStationModal, searchQuery, handleSweetAlert } from '$lib/index';
	import { afterUpdate, onMount } from 'svelte';
	import axios from 'axios';

	export let selectedStation;
	export let allStations;

	$: showStationTypes = false;
	let stationTypes = [
		{
			code: 'lowcost',
			display: 'Lowcost'
		},
		{
			code: 'reference',
			display: 'Reference'
		},
		{
			code: 'lab',
			display: 'Lab'
		},
		{
			code: 'dlh_dki_pm25',
			display: 'PM2.5'
		}
	];
	$: selectedStationType = {};

	$: showStations = false;
	$: filteredStations = [];
	$: selectedParentStation = {};

	$: showProvinces = false;
	$: provinces = [];
	$: filteredProvinces = provinces;
	$: selectedProvince = {};

	$: showCities = false;
	$: cities = [];
	$: filteredCities = [];
	$: selectedCity = {};

	$: provinceCityQuery = '';

	let id_station = '';
	let tipe_station = '';
	let nama = '';
	let lat = '';
	let lon = '';
	let alamat = '';
	let kota = '';
	let provinsi = '';
	let icon = '1';
	let geojson = '1';
	let use_internet = '1';
	let dbsource = '1';
	let calculate_ispu = '1';
	let is_deleted = '0';
	let parent_id_station = '';
	let parent_tipe_station = '';
	$: payload = {};

	let dropdownStationTypeEl;
	let dropdownStationEl;
	let dropdownProvinceEl;
	let dropdownCityEl;

	$: if (showStationTypes) {
		if (dropdownStationTypeEl !== undefined && dropdownStationTypeEl !== null) {
			dropdownStationTypeEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if (showStations) {
		if (dropdownStationEl !== undefined && dropdownStationEl !== null) {
			dropdownStationEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if (showProvinces) {
		if (dropdownProvinceEl !== undefined && dropdownProvinceEl !== null) {
			dropdownProvinceEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if (showCities) {
		if (dropdownCityEl !== undefined && dropdownCityEl !== null) {
			dropdownCityEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	}

	$: handleClose = () => {
		selectedStation = null;
		$formMode = '';
		$showStationModal = false;
		payload = null;
	};

	function handleSearchProvinceOrCity(state = 'province') {
		if (state === 'province') {
			filteredProvinces = provinces.filter((province) =>
				province.name.toLowerCase().includes(provinceCityQuery.toLowerCase())
			);
		} else if (state === 'city') {
			const provinceCode = selectedProvince.code;

			filteredCities = cities.filter(
				(city) =>
					city.code.startsWith(provinceCode) &&
					city.name.toLowerCase().includes(provinceCityQuery.toLowerCase())
			);
		}
	}

	function searchParentStation() {
		filteredStations = allStations.filter(
			(station) =>
				station.id_station.toLowerCase().includes($searchQuery.toLowerCase()) &&
				station.tipe_station !== 'lab' &&
				station.tipe_station !== 'dlh_dki_pm25'
		);
	}

	function validateLatLonInput(event, type) {
		const value = event.target.value;
		const sanitizedValue = value.replace(/[^0-9.\-]/g, ''); // Remove invalid characters

		if (type === 'lat') {
			lat = sanitizedValue; // Update the bound value
		} else {
			lon = sanitizedValue; // Update the bound value
		}
	}

	const getProvinces = async () => {
		try {
			const response = await fetch('provinces.json');

			if (!response.ok) {
				throw new Error('Data provinsi tidak ditemukan');
			}

			provinces = await response.json();
		} catch (error) {
			console.log(error);
		}
	};

	const getCities = async () => {
		try {
			const response = await fetch('cities.json');

			if (!response.ok) {
				throw new Error('Data kota dan kabupaten tidak ditemukan');
			}

			cities = await response.json();
			filteredCities = cities.filter((city) => {
				return city.code.startsWith(selectedProvince.code) && !city.code.endsWith('00');
			});
		} catch (error) {
			console.log(error);
		}
	};

	const createStation = async () => {
		try {
			const response = await axios.post('/api/master/station', payload, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.status === 200) {
				const message = response.data.message;
				handleSweetAlert('success', message);

				handleClose();
			}
		} catch (error) {
			const response = error.response;

			if (response) {
				const message = response.data.error;

				if (response.status === 400 || response.status === 422) {
					handleSweetAlert('error', message);
				}
			}
		}
	};

	const updateStation = async () => {
		try {
			const response = await axios.put('/api/master/station', payload, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					'Content-Type': 'application/json'
				},
				params: {
					id_station
				}
			});

			if (response.status === 200) {
				const message = response.data.message;
				handleSweetAlert('success', message);

				handleClose();
			}
		} catch (error) {
			const response = error.response;

			if (response) {
				const message = response.data.error;

				if (response.status === 400 || response.status === 404 || response.status === 422) {
					handleSweetAlert('error', message);
				} else if (response.status === 405) {
					handleSweetAlert('error', response.data);
				}
			}
		}
	};

	onMount(async () => {
		if ($isPm25App) {
			stationTypes = [
				{
					code: 'dlh_dki_pm25',
					display: 'PM2.5'
				}
			];
		}

		await getProvinces();
		filteredStations = allStations;

		if ($formMode === 'read' || $formMode === 'update') {
			for (let i = 0; i < stationTypes.length; i++) {
				if (stationTypes[i].code === selectedStation.tipe_station)
					selectedStationType = stationTypes[i];
			}

			for (let i = 0; i < filteredStations.length; i++) {
				const parentStation =
					filteredStations[i].id_station + '-' + filteredStations[i].tipe_station;

				if (parentStation === selectedStation.parent_id)
					selectedParentStation = filteredStations[i];
			}

			for (let i = 0; i < provinces.length; i++) {
				if (provinces[i].name === selectedStation.provinsi) selectedProvince = provinces[i];
				await getCities();
			}

			for (let i = 0; i < filteredCities.length; i++) {
				if (filteredCities[i].name === selectedStation.kota) selectedCity = filteredCities[i];
			}

			id_station = selectedStation.id_station;
			tipe_station = selectedStation.tipe_station;
			nama = selectedStation.nama;
			lat = selectedStation.lat;
			lon = selectedStation.lon;
			alamat = selectedStation.alamat;
			kota = selectedCity.name;
			provinsi = selectedProvince.name;
			icon = '1';
			geojson = '1';
			use_internet = '1';
			dbsource = '1';
			calculate_ispu = '1';
			is_deleted = '0';
			parent_id_station = selectedParentStation.id_station;
			parent_tipe_station = selectedParentStation.tipe_station;
		}
	});

	afterUpdate(() => {
		if ($isPm25App) {
			tipe_station = 'dlh_dki_pm25';
		}

		payload = {
			id_station,
			tipe_station,
			nama,
			lat,
			lon,
			alamat,
			kota,
			provinsi,
			icon,
			geojson,
			use_internet,
			dbsource,
			calculate_ispu,
			is_deleted,
			parent_id_station,
			parent_tipe_station
		};
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="relative z-50"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div class="fixed inset-0 bg-black/45 transition-opacity" aria-hidden="true"></div>

	<div
		transition:fly={{ y: 200, duration: 300 }}
		class="fixed inset-0 z-10 w-screen overflow-y-auto"
	>
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-lg border border-gt-color-dark-3-transparent text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
			>
				<!-- Header -->
				<div
					class="flex flex-row h-16 gap-2 px-4 py-3 bg-gt-color-dark border-b border-gt-color-dark-3-transparent items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>

					{#if $formMode === 'read'}
						<span class="font-normal">Detail Stasiun</span>
					{:else if $formMode === 'create'}
						<span class="font-normal">Tambah Data Stasiun</span>
					{:else if $formMode === 'update'}
						<span class="font-normal">Ubah Data Stasiun</span>
					{/if}
				</div>
				<!-- End of Header -->

				<!-- Body -->
				<div class="bg-gt-color-dark-5 p-3 max-h-[600px] 2xl:max-h-[680px] overflow-auto scrollbar">
					{#if $formMode === 'create'}
						<div
							class="flex flex-col gap-3 bg-gt-color-dark p-6 rounded-md border border-gt-color-dark-3-transparent"
						>
							<!-- ID Stasiun -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="id_station" class="font-normal text-sm text-gt-color-gray capitalize"
									>ID Stasiun <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={id_station}
									type="text"
									name="id_station"
									id="id_station"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="ID stasiun"
									autocomplete="off"
								/>
							</div>
							<!-- End of ID Stasiun -->

							{#if !$isPm25App}
								<!-- Tipe Station -->
								<div class="flex flex-col gap-2 pb-1">
									<span class="font-normal text-sm text-gt-color-gray capitalize"
										>tipe stasiun <span class="text-xs text-red-500">*</span></span
									>

									<div class="relative">
										<button
											on:click={() => (showStationTypes = !showStationTypes)}
											type="button"
											class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										>
											<span
												>{Object.keys(selectedStationType).length === 0
													? 'Pilih tipe stasiun'
													: selectedStationType.display}</span
											>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-4 text-zicare-text-lightgray {showStationTypes
													? 'rotate-180'
													: ''} ease-in-out duration-150"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m19.5 8.25-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>

										{#if showStationTypes}
											<div
												bind:this={dropdownStationTypeEl}
												transition:fly={{ y: 25, duration: 150 }}
												class="absolute left-0 z-50 w-full mt-px max-h-36 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="menu-button"
												tabindex="-1"
											>
												<div class="py-1" role="none">
													{#each stationTypes as type, index}
														<!-- svelte-ignore a11y-invalid-attribute -->
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<a
															on:click={() => (
																(tipe_station = type.code),
																(selectedStationType = type),
																(showStationTypes = !showStationTypes)
															)}
															class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
															role="menuitem"
															tabindex="-1"
															id={'station-type-' + (index + 1)}>{type.display}</a
														>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								</div>
								<!-- End of Tipe Station -->
							{/if}

							<!-- Nama -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="nama" class="font-normal text-sm text-gt-color-gray capitalize"
									>nama <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={nama}
									type="text"
									name="nama"
									id="nama"
									class="bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Nama stasiun"
									autocomplete="off"
								/>
							</div>
							<!-- End of Nama -->

							{#if !$isPm25App}
								<!-- Stasiun Induk -->
								<div class="flex flex-col gap-2 pb-1">
									<span class="font-normal text-sm text-gt-color-gray capitalize"
										>stasiun induk</span
									>

									<div class="relative">
										<button
											on:click={() => {
												if (tipe_station === 'lab') showStations = !showStations;
											}}
											type="button"
											class="flex flex-row w-full justify-between items-center {tipe_station ===
											'lab'
												? 'bg-transparent'
												: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										>
											<span
												>{Object.keys(selectedParentStation).length === 0
													? 'Pilih stasiun induk'
													: selectedParentStation.nama +
														' (' +
														selectedParentStation.tipe_station +
														')'}</span
											>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-4 text-zicare-text-lightgray {showStations
													? 'rotate-180'
													: ''} ease-in-out duration-150"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m19.5 8.25-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>

										{#if showStations}
											<div
												bind:this={dropdownStationEl}
												transition:fly={{ y: 25, duration: 150 }}
												class="absolute left-0 z-50 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="menu-button"
												tabindex="-1"
											>
												<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
													<!-- Input untuk pencarian -->
													<input
														type="text"
														placeholder="Pencarian..."
														class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
														bind:value={$searchQuery}
														on:input={searchParentStation}
													/>
												</div>

												<div class="py-1" role="none">
													{#if filteredStations.length > 0}
														{#each filteredStations as station, index}
															<!-- svelte-ignore a11y-invalid-attribute -->
															<!-- svelte-ignore a11y-click-events-have-key-events -->
															<a
																on:click={() => (
																	(parent_id_station = station.id_station),
																	(parent_tipe_station = station.tipe_station),
																	(selectedParentStation = station),
																	(showStations = !showStations)
																)}
																class="block px-4 py-2 mx-1 font-light text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
																role="menuitem"
																tabindex="-1"
																id={'parent-station-' + (index + 1)}
																>{station.nama} ({station.tipe_station})</a
															>
														{/each}
													{:else}
														<div class="pb-2 text-center text-sm text-gt-color-gray">
															Data stasiun tidak ditemukan.
														</div>
													{/if}
												</div>
											</div>
										{/if}
									</div>
								</div>
								<!-- End of Stasiun Induk -->
							{/if}

							<!-- Longitude -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="lon" class="font-normal text-sm text-gt-color-gray capitalize"
									>longitude <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={lon}
									on:input={(e) => validateLatLonInput(e, 'lon')}
									type="text"
									name="lon"
									id="lon"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Longitude"
									autocomplete="off"
								/>
							</div>
							<!-- End of Longitude -->

							<!-- Latitude -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="lat" class="font-normal text-sm text-gt-color-gray capitalize"
									>latitude <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={lat}
									on:input={(e) => validateLatLonInput(e, 'lat')}
									type="text"
									name="lat"
									id="lat"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Latitude"
									autocomplete="off"
								/>
							</div>
							<!-- End of Latitude -->

							<!-- Provinsi -->
							<div class="flex flex-col gap-2 pb-1">
								<span class="font-normal text-sm text-gt-color-gray capitalize"
									>provinsi <span class="text-xs text-red-500">*</span></span
								>

								<div class="relative">
									<button
										on:click={() => (showProvinces = !showProvinces)}
										type="button"
										class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									>
										<span
											>{Object.keys(selectedProvince).length === 0
												? 'Pilih provinsi'
												: selectedProvince.name}</span
										>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="size-4 text-zicare-text-lightgray {showProvinces
												? 'rotate-180'
												: ''} ease-in-out duration-150"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>

									{#if showProvinces}
										<div
											bind:this={dropdownProvinceEl}
											transition:fly={{ y: 25, duration: 150 }}
											class="absolute left-0 bottom-12 z-50 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="menu-button"
											tabindex="-1"
										>
											<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
												<!-- Input untuk pencarian -->
												<input
													type="text"
													name="search-province"
													id="search-province"
													placeholder="Pencarian..."
													class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
													bind:value={provinceCityQuery}
													on:input={() => handleSearchProvinceOrCity()}
												/>
											</div>

											<div class="py-1" role="none">
												{#each filteredProvinces as province, index}
													<!-- svelte-ignore a11y-invalid-attribute -->
													<!-- svelte-ignore a11y-click-events-have-key-events -->
													<a
														on:click={async () => (
															(provinsi = province.name),
															(selectedProvince = province),
															(kota = ''),
															(selectedCity = {}),
															(showProvinces = !showProvinces),
															(provinceCityQuery = ''),
															await getCities()
														)}
														class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
														role="menuitem"
														tabindex="-1"
														id={'province-' + (index + 1)}>{province.name}</a
													>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
							<!-- End of Provinsi -->

							<!-- Kota -->
							<div class="flex flex-col gap-2 pb-1">
								<span class="font-normal text-sm text-gt-color-gray capitalize"
									>kota <span class="text-xs text-red-500">*</span></span
								>

								<div class="relative">
									<button
										on:click={() => {
											if (Object.keys(selectedProvince).length > 0) showCities = !showCities;
										}}
										type="button"
										class="flex flex-row w-full justify-between items-center {Object.keys(
											selectedProvince
										).length > 0
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									>
										<span
											>{Object.keys(selectedCity).length === 0
												? 'Pilih kota'
												: selectedCity.name}</span
										>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="size-4 text-zicare-text-lightgray {showCities
												? 'rotate-180'
												: ''} ease-in-out duration-150"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>

									{#if showCities}
										<div
											bind:this={dropdownCityEl}
											transition:fly={{ y: 25, duration: 150 }}
											class="absolute left-0 bottom-12 z-20 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="menu-button"
											tabindex="-1"
										>
											<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
												<!-- Input untuk pencarian -->
												<input
													type="text"
													name="search-city"
													id="search-city"
													placeholder="Pencarian..."
													class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
													bind:value={provinceCityQuery}
													on:input={() => handleSearchProvinceOrCity('city')}
												/>
											</div>

											<div class="py-1" role="none">
												{#each filteredCities as city, index}
													<!-- svelte-ignore a11y-invalid-attribute -->
													<!-- svelte-ignore a11y-click-events-have-key-events -->
													<a
														on:click={() => (
															(kota = city.name), (selectedCity = city), (showCities = !showCities)
														)}
														class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
														role="menuitem"
														tabindex="-1"
														id={'city-' + (index + 1)}>{city.name}</a
													>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
							<!-- End of Kota -->

							<!-- Alamat -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="alamat" class="font-normal text-sm text-gt-color-gray capitalize"
									>alamat <span class="text-xs text-red-500">*</span></label
								>

								<textarea
									bind:value={alamat}
									type="text"
									name="alamat"
									id="alamat"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Alamat lengkap"
									autocomplete="off"
								/>
							</div>
							<!-- End of Alamat -->
						</div>
					{:else if $formMode === 'read' || $formMode === 'update'}
						<div
							class="flex flex-col gap-3 bg-gt-color-dark p-6 rounded-md border border-gt-color-dark-3-transparent"
						>
							<!-- ID Stasiun -->
							{#if $formMode === 'read'}
								<div class="flex flex-col gap-2 pb-1">
									<label for="id_station" class="font-normal text-sm text-gt-color-gray capitalize"
										>ID Stasiun <span class="text-xs text-red-500">*</span></label
									>

									<input
										bind:value={id_station}
										type="text"
										name="id_station"
										id="id_station"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="ID stasiun"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
							{:else if $formMode === 'update'}
								<div class="flex flex-col gap-2 pb-1">
									<label for="id_station" class="font-normal text-sm text-gt-color-gray capitalize"
										>ID Stasiun <span class="text-xs text-red-500">*</span></label
									>

									<input
										bind:value={id_station}
										type="text"
										name="id_station"
										id="id_station"
										class="bg-gt-color-dark-3-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="ID stasiun"
										autocomplete="off"
										disabled
									/>
								</div>
							{/if}
							<!-- End of ID Stasiun -->

							{#if !$isPm25App}
								<!-- Tipe Station -->
								{#if $formMode === 'read'}
									<div class="flex flex-col gap-2 pb-1">
										<label
											for="tipe_station"
											class="font-normal text-sm text-gt-color-gray capitalize"
											>tipe stasiun <span class="text-xs text-red-500">*</span></label
										>

										<input
											bind:value={tipe_station}
											type="text"
											name="tipe_station"
											id="tipe_station"
											class="{$formMode === 'update'
												? 'bg-transparent'
												: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
											placeholder="Tipe stasiun"
											autocomplete="off"
											disabled={$formMode === 'read'}
										/>
									</div>
								{:else if $formMode === 'update'}
									<div class="flex flex-col gap-2 pb-1">
										<span class="font-normal text-sm text-gt-color-gray capitalize"
											>tipe stasiun <span class="text-xs text-red-500">*</span></span
										>

										<div class="relative">
											<button
												on:click={() => (showStationTypes = !showStationTypes)}
												type="button"
												class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
											>
												<span
													>{Object.keys(selectedStationType).length === 0
														? 'Pilih tipe stasiun'
														: selectedStationType.display}</span
												>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													class="size-4 text-zicare-text-lightgray {showStationTypes
														? 'rotate-180'
														: ''} ease-in-out duration-150"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="m19.5 8.25-7.5 7.5-7.5-7.5"
													/>
												</svg>
											</button>

											{#if showStationTypes}
												<div
													bind:this={dropdownStationTypeEl}
													transition:fly={{ y: 25, duration: 150 }}
													class="absolute left-0 z-50 w-full mt-px max-h-36 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
													role="menu"
													aria-orientation="vertical"
													aria-labelledby="menu-button"
													tabindex="-1"
												>
													<div class="py-1" role="none">
														{#each stationTypes as type, index}
															<!-- svelte-ignore a11y-invalid-attribute -->
															<!-- svelte-ignore a11y-click-events-have-key-events -->
															<a
																on:click={() => (
																	(tipe_station = type.code),
																	(selectedStationType = type),
																	(showStationTypes = !showStationTypes)
																)}
																class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
																role="menuitem"
																tabindex="-1"
																id={'station-type-' + (index + 1)}>{type.display}</a
															>
														{/each}
													</div>
												</div>
											{/if}
										</div>
									</div>
								{/if}
								<!-- End of Tipe Station -->
							{/if}

							<!-- Nama -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="nama" class="font-normal text-sm text-gt-color-gray capitalize"
									>nama <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={nama}
									type="text"
									name="nama"
									id="nama"
									class="{$formMode === 'update'
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Nama stasiun"
									autocomplete="off"
									disabled={$formMode === 'read'}
								/>
							</div>
							<!-- End of Nama -->

							{#if !$isPm25App}
								<!-- Stasiun Induk -->
								{#if $formMode === 'read'}
									<div class="flex flex-col gap-2 pb-1">
										<label for="parent_id" class="font-normal text-sm text-gt-color-gray capitalize"
											>stasiun induk <span class="text-xs text-red-500">*</span></label
										>

										<input
											bind:value={selectedStation.parent_id}
											type="text"
											name="parent_id"
											id="parent_id"
											class="{$formMode === 'update'
												? 'bg-transparent'
												: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
											placeholder={selectedStation.parent_id ? '' : 'Nama induk stasiun'}
											autocomplete="off"
											disabled={$formMode === 'read'}
										/>
									</div>
								{:else if $formMode === 'update'}
									<div class="flex flex-col gap-2 pb-1">
										<span class="font-normal text-sm text-gt-color-gray capitalize"
											>stasiun induk</span
										>

										<div class="relative">
											<button
												on:click={() => {
													if (tipe_station === 'lab') showStations = !showStations;
												}}
												type="button"
												class="flex flex-row w-full justify-between items-center {tipe_station ===
												'lab'
													? 'bg-transparent'
													: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
											>
												<span
													>{Object.keys(selectedParentStation).length === 0
														? 'Pilih stasiun induk'
														: selectedParentStation.nama +
															' (' +
															selectedParentStation.tipe_station +
															')'}</span
												>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													class="size-4 text-zicare-text-lightgray {showStations
														? 'rotate-180'
														: ''} ease-in-out duration-150"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="m19.5 8.25-7.5 7.5-7.5-7.5"
													/>
												</svg>
											</button>

											{#if showStations}
												<div
													bind:this={dropdownStationEl}
													transition:fly={{ y: 25, duration: 150 }}
													class="absolute left-0 z-50 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
													role="menu"
													aria-orientation="vertical"
													aria-labelledby="menu-button"
													tabindex="-1"
												>
													<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
														<!-- Input untuk pencarian -->
														<input
															type="text"
															placeholder="Pencarian..."
															class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
															bind:value={$searchQuery}
															on:input={searchParentStation}
														/>
													</div>

													<div class="py-1" role="none">
														{#if filteredStations.length > 0}
															{#each filteredStations as station, index}
																<!-- svelte-ignore a11y-invalid-attribute -->
																<!-- svelte-ignore a11y-click-events-have-key-events -->
																<a
																	on:click={() => (
																		(parent_id_station = station.id_station),
																		(parent_tipe_station = station.tipe_station),
																		(selectedParentStation = station),
																		(showStations = !showStations)
																	)}
																	class="block px-4 py-2 mx-1 font-light text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
																	role="menuitem"
																	tabindex="-1"
																	id={'parent-station-' + (index + 1)}
																	>{station.nama} ({station.tipe_station})</a
																>
															{/each}
														{:else}
															<div class="pb-2 text-center text-sm text-gt-color-gray">
																Data stasiun tidak ditemukan.
															</div>
														{/if}
													</div>
												</div>
											{/if}
										</div>
									</div>
								{/if}
								<!-- End of Stasiun Induk -->
							{/if}

							<!-- Status -->
							{#if $formMode === 'read'}
								<div class="flex flex-col gap-2 pb-1">
									<label for="status" class="font-normal text-sm text-gt-color-gray capitalize"
										>status <span class="text-xs text-red-500">*</span></label
									>

									<input
										bind:value={selectedStation.status}
										type="text"
										name="status"
										id="status"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Status stasiun"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
							{/if}
							<!-- End of Status -->

							<!-- Longitude -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="lon" class="font-normal text-sm text-gt-color-gray capitalize"
									>longitude <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={lon}
									type="text"
									name="lon"
									id="lon"
									class="{$formMode === 'update'
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Longitude"
									autocomplete="off"
									disabled={$formMode === 'read'}
								/>
							</div>
							<!-- End of Longitude -->

							<!-- Latitude -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="lat" class="font-normal text-sm text-gt-color-gray capitalize"
									>latitude <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={lat}
									type="text"
									name="lat"
									id="lat"
									class="{$formMode === 'update'
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Latitude"
									autocomplete="off"
									disabled={$formMode === 'read'}
								/>
							</div>
							<!-- End of Latitude -->

							<!-- Provinsi -->
							{#if $formMode === 'read'}
								<div class="flex flex-col gap-2 pb-1">
									<label for="provinsi" class="font-normal text-sm text-gt-color-gray capitalize"
										>provinsi <span class="text-xs text-red-500">*</span></label
									>

									<input
										bind:value={provinsi}
										type="text"
										name="provinsi"
										id="provinsi"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Provinsi"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
							{:else if $formMode === 'update'}
								<div class="flex flex-col gap-2 pb-1">
									<span class="font-normal text-sm text-gt-color-gray capitalize"
										>provinsi <span class="text-xs text-red-500">*</span></span
									>

									<div class="relative">
										<button
											on:click={() => (showProvinces = !showProvinces)}
											type="button"
											class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										>
											<span
												>{Object.keys(selectedProvince).length === 0
													? 'Pilih provinsi'
													: selectedProvince.name}</span
											>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-4 text-zicare-text-lightgray {showProvinces
													? 'rotate-180'
													: ''} ease-in-out duration-150"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m19.5 8.25-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>

										{#if showProvinces}
											<div
												bind:this={dropdownProvinceEl}
												transition:fly={{ y: 25, duration: 150 }}
												class="absolute left-0 bottom-12 z-50 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="menu-button"
												tabindex="-1"
											>
												<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
													<!-- Input untuk pencarian -->
													<input
														type="text"
														name="search-province"
														id="search-province"
														placeholder="Pencarian..."
														class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
														bind:value={provinceCityQuery}
														on:input={() => handleSearchProvinceOrCity()}
													/>
												</div>

												<div class="py-1" role="none">
													{#each filteredProvinces as province, index}
														<!-- svelte-ignore a11y-invalid-attribute -->
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<a
															on:click={async () => (
																(provinsi = province.name),
																(selectedProvince = province),
																(kota = ''),
																(selectedCity = {}),
																(showProvinces = !showProvinces),
																(provinceCityQuery = ''),
																await getCities()
															)}
															class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
															role="menuitem"
															tabindex="-1"
															id={'province-' + (index + 1)}>{province.name}</a
														>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								</div>
							{/if}
							<!-- End of Provinsi -->

							<!-- Kota -->
							{#if $formMode === 'read'}
								<div class="flex flex-col gap-2 pb-1">
									<label for="kota" class="font-normal text-sm text-gt-color-gray capitalize"
										>kota <span class="text-xs text-red-500">*</span></label
									>

									<input
										bind:value={kota}
										type="text"
										name="kota"
										id="kota"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Kota"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
							{:else if $formMode === 'update'}
								<div class="flex flex-col gap-2 pb-1">
									<span class="font-normal text-sm text-gt-color-gray capitalize"
										>kota <span class="text-xs text-red-500">*</span></span
									>

									<div class="relative">
										<button
											on:click={() => {
												if (Object.keys(selectedProvince).length > 0) showCities = !showCities;
											}}
											type="button"
											class="flex flex-row w-full justify-between items-center {Object.keys(
												selectedProvince
											).length > 0
												? 'bg-transparent'
												: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										>
											<span
												>{Object.keys(selectedCity).length === 0
													? 'Pilih kota'
													: selectedCity.name}</span
											>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="size-4 text-zicare-text-lightgray {showCities
													? 'rotate-180'
													: ''} ease-in-out duration-150"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m19.5 8.25-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>

										{#if showCities}
											<div
												bind:this={dropdownCityEl}
												transition:fly={{ y: 25, duration: 150 }}
												class="absolute left-0 bottom-12 z-20 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="menu-button"
												tabindex="-1"
											>
												<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
													<!-- Input untuk pencarian -->
													<input
														type="text"
														name="search-city"
														id="search-city"
														placeholder="Pencarian..."
														class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
														bind:value={provinceCityQuery}
														on:input={() => handleSearchProvinceOrCity('city')}
													/>
												</div>

												<div class="py-1" role="none">
													{#each filteredCities as city, index}
														<!-- svelte-ignore a11y-invalid-attribute -->
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<a
															on:click={() => (
																(kota = city.name),
																(selectedCity = city),
																(showCities = !showCities)
															)}
															class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
															role="menuitem"
															tabindex="-1"
															id={'city-' + (index + 1)}>{city.name}</a
														>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								</div>
							{/if}
							<!-- End of Kota -->

							<!-- Alamat -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="alamat" class="font-normal text-sm text-gt-color-gray capitalize"
									>alamat <span class="text-xs text-red-500">*</span></label
								>

								<textarea
									bind:value={alamat}
									type="text"
									name="alamat"
									id="alamat"
									class="{$formMode === 'update'
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Alamat lengkap"
									autocomplete="off"
									disabled={$formMode === 'read'}
								/>
							</div>
							<!-- End of Alamat -->

							{#if $formMode === 'read'}
								<!-- GeoJSON -->
								<div class="flex flex-col gap-2 pb-1">
									<label for="geojson" class="font-normal text-sm text-gt-color-gray capitalize"
										>GeoJSON</label
									>

									<input
										bind:value={selectedStation.v_geojson}
										type="text"
										name="geojson"
										id="geojson"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Yes"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
								<!-- End ofGeoJSON -->

								<!-- Use Interner -->
								<div class="flex flex-col gap-2 pb-1">
									<label
										for="use_internet"
										class="font-normal text-sm text-gt-color-gray capitalize">use internet</label
									>

									<input
										bind:value={selectedStation.v_use_internet}
										type="text"
										name="use_internet"
										id="use_internet"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Yes"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
								<!-- End of Use Interner -->

								<!-- Calculate ISPU -->
								<div class="flex flex-col gap-2 pb-1">
									<label
										for="calculate_ispu"
										class="font-normal text-sm text-gt-color-gray capitalize">calculate ISPU</label
									>

									<input
										bind:value={selectedStation.v_calculate_ispu}
										type="text"
										name="calculate_ispu"
										id="calculate_ispu"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Yes"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
								<!-- End of Calculate ISPU -->

								<!-- Last Update -->
								<div class="flex flex-col gap-2 pb-1">
									<label for="last_update" class="font-normal text-sm text-gt-color-gray capitalize"
										>last update</label
									>

									<input
										bind:value={selectedStation.last_update}
										type="text"
										name="last_update"
										id="last_update"
										class="{$formMode === 'update'
											? 'bg-transparent'
											: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
										placeholder="Update terakhir"
										autocomplete="off"
										disabled={$formMode === 'read'}
									/>
								</div>
								<!-- End of Last Update -->
							{/if}
						</div>
					{/if}
				</div>
				<!-- End of Body -->

				<!-- Footer -->
				<div class="flex flex-row-reverse gap-3 px-4 py-3 bg-gt-color-dark">
					{#if $formMode === 'create'}
						<button
							on:click={() => createStation()}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-primary hover:bg-gt-color-primary-hover px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm sm:mt-0 sm:w-auto ease-in-out duration-150"
							>Simpan</button
						>
					{:else if $formMode === 'update'}
						<button
							on:click={() => updateStation()}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-primary hover:bg-gt-color-primary-hover px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm sm:mt-0 sm:w-auto ease-in-out duration-150"
							>Simpan</button
						>
					{/if}

					<button
						on:click={() => handleClose()}
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-dark-3-transparent px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm hover:bg-gt-color-dark-2 sm:mt-0 sm:w-auto ease-in-out duration-150"
						>Tutup</button
					>
				</div>
				<!-- End of Footer -->
			</div>
		</div>
	</div>
</div>
