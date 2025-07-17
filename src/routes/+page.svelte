<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import axios from 'axios';
	import { jakartasGrid } from '$lib/utils/geojson/jakarta.js';
	import { getArrayBy } from '$lib/utils/array.js';
	import { industri, transportasi } from '$lib/utils/ext/contohdata.js';
	import {
		isPm25App,
		isLoading,
		showModeling,
		showComparisonStation,
		expandedAccordion
	} from '$lib/index';

	import { getCenter } from 'ol/extent';
	import { fromLonLat, toLonLat } from 'ol/proj';
	import { getDistance } from 'ol/sphere';
	import GeoJSON from 'ol/format/GeoJSON.js';
	import Map from 'ol/Map.js';
	import Select from 'ol/interaction/Select.js';
	import { DragBox } from 'ol/interaction.js';
	import VectorLayer from 'ol/layer/Vector.js';
	import VectorSource from 'ol/source/Vector.js';
	import View from 'ol/View.js';
	import { click, platformModifierKeyOnly } from 'ol/events/condition.js';
	import { Style, Stroke, Fill, Text } from 'ol/style';
	import Overlay from 'ol/Overlay';
	import { getWidth } from 'ol/extent.js';
	import { transformExtent } from 'ol/proj.js';
	import Feature from 'ol/Feature.js';
	import Point from 'ol/geom/Point.js';
	import Heatmap from 'ol/layer/Heatmap.js';
	import ImageLayer from 'ol/layer/Image';
	import Static from 'ol/source/ImageStatic';

	import SidebarNav from '$lib/component/SidebarNav.svelte';
	import Loading from '$lib/component/Loading.svelte';
	import ZoomPanel from '$lib/component/ZoomPanel.svelte';
	import DataViewPm25 from '$lib/component/DataViewPM25.svelte';
	import Legend from '$lib/component/Legend.svelte';
	import AirQualityModal from '$lib/component/AirQualityModal.svelte';
	import AirQualityModalPm25 from '$lib/component/AirQualityModalPM25.svelte';
	import MeteorologyModal from '$lib/component/MeteorologyModal.svelte';
	import MeteorologyModalPm25 from '$lib/component/MeteorologyModalPM25.svelte';
	import MapView from '$lib/component/MapView.svelte';
	import DetailStationModal from '$lib/component/DetailStationModal.svelte';
	import DetailStationModalPm25 from '$lib/component/DetailStationModalPM25.svelte';
	import ExpandedIspuRankCard from '$lib/component/ExpandedISPURankCard.svelte';
	import ExpandedIspuRankCardPm25 from '$lib/component/ExpandedISPURankCardPM25.svelte';
	import ForecastModalPm25 from '$lib/component/ForecastModalPM25.svelte';

	let svgload = true;

	let accessToken = '';

	$: aqis = [];
	$: airStations = [];
	$: ispus = [];
	$: ispuRankAllParams = $isPm25App ? 'pm25' : 'pm10';
	$: ispuRankAll = [];
	$: ispuTopRank = [];
	$: demography = [];
	$: weatherForecast = [];
	$: currentRadius = 0;
	$: currentLongitude = 106.8456;
	$: currentLatitude = -6.2088;
	$: ispuByRadius = [];

	let map;
	let vectorLayer;
	$: showMapView = true;
	$: showMeteorologyModal = false;
	$: showForecastModal = false;
	// $: $showModeling = false;

	$: totalPopulationChecked = true;
	$: areaSizeChecked = false;
	$: populationDensityChecked = false;

	let vectorLayerDemography;
	let vectorSourcegeojsonindonesia;
	let vector;
	let vectorLayerGeo3;
	let vectorLayerGeo4;
	let heatmapLayer;
	let overlayMarker = [];

	$: demographyModal = false;
	let modalDetailData = false;

	let selectedAirStation = {};
	$: selectedAirStation = selectedAirStation;
	let selectedChildStation = {};
	$: selectedChildStation = selectedChildStation;

	let StasiunLainnya = [];
	$: StasiunLainnya = StasiunLainnya;

	let selectedAirStationKedua = {};
	$: selectedAirStationKedua = selectedAirStationKedua;

	$: viewDataIndustri = false;
	$: viewDataUdara = false;
	$: viewDataTransportasi = false;

	let btnJumlahPenduduk = false;
	$: btnJumlahPenduduk = btnJumlahPenduduk;

	let btnLuasWilayah = false;
	$: btnLuasWilayah = btnLuasWilayah;

	let btnKepadatanPenduduk = false;
	$: btnKepadatanPenduduk = btnKepadatanPenduduk;

	let selectValueUdara = [
		{ value: 'bw', label: 'Batas Wilayah' }
		// { value: 's', label: 'Satelit' }
	];

	let selectValue = 'bw';
	$: selectValue = selectValue;
	$: selectOpen = selectOpen;

	let selectOpen = false;

	let selectValueParamIspus = [
		{ value: 'pm25', label: 'PM2.5' },
		{ value: 'pm10', label: 'PM10' },
		{ value: 'so2', label: 'SO2' },
		{ value: 'co', label: 'CO' },
		{ value: 'o3', label: 'O3' },
		{ value: 'no2', label: 'NO2' },
		{ value: 'hc', label: 'HC' }
	];

	// param ispu
	let selectedValueParamIspu = $isPm25App ? 'pm25' : 'pm10';
	$: selectedValueParamIspu = selectedValueParamIspu;
	$: selectOpenParams = selectOpenParams;

	let selectOpenParams = false;

	let stationTypes = [
		{ value: 'all', label: 'Semua' },
		{ value: 'lowcost', label: 'Lowcost' },
		{ value: 'dlh_dki_pm25', label: 'PM2.5 Only' }
	];

	// jenis stasiun ispu
	// let selectedStationType = $isPm25App ? 'dlh_dki_pm25' : 'lowcost';
	let selectedStationType = 'all';
	$: selectedStationType = selectedStationType;
	$: selectOpenParams = selectOpenParams;

	let selectOpenJenisStasiun = false;

	let showGrid = false;
	$: showGrid = showGrid;

	let modalIspuRankOpen = false;
	let modalIspuRankStatus = true;

	$: modalIspuRankOpen = modalIspuRankOpen;

	$: if (modalDetailData) {
		const markerId = selectedAirStation.markerId;

		overlayMarker.forEach((overlay) => {
			const markerElement = overlay.getElement();

			if (markerElement.id === markerId) {
				markerElement.classList.remove('hidden'); // Show clicked marker
			} else {
				markerElement.classList.add('hidden'); // Hide others
			}
		});
	} else {
		overlayMarker.forEach((overlay) => {
			const markerElement = overlay.getElement();
			markerElement.classList.remove('hidden'); // Show clicked marker
		});
	}

	// Mark ICON
	function markUdara(warna = 'bg-sky-500', value = '0') {
		let htmlIcon = `<span class="z-20 cursor-pointer relative flex h-10 w-10"><span class="animate-ping absolute inline-flex h-full w-full rounded-full ${warna} opacity-75"></span><span class="relative inline-flex rounded-full h-10 w-10 ${warna} justify-center items-center text-white">${value}</span></span>`;

		return htmlIcon;
	}

	function markIndustri(warna = 'bg-sky-500', value = '0') {
		let htmlIcon = `<div class="flex flex-row gap-2 p-2.5 h-8 w-fit rounded-lg ${warna} items-center justify-around cursor-pointer">
		<img src="/icons/industry-icon.svg" class="size-4" alt="Industry Icon" /><div class="h-4 w-px rounded-full bg-[#F9FAFB]"></div><span class="font-normal text-sm text-[#F9FAFB]">${value}</span></div>`;

		return htmlIcon;
	}

	function markTransportasi(warna = 'bg-sky-500', value = '0') {
		let htmlIcon = `<div class="flex flex-row gap-2 p-2.5 h-8 w-fit rounded-lg ${warna} items-center justify-around cursor-pointer">
		<img src="/icons/transportation-icon.svg" class="size-4" alt="Transportation Icon" /><div class="h-4 w-px rounded-full bg-[#F9FAFB]"></div><span class="font-normal text-sm text-[#F9FAFB]">${value}</span></div>`;

		return htmlIcon;
	}

	function handleAccordion(type) {
		// console.log(type);
		if (type === 'pm10') {
			if ($expandedAccordion === 'pm10') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'pm10';
		} else if (type === 'pm25') {
			if ($expandedAccordion === 'pm25') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'pm25';
		} else if (type === 'so2') {
			if ($expandedAccordion === 'so2') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'so2';
		} else if (type === 'co') {
			if ($expandedAccordion === 'co') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'co';
		} else if (type === 'o3') {
			if ($expandedAccordion === 'o3') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'o3';
		} else if (type === 'no2') {
			if ($expandedAccordion === 'no2') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'no2';
		} else if (type === 'hc') {
			if ($expandedAccordion === 'hc') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'hc';
		} else if (type === 'windrose') {
			if ($expandedAccordion === 'windrose') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'windrose';
		} else if (type === 'arah-angin') {
			if ($expandedAccordion === 'arah-angin') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'arah-angin';
		} else if (type === 'curah-hujan') {
			if ($expandedAccordion === 'curah-hujan') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'curah-hujan';
		} else if (type === 'kecepatan-angin') {
			if ($expandedAccordion === 'kecepatan-angin') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'kecepatan-angin';
		} else if (type === 'kelembaban') {
			if ($expandedAccordion === 'kelembaban') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'kelembaban';
		} else if (type === 'suhu') {
			if ($expandedAccordion === 'suhu') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'suhu';
		} else if (type === 'solar-radius') {
			if ($expandedAccordion === 'solar-radius') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'solar-radius';
		} else if (type === 'tekanan-udara') {
			if ($expandedAccordion === 'tekanan-udara') {
				$expandedAccordion = '';
			}

			$expandedAccordion = 'tekanan-udara';
		} else {
			$expandedAccordion = '';
		}
	}

	function handleMeteorologyModal() {
		showMeteorologyModal = !showMeteorologyModal;
		showForecastModal = false;

		if (showMeteorologyModal === false) {
			$expandedAccordion = '';
		}
	}

	async function handleDemographyModal() {
		demographyModal = !demographyModal;

		if (demographyModal) {
			handleTotalPopulationToggle(false);
		} else {
			handleTotalPopulationToggle(true);
		}
	}

	function handleForecastModal() {
		showForecastModal = !showForecastModal;
		showMeteorologyModal = false;
	}

	async function handleModelingOld() {
		$showModeling = !$showModeling;

		if ($showModeling) {
			// Define bounds and a function to generate random points
			const boundsList = [
				{
					minLon: 106.6940510972486,
					maxLon: 106.95491228447992,
					minLat: -6.1677369249786835,
					maxLat: -6.090694058860436
				},
				{
					minLon: 106.72132550783563,
					maxLon: 106.9579420407259,
					minLat: -6.219273724140834,
					maxLat: -6.19351005702903
				},
				{
					minLon: 106.7457426743604,
					maxLon: 106.94307744887364,
					minLat: -6.266463416445632,
					maxLat: -6.2397203063906375
				},
				{
					minLon: 106.76790556847327,
					maxLon: 106.91452463711093,
					minLat: -6.3576959754080065,
					maxLat: -6.281762022604042
				}
			];

			function generateRandomPoints(bounds, count) {
				const points = [];
				for (let i = 0; i < count; i++) {
					const lon = Math.random() * (bounds.maxLon - bounds.minLon) + bounds.minLon;
					const lat = Math.random() * (bounds.maxLat - bounds.minLat) + bounds.minLat;
					const weight = Math.random();
					points.push({ lon, lat, weight });
				}
				return points;
			}

			// Generate random data points from all bounds
			// const data = boundsList.flatMap((bounds) => generateRandomPoints(bounds, 30));

			const response = await fetch('/heatmapData.json');
			const data = await response.json();

			// Create features for each data point
			const features = data.map((item) => {
				return new Feature({
					geometry: new Point(fromLonLat([item.lon, item.lat])),
					weight: item.weight
				});
			});

			// Create vector source and heatmap layer
			const vectorSource = new VectorSource({
				features: features
			});

			heatmapLayer = new Heatmap({
				source: vectorSource,
				blur: 85, // Adjust as needed
				radius: 40, // Adjust as needed
				weight: (feature) => feature.get('weight') // Set weight
			});

			// Add the heatmap layer to the map
			map.addLayer(heatmapLayer);
		} else {
			if (heatmapLayer) {
				map.removeLayer(heatmapLayer); // Remove the heatmap layer
				heatmapLayer = null;
			}
		}
	}

	async function handleModelingAman() {
		$showModeling = !$showModeling;

		if ($showModeling) {
			try {
				// const response = await fetch('/pm25_modelling.json');
				// const data = await response.json();
				const response = await axios.get('/api/aqms/ispu_modeling');
				const interpolationData = response.data.interpolation;
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				const gridSize = interpolationData.grid_values.length;
				canvas.width = gridSize;
				canvas.height = gridSize;

				// Fill the canvas with our AQI values
				for (let i = 0; i < gridSize; i++) {
					for (let j = 0; j < gridSize; j++) {
						const value = interpolationData.grid_values[i][j];

						// Get color for this value
						const color = getColorForValue(value);

						// Set pixel color directly
						context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
						context.fillRect(j, i, 1, 1);
					}
				}

				// Create a proper extent in map projection
				const bounds = interpolationData.bounds;

				// Log the bounds for debugging
				// console.log('Interpolation bounds:', bounds);

				// Make sure to use the correct order: [minLon, minLat, maxLon, maxLat]
				const extent = [bounds.west, bounds.south, bounds.east, bounds.north];

				// Transform extent corners to OpenLayers projection (EPSG:3857)
				const bottomLeft = fromLonLat([extent[0], extent[1]]);
				const topRight = fromLonLat([extent[2], extent[3]]);

				const projectedExtent = [
					bottomLeft[0], // Min X (transformed west)
					bottomLeft[1], // Min Y (transformed south)
					topRight[0], // Max X (transformed east)
					topRight[1] // Max Y (transformed north)
				];

				// Create image layer with the canvas as the source
				heatmapLayer = new ImageLayer({
					source: new Static({
						url: canvas.toDataURL(),
						imageExtent: projectedExtent,
						projection: 'EPSG:3857'
					}),
					opacity: 0.7,
					zIndex: 1
				});

				// Add the layer to the map
				map.addLayer(heatmapLayer);
			} catch (error) {
				console.log(error);
			}
		} else {
			if (heatmapLayer) {
				map.removeLayer(heatmapLayer); // Remove the heatmap layer
				heatmapLayer = null;
			}
		}
	}

	async function handleModeling() {
		$showModeling = !$showModeling;

		if ($showModeling) {
			try {
				// Fetch the interpolation data
				const response = await axios.get('/api/aqms/ispu_modeling');
				const interpolationData = response.data.interpolation;

				// Define the grid size and bounds
				const gridValues = interpolationData.grid_values;
				const bounds = interpolationData.bounds;
				const rows = gridValues.length;
				const cols = gridValues[0].length;

				// Create a high resolution canvas
				const scaleFactor = 4;
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				canvas.width = cols * scaleFactor;
				canvas.height = rows * scaleFactor;

				// Function to get color based on value
				function getColorForValue(value) {
					// If value is 0 or null, return transparent
					if (!value || value === 0) {
						return 'rgba(0, 0, 0, 0)';
					}

					// Define category thresholds and colors with higher opacity for better visibility
					if (value <= 50) {
						return 'rgba(34, 173, 92, 0.4)'; // Baik (Green)
					} else if (value <= 100) {
						return 'rgba(1, 169, 219, 0.4)'; // Sedang (Blue)
					} else if (value <= 150) {
						return 'rgba(251, 191, 36, 0.4)'; // Tidak Sehat (Yellow)
					} else if (value <= 200) {
						// return 'rgba(255, 87, 34, 0.4)'; // Sangat Tidak Sehat (Orange)
						return 'rgba(242, 48, 48, 0.4)'; // Sangat Tidak Sehat (Orange)
					} else {
						// return 'rgba(12, 12, 13, 0.4)'; // Berbahaya (Black)
						return 'rgba(156, 39, 176, 0.4)'; // Berbahaya (Purple)
					}
				}

				// Draw grid cells with flipped y-axis
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						const value = gridValues[i][j];
						if (value === 0) continue;

						const color = getColorForValue(value);
						context.fillStyle = color;

						context.fillRect(
							j * scaleFactor - 0.5,
							(rows - 1 - i) * scaleFactor - 0.5, // Flipped y-axis
							scaleFactor + 1,
							scaleFactor + 1
						);
					}
				}

				// Apply blur for smoother transitions
				context.globalAlpha = 0.7;
				context.filter = 'blur(1.5px)';
				context.drawImage(canvas, 0, 0);
				context.filter = 'none';
				context.globalAlpha = 1.0;

				// Create image layer with the canvas as the source
				const extent = [bounds.west, bounds.south, bounds.east, bounds.north];

				// Transform extent corners to OpenLayers projection (EPSG:3857)
				const bottomLeft = fromLonLat([extent[0], extent[1]]);
				const topRight = fromLonLat([extent[2], extent[3]]);

				const projectedExtent = [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]];

				// Create image layer with the canvas as the source - starting with opacity 0
				heatmapLayer = new ImageLayer({
					source: new Static({
						url: canvas.toDataURL(),
						imageExtent: projectedExtent,
						projection: 'EPSG:3857'
					}),
					opacity: 0, // Start with opacity 0 for fade-in effect
					zIndex: 1
				});

				// Add the layer to the map
				map.addLayer(heatmapLayer);

				// Animate the opacity from 0 to 0.9 for a smooth fade-in effect
				let startTime = null;
				const duration = 150; // Transition duration in milliseconds
				const targetOpacity = 0.9;

				function animate(timestamp) {
					if (!startTime) startTime = timestamp;
					const elapsed = timestamp - startTime;
					const progress = Math.min(elapsed / duration, 1);

					// Use an easing function for smoother animation (ease out)
					const easeOutCubic = 1 - Math.pow(1 - progress, 3);
					const currentOpacity = easeOutCubic * targetOpacity;

					heatmapLayer.setOpacity(currentOpacity);

					if (progress < 1) {
						requestAnimationFrame(animate);
					}
				}

				requestAnimationFrame(animate);
			} catch (error) {
				console.log(error);
			}
		} else {
			if (heatmapLayer) {
				// Animate the opacity from current to 0 for a smooth fade-out effect
				let startTime = null;
				const duration = 150; // Fade-out duration in milliseconds
				const startOpacity = heatmapLayer.getOpacity();

				function animateFadeOut(timestamp) {
					if (!startTime) startTime = timestamp;
					const elapsed = timestamp - startTime;
					const progress = Math.min(elapsed / duration, 1);

					// Use an easing function (ease in)
					const easeInCubic = progress * progress * progress;
					const currentOpacity = startOpacity * (1 - easeInCubic);

					heatmapLayer.setOpacity(currentOpacity);

					if (progress < 1) {
						requestAnimationFrame(animateFadeOut);
					} else {
						// When animation completes, remove the layer
						map.removeLayer(heatmapLayer);
						heatmapLayer = null;
					}
				}

				requestAnimationFrame(animateFadeOut);
			}
		}
	}

	function getColorForValue(value) {
		// Define color ranges for AQI values
		// const colorStops = [
		// 	{ value: 50, color: { r: 35, g: 35, b: 100 } }, // Dark blue
		// 	{ value: 100, color: { r: 70, g: 70, b: 120 } }, // Blue-purple
		// 	{ value: 200, color: { r: 120, g: 80, b: 150 } }, // Purple
		// 	{ value: 300, color: { r: 180, g: 100, b: 160 } }, // Purple-pink
		// 	{ value: 999, color: { r: 220, g: 140, b: 130 } } // Pink-beige
		// ];
		const colorStops = [
			{ value: 50, color: { r: 34, g: 173, b: 92 } }, // Green
			{ value: 100, color: { r: 1, g: 169, b: 219 } }, // Blue
			{ value: 200, color: { r: 251, g: 191, b: 36 } }, // Yellow
			{ value: 300, color: { r: 242, g: 48, b: 48 } }, // Red
			{ value: 999, color: { r: 12, g: 12, b: 13 } } // Black
		];

		// Find color interpolation
		if (value <= colorStops[0].value) {
			return colorStops[0].color;
		}

		if (value >= colorStops[colorStops.length - 1].value) {
			return colorStops[colorStops.length - 1].color;
		}

		for (let i = 0; i < colorStops.length - 1; i++) {
			if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
				const t = (value - colorStops[i].value) / (colorStops[i + 1].value - colorStops[i].value);

				return {
					r: Math.round(
						colorStops[i].color.r + t * (colorStops[i + 1].color.r - colorStops[i].color.r)
					),
					g: Math.round(
						colorStops[i].color.g + t * (colorStops[i + 1].color.g - colorStops[i].color.g)
					),
					b: Math.round(
						colorStops[i].color.b + t * (colorStops[i + 1].color.b - colorStops[i].color.b)
					)
				};
			}
		}

		return colorStops[0].color;
	}

	async function handleTotalPopulationToggle(state) {
		totalPopulationChecked = !state;

		if (totalPopulationChecked) {
			const vectorSourceDemography = new VectorSource({
				url: '/gadm41_IDN_3.geojson',
				format: new GeoJSON()
			});

			const colorPalette = [
				'#0B1731',
				'#10224B',
				'#16306C',
				'#1C3D8D',
				'#224BAE',
				'#2859CF',
				'#446DD0',
				'#6081D1',
				'#7C96D2',
				'#98AAD3',
				'#AEBAD4'
			];

			// const colorPalette = [
			// 	'#10224B',
			// 	'#16306C',
			// 	'#1C3D8D',
			// 	'#224BAE',
			// 	'#2859CF',
			// 	'#446DD0',
			// 	'#6081D1',
			// 	'#7C96D2',
			// 	'#98AAD3',
			// 	'#AEBAD4'
			// ];

			const name3ToColor = {};
			const city = $isPm25App ? selectedAirStation.stationData.kota : selectedAirStation.kota;
			let municipality = city.trim().split(' ').join('').toLowerCase();

			if (municipality.includes('kota')) {
				municipality = municipality.replace('kota', '');
			}

			switch (municipality) {
				case 'jakartautara':
					municipality = 'JakartaUtara';
					break;
				case 'jakartabarat':
					municipality = 'JakartaBarat';
					break;
				case 'jakartapusat':
					municipality = 'JakartaPusat';
					break;
				case 'jakartatimur':
					municipality = 'JakartaTimur';
					break;
				case 'jakartaselatan':
					municipality = 'JakartaSelatan';
					break;
				default:
					break;
			}

			map.getView().animate({
				center: fromLonLat(selectedAirStation.lonlat),
				zoom: 12,
				duration: 750
			});

			await getDemographyData(selectedAirStation.id_stasiun);
			let demographyData = demography;

			// Clean up district_level
			demographyData.map((item) => {
				item.district_level = item.district_level.trim().split(' ').join('');
			});

			vectorSourceDemography.once('change', async () => {
				if (vectorSourceDemography.getState() === 'ready') {
					const features = vectorSourceDemography.getFeatures();

					// Extract all NAME_3 values within the selected municipality
					const name3Values = new Set(
						features
							.filter((feature) => feature.get('NAME_2') === municipality)
							.map((feature) => feature.get('NAME_3'))
					);

					// Sort demographyData by population (ascending order)
					demographyData.sort((a, b) => Number(a.population) - Number(b.population));

					// Normalize population to assign colors proportionally
					const populationValues = demographyData.map((d) => d.population);
					const minPopulation = Math.min(...populationValues);
					const maxPopulation = Math.max(...populationValues);
					const colorPaletteAsc = colorPalette.reverse();

					// Function to get color based on population
					const getColorByPopulation = (population) => {
						const normalizedValue = (population - minPopulation) / (maxPopulation - minPopulation);
						const colorIndex = Math.floor(normalizedValue * (colorPaletteAsc.length - 1));
						return colorPaletteAsc[colorIndex];
					};

					// Assign colors based on population
					demographyData.forEach((item) => {
						if (name3Values.has(item.district_level)) {
							name3ToColor[item.district_level] = getColorByPopulation(item.population);
						}
					});
				}
			});

			vectorLayerDemography = new VectorLayer({
				source: vectorSourceDemography,
				style: (feature) => {
					if (feature.get('NAME_2') === municipality) {
						const name3 = feature.get('NAME_3');

						const color = name3ToColor[name3] || '#CCCCCC';

						return new Style({
							fill: new Fill({
								color: color
							}),
							stroke: new Stroke({
								color: '#6B7280',
								width: 1
							}),
							text: new Text({
								text: name3 || '',
								fill: new Fill({
									color: '#FEFEFE'
								}),
								stroke: new Stroke({
									color: '#000000',
									width: 1
								}),
								font: '14px Arial, sans-serif',
								overflow: true
							})
						});
					}
				}
			});

			map.addLayer(vectorLayerDemography);

			let hoveredFeature = null; // To track the currently hovered feature

			// Add pointermove event listener for hover functionality
			map.on('pointermove', (evt) => {
				// Change the cursor style when hovering over a feature
				const pixel = evt.pixel;
				const feature = map.forEachFeatureAtPixel(pixel, (f) => f);

				if (hoveredFeature && hoveredFeature !== feature) {
					// Reset the style of the previously hovered feature
					hoveredFeature.setStyle(null);
					hoveredFeature = null;
				}

				if (feature && feature.get('NAME_2') === municipality) {
					// Highlight the hovered feature
					const name3 = feature.get('NAME_3');
					const hoverColor = '#303A49'; // Highlight color

					feature.setStyle(
						new Style({
							fill: new Fill({
								color: hoverColor
							}),
							stroke: new Stroke({
								color: '#6B7280',
								width: 2
							}),
							text: new Text({
								text: name3 || '',
								fill: new Fill({
									color: '#FEFEFE'
								}),
								stroke: new Stroke({
									color: '#000000',
									width: 1
								}),
								font: '14px Arial, sans-serif',
								overflow: true
							})
						})
					);

					hoveredFeature = feature; // Update the current hovered feature
				}

				// Reset cursor style if not hovering over any feature
				map.getTargetElement().style.cursor = feature ? 'pointer' : '';
			});

			// Add singleclick listener for NAME_3 click functionality
			map.on('singleclick', (evt) => {
				map.forEachFeatureAtPixel(evt.pixel, async (feature) => {
					const type3 = feature.get('TYPE_3');
					const name3 = feature.get('NAME_3');
					if (type3 && name3) {
						// showDistrictLayer(type3, name3);
						// console.log(selectedAirStation.id_stasiun, name3);
						await getDemographyData(selectedAirStation.id_stasiun, name3);
						// console.log(demography);
					}
				});
			});
		} else {
			if (vectorLayerDemography) {
				map.removeLayer(vectorLayerDemography);
				vectorLayerDemography = null;
			}

			// Remove singleclick listener when the layer is removed
			map.un('singleclick', null);
		}
	}

	function showDistrictLayer(type, districtName) {
		if (totalPopulationChecked) {
			const vectorSourceDemography = new VectorSource({
				url: '/gadm41_IDN_4.geojson',
				format: new GeoJSON()
			});

			const colorPalette = [
				'#0B1731',
				'#10224B',
				'#16306C',
				'#1C3D8D',
				'#224BAE',
				'#2859CF',
				'#446DD0',
				'#6081D1',
				'#7C96D2',
				'#98AAD3',
				'#AEBAD4'
			];

			const name4ToColor = {};

			map.getView().animate({
				center: fromLonLat(selectedAirStation.lonlat),
				zoom: 12,
				duration: 750
			});

			vectorSourceDemography.once('change', () => {
				if (vectorSourceDemography.getState() === 'ready') {
					const features = vectorSourceDemography.getFeatures();

					const name4Values = new Set(
						features
							.filter((feature) => feature.get('NAME_3') === districtName)
							.map((feature) => feature.get('NAME_4'))
					);

					Array.from(name4Values).forEach((name, index) => {
						name4ToColor[name] = colorPalette[index % colorPalette.length];
					});
				}
			});

			vectorLayerDemography = new VectorLayer({
				source: vectorSourceDemography,
				style: (feature) => {
					if (feature.get('NAME_3') === districtName) {
						const name4 = feature.get('NAME_4');
						const color = name4ToColor[name4] || '#CCCCCC';

						return new Style({
							fill: new Fill({
								color: color
							}),
							stroke: new Stroke({
								color: '#6B7280',
								width: 1
							}),
							text: new Text({
								text: name4 || '',
								fill: new Fill({
									color: '#FEFEFE'
								}),
								stroke: new Stroke({
									color: '#000000',
									width: 1
								}),
								font: '14px Arial, sans-serif'
							})
						});
					}
				}
			});

			map.addLayer(vectorLayerDemography);

			// Add singleclick listener for NAME_3 click functionality
			map.on('singleclick', (evt) => {
				map.forEachFeatureAtPixel(evt.pixel, async (feature) => {
					const type4 = feature.get('TYPE_4');
					const name4 = feature.get('NAME_4');
					const districtLevel = type4 && type4 === 'Kelurahan' ? 2 : 1;

					if (districtLevel && name4) {
						alert(`${type4}: ${name4}`);
						await getDemographyData(selectedAirStation.id_stasiun, districtLevel);
						viewDataUdara = true;
						modalDetailData = true;
						modalIspuRankStatus = false;
						modalIspuRankOpen = false;
						showMapView = false;
					}
				});
			});
		} else {
			if (vectorLayerDemography) {
				map.removeLayer(vectorLayerDemography);
				vectorLayerDemography = null;
			}

			// Remove singleclick listener when the layer is removed
			map.un('singleclick', null);
		}
	}

	function showGridLayer() {
		showGrid = !showGrid;
		if (showGrid) {
			addLayer(jakartasGrid, true);
		} else {
			map.removeLayer(vectorLayer);
		}
	}

	// Switch to GeoJSON Layer batas wilayah
	function switchToGeoJSON() {
		map.getLayers().removeAt(0);
		map.getLayers().insertAt(0, vector);
	}

	// Switch to Satellite Layer
	function switchToSatellite() {
		map.getLayers().removeAt(0);
		map.getLayers().insertAt(0, satelliteLayer);
	}

	// Fungsi untuk zoom in
	function zoomIn() {
		const view = map.getView();
		const zoom = view.getZoom();
		view.setZoom(zoom + 1);
	}

	// Fungsi untuk zoom out
	function zoomOut() {
		const view = map.getView();
		const zoom = view.getZoom();
		view.setZoom(zoom - 1);
	}

	// fungsi zoom to ol_uid
	function zoomToOlUid(ol_uid, id_geo) {
		let targetFeature = null;
		vector
			.getSource()
			.getFeatures()
			.forEach((feature) => {
				if (feature.ol_uid == ol_uid) {
					targetFeature = feature;
				}
			});

		if (targetFeature) {
			const geometry = targetFeature.getGeometry();
			const extent = geometry.getExtent();
			map.getView().fit(extent, { duration: 1000, maiZoom: 7 });
		} else {
			console.log('Feature not found');
		}
	}

	async function addLayer(geojsonObject, is_dragbox = false) {
		// 1. Adding a GeoJSON Layer
		const vectorSource = new VectorSource({
			features: new GeoJSON().readFeatures(geojsonObject, {
				featureProjection: 'EPSG:3857'
			})
		});

		// 2. Styling the Layer
		vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				fill: new Fill({
					color: '#1BD5A61A'
				}),
				stroke: new Stroke({
					color: '#6B7280',
					width: 1.5,
					lineDash: [4, 8] // [Panjang dash, Gap]
				})
			})
		});

		// 3. Adding the Layer to the Map
		map.addLayer(vectorLayer);

		// 4. DragBox Interaction
		if (is_dragbox) {
			// Dragbox
			const selectedStyle = new Style({
				// fill: new Fill({
				//     color: 'rgba(255, 255, 255, 0.6)',
				// }),
				stroke: new Stroke({
					color: 'rgba(255, 255, 255, 0.7)',
					width: 2
				})
			});

			// a normal select interaction to handle click
			const select = new Select({
				// condition: shiftKeyOnly,
				layers: [vectorLayer],
				// condition:platformModifierKeyOnly,
				style: function (feature) {
					// const color = feature.get('COLOR_BIO') || 'red';
					// selectedStyle.getFill().setColor(color);
					return selectedStyle;
				}
			});

			map.addInteraction(select);

			const selectedFeatures = select.getFeatures();

			// a DragBox interaction used to select features by drawing boxes
			const dragBox = new DragBox({
				condition: platformModifierKeyOnly,
				layers: vectorLayer
			});

			map.addInteraction(dragBox);

			dragBox.on('boxend', function () {
				const boxExtent = dragBox.getGeometry().getExtent();
				// if the extent crosses the antimeridian process each world separately
				const worldExtent = map.getView().getProjection().getExtent();
				const worldWidth = getWidth(worldExtent);
				const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth);
				const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

				for (let world = startWorld; world <= endWorld; ++world) {
					const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0]);
					const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2]);
					const extent = [left, boxExtent[1], right, boxExtent[3]];

					const boxFeatures = vectorSource
						.getFeaturesInExtent(extent)
						.filter(
							(feature) =>
								!selectedFeatures.getArray().includes(feature) &&
								feature.getGeometry().intersectsExtent(extent)
						);

					// features that intersect the box geometry are added to the
					// collection of selected features

					// if the view is not obliquely rotated the box geometry and
					// its extent are equalivalent so intersecting features can
					// be added directly to the collection
					const rotation = map.getView().getRotation();
					const oblique = rotation % (Math.PI / 2) !== 0;

					// when the view is obliquely rotated the box extent will
					// exceed its geometry so both the box and the candidate
					// feature geometries are rotated around a common anchor
					// to confirm that, with the box geometry aligned with its
					// extent, the geometries intersect
					if (oblique) {
						const anchor = [0, 0];
						const geometry = dragBox.getGeometry().clone();
						geometry.translate(-world * worldWidth, 0);
						geometry.rotate(-rotation, anchor);
						const extent = geometry.getExtent();
						boxFeatures.forEach(function (feature) {
							const geometry = feature.getGeometry().clone();
							geometry.rotate(-rotation, anchor);
							if (geometry.intersectsExtent(extent)) {
								selectedFeatures.push(feature);
							}
						});
					} else {
						selectedFeatures.extend(boxFeatures);
					}
				}
			});

			// clear selection when drawing a new box and when clicking on the map
			dragBox.on('boxstart', function () {
				selectedFeatures.clear();
			});

			dragBox.on('boxend', function () {
				// selectedFeatures.clear();
				// alert('uuu');

				// Get the box geometry and extent
				const boxExtent = dragBox.getGeometry().getExtent();

				// Convert extent from EPSG:3857 to EPSG:4326 (lon/lat)
				const transformedExtent = transformExtent(
					boxExtent,
					'EPSG:3857', // Source projection (web mercator)
					'EPSG:4326' // Target projection (lon/lat)
				);

				// Extract corners of the box in lon/lat
				const [minLon, minLat, maxLon, maxLat] = transformedExtent;

				// Log or use the coordinates
				console.log('Southwest Corner (Lon, Lat):', minLon, minLat);
				console.log('Northeast Corner (Lon, Lat):', maxLon, maxLat);

				// Example: You could use these coordinates for further logic
				alert(`Dragged Box Lon/Lat:
Southwest: [${minLon}, ${minLat}]
Northeast: [${maxLon}, ${maxLat}]`);
			});
		}
	}

	// fungsi menampilkan layer level 2
	async function addLayerLevel3(id_geo) {
		svgload = true;

		// let geoLevel3 = await getData(`/api/geo`, {
		// 	params: {
		// 		level: '3',
		// 		id: `${id_geo}`
		// 	}
		// });

		if (vectorLayerGeo3) {
			map.removeLayer(vectorLayerGeo3);
		}

		if (vectorLayerGeo4) {
			map.removeLayer(vectorLayerGeo4);
		}

		const vectorSource = new VectorSource({
			url: '/gadm41_IDN_3.geojson',
			format: new GeoJSON()
		});

		vectorLayerGeo3 = new VectorLayer({
			source: vectorSource,
			style: new Style({
				// fill: new Fill({
				//     color: 'red'
				// }),
				stroke: new Stroke({
					color: '#6B7280',
					width: 1
				})
			})
		});

		map.addLayer(vectorLayerGeo3);

		// SELECTOR LEVEL 1 untuk lihat level 2
		let selectLayerVector = new Select({
			condition: click,
			layers: [vectorLayerGeo3],
			style: null
		});

		map.addInteraction(selectLayerVector);

		selectLayerVector.on('select', function (e) {
			const selectedFeatures = e.selected;
			if (selectedFeatures.length > 0) {
				let id_geo = selectedFeatures[0].values_.CC_3;
				addLayerLevel4(id_geo);
				zoomToOlUid(selectedFeatures[0].ol_uid, id_geo);
			}
		});
		selectLayerVector.getLayer(vectorLayerGeo3);
		vectorLayerGeo3.getSource().on('featuresloadstart', () => {
			svgload = false;
		});

		vectorLayerGeo3.getSource().on('featuresloadend', () => {
			svgload = false;
		});
	}

	// fungsi menampilkan layer level 2
	async function addLayerLevel4(id_geo) {
		svgload = true;

		// let geoLevel3 = await getData(`/api/geo`, {
		// 	params: {
		// 		level: '4',
		// 		id: `${id_geo}`
		// 	}
		// });

		if (vectorLayerGeo4) {
			map.removeLayer(vectorLayerGeo4);
		}

		const vectorSource = new VectorSource({
			url: '/gadm41_IDN_4.geojson',
			format: new GeoJSON()
		});

		vectorLayerGeo4 = new VectorLayer({
			source: vectorSource,
			style: new Style({
				// fill: new Fill({
				//     color: 'rgba(255, 255, 255, 0.6)'
				// }),
				stroke: new Stroke({
					color: '#111928CC',
					width: 1
				})
			})
		});

		map.addLayer(vectorLayerGeo4);

		// SELECTOR LEVEL 1 untuk lihat level 2
		let selectLayerVector = new Select({
			condition: click,
			layers: [vectorLayerGeo4],
			style: null
		});

		map.addInteraction(selectLayerVector);

		selectLayerVector.on('select', function (e) {
			const selectedFeatures = e.selected;
			if (selectedFeatures.length > 0) {
				let id_geo = selectedFeatures[0].values_.CC_4;
				// addLayerLevel4(id_geo);
				// zoomToOlUid(selectedFeatures[0].ol_uid,id_geo);
			}
		});
		selectLayerVector.getLayer(vectorLayerGeo4);

		vectorLayerGeo4.getSource().on('featuresloadstart', () => {
			svgload = false;
		});

		vectorLayerGeo4.getSource().on('featuresloadend', () => {
			svgload = false;
		});
	}

	// Klasifikasi Marker
	function warnaMark(category) {
		let markColor = 'bg-gray-400';

		if (category == 'baik') {
			markColor = 'bg-[#22AD5C]';
		}
		if (category == 'sedang') {
			markColor = 'bg-[#01A9DB]';
		}
		if (category == 'tidak_sehat') {
			markColor = 'bg-[#FBBF24]';
		}
		if (category == 'sangat_tidak_sehat') {
			markColor = 'bg-[#F23030]';
		}
		if (category == 'berbahaya') {
			markColor = 'bg-[#0C0C0D]';
		}
		if (category == 'offline') {
			markColor = 'bg-gray-400';
		}

		return markColor;
	}

	// actViewDataUdaraOld
	async function actViewDataUdara() {
		if (overlayMarker.length > 0) {
			overlayMarker.forEach((element) => {
				map.removeOverlay(element);
			});
		}

		airStations.forEach((marker, index) => {
			ispus.forEach((ispu) => {
				if (ispu.id_stasiun === marker.id_station) {
					if (ispu.is_filter === 1) {
						marker.ispu_data = ispu;

						const values = [ispu.pm25, ispu.pm10, ispu.so2, ispu.co, ispu.o3, ispu.no2, ispu.hc];

						const highestValue = Math.max(...values);

						marker.highestValue = highestValue;

						if (marker.highestValue) {
							const filteredAQI = aqis.filter(
								(item) =>
									item.min_value <= marker.highestValue &&
									(item.max_value >= marker.highestValue || item.max_value === null)
							);

							marker.aqi = filteredAQI[0];
						}
					}
				}
			});

			marker.lonlat = [marker.lon, marker.lat];
			let markColor = warnaMark(marker.aqi ? marker.aqi.category : '');
			const element = document.createElement('div');
			element.id = `marker-${index + 1}`;
			element.className = 'marker z-30';
			element.innerHTML = markUdara(markColor, marker.highestValue);
			element.addEventListener('click', async () => {
				$showComparisonStation = false;
				selectedAirStation = marker;
				await getDemographyData(selectedAirStation.id_station, 1);
				viewDataUdara = true;
				modalDetailData = true;
				modalIspuRankStatus = false;
				modalIspuRankOpen = false;
				showMapView = false;

				const parentStationIdentity =
					selectedAirStation.id_station + '-' + selectedAirStation.tipe_station;

				getChildAirStations(parentStationIdentity);
			});

			const markerOverlay = new Overlay({
				position: fromLonLat(marker.lonlat),
				positioning: 'center-center',
				element: element,
				stopEvent: false
			});

			overlayMarker.push(markerOverlay);
			map.addOverlay(markerOverlay);
		});

		modalDetailData = false;
		modalIspuRankStatus = true;
		modalIspuRankOpen = false;
		viewDataUdara = true;
		viewDataIndustri = false;
		viewDataTransportasi = false;
	}
	// End of actViewDataUdaraOld

	async function actViewDataUdaraPm25() {
		if (overlayMarker.length > 0) {
			overlayMarker.forEach((element) => {
				map.removeOverlay(element);
			});
		}

		ispuByRadius.forEach((ispu, index) => {
			// if (ispu.id_stasiun && ispu.tipe_stasiun) {
			if (ispu.id_stasiun && ispu.tipe_stasiun && ispu.highest.value > 0) {
				// Join ISPU with Master AQI
				if (ispu.highest.value >= 0) {
					const filteredAQI = aqis.filter(
						(item) =>
							item.min_value <= ispu.highest.value &&
							(item.max_value >= ispu.highest.value || item.max_value === null)
					);

					ispu.aqi = filteredAQI[0];
				}
				// End of Join ISPU with Master AQI

				let matchingStation;
				// Join ISPU with Master Station
				if (airStations.length > 0) {
					matchingStation = airStations.filter((station) => station.id_station === ispu.id_stasiun);
				}
				// End of Join ISPU with Master Station

				ispu.lonlat = [ispu.lon, ispu.lat];
				let markColor = warnaMark(ispu.aqi ? ispu.aqi.category : 'offline');
				const element = document.createElement('div');
				element.id = `marker-${index + 1}`;
				element.className = 'marker z-30';
				element.innerHTML = markUdara(
					ispu.highest.value === 0 ? 'bg-gray-400' : markColor,
					ispu.highest.value
				);
				element.addEventListener('click', async () => {
					$showComparisonStation = false;
					selectedAirStation = ispu;
					selectedAirStation.markerId = element.id;
					selectedAirStation.stationData = matchingStation[0];
					await getDemographyData(selectedAirStation.id_stasiun, 1);
					selectedAirStation.forecast = await getForecastData(selectedAirStation.id_stasiun);
					viewDataUdara = true;
					modalDetailData = true;
					modalIspuRankStatus = false;
					modalIspuRankOpen = false;
					showMapView = false;
				});

				const markerOverlay = new Overlay({
					position: fromLonLat(ispu.lonlat),
					positioning: 'center-center',
					element: element,
					stopEvent: false
				});

				overlayMarker.push(markerOverlay);
				map.addOverlay(markerOverlay);
			}
		});

		modalDetailData = false;
		modalIspuRankStatus = true;
		modalIspuRankOpen = false;
		viewDataUdara = true;
		viewDataIndustri = false;
		viewDataTransportasi = false;
	}

	async function actViewDataIndustri() {
		if (overlayMarker.length > 0) {
			overlayMarker.forEach((element) => {
				map.removeOverlay(element);
			});
		}

		industri.forEach((marker) => {
			marker.lonlat = [marker.lng, marker.lat];
			let markColor = 'bg-sky-500';
			markColor = warnaMark(marker.status);
			const element = document.createElement('div');
			element.className = 'marker';
			element.innerHTML = markIndustri(markColor, marker.ispu_03.value);

			element.addEventListener('click', () => {
				selectedAirStation = marker;
				viewDataUdara = false;
				viewDataIndustri = true;
				viewDataTransportasi = false;
				modalDetailData = true;
				modalIspuRankStatus = false;
				modalIspuRankOpen = false;
				showMapView = false;
			});

			const markerOverlay = new Overlay({
				position: fromLonLat(marker.lonlat),
				positioning: 'center-center',
				element: element,
				stopEvent: false
			});

			overlayMarker.push(markerOverlay);
			map.addOverlay(markerOverlay);
		});

		modalDetailData = false;
		modalIspuRankStatus = true;
		modalIspuRankOpen = false;

		viewDataUdara = false;
		viewDataIndustri = true;
		viewDataTransportasi = fa;
	}

	async function actViewDataTransportasi() {
		if (overlayMarker.length > 0) {
			overlayMarker.forEach((element) => {
				map.removeOverlay(element);
			});
		}

		transportasi.forEach((marker) => {
			marker.lonlat = [marker.lng, marker.lat];
			let markColor = 'bg-sky-500';
			markColor = warnaMark(marker.status);
			const element = document.createElement('div');
			element.className = 'marker';
			element.innerHTML = markTransportasi(markColor, marker.ispu_03.value);
			element.addEventListener('click', () => {
				selectedAirStation = marker;
				viewDataTransportasi = true;
				modalDetailData = true;
			});

			const markerOverlay = new Overlay({
				position: fromLonLat(marker.lonlat),
				positioning: 'center-center',
				element: element,
				stopEvent: false
			});

			overlayMarker.push(markerOverlay);
			map.addOverlay(markerOverlay);
		});

		modalDetailData = false;
		modalIspuRankStatus = true;
		modalIspuRankOpen = false;

		viewDataUdara = false;
		viewDataIndustri = false;
		viewDataTransportasi = true;
	}

	function closeModalDetailData() {
		modalDetailData = false;
		modalIspuRankStatus = true;
		modalIspuRankOpen = false;
		showMapView = true;
	}

	function actSelect(value) {
		selectValue = value;
		selectOpen = false;
		if (value == 'bw') {
			// bataswilayah();
			switchToGeoJSON();
		}
		if (value == 's') {
			// satelit();
			switchToSatellite();
		}
	}

	function openSelect() {
		selectOpen = !selectOpen;
	}

	async function actSelectParamIspu(value) {
		selectedValueParamIspu = value;
		selectOpenParams = false;
		ispuRankAllParams = value;

		await getIspuRankAll();
	}

	function openSelectParamIspu() {
		selectOpenParams = !selectOpenParams;
	}

	function actSelectJenisStasiun(value) {
		selectedStationType = value;
		ispuRankAll = ispuRankAll.filter(
			(station) => station && station.tipe_stasiun && station.tipe_stasiun === value
		);

		selectOpenJenisStasiun = false;
	}

	function modalIspuRank(is_open) {
		modalIspuRankOpen = is_open;
	}

	async function calculateMapScale() {
		const view = map.getView();

		// Get center coordinates in longitude and latitude
		const centerCoordinates = toLonLat(getCenter(view.calculateExtent()));
		const longitude = centerCoordinates[0];
		const latitude = centerCoordinates[1];

		currentLongitude = longitude;
		currentLatitude = latitude;

		currentRadius = getRadiusInKm([currentLongitude, currentLatitude]);
		currentRadius = parseFloat(currentRadius.toFixed(2));

		await getIspuByRadius();
		$isPm25App ? actViewDataUdaraPm25() : actViewDataUdara();
	}

	function getRadiusInKm(centerLonLat) {
		const view = map.getView();

		// Convert center to map coordinates
		const centerMapCoords = fromLonLat(centerLonLat);

		// Get current resolution (meters/pixel)
		const resolution = view.getResolution();

		// Get the extent of the map in map units
		const extent = view.calculateExtent(map.getSize());

		// Calculate the center point and a point on the edge of the extent (to the right)
		const rightEdgeCoords = [extent[2], centerMapCoords[1]];

		// Convert both the center and right edge points to lon/lat
		const centerLonLatCoords = toLonLat(centerMapCoords);
		const rightEdgeLonLatCoords = toLonLat(rightEdgeCoords);

		// Calculate the distance between the center and the right edge in meters
		const radiusInMeters = getDistance(centerLonLatCoords, rightEdgeLonLatCoords);

		// Convert meters to kilometers
		const radiusInKm = radiusInMeters / 1000;

		// console.log(`Map Radius: ${radiusInKm.toFixed(2)} km`);
		return radiusInKm;
	}

	const getAqi = async () => {
		try {
			const response = await axios.get('/api/master/aqi', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			aqis = response.data.data.aqi;
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getAqi');
		}
	};

	const getAirStations = async () => {
		try {
			const response = await axios.get('/api/master/station', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			if ($isPm25App) {
				airStations = response.data.data.station;
			} else {
				for (let i = 0; i < response.data.data.station.length; i++) {
					const station = response.data.data.station[i];
					station.forecast = weatherForecast[i];

					if (station.tipe_station === 'lowcost') {
						airStations.push(station);
					}
				}
			}
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getAirStations');
		}
	};

	const getIspuData = async (id_stasiun = null, tipe_stasiun = null) => {
		// const sixDaysAgo =
		// const date_from = (id_stasiun && tipe_stasiun) === null ? currentDay : null;
		// const date_to = (id_stasiun && tipe_stasiun) === null ? sixDaysAgo : null;

		const date_from = (id_stasiun && tipe_stasiun) === null ? '2024-09-18T00:00:00.000Z' : null;
		const date_to = (id_stasiun && tipe_stasiun) === null ? '2024-09-18T23:59:59.000Z' : null;

		try {
			const response = await axios.get('/api/aqms/ispu_data', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun,
					tipe_stasiun,
					date_from,
					date_to
				}
			});
			if (id_stasiun === null && tipe_stasiun === null) {
				ispus = response.data.data.aqm_ispu;
			} else {
				return response.data.data.aqm_ispu[0];
			}
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getIspuData');
		}
	};

	const getIspuRankAll = async (type = 'lowcost') => {
		const tipe_stasiun = $isPm25App ? 'dlh_dki_pm25' : type;

		try {
			const response = await axios.get('/api/aqms/ispu_rank_all', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					parameter: ispuRankAllParams,
					is_filter: 0
					// tipe_stasiun
				}
			});

			ispuRankAll = response.data.data.aqm_ispu;
			ispuRankAll = ispuRankAll.filter(
				(ispu) => ispu.tipe_stasiun === 'lowcost' || ispu.tipe_stasiun === 'dlh_dki_pm25'
			);

			// Hapus data ispu jika valuenya 0
			// ispuRankAll = ispuRankAll.filter(
			// 	(aqm) => aqm[ispuRankAllParams] !== null && aqm[ispuRankAllParams] !== 0
			// );
			ispuRankAll = ispuRankAll.filter(
				(aqm) => aqm[ispuRankAllParams] && aqm[ispuRankAllParams] > 0
			);

			// Tambahkan data kategori dan nama stasiun
			ispuRankAll.map((aqm) => {
				const filteredAQI = aqis.filter(
					(item) =>
						item.min_value <= aqm[ispuRankAllParams] &&
						(item.max_value >= aqm[ispuRankAllParams] || item.max_value === null)
				);

				aqm.category = filteredAQI[0].category;

				if ($isPm25App) {
					const matchingStation = airStations.filter((station) => {
						return station.id_station === aqm.id_stasiun;
					});

					aqm.name = matchingStation[0].nama;
				}
			});

			ispuRankAll.forEach((item, index) => {
				// Assign rank in ascending order
				ispuRankAll[index].rankDesc = index + 1;

				// Assign rank in descending order
				ispuRankAll[index].rankAsc = ispuRankAll.length - index;
			});
		} catch (error) {
			console.log(error);
		}
	};

	const getIspuTopRank = async (type = 'lowcost') => {
		const tipe_stasiun = $isPm25App ? 'dlh_dki_pm25' : type;

		try {
			const response = await axios.get('/api/aqms/ispu_top_rank', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					number: 3
					// tipe_stasiun
				}
			});

			ispuTopRank = response.data.data.aqm_ispu;

			// Hapus data ispu jika valuenya 0
			ispuTopRank = ispuTopRank.filter(
				(aqm) =>
					(aqm.value !== null && aqm.value !== 0 && aqm.tipe_stasiun === 'lowcost') ||
					aqm.tipe_stasiun === 'dlh_dki_pm25'
			);

			ispuTopRank.map((aqm) => {
				const filteredAQI = aqis.filter(
					(item) =>
						item.min_value <= aqm.value && (item.max_value >= aqm.value || item.max_value === null)
				);

				aqm.category = filteredAQI[0].category;

				if ($isPm25App) {
					const matchingStation = airStations.filter((station) => {
						return station.id_station === aqm.id_stasiun;
					});

					aqm.name = matchingStation[0].nama;
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	const getForecast = async () => {
		try {
			const response = await fetch('/forecast.json');

			weatherForecast = await response.json();
		} catch (error) {
			console.log(error);
		}
	};

	const getForecastData = async (id_stasiun) => {
		try {
			const response = await axios.get('/api/aqms/ispu_forecast', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun
				}
			});

			return response.data.data.aqm_ispu;
		} catch (error) {
			console.log(error);
		}
	};

	const getIspuByRadius = async (type = 'lowcost') => {
		const tipe_stasiun = $isPm25App ? 'dlh_dki_pm25' : type;

		try {
			const response = await axios.get('/api/aqms/ispu_by_radius', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					lon: currentLongitude,
					lat: currentLatitude,
					radius: currentRadius
					// tipe_stasiun
				}
			});

			// Changes 5 Mar 2025
			// ispuByRadius = response.data.data.aqm_ispu.filter((ispu) => {
			// 	return (
			// 		(ispu.is_filter === 1 && ispu.tipe_stasiun === 'lowcost') ||
			// 		ispu.tipe_stasiun === 'dlh_dki_pm25'
			// 	);
			// });

			// Changes 5 Mar 2025
			ispuByRadius = response.data.data.aqm_ispu;
			// console.log(ispuByRadius);

			ispuByRadius.map((ispu, index) => {
				ispu.forecast = weatherForecast[index];
			});
		} catch (error) {
			console.log(error, '< < < getIspuByRadius');
		}
	};

	const getDemographyData = async (id_station = null, district_level = null) => {
		try {
			const response = await axios.get('/api/master/demografi', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_station,
					district_level
				}
			});

			demography = district_level ? response.data.data.demografi[0] : response.data.data.demografi;
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getDemographyData');
		}
	};

	const getChildAirStations = async (parentStationId) => {
		try {
			const response = await axios.get('/api/master/station', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					parent_id: parentStationId
				}
			});

			selectedChildStation = response.data.data.station[0];
			selectedChildStation.ispu_data = await getIspuData(
				selectedChildStation.id_station,
				selectedChildStation.tipe_station
			);
		} catch (error) {
			const response = error.response;

			if (response.status === 404) {
				selectedChildStation = response.data.station;
			}
		}
	};

	onMount(async () => {
		$isLoading = true;
		accessToken = localStorage.getItem('accessToken');
		const role = localStorage.getItem('role');

		if (role && role.includes('pm25')) {
			$isPm25App = true;
			selectedValueParamIspu = $isPm25App ? 'pm25' : 'pm10';
		}

		await getForecast();
		await getAqi();
		await getAirStations();
		if (!$isPm25App) await getIspuData();
		await getIspuRankAll();
		await getIspuTopRank();

		vectorSourcegeojsonindonesia = new VectorSource({
			url: '/gadm41_IDN_2.geojson',
			format: new GeoJSON()
		});

		vector = new VectorLayer({
			source: vectorSourcegeojsonindonesia,
			background: '#6B7280',
			style: (feature) => {
				const province = feature.get('NAME_1') || '';

				if (province === 'JakartaRaya') {
					return new Style({
						fill: new Fill({
							color: '#131B2A'
						}),
						stroke: new Stroke({
							color: '#6B7280',
							width: 1
						}),
						text: new Text({
							text: feature.get('NAME_2') || '',
							fill: new Fill({
								color: '#fefefe'
							}),
							stroke: new Stroke({
								color: '#000000',
								width: 1
							}),
							font: '16px Arial, sans-serif'
						})
					});
				}

				return new Style({
					fill: new Fill({
						color: '#1D2534'
					}),
					stroke: new Stroke({
						color: '#6B7280',
						width: 1
					})
				});
			}
		});

		map = new Map({
			target: 'map',
			layers: [vector],
			view: new View({
				center: fromLonLat([currentLongitude, currentLatitude]),
				zoom: 11.7,
				maxZoom: 14,
				minZoom: 5
			})
		});

		vector.getSource().on('featuresloadstart', () => {
			// Menambahkan GRID GEOJSON Layer
			// showGridLayer();

			// Menampilkan Marker Udara ke peta
			// actViewDataUdara();

			svgload = false;
		});

		let timeoutId;
		let zooming = false; // Flag to track zooming state

		map.on('moveend', () => {
			// Only trigger map scale calculation if it's not during zooming
			if (!zooming && !modalDetailData) {
				calculateMapScale();
			}
		});

		map.getView().on('change:resolution', () => {
			if (!modalDetailData) {
				// Set the zooming flag to true when resolution changes (i.e., zooming)
				zooming = true;

				// Clear the previous timeout if there's any
				clearTimeout(timeoutId);

				// Set a new timeout to call the function after zoom has completed
				timeoutId = setTimeout(() => {
					// After delay, reset the zooming flag and calculate map scale
					zooming = false;
					calculateMapScale();
				}, 300); // Adjust the delay as needed
			}
		});

		currentRadius = getRadiusInKm([currentLongitude, currentLatitude]);
		currentRadius = currentRadius.toFixed(2);

		await getIspuByRadius();
		$isPm25App ? actViewDataUdaraPm25() : actViewDataUdara();

		$isLoading = false;
	});
