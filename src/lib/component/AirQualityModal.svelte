<script>
	import { fade, fly } from 'svelte/transition';
	import { showComparisonStation, expandedAccordion } from '$lib/index';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import axios from 'axios';
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
	import AirQualityAccordion from '$lib/component/AirQualityAccordion.svelte';
	import AirQualityAccordionPM25 from '$lib/component/AirQualityAccordionPM25.svelte';

	export let accessToken, closeModalDetailData, selectedAirStation, selectedChildStation;
	export let handleAccordion = () => {};

	let userRole = '';

	let comparisonStationWidth;
	$: selectComparisonStation = false;

	$: ispuData = [];
	$: ispuDataComparison = [];
	$: firstOpenedStation = '';

	let metrics = ['pm10', 'pm25', 'so2', 'co', 'o3', 'no2', 'hc'];

	// Initialize empty reactive objects
	$: data = {};
	$: comparisonData = {};
	$: charts = {};

	// Populate reactive variables
	$: {
		metrics.forEach((metric) => {
			data[metric] = [];
			comparisonData[metric] = [];
			charts[metric] = null;
		});
	}

	$: chartMap = {};
	$: {
		metrics.forEach((metric) => {
			chartMap[metric] = {
				type: metric,
				chartName: `${metric}Chart`,
				instance: charts[metric]
			};
		});
	}

	let separatorClass = '';

	$: if (selectedAirStation.aqi.category === 'baik') {
		separatorClass = 'bg-[#22AD5C]';
	} else if (selectedAirStation.aqi.category === 'sedang') {
		separatorClass = 'bg-[#01A9DB]';
	} else if (selectedAirStation.aqi.category === 'tidak_sehat') {
		separatorClass = 'bg-[#FBBF24]';
	} else if (selectedAirStation.aqi.category === 'sangat_tidak_sehat') {
		separatorClass = 'bg-[#F23030]';
	} else if (selectedAirStation.aqi.category === 'berbahaya') {
		separatorClass = 'bg-[#0C0C0D]';
	}

	function defAirQualityLineChart(type, chartName = null) {
		am5.ready(function () {
			const root = am5.Root.new(chartName);
			let chartData;
			let chartDataComparison;

			charts[type] = root;
			chartData = data[type];

			if ($showComparisonStation) {
				chartDataComparison = comparisonData[type];
			}

			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push(
				am5xy.XYChart.new(root, {
					panX: true,
					panY: true,
					wheelX: 'panX',
					wheelY: 'zoomX',
					pinchZoomX: true
				})
			);

			var cursor = chart.set(
				'cursor',
				am5xy.XYCursor.new(root, {
					behavior: 'none'
				})
			);
			cursor.lineY.set('visible', false);

			// Create X-Axis (Date Axis)
			let xAxis = chart.xAxes.push(
				am5xy.DateAxis.new(root, {
					maxDeviation: 0.5,
					baseInterval: {
						timeUnit: 'day',
						count: 1
					},
					renderer: am5xy.AxisRendererX.new(root, {
						minGridDistance: 50
					}),
					tooltip: am5.Tooltip.new(root, {})
				})
			);

			let xRenderer = xAxis.get('renderer');

			xRenderer.labels.template.setAll({
				fill: am5.color('#FEFEFE'),
				fontSize: 12,
				fontWeight: 400
			});

			// Create Y-Axis (Value Axis)
			let yAxis = chart.yAxes.push(
				am5xy.ValueAxis.new(root, {
					min: 0,
					max: 550,
					renderer: am5xy.AxisRendererY.new(root, {
						opposite: false
					})
				})
			);

			let yRenderer = yAxis.get('renderer');

			yRenderer.labels.template.setAll({
				visible: false
			});

			function createSeries(
				valueField,
				seriesStrokeColor,
				addTooltip = false,
				isFirstSeries = false
			) {
				// Create a new tooltip for each series
				var seriesTooltip = am5.Tooltip.new(root, {
					labelText: '{valueY}',
					getStrokeFromSprite: false
				});

				seriesTooltip.label.setAll({
					fill: am5.color('#F9FAFB')
				});

				seriesTooltip.get('background').setAll({
					fill: am5.color('#111928'),
					fillOpacity: 1,
					shadowColor: am5.color(seriesStrokeColor),
					stroke: am5.color(seriesStrokeColor),
					shadowBlur: 10,
					shadowOffsetX: 5,
					shadowOffsetY: 5,
					shadowOpacity: 0.3
				});

				var series = chart.series.push(
					am5xy.SmoothedXLineSeries.new(root, {
						name: 'Series',
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: valueField,
						valueXField: 'date',
						tooltip: seriesTooltip,
						stroke: am5.color(seriesStrokeColor),
						fill: am5.color(seriesStrokeColor)
					})
				);

				series.strokes.template.setAll({
					strokeWidth: 3,
					shadowColor: am5.color(0x000000),
					shadowBlur: 10,
					shadowOffsetX: 3,
					shadowOffsetY: 3,
					shadowOpacity: 0.2
				});

				series.fills.template.setAll({
					visible: false,
					fillOpacity: 0.3
				});

				series.bullets.push(function () {
					return am5.Bullet.new(root, {
						locationY: 0,
						sprite: am5.Circle.new(root, {
							radius: 4,
							stroke: am5.color('#133F41'),
							strokeWidth: 3,
							fill: am5.color(seriesStrokeColor),
							visible: true
						})
					});
				});

				return series; // Return the series
			}

			// Create primary series
			var seriesPrimary = createSeries('value', '#1BD5A6', true, true);
			seriesPrimary.data.setAll(chartData);

			if ($showComparisonStation) {
				var seriesSecondary = createSeries('value', '#A851DA');
				seriesSecondary.data.setAll(chartDataComparison);
			}

			// Add color ranges
			function addColorRange(startValue, endValue, color) {
				let range = yAxis.makeDataItem({
					value: startValue,
					endValue: endValue
				});

				yAxis.createAxisRange(range);

				range.get('grid').setAll({
					stroke: color,
					strokeOpacity: 1,
					strokeWidth: 4
				});

				range.get('axisFill').setAll({
					visible: false
				});
			}

			// Adding ranges for color
			addColorRange(0, 50, am5.color('#2F9E5E'));
			addColorRange(51, 100, am5.color('#159BC3'));
			addColorRange(101, 200, am5.color('#DDAD31'));
			addColorRange(201, 300, am5.color('#D33B3B'));
			addColorRange(301, 999, am5.color('#1E1E1F'));

			chart.appear(1000, 100);
		});
	}

	async function generateChartData(type, isComparison = false) {
		const dataSource = isComparison ? ispuDataComparison : ispuData;

		const getTimestampFromTime = (waktu) => {
			const dateOnly = waktu.split('T')[0];

			return new Date(dateOnly).getTime();
		};

		const groupedData = dataSource.reduce((acc, item) => {
			const timestamp = getTimestampFromTime(item.waktu);

			if (!acc[timestamp]) acc[timestamp] = [];
			acc[timestamp].push(item);

			return acc;
		}, {});

		const metricMap = {
			pm10Chart: 'pm10',
			pm25Chart: 'pm25',
			so2Chart: 'so2',
			coChart: 'co',
			o3Chart: 'o3',
			no2Chart: 'no2',
			hcChart: 'hc'
		};

		const dailyData = Object.keys(groupedData)
			.map((timestamp) => {
				const values = groupedData[timestamp]
					.map((item) => parseFloat(item[metricMap[type]]))
					.filter((value) => !isNaN(value));

				const avg =
					values.length > 0
						? parseFloat((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2))
						: 1;

				return {
					date: parseInt(timestamp),
					value: avg
				};
			})
			.reverse();

		if (isComparison) {
			comparisonData[metricMap[type]] = dailyData;
		} else {
			data[metricMap[type]] = dailyData;
		}
	}

	function clearChartDataComparison(type) {
		comparisonData[type] = [];
	}

	function handleShowChart(chartType, chartName, chartInstance, showChart) {
		if (showChart) {
			defAirQualityLineChart(chartType, chartName);
		} else {
			if (chartInstance !== null) {
				chartInstance.dispose();
				chartInstance = null;
			}
		}
	}

	const getIspuData = async () => {
		// const today = new Date();
		// const pastDate = new Date(today);
		// pastDate.setDate(today.getDate() - 6);
		const date_from = '2024-10-12T00:00:00.000Z';
		const date_to = '2024-10-18T23:59:59.000Z';

		try {
			const response = await axios.get('/api/aqms/ispu_data', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedAirStation.id_station,
					tipe_stasiun: selectedAirStation.tipe_station,
					date_from: date_from,
					date_to: date_to
					// date_from: pastDate.toISOString(),
					// date_to: today.toISOString()
				}
			});

			ispuData = response.data.data.aqm_ispu;
			// latestIspuData = ispuData[0];
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getIspuData');
		}
	};

	const getIspuDataComparison = async () => {
		// const today = new Date();
		// const pastDate = new Date(today);
		// pastDate.setDate(today.getDate() - 6);
		const date_from = '2024-10-12T00:00:00.000Z';
		const date_to = '2024-10-18T23:59:59.000Z';

		try {
			const response = await axios.get('/api/aqms/ispu_data', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedAirStation.id_station,
					tipe_stasiun: 'lab',
					date_from: date_from,
					date_to: date_to
					// date_from: pastDate.toISOString(),
					// date_to: today.toISOString()
				}
			});

			ispuDataComparison = response.data.data.aqm_ispu;
			// latestIspuDataComparison = ispuDataComparison[0];
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getIspuDataComparison');
		}
	};

	onMount(async () => {
		accessToken = localStorage.getItem('accessToken');
		userRole = localStorage.getItem('role');
		firstOpenedStation = selectedAirStation.id_station;
		await getIspuData();

		if (selectedChildStation) {
			await getIspuDataComparison();
		}
	});

	afterUpdate(async () => {
		if (userRole === 'admin-pm25') {
			getIspuData();

			if (selectedChildStation !== null) {
				getIspuDataComparison();
			}
		}

		if ($expandedAccordion in chartMap) {
			let { type, chartName, instance } = chartMap[$expandedAccordion];

			if ($showComparisonStation) {
				clearChartDataComparison(type);

				if (instance !== null) {
					instance.dispose();
					instance = null;
				}

				generateChartData(chartName);
				generateChartData(chartName, true);
				handleShowChart(type, chartName, instance, true);
			} else {
				clearChartDataComparison(type);

				if (instance !== null) {
					instance.dispose();
					instance = null;
				}

				generateChartData(chartName);
				handleShowChart(type, chartName, instance, true);
			}
		} else {
			Object.entries(chartMap).forEach(([key]) => {
				if (charts[key] !== null) {
					charts[key].dispose();
					charts[key] = null;
				}
			});
		}
	});

	onDestroy(() => {
		handleAccordion(null);
		Object.entries(chartMap).forEach(([key]) => {
			if (charts[key] !== null) {
				charts[key].dispose();
				charts[key] = null;
			}
		});
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed flex top-1 right-[12rem] mt-16 flex-end mr-[32.5px]"
>
	<div
		class="justify-end mt-7 w-[23rem] overflow-hidden shadow-lg border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div
			class="flex flex-col bg-gt-color-dark gap-2 p-6 border-b border-gt-color-dark-3-transparent"
		>
			<div class="flex flex-row gap-3 justify-between">
				<span class="font-bold text-base text-gt-color-gray">Kualitas Udara</span>

				<button on:click={closeModalDetailData} type="button" class="text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gt-color-gray"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-2 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gt-color-gray"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>

					<span class="font-medium text-xs text-gt-color-gray">DATA STASIUN</span>
				</div>

				<div in:fade={{ duration: 200 }} class="h-8 flex flex-row gap-2 justify-between">
					<div class="flex flex-row gap-3">
						<div class="flex flex-row gap-2 items-center">
							<div class="w-4 h-4 rounded {separatorClass}"></div>

							<div class="flex flex-row gap-3 rounded-lg p-2 justify-between items-center w-full">
								<span class="font-medium text-xs text-gt-color-gray">{selectedAirStation.nama}</span
								>

								<span
									class="py-0.5 px-2.5 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-[#F9FAFB] capitalize"
									>{selectedAirStation.tipe_station}</span
								>
							</div>
						</div>
					</div>

					<!-- Icon Arrow Right Left -->
					{#if $showComparisonStation}
						<button
							in:fade={{ duration: 150 }}
							type="button"
							class="inline-flex items-center p-1 hover:bg-slate-800 border border-gt-color-dark-3-transparent rounded-md ease-in-out duration-150"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5 text-gt-color-gray"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
								/>
							</svg>
						</button>
					{/if}
					<!-- Icon Arrow Right Left -->

					<!-- Icon Plus -->
					{#if selectedChildStation !== null}
						{#if $showComparisonStation === false}
							<button
								in:fade={{ duration: 200 }}
								on:click={() => ($showComparisonStation = true)}
								type="button"
								class="inline-flex items-center p-1 hover:bg-slate-800 border border-gt-color-dark-3-transparent rounded-md ease-in-out duration-150"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
							</button>
						{/if}
					{/if}
					<!-- End of Icon Plus -->
				</div>
			</div>

			<!-- Stasiun Udara Pembanding -->
			{#if $showComparisonStation}
				<div in:fly={{ y: 20, duration: 150 }} class="flex flex-col gap-2">
					<div class="flex flex-row gap-2 justify-between items-center">
						<div class="flex flex-row gap-3 w-full">
							<div class="relative flex flex-row gap-2 items-center w-full">
								<div class="w-4 h-4 rounded bg-[#AA52DD]"></div>

								<!-- <button
									type="button"
									on:click={() => (selectComparisonStation = !selectComparisonStation)}
									bind:clientWidth={comparisonStationWidth}
									class="flex flex-row gap-3 border border-gt-color-dark-3-transparent rounded-lg p-1.5 justify-between items-center w-full hover:ring-1 hover:ring-indigo-600"
								> -->

								<button
									type="button"
									on:click={() => (selectComparisonStation = !selectComparisonStation)}
									bind:clientWidth={comparisonStationWidth}
									class="flex flex-row gap-3 rounded-lg p-1.5 justify-between items-center w-full cursor-default"
								>
									<div class="flex flex-row items-center gap-3">
										<span class="font-medium text-xs text-gt-color-gray text-nowrap"
											>{selectedChildStation.nama}</span
										>

										<span
											class="py-0.5 px-2 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-[#F9FAFB] text-nowrap capitalize"
											>{selectedChildStation.tipe_station}</span
										>
									</div>
									<!-- <svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5 text-gt-color-gray"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m19.5 8.25-7.5 7.5-7.5-7.5"
										/>
									</svg> -->
								</button>

								<!-- {#if selectComparisonStation}
									<div
										transition:fly={{ y: 25, duration: 150 }}
										class="absolute top-10 right-0 z-10 origin-top-right rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent"
										style="width: {comparisonStationWidth}px;"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="menu-button"
										tabindex="-1"
									>
										<div class="flex flex-col gap-1 p-1" role="none">
											<div
												class="flex flex-row gap-3 items-center px-2 py-1.5 hover:bg-slate-800 hover:cursor-pointer rounded-md"
											>
												<span class="text-xs text-[#F9FAFB]">Jakarta Utara</span>
												<span
													class="py-0.5 px-2 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-[#F9FAFB]"
													>Low Cost</span
												>
											</div>

											<hr class="border-slate-800" />

											<div
												class="flex flex-row gap-3 items-center px-2 py-1.5 hover:bg-slate-800 hover:cursor-pointer rounded-md"
											>
												<span class="text-xs text-[#F9FAFB]">Jakarta Utara</span>
												<span
													class="py-0.5 px-2 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-[#F9FAFB]"
													>Mid</span
												>
											</div>
										</div>
									</div>
								{/if} -->
							</div>
						</div>

						<!-- Icon Minus -->
						<button
							on:click={() => (($showComparisonStation = false), (selectComparisonStation = false))}
							type="button"
							class="p-1 h-8 w-8 hover:bg-slate-800 border border-gt-color-dark-3-transparent rounded-md transition ease-in-out duration-150"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5 text-gt-color-gray"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
							</svg>
						</button>
						<!-- End of Icon Minus -->
					</div>
				</div>
			{/if}
			<!-- End of Stasiun Udara Pembanding -->
		</div>
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex w-full max-h-80 overflow-y-auto scrollbar gap-6 p-3 bg-gt-color-dark bg-opacity-80 backdrop-blur shadow"
		>
			<div class="flex flex-col w-full gap-3">
				<!-- Items -->

				<!-- pm10 -->
				{#if userRole !== 'admin-pm25'}
					<AirQualityAccordion
						metric={'pm10'}
						selectedValue={selectedAirStation?.ispu_data?.pm10 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.pm10 || 0}
						{handleAccordion}
						chartId={'pm10Chart'}
						chartDataLength={data['pm10'].length}
						bind:separatorClass
					/>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
				{/if}
				<!-- End of pm10 -->

				<!-- pm25 -->
				{#if userRole !== 'admin-pm25'}
					<AirQualityAccordion
						metric={'pm25'}
						selectedValue={selectedAirStation?.ispu_data?.pm25 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.pm25 || 0}
						{handleAccordion}
						chartId={'pm25Chart'}
						chartDataLength={data['pm25'].length}
						bind:separatorClass
					/>
				{:else}
					<AirQualityAccordionPM25
						metric={'pm25'}
						selectedValue={selectedAirStation?.ispu_data?.pm25 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.pm25 || 0}
						chartId={'pm25Chart'}
						chartDataLength={data['pm25'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of pm25 -->

				<!-- so2 -->
				{#if userRole !== 'admin-pm25'}
					<hr class="border-gt-color-dark-3 bg-opacity-80" />

					<AirQualityAccordion
						metric={'so2'}
						selectedValue={selectedAirStation?.ispu_data?.so2 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.so2 || 0}
						{handleAccordion}
						chartId={'so2Chart'}
						chartDataLength={data['so2'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of so2 -->

				<!-- co -->
				{#if userRole !== 'admin-pm25'}
					<hr class="border-gt-color-dark-3 bg-opacity-80" />

					<AirQualityAccordion
						metric={'co'}
						selectedValue={selectedAirStation?.ispu_data?.co || 0}
						comparisonValue={selectedChildStation?.ispu_data?.co || 0}
						{handleAccordion}
						chartId={'coChart'}
						chartDataLength={data['co'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of co -->

				<!-- o3 -->
				{#if userRole !== 'admin-pm25'}
					<hr class="border-gt-color-dark-3 bg-opacity-80" />

					<AirQualityAccordion
						metric={'o3'}
						selectedValue={selectedAirStation?.ispu_data?.o3 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.o3 || 0}
						{handleAccordion}
						chartId={'o3Chart'}
						chartDataLength={data['o3'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of o3 -->

				<!-- no2 -->
				{#if userRole !== 'admin-pm25'}
					<hr class="border-gt-color-dark-3 bg-opacity-80" />

					<AirQualityAccordion
						metric={'no2'}
						selectedValue={selectedAirStation?.ispu_data?.no2 || 0}
						comparisonValue={selectedChildStation?.ispu_data?.no2 || 0}
						{handleAccordion}
						chartId={'no2Chart'}
						chartDataLength={data['no2'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of no2 -->

				<!-- hc -->
				{#if userRole !== 'admin-pm25'}
					<hr class="border-gt-color-dark-3 bg-opacity-80" />

					<AirQualityAccordion
						metric={'hc'}
						selectedValue={selectedAirStation?.ispu_data?.hc || 0}
						comparisonValue={selectedChildStation?.ispu_data?.hc || 0}
						{handleAccordion}
						chartId={'hcChart'}
						chartDataLength={data['hc'].length}
						bind:separatorClass
					/>
				{/if}
				<!-- End of hc -->

				<!-- Items -->
			</div>
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
