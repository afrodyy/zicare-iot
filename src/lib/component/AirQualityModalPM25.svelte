<script>
	import { fade } from 'svelte/transition';
	import { isLoading, getLast60MinuteInterval, expandedAccordion } from '$lib/index';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import axios from 'axios';
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
	import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';
	import AirQualityAccordionPM25 from '$lib/component/AirQualityAccordionPM25.svelte';
	import ExcelJS from 'exceljs';
	import moment from 'moment';

	export let accessToken, closeModalDetailData, selectedAirStation;
	export let handleAccordion = () => {};

	let lastSelectedAirStation = selectedAirStation;
	let date_from = '';
	let date_to = '';

	$: selectedTimeRange = 'daily';

	$: ispuData = [];
	$: metrics = ['pm25'];
	// $: metrics = lastSelectedAirStation.parameters.split(',');

	// Initialize empty reactive objects
	$: data = {};
	$: charts = {};

	// Populate reactive variables
	$: {
		metrics.forEach((metric) => {
			data[metric] = [];
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
		if (selectedAirStation.highest.value === 0) {
			separatorClass = 'bg-gray-400';
		} else {
			separatorClass = 'bg-[#22AD5C]';
		}
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
			if (am5.registry.rootElements.length > 0) {
				am5.registry.rootElements.forEach((root) => {
					if (root.dom.id === chartName) {
						root.dispose(); // Dispose the existing root
					}
				});
			}

			const el = document.querySelector(`#${chartName}`);
			if (el) {
				const root = am5.Root.new(chartName);
				let chartData;

				charts[type] = root;
				chartData = data[type];

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
						max: 320,
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
			}
		});
	}

	function defAirQualityBarChart(type, chartName = null) {
		am5.ready(function () {
			if (am5.registry.rootElements.length > 0) {
				am5.registry.rootElements.forEach((root) => {
					if (root.dom.id === chartName) {
						root.dispose(); // Dispose the existing root
					}
				});
			}

			const chartEl = document.getElementById(chartName);

			if (chartEl) {
				let root = am5.Root.new(chartName);
				const myTheme = am5.Theme.new(root);

				myTheme.rule('AxisLabel', ['minor']).setAll({
					dy: 1
				});

				// Set themes
				// https://www.amcharts.com/docs/v5/concepts/themes/
				root.setThemes([am5themes_Animated.new(root), myTheme, am5themes_Responsive.new(root)]);

				// Create chart
				// https://www.amcharts.com/docs/v5/charts/xy-chart/
				let chart = root.container.children.push(
					am5xy.XYChart.new(root, {
						panX: false,
						panY: false,
						wheelX: 'panX',
						wheelY: 'zoomX',
						paddingLeft: 0
					})
				);

				// Add cursor
				// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
				let cursor = chart.set(
					'cursor',
					am5xy.XYCursor.new(root, {
						behavior: 'zoomX'
					})
				);
				cursor.lineY.set('visible', false);

				// Create axes
				// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
				let xAxis = chart.xAxes.push(
					am5xy.DateAxis.new(root, {
						maxDeviation: 0,
						baseInterval: {
							timeUnit: selectedTimeRange === 'hourly' ? 'hour' : 'day',
							count: 1
						},
						renderer: am5xy.AxisRendererX.new(root, {
							minorGridEnabled: true,
							minorLabelsEnabled: true
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

				xAxis.set('minorDateFormats', {
					day: 'dd',
					month: 'MM'
				});

				let yAxis = chart.yAxes.push(
					am5xy.ValueAxis.new(root, {
						renderer: am5xy.AxisRendererY.new(root, {})
					})
				);

				let yRenderer = yAxis.get('renderer');

				yRenderer.labels.template.setAll({
					fill: am5.color('#FEFEFE'),
					fontSize: 12,
					fontWeight: 400
				});

				// Add series
				// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
				let series = chart.series.push(
					am5xy.ColumnSeries.new(root, {
						name: 'Series',
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: 'value',
						valueXField: 'date',
						tooltip: am5.Tooltip.new(root, {
							labelText: '{valueY}'
						})
					})
				);

				series.columns.template.setAll({ strokeOpacity: 0 });

				// Set conditional colors
				series.columns.template.adapters.add('fill', () => {
					if (selectedAirStation.aqi.category === 'baik') {
						if (selectedAirStation.highest.value === 0) {
							return am5.color('#9ca3af');
						} else {
							return am5.color('#22AD5C');
						}
					} else if (selectedAirStation.aqi.category === 'sedang') {
						return am5.color('#01A9DB');
					} else if (selectedAirStation.aqi.category === 'tidak_sehat') {
						return am5.color('#FBBF24');
					} else if (selectedAirStation.aqi.category === 'sangat_tidak_sehat') {
						return am5.color('#F23030');
					} else if (selectedAirStation.aqi.category === 'berbahaya') {
						return am5.color('#0C0C0D');
					}
				});

				series.columns.template.adapters.add('stroke', (stroke, target) => {
					const value = target.dataItem.get('valueY'); // Get the value of the bar
					if (value <= 10) {
						return am5.color('#a9df60');
					} else if (value >= 11 && value <= 35) {
						return am5.color('#fdd64d');
					} else if (value >= 36 && value <= 50) {
						return am5.color('#fe9b55');
					} else {
						return am5.color('#fe6a69');
					}
				});

				series.data.setAll(data[type]);

				// Make stuff animate on load
				// https://www.amcharts.com/docs/v5/concepts/animations/
				series.appear(1000);
				chart.appear(1000, 100);
			}
		});
	}

	async function generateChartData(type) {
		const metricMap = {
			pm10Chart: 'pm10',
			pm25Chart: 'pm25',
			so2Chart: 'so2',
			coChart: 'co',
			o3Chart: 'o3',
			no2Chart: 'no2',
			hcChart: 'hc'
		};

		if (selectedTimeRange === 'hourly') {
			data[metricMap[type]] = ispuData
				.map((ispu) => {
					return {
						date: new Date(ispu.waktu).getTime(),
						value: parseFloat(ispu[metricMap[type]])
					};
				})
				.reverse();
		} else {
			const dataSource = ispuData;

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
						value: avg > 300 ? 300 : avg
					};
				})
				.reverse();

			data[metricMap[type]] = dailyData;
		}
	}

	async function handleShowChart(chartType, chartName, chartInstance, showChart) {
		if (showChart) {
			if (data[chartType].length > 0) {
				// defAirQualityLineChart(chartType, chartName);
				defAirQualityBarChart(chartType, chartName);
			}
		} else {
			if (chartInstance !== null) {
				chartInstance.dispose();
				chartInstance = null;
			}
		}
	}

	const getIspuData = async (startDate = null, endDate = null) => {
		$isLoading = true;

		if (!startDate && !endDate) {
			if (selectedTimeRange === 'daily') {
				date_from =
					getLast60MinuteInterval(moment().subtract(3, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') +
					'Z';
			} else {
				date_from =
					getLast60MinuteInterval(moment().subtract(1, 'months')).format(
						'YYYY-MM-DDTHH:mm:ss.SSS'
					) + 'Z';
			}

			date_to = getLast60MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		} else {
			date_from = startDate;
			date_to = endDate;
		}

		try {
			const response = await axios.get('/api/aqms/ispu_data', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedAirStation.id_stasiun,
					tipe_stasiun: selectedAirStation.tipe_stasiun,
					date_from,
					date_to
				}
			});

			// Changes 5 Mar 2025
			// ispuData = response.data.data.aqm_ispu.filter((ispu) => {
			// 	return ispu.is_filter === 1;
			// });

			// Changes 5 Mar 2025
			ispuData = response.data.data.aqm_ispu.filter((ispu) => {
				return ispu.is_filter === 0;
			});
			// console.log(ispuData);

			$isLoading = false;
		} catch (error) {
			console.log(error, '<<<<<<<<<<<<<< Catch Error getIspuData');
			$isLoading = false;
		}
	};

	async function updateMeasurementData(type, startDate, endDate) {
		await getIspuData(startDate, endDate);
		handleChartLogic(type);
	}

	// async function handleChartLogic() {
	// 	$isLoading = true;

	// 	let { type, chartName, instance } = chartMap['pm25'];

	// 	if (instance !== null) {
	// 		instance.dispose();
	// 		instance = null;
	// 	}

	// 	await generateChartData(chartName);
	// 	handleShowChart(type, chartName, instance, true);

	// 	$isLoading = false;
	// }

	async function handleChartLogic() {
		if ($expandedAccordion in chartMap) {
			let { type, chartName, instance } = chartMap[$expandedAccordion];

			if (instance !== null) {
				instance.dispose();
				instance = null;
			}

			generateChartData(chartName);
			handleShowChart(type, chartName, instance, true);
		} else {
			Object.entries(chartMap).forEach(([key]) => {
				if (charts[key] !== null) {
					charts[key].dispose();
					charts[key] = null;
				}
			});
		}
	}

	async function exportData(type) {
		const fileName = `ISPU_Report_${selectedAirStation.stationData.nama}`;

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Data ISPU');

		worksheet.mergeCells('A1:B1');
		worksheet.mergeCells('A2:B2');

		const titleRow = worksheet.getCell('A1');
		titleRow.value = 'ISPU Report';
		titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
		titleRow.font = { size: 16, bold: true };

		const subtitleRow = worksheet.getCell('A2');
		subtitleRow.value = 'Air Monitoring Quality System Data';
		subtitleRow.alignment = { vertical: 'middle', horizontal: 'center' };
		subtitleRow.font = { size: 16, bold: true };

		const dateLabelRow = worksheet.getCell('A3');
		dateLabelRow.value = 'Tanggal:';
		dateLabelRow.alignment = { vertical: 'middle', horizontal: 'left' };
		dateLabelRow.font = { size: 12, bold: true };

		const dateValueRow = worksheet.getCell('B3');
		dateValueRow.value =
			moment.utc(date_from).format('YYYY-MM-DD HH:mm:ss') +
			' - ' +
			moment.utc(date_to).format('YYYY-MM-DD HH:mm:ss');
		dateValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		dateValueRow.font = { size: 12, bold: true };

		const stationIdLabelRow = worksheet.getCell('A4');
		stationIdLabelRow.value = 'ID Stasiun:';
		stationIdLabelRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationIdLabelRow.font = { size: 12, bold: true };

		const stationIdValueRow = worksheet.getCell('B4');
		stationIdValueRow.value = selectedAirStation.id_stasiun;
		stationIdValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationIdValueRow.font = { size: 12, bold: true };

		const stationTypeLabelRow = worksheet.getCell('A5');
		stationTypeLabelRow.value = 'Nama Stasiun:';
		stationTypeLabelRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationTypeLabelRow.font = { size: 12, bold: true };

		const stationValueValueRow = worksheet.getCell('B5');
		stationValueValueRow.value = selectedAirStation.stationData.nama;
		stationValueValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationValueValueRow.font = { size: 12, bold: true };

		let metric = '';
		let title = '';

		if (type === 'pm25') {
			(title = 'PM2.5'), (metric = 'pm25');
		}

		const columnTitles = ['Waktu', title];
		worksheet.addRow(columnTitles);

		// Changes 5 Mar 2025
		// const validatedIspu = ispuData.filter((ispu) => ispu.is_filter === 1);
		const validatedIspu = ispuData;

		validatedIspu.forEach((ispu) => {
			worksheet.addRow([moment.utc(ispu.waktu).format('YYYY-MM-DD HH:mm:ss'), ispu[metric] || 0]);
		});

		const startColumn = 'A';
		const endColumn = 'B';
		const row = 6;

		for (let col = startColumn.charCodeAt(0); col <= endColumn.charCodeAt(0); col++) {
			const cellAddress = String.fromCharCode(col) + row;
			const cell = worksheet.getCell(cellAddress);
			cell.font = { bold: true };
		}

		worksheet.getColumn('A').width = 24;
		worksheet.getColumn('B').width = 40;

		const rowCount = worksheet.rowCount;

		for (let i = 5; i <= rowCount; i++) {
			worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'right' };
		}

		// Export the workbook
		const buffer = await workbook.xlsx.writeBuffer();
		const fileURL = window.URL.createObjectURL(new Blob([buffer]));

		// Membuat elemen <a> untuk mendownload file
		const fileLink = document.createElement('a');
		fileLink.href = fileURL;
		fileLink.setAttribute('download', `${fileName}.xlsx`);
		document.body.appendChild(fileLink);
		fileLink.click();
		fileLink.remove();
	}

	onMount(async () => {
		$expandedAccordion = '';
		accessToken = localStorage.getItem('accessToken');

		await getIspuData();

		if (ispuData.length > 0) {
			handleChartLogic();
		}
	});

	afterUpdate(async () => {
		if (lastSelectedAirStation.id_stasiun !== selectedAirStation.id_stasiun) {
			lastSelectedAirStation = selectedAirStation;

			ispuData = [];
			await getIspuData();

			if (ispuData.length > 0) {
				handleChartLogic();
			} else {
				metrics.forEach((metric) => {
					data[metric] = [];
				});
			}
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

<div class="fixed flex top-1 right-8 mt-16 flex-end">
	<div
		class="justify-end mt-7 w-[23rem] overflow-hidden shadow-lg border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div
			class="flex flex-col bg-gt-color-dark gap-2 p-6 pb-5 border-b border-gt-color-dark-3-transparent"
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
				<div class="flex flex-col">
					<table>
						<tr class="font-medium text-xs text-gt-color-gray">
							<td>Latitude</td>
							<td> : </td>
							<td>{selectedAirStation.lat}</td>
						</tr>
						<tr class="font-medium text-xs text-gt-color-gray">
							<td>Longitude</td>
							<td> : </td>
							<td>{selectedAirStation.lon}</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex w-full max-h-96 overflow-y-auto scrollbar gap-6 p-3 bg-gt-color-dark-transparent backdrop-blur shadow ease-out duration-150"
		>
			<div class="flex flex-col w-full gap-3">
				{#each metrics as metric, index}
					<AirQualityAccordionPM25
						{metric}
						selectedValue={selectedAirStation[metric] || 0}
						selectedConcentrateValue={selectedAirStation[[metric] + '_val'] || 0}
						chartId={metric + 'Chart'}
						chartDataLength={data[metric].length}
						bind:selectedTimeRange
						bind:separatorClass
						{updateMeasurementData}
						{handleAccordion}
					/>

					{#if metrics.length !== index + 1}
						<hr class="border-gt-color-dark-3 bg-opacity-80" />
					{/if}
				{/each}
			</div>
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