</script>

<svelte:head>
	<title>ZiCare Air Quality Monitoring System</title>
</svelte:head>

<SidebarNav {handleModeling} />

<div transition:fade={{ duration: 200 }} class="min-h-full min-w-full">
	<!-- Map -->
	<div
		transition:fade={{ duration: 200 }}
		id="map"
		class="w-full h-full fixed bg-gt-color-dark-3-transparent"
	></div>
	<!-- End of Map -->

	<!-- Expanded ISPU Rank Card [CEK LAGI] -->
	{#if modalIspuRankOpen && modalIspuRankStatus}
		<div transition:fade={{ duration: 200 }}>
			{#if $isPm25App}
				<ExpandedIspuRankCardPm25
					{modalIspuRank}
					{openSelectParamIspu}
					{getArrayBy}
					{selectValueParamIspus}
					{selectedValueParamIspu}
					{selectOpenParams}
					{actSelectParamIspu}
					{stationTypes}
					{selectedStationType}
					{selectOpenJenisStasiun}
					{ispuRankAll}
				/>
			{:else}
				<ExpandedIspuRankCard
					{modalIspuRank}
					{openSelectParamIspu}
					{getArrayBy}
					{selectValueParamIspus}
					{selectedValueParamIspu}
					{selectOpenParams}
					{actSelectParamIspu}
					{stationTypes}
					{selectedStationType}
					{selectOpenJenisStasiun}
					{actSelectJenisStasiun}
					{ispuRankAll}
				/>
			{/if}
		</div>
	{/if}
	<!-- End of Expanded ISPU Rank Card -->

	<!-- Detail Stasiun Modal -->
	{#if modalDetailData}
		<div transition:fade={{ duration: 200 }}>
			{#if $isPm25App}
				<DetailStationModalPm25
					{selectedAirStation}
					{demographyModal}
					{totalPopulationChecked}
					{areaSizeChecked}
					{populationDensityChecked}
					{handleTotalPopulationToggle}
					{demography}
				/>
			{:else}
				<DetailStationModal
					{selectedAirStation}
					{demographyModal}
					{totalPopulationChecked}
					{areaSizeChecked}
					{populationDensityChecked}
					{handleTotalPopulationToggle}
					{demography}
				/>
			{/if}
		</div>
	{/if}

	<!-- End of Detail Stasiun Modal -->

	<!-- Kualitas Udara Modal -->
	{#if modalDetailData}
		<div transition:fade={{ duration: 200 }}>
			{#if $isPm25App}
				<AirQualityModalPm25
					{accessToken}
					{closeModalDetailData}
					{selectedAirStation}
					{handleAccordion}
				/>
			{:else}
				<AirQualityModal
					{accessToken}
					{closeModalDetailData}
					{selectedAirStation}
					{handleAccordion}
					{selectedChildStation}
				/>
			{/if}
		</div>
	{/if}
	<!-- End of Kualitas Udara Modal -->

	<!-- Meteorology Modal -->
	{#if modalDetailData && showMeteorologyModal}
		<div transition:fade={{ duration: 200 }}>
			{#if $isPm25App}
				<MeteorologyModalPm25
					{showMeteorologyModal}
					{selectedAirStation}
					{handleAccordion}
					{handleMeteorologyModal}
				/>
			{:else}
				<MeteorologyModal
					{showMeteorologyModal}
					{selectedAirStation}
					{handleAccordion}
					{handleMeteorologyModal}
					{selectedChildStation}
				/>
			{/if}
		</div>
	{/if}
	<!-- End of Meteorology Modal -->

	<!-- Forecast Modal -->
	{#if modalDetailData && showForecastModal}
		<div transition:fade={{ duration: 200 }}>
			<!-- {#if $isPm25App} -->
			<ForecastModalPm25 bind:showForecastModal bind:selectedAirStation {handleForecastModal} />
			<!-- {/if} -->
		</div>
	{/if}
	<!-- End of Forecast Modal -->

	<!-- Map View -->
	{#if showMapView}
		<MapView {openSelect} {getArrayBy} {selectValueUdara} {selectValue} {selectOpen} {actSelect} />
	{/if}
	<!-- End of Map View -->

	<!-- Legend -->
	<Legend />
	<!-- End of Legend -->

	<!-- Data View -->
	<div in:fade={{ duration: 200 }}>
		{#if $isPm25App}
			<DataViewPm25 {showGridLayer} {showGrid} {actViewDataUdaraPm25} {viewDataUdara} />
		{:else}
			<DataViewPm25 {showGrid} {actViewDataUdaraPm25} {viewDataUdara} />
			<!-- <DataView
				{showGridLayer}
				{showGrid}
				{actViewDataUdara}
				{viewDataUdara}
				{actViewDataIndustri}
				{viewDataIndustri}
				{actViewDataTransportasi}
				{viewDataTransportasi}
			/> -->
		{/if}
	</div>
	<!-- End of Data View -->

	<!-- Zoom -->
	<ZoomPanel {zoomIn} {zoomOut} />
	<!-- End of Zoom -->

	<!-- Loader -->
	{#if svgload || $isLoading}
		<Loading></Loading>
	{/if}
	<!-- End of Loader -->
</div>
