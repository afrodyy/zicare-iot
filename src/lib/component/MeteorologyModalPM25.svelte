<script>
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import MeteorologyAccordionPm25 from '$lib/component/MeteorologyAccordionPM25.svelte';
	import { fade } from 'svelte/transition';
	import {
		expandedAccordion,
		getLast30MinuteInterval,
		getLast60MinuteInterval,
		handleSweetAlert
	} from '$lib/index';
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import * as am5radar from '@amcharts/amcharts5/radar';
	import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
	import axios from 'axios';
	import moment from 'moment';
	import ExcelJS from 'exceljs';

	export let showMeteorologyModal, selectedAirStation;
	export let handleAccordion = () => {},
		handleMeteorologyModal = () => {};

	let accessToken;
	let lastSelectedAirStation = selectedAirStation;
	let separatorClass = 'bg-gt-color-cyan';
	$: windRoseToggle = false;

	$: if (windRoseToggle) {
		$expandedAccordion = 'windrose';
	} else {
		$expandedAccordion = '';
	}

	$: windRoseData = [];
	$: measurementMet = [];
	$: latestMeasurementMet = [];
	$: windDirection = [];
	$: rainIntensity = [];
	$: windSpeed = [];
	$: humidity = [];
	$: temperature = [];
	$: solarRadius = [];
	$: airPressure = [];
	$: windRoseChart = null;
	$: windDirectionChart = null;
	$: rainIntensityChart = null;
	$: windSpeedChart = null;
	$: humidityChart = null;
	$: temperatureChart = null;
	$: solarRadiusChart = null;
	$: airPressureChart = null;
	$: showWindRoseChart = false;
	$: showWindDirectionChart = false;
	$: showRainIntensityChart = false;
	$: showWindSpeedChart = false;
	$: showHumidityChart = false;
	$: showTemperatureChart = false;
	$: showSolarRadiusChart = false;
	$: showAirPressureChart = false;

	let date_from = '';
	let date_to = '';
	let windRoseDataLength = 64;

	let topModalBody,
		windRoseEl,
		windDirectionEl,
		rainIntensityEl,
		windSpeedEl,
		humidityEl,
		temperatureEl,
		solarRadiusEl,
		airPressureEl;

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

	$: if ($expandedAccordion === 'windrose') {
		if (windRoseEl !== undefined && windRoseEl !== null) {
			windRoseEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'arah-angin') {
		if (windDirectionEl !== undefined && windDirectionEl !== null) {
			windDirectionEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'curah-hujan') {
		if (rainIntensityEl !== undefined && rainIntensityEl !== null) {
			rainIntensityEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'kecepatan-angin') {
		if (windSpeedEl !== undefined && windSpeedEl !== null) {
			windSpeedEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'kelembaban') {
		if (humidityEl !== undefined && humidityEl !== null) {
			humidityEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'suhu') {
		if (temperatureEl !== undefined && temperatureEl !== null) {
			temperatureEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'solar-radius') {
		if (solarRadiusEl !== undefined && solarRadiusEl !== null) {
			solarRadiusEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else if ($expandedAccordion === 'tekanan-udara') {
		if (airPressureEl !== undefined && airPressureEl !== null) {
			airPressureEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	} else {
		if (topModalBody !== undefined && topModalBody !== null) {
			topModalBody.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	}

	function setMeteorologyEl(type, el) {
		if (type === 'arah-angin') {
			windDirectionEl = el; // Update the reference in the parent
		} else if (type === 'curah-hujan') {
			rainIntensityEl = el; // Update the reference in the parent
		} else if (type === 'kecepatan-angin') {
			windSpeedEl = el; // Update the reference in the parent
		} else if (type === 'kelembaban') {
			humidityEl = el; // Update the reference in the parent
		} else if (type === 'suhu') {
			temperatureEl = el; // Update the reference in the parent
		} else if (type === 'solar-radius') {
			solarRadiusEl = el; // Update the reference in the parent
		} else if (type === 'tekanan-udara') {
			airPressureEl = el; // Update the reference in the parent
		} else if (type === 'windrose') {
			windRoseEl = el; // Update the reference in the parent
		}
	}

	function defWindRoseChart(type, chartData) {
		am5.ready(function () {
			/* Chart code */
			// Check if root already exists and dispose of it
			if (am5.registry.rootElements.length > 0) {
				am5.registry.rootElements.forEach((root) => {
					if (root.dom.id === type) {
						root.dispose(); // Dispose the existing root
					}
				});
			}

			// Create root element
			// https://www.amcharts.com/docs/v5/getting-started/#Root_element
			const root = am5.Root.new(type);

			// Set themes
			// https://www.amcharts.com/docs/v5/concepts/themes/
			root.setThemes([am5themes_Animated.new(root)]);

			// Create chart
			// https://www.amcharts.com/docs/v5/charts/radar-chart/
			let chart = root.container.children.push(
				am5radar.RadarChart.new(root, {
					panX: false,
					panY: false,
					wheelX: 'panX',
					wheelY: 'zoomX',
					paddingTop: 0,
					paddingRight: 0,
					paddingBottom: -40,
					paddingLeft: 0,
					innerRadius: am5.percent(10),
					layout: root.verticalLayout
				})
			);

			// Add cursor
			// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
			let cursor = chart.set(
				'cursor',
				am5radar.RadarCursor.new(root, {
					behavior: 'zoomX'
				})
			);

			cursor.lineX.setAll({
				stroke: am5.color('#FEFEFE'), // Set the color of lineX
				strokeWidth: 1, // Optional: Set the thickness
				strokeDasharray: [3, 3] // Optional: Add dash pattern
			});

			cursor.selection.setAll({
				fill: am5.color('#FEFEFE'), // Set the fill color of the selected area
				fillOpacity: 0.4 // Optional: Adjust transparency
			});

			cursor.lineY.set('visible', false);

			// Create axes and their renderers
			// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes

			let xRenderer = am5radar.AxisRendererCircular.new(root, {
				minGridDistance: 0
			});

			let xAxis = chart.xAxes.push(
				am5xy.CategoryAxis.new(root, {
					maxDeviation: 0.1,
					categoryField: 'category',
					renderer: xRenderer,
					tooltip: am5.Tooltip.new(root, {})
				})
			);

			xRenderer.grid.template.setAll({
				stroke: am5.color('#FEFEFE'),
				strokeWidth: 0.8,
				strokeOpacity: 0.8,
				strokeDasharray: [2, 2]
			});

			xRenderer.labels.template.setAll({
				fontSize: 10,
				fill: am5.color('#FEFEFE')
			});

			let yRenderer = am5radar.AxisRendererRadial.new(root, {});
			let yAxis = chart.yAxes.push(
				am5xy.ValueAxis.new(root, {
					renderer: yRenderer
				})
			);

			yRenderer.grid.template.setAll({
				stroke: am5.color('#FEFEFE'),
				strokeWidth: 0.8,
				strokeOpacity: 0.8,
				strokeDasharray: [3, 3]
			});

			yRenderer.labels.template.setAll({
				fontSize: 10,
				fill: am5.color('#FEFEFE')
			});

			const windDirections = [
				'N',
				'NNE',
				'NE',
				'ENE',
				'E',
				'ESE',
				'SE',
				'SSE',
				'S',
				'SSW',
				'SW',
				'WSW',
				'W',
				'WNW',
				'NW',
				'NNW'
			];
			const numberOfSeries = chartData.length;
			const seriesAttributes = [
				{
					name: '< 3 m/s',
					color: am5.color('#374E87')
				},
				{
					name: '3-6 m/s',
					color: am5.color('#1A6D41')
				},
				{
					name: '6-10 m/s',
					color: am5.color('#BB8733')
				},
				{
					name: '> 10 m/s',
					color: am5.color('#971B1D')
				}
			];

			// Create series
			// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
			for (var i = 0; i < numberOfSeries; i++) {
				let series = chart.series.push(
					am5radar.RadarColumnSeries.new(root, {
						stacked: true,
						name: seriesAttributes[i].name,
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: 'value',
						categoryXField: 'category'
					})
				);

				// Set color for each series
				series.set('fill', seriesAttributes[i].color);
				series.set('stroke', root.interfaceColors.get('background'));

				series.columns.template.setAll({
					width: am5.p100,
					strokeOpacity: 0.1,
					fillOpacity: 0.8,
					tooltipText: 'r: {valueY}%'
				});

				const data = [];

				chartData[i].forEach((item, index) => {
					data.push({
						category: windDirections[index],
						value: item
					});
				});

				series.data.setAll(data);
				series.appear(1000);
			}

			const cardinalDirections = [];
			windDirections.forEach((direction) => {
				cardinalDirections.push({
					category: direction
				});
			});
			xAxis.data.setAll(cardinalDirections);

			let legend = chart.children.push(
				am5.Legend.new(root, {
					layout: root.verticalLayout, // Vertically stacks legend items
					x: am5.percent(75),
					y: am5.percent(72)
				})
			);

			// Customize legend items
			legend.itemContainers.template.setAll({
				layout: root.horizontalLayout, // Marker and label are in a row
				paddingTop: 5,
				paddingBottom: 0,
				paddingLeft: 10,
				paddingRight: 10,
				centerY: am5.percent(50) // Vertically centers items
			});

			// Customize markers (legend icons)
			legend.markers.template.setAll({
				width: 8, // Marker size
				height: 8,
				centerY: am5.percent(50) // Centers marker vertically
			});

			// Customize labels (legend text)
			legend.labels.template.setAll({
				fontSize: 12, // Adjust font size for clarity
				fill: am5.color('#FEFEFE'),
				centerY: am5.percent(50), // Centers label vertically
				marginLeft: 10 // Adds spacing between marker and label
			});

			legend.data.setAll(chart.series.values);

			// Animate chart
			// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
			chart.appear(1000, 100);
		});
	}

	function defMeteorologyLineChart(type) {
		am5.ready(function () {
			if (am5.registry.rootElements.length > 0) {
				am5.registry.rootElements.forEach((root) => {
					if (root.dom.id === type) {
						root.dispose(); // Dispose the existing root
					}
				});
			}

			const root = am5.Root.new(type);
			let chartData;

			// Assign chartData sesuai dengan tipe chart yang dipilih
			if (type === 'windDirectionChart') {
				windDirectionChart = root;
				chartData = windDirection;
			} else if (type === 'rainIntensityChart') {
				rainIntensityChart = root;
				chartData = rainIntensity;
			} else if (type === 'windSpeedChart') {
				windSpeedChart = root;
				chartData = windSpeed;
			} else if (type === 'humidityChart') {
				humidityChart = root;
				chartData = humidity;
			} else if (type === 'temperatureChart') {
				temperatureChart = root;
				chartData = temperature;
			} else if (type === 'solarRadiusChart') {
				solarRadiusChart = root;
				chartData = solarRadius;
			} else if (type === 'airPressureChart') {
				airPressureChart = root;
				chartData = airPressure;
			}

			// Set themes
			root.setThemes([am5themes_Animated.new(root)]);

			// Create chart
			var chart = root.container.children.push(
				am5xy.XYChart.new(root, {
					panX: true,
					panY: true,
					wheelX: 'panX',
					wheelY: 'zoomX',
					pinchZoomX: true,
					paddingLeft: 0
				})
			);

			var cursor = chart.set(
				'cursor',
				am5xy.XYCursor.new(root, {
					behavior: 'none'
				})
			);
			cursor.lineY.set('visible', false);

			// Create X Axis (Date Axis)
			var xAxis = chart.xAxes.push(
				am5xy.DateAxis.new(root, {
					maxDeviation: 0.5,
					baseInterval: {
						timeUnit: 'day',
						count: 1
					},
					renderer: am5xy.AxisRendererX.new(root, {
						minGridDistance: 80,
						minorGridEnabled: true,
						pan: 'zoom'
					}),
					tooltip: am5.Tooltip.new(root, {})
				})
			);

			let xRenderer = xAxis.get('renderer');
			xRenderer.grid.template.setAll({
				stroke: am5.color('#FEFEFE'),
				strokeWidth: 2,
				strokeDasharray: [5, 5]
			});

			xRenderer.labels.template.setAll({
				fill: am5.color('#FEFEFE'),
				fontSize: 12,
				fontWeight: 400
			});

			// Buat hanya 1 Y Axis untuk kedua series
			var yRenderer = am5xy.AxisRendererY.new(root, { opposite: false });

			yRenderer.labels.template.setAll({
				fill: am5.color('#FEFEFE'),
				fontSize: 12,
				fontWeight: 400
			});

			yRenderer.grid.template.setAll({
				stroke: am5.color('#FEFEFE'),
				strokeWidth: 2,
				strokeDasharray: [5, 5]
			});

			var yAxis = chart.yAxes.push(
				am5xy.ValueAxis.new(root, {
					maxDeviation: 1,
					renderer: yRenderer
				})
			);

			let verticalText;
			let valueYUnit;

			if (type === 'windDirectionChart') {
				verticalText = 'Arah Angin (°)';
				valueYUnit = '{valueY}°';
			} else if (type === 'rainIntensityChart') {
				verticalText = 'Curah Hujan (mm/h)';
				valueYUnit = '{valueY} mm/h';
			} else if (type === 'windSpeedChart') {
				verticalText = 'Kecepatan Angin (m/s)';
				valueYUnit = '{valueY} m/s';
			} else if (type === 'humidityChart') {
				verticalText = 'Humidity (%)';
				valueYUnit = '{valueY}%';
			} else if (type === 'temperatureChart') {
				verticalText = 'Temperature (°C)';
				valueYUnit = '{valueY}°C';
			} else if (type === 'solarRadiusChart') {
				verticalText = 'Solar Radiation (watt/m2)';
				valueYUnit = '{valueY} watt/m2';
			} else if (type === 'airPressureChart') {
				verticalText = 'Tekanan Udara (mBar)';
				valueYUnit = '{valueY} mBar';
			}

			yAxis.children.moveValue(
				am5.Label.new(root, {
					text: verticalText,
					fontSize: 12,
					fontWeight: 400,
					rotation: -90,
					y: am5.p50,
					centerX: am5.p50,
					fill: am5.color('#F9FAFB')
				}),
				0
			);

			// Fungsi untuk membuat series menggunakan sumbu Y yang sama
			function createSeries(valueField, seriesStrokeColor) {
				var series = chart.series.push(
					am5xy.SmoothedXLineSeries.new(root, {
						name: 'Series',
						xAxis: xAxis,
						yAxis: yAxis, // Menggunakan Y Axis yang sama
						valueYField: valueField,
						valueXField: 'date',
						tooltip: am5.Tooltip.new(root, {
							labelText: valueYUnit
						}),
						stroke: am5.color(seriesStrokeColor),
						fill: am5.color(seriesStrokeColor)
					})
				);

				series.strokes.template.setAll({
					strokeWidth: 3
				});

				series.fills.template.setAll({
					visible: true,
					fillOpacity: 0.3
				});

				series.bullets.push(function () {
					return am5.Bullet.new(root, {
						locationY: 0,
						sprite: am5.Circle.new(root, {
							radius: 4,
							stroke: am5.color('#133F41'),
							strokeWidth: 3,
							fill: am5.color(seriesStrokeColor)
						})
					});
				});

				return series;
			}

			var seriesPrimary = createSeries('value', '#1BD5A6');
			seriesPrimary.data.setAll(chartData);

			// Animate the chart on load
			chart.appear(1000, 100);
		});
	}

	async function generateChartData(type) {
		const getDayTimestampFromTime = (waktu) => {
			const dateOnly = moment(waktu).format('YYYY-MM-DD');
			return new Date(dateOnly).getTime(); // Mengubah menjadi timestamp
		};

		// Langkah 1: Mengelompokkan data berdasarkan tanggal
		const groupedData = measurementMet.reduce((acc, item) => {
			const timestamp = getDayTimestampFromTime(item.waktu);
			if (!acc[timestamp]) {
				acc[timestamp] = [];
			}

			acc[timestamp].push(item);
			return acc;
		}, {});

		// Langkah 2: Ambil rata-rata nilai 'ws' per hari
		const dailyData = Object.keys(groupedData).map((timestamp) => {
			let values;
			let avg;
			let formattedAvg;

			if (type === 'windDirectionChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.wd))
					.filter((wd) => !isNaN(wd)); // Hanya ambil nilai 'ws' yang valid
			} else if (type === 'rainIntensityChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.rain_intensity))
					.filter((rain_intensity) => !isNaN(rain_intensity)); // Hanya ambil nilai 'ws' yang valid
			} else if (type === 'windSpeedChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.ws))
					.filter((ws) => !isNaN(ws)); // Hanya ambil nilai 'ws' yang valid
			} else if (type === 'humidityChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.humidity))
					.filter((humidity) => !isNaN(humidity)); // Hanya ambil nilai 'humidity' yang valid
			} else if (type === 'temperatureChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.temperature))
					.filter((temperature) => !isNaN(temperature)); // Hanya ambil nilai 'temperature' yang valid
			} else if (type === 'solarRadiusChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.sr))
					.filter((sr) => !isNaN(sr)); // Hanya ambil nilai 'sr' yang valid
			} else if (type === 'airPressureChart') {
				values = groupedData[timestamp]
					.map((item) => parseFloat(item.pressure))
					.filter((pressure) => !isNaN(pressure)); // Hanya ambil nilai 'pressure' yang valid
			}

			if (values.length > 0) {
				if (type === 'windDirectionChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, wd) => sum + wd, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'rainIntensityChart') {
					// Menghitung rata-rata
					// avg = values.reduce((sum, rain_intensity) => sum + rain_intensity, 0) / values.length;

					// Menghitung jumlah
					avg = values.reduce((sum, rain_intensity) => sum + rain_intensity, 0);

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'windSpeedChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, ws) => sum + ws, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'humidityChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, humidity) => sum + humidity, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'temperatureChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, temperature) => sum + temperature, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'solarRadiusChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, sr) => sum + sr, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				} else if (type === 'airPressureChart') {
					// Menghitung rata-rata
					avg = values.reduce((sum, pressure) => sum + pressure, 0) / values.length;

					// Membulatkan hasil rata-rata menjadi 2 angka di belakang koma
					formattedAvg = parseFloat(avg.toFixed(2));
				}

				return {
					date: parseInt(timestamp), // Timestamp dalam milidetik
					value: formattedAvg // Rata-rata nilai 'ws' pada hari tersebut
					// value: Math.round(avgWs) // Rata-rata nilai 'ws' pada hari tersebut
				};
			} else {
				return {
					date: parseInt(timestamp),
					value: 1 // Jika tidak ada nilai 'ws' yang valid
				};
			}
		});

		if (type === 'windDirectionChart') {
			// Hasil akhir
			windDirection = dailyData.reverse();
		} else if (type === 'rainIntensityChart') {
			// Hasil akhir
			rainIntensity = dailyData.reverse();
		} else if (type === 'windSpeedChart') {
			// Hasil akhir
			windSpeed = dailyData.reverse();
		} else if (type === 'humidityChart') {
			// Hasil akhir
			humidity = dailyData.reverse();
		} else if (type === 'temperatureChart') {
			// Hasil akhir
			temperature = dailyData.reverse();
		} else if (type === 'solarRadiusChart') {
			// Hasil akhir
			solarRadius = dailyData.reverse();
		} else if (type === 'airPressureChart') {
			// Hasil akhir
			airPressure = dailyData.reverse();
		}
	}

	const getMeasurement30Min = async (startDate = null, endDate = null) => {
		if (!startDate && !endDate) {
			date_from =
				getLast30MinuteInterval(moment().subtract(6, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') +
				'Z';
			date_to =
				getLast30MinuteInterval(moment())
					.subtract(30, 'minutes')
					.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		} else {
			date_from = startDate;
			date_to = endDate;
		}

		try {
			const response = await axios.get('/api/aqms/measurement30min', {
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

			measurementMet = response.data.data.aqms_30_min;
		} catch (error) {
			console.log(error);
		}
	};

	const getWindRoseData = async (startDate = null, endDate = null) => {
		const id_stasiun = selectedAirStation.id_stasiun;

		if (!startDate && !endDate) {
			date_from =
				getLast30MinuteInterval(moment().subtract(1, 'days').subtract(30, 'minutes')).format(
					'YYYY-MM-DDTHH:mm:ss.SSS'
				) + 'Z';
			date_to =
				getLast30MinuteInterval(moment().subtract(30, 'minutes')).format(
					'YYYY-MM-DDTHH:mm:ss.SSS'
				) + 'Z';
		} else {
			date_from = startDate;
			date_to = endDate;
		}

		try {
			const response = await axios.get('/api/aqms/windrose30min', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun,
					date_from,
					date_to
				}
			});

			windRoseData = await response.data.data.windrose;
		} catch (error) {
			const response = error.response;

			if (response) {
				const statusCode = response.status;

				if (statusCode === 401) {
					alert(response.data.message);

					localStorage.clear();
					goto('/');
				} else if (statusCode === 500) {
					console.log(response.data.message, '<<< Err 500');
					handleSweetAlert('info', 'Tidak ada data untuk ditampilkan');
					const data = [
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					];
					return data;
				}
			}
		}
	};

	async function handleShowChart(chartType, showChart, chartInstance, updateWindRoseData = false) {
		if (showChart) {
			if (chartType === 'windRoseChart') {
				if (!updateWindRoseData) {
					await getWindRoseData();
					// windRoseData = [
					// 	[3, 4, 1, 0, 1, 2, 4, 0, 2, 2, 4, 0, 1, 0, 4, 3],
					// 	[0, 1, 1, 2, 0, 3, 2, 2, 1, 3, 1, 3, 1, 4, 1, 3],
					// 	[1, 4, 2, 1, 3, 0, 3, 0, 3, 1, 0, 4, 4, 0, 2, 2],
					// 	[0, 3, 3, 2, 4, 4, 0, 0, 3, 0, 4, 4, 1, 0, 3, 0]
					// ];
				}

				windRoseDataLength = windRoseData.flat().filter((value) => value === 0).length;
				const windRoseChartEl = document.querySelector(`#${chartType}`);

				if (windRoseDataLength < 64 && windRoseChartEl) defWindRoseChart(chartType, windRoseData);
			} else {
				await generateChartData(chartType);
				let length = 0;

				if (chartType === 'windDirectionChart') {
					length = windDirection.length;
				} else if (chartType === 'rainIntensityChart') {
					length = rainIntensity.length;
				} else if (chartType === 'windSpeedChart') {
					length = windSpeed.length;
				} else if (chartType === 'humidityChart') {
					length = humidity.length;
				} else if (chartType === 'temperatureChart') {
					length = temperature.length;
				} else if (chartType === 'solarRadiusChart') {
					length = solarRadius.length;
				} else if (chartType === 'airPressureChart') {
					length = airPressure.length;
				}

				if (length > 0) defMeteorologyLineChart(chartType);
			}
		} else {
			if (chartInstance !== null) {
				chartInstance.dispose();
				chartInstance = null;
			}
		}
	}

	async function updateMeasurementData(type, startDate, endDate) {
		if (type === 'windrose') {
			await getWindRoseData(startDate, endDate);
			handleChartLogic(type, true);
		} else {
			await getMeasurement30Min(startDate, endDate);
			handleChartLogic(type);
		}
	}

	function handleChartLogic(meteorology = null, updateWindRoseData = false) {
		const chartMap = {
			windrose: {
				type: 'windRoseChart',
				instance: windRoseChart,
				show: showWindRoseChart
			},
			'arah-angin': {
				type: 'windDirectionChart',
				instance: windDirectionChart,
				show: showWindDirectionChart
			},
			'curah-hujan': {
				type: 'rainIntensityChart',
				instance: rainIntensityChart,
				show: showRainIntensityChart
			},
			'kecepatan-angin': {
				type: 'windSpeedChart',
				instance: windSpeedChart,
				show: showWindSpeedChart
			},
			kelembaban: { type: 'humidityChart', instance: humidityChart, show: showHumidityChart },
			suhu: { type: 'temperatureChart', instance: temperatureChart, show: showTemperatureChart },
			'solar-radius': {
				type: 'solarRadiusChart',
				instance: solarRadiusChart,
				show: showSolarRadiusChart
			},
			'tekanan-udara': {
				type: 'airPressureChart',
				instance: airPressureChart,
				show: showAirPressureChart
			}
		};

		if ($expandedAccordion in chartMap || $expandedAccordion === meteorology) {
			let { type, instance } = chartMap[$expandedAccordion];

			if (instance !== null) {
				instance.dispose();
				instance = null;
			}

			handleShowChart(type, true, instance, updateWindRoseData);
		} else {
			windRoseToggle = false;

			const chartInstances = [
				windRoseChart,
				windDirectionChart,
				rainIntensityChart,
				windSpeedChart,
				humidityChart,
				temperatureChart,
				solarRadiusChart,
				airPressureChart
			];

			chartInstances.forEach((chart) => {
				if (chart !== null) {
					chart.dispose();
					chart = null;
				}
			});
		}
	}

	async function exportData(type) {
		const fileName = `AQMS_Report_${selectedAirStation.stationData.nama}`;

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Data AQMS');

		if (type === 'windrose') {
			worksheet.mergeCells('A1:C1');
			worksheet.mergeCells('A2:C2');
			worksheet.mergeCells('B3:C3');
			worksheet.mergeCells('B4:C4');
		} else {
			worksheet.mergeCells('A1:B1');
			worksheet.mergeCells('A2:B2');
		}

		const titleRow = worksheet.getCell('A1');
		titleRow.value = 'AQMS - Meteorologi Report';
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

		if (type === 'arah-angin') {
			(title = 'Wind Direction (°)'), (metric = 'wd');
		} else if (type === 'curah-hujan') {
			(title = 'Rain Intensity (μg/Nm3)'), (metric = 'rain_intensity');
		} else if (type === 'kecepatan-angin') {
			(title = 'Wind Speed (m/s)'), (metric = 'ws');
		} else if (type === 'kelembaban') {
			(title = 'Humidity (%)'), (metric = 'humidity');
		} else if (type === 'suhu') {
			(title = 'Temperature (°C)'), (metric = 'temperature');
		} else if (type === 'solar-radius') {
			(title = 'Solar Radius (%)'), (metric = 'sr');
		} else if (type === 'tekanan-udara') {
			(title = 'Air Pressure (mBar)'), (metric = 'pressure');
		}

		let columnTitles = [];

		if (type === 'windrose') {
			columnTitles = ['Waktu', 'Wind Speed (m/s)', 'Wind Direction (°)'];
		} else {
			columnTitles = ['Waktu', title];
		}

		worksheet.addRow(columnTitles);

		if (type === 'windrose') {
			measurementMet.forEach((aqms) => {
				worksheet.addRow([
					moment.utc(aqms.waktu).format('YYYY-MM-DD HH:mm:ss'),
					aqms.ws || 0,
					aqms.wd || 0
				]);
			});
		} else {
			measurementMet.forEach((aqms) => {
				worksheet.addRow([moment.utc(aqms.waktu).format('YYYY-MM-DD HH:mm:ss'), aqms[metric] || 0]);
			});
		}

		const startColumn = 'A';
		const endColumn = type === 'windrose' ? 'C' : 'B';
		const row = 6;

		for (let col = startColumn.charCodeAt(0); col <= endColumn.charCodeAt(0); col++) {
			const cellAddress = String.fromCharCode(col) + row;
			const cell = worksheet.getCell(cellAddress);
			cell.font = { bold: true };
		}

		worksheet.getColumn('A').width = 24;

		if (type === 'windrose') {
			worksheet.getColumn('B').width = 20;
			worksheet.getColumn('C').width = 20;
		} else {
			worksheet.getColumn('B').width = 40;
		}

		const rowCount = worksheet.rowCount;

		for (let i = 5; i <= rowCount; i++) {
			worksheet.getCell(`B${i}`).alignment = { vertical: 'middle', horizontal: 'right' };

			if (type === 'windrose') {
				worksheet.getCell(`C${i}`).alignment = { vertical: 'middle', horizontal: 'right' };
			}
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
		accessToken = localStorage.getItem('accessToken');
		await getMeasurement30Min();
		latestMeasurementMet = measurementMet[0];
	});

	// After update ketrigger 3x ketika buka windrose dan ganti stasiun
	// Coba cari cara buat triggernya cuma 1x, entah buat variable integer terus -2
	afterUpdate(async () => {
		if (selectedAirStation.id_stasiun !== lastSelectedAirStation.id_stasiun) {
			lastSelectedAirStation = selectedAirStation;

			await getMeasurement30Min();
			latestMeasurementMet = measurementMet[0];
		}

		handleChartLogic();
	});

	onDestroy(() => {
		windRoseToggle = false;

		const chartInstances = [
			windRoseChart,
			windDirectionChart,
			rainIntensityChart,
			windSpeedChart,
			humidityChart,
			temperatureChart,
			solarRadiusChart,
			airPressureChart
		];

		chartInstances.forEach((chart) => {
			if (chart !== null) {
				chart.dispose();
				chart = null;
			}
		});
	});
</script>

<div
	transition:fade={{ duration: 2000 }}
	class="fixed flex top-1 right-[38.5rem] mt-16 flex-end z-50"
>
	<div
		class="justify-end mt-7 w-[23rem] overflow-hidden shadow-lg border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div
			class="flex flex-col bg-gt-color-dark gap-2 p-6 border-b border-gt-color-dark-3-transparent"
		>
			<!-- Title -->
			<div class="flex flex-row gap-3 justify-between">
				<span class="font-bold text-base text-gt-color-gray">Meteorologi</span>

				<button
					on:click={(() => (showMeteorologyModal = !showMeteorologyModal), handleMeteorologyModal)}
					type="button"
					class="text-white"
				>
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
			<!-- End of Title -->

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

				<div class="h-8 flex flex-row gap-2 justify-between">
					<div class="flex flex-row gap-3">
						<div class="flex flex-row gap-2 items-center">
							<div class="w-5 h-4 rounded {separatorClass}"></div>

							<div class="flex flex-row gap-3 rounded-lg p-2 justify-between items-center w-full">
								<span class="font-medium text-xs text-gt-color-gray"
									>{selectedAirStation.stationData.nama}</span
								>
							</div>
						</div>
					</div>
				</div>

				<div class="h-px mb-1 border-b border-gt-color-dark-3-transparent"></div>

				<div class="flex flex-row -mb-2 justify-between items-center">
					<div class="flex flex-row gap-2 items-center">
						<img src="/icons/windrose-icon.svg" class="size-5" alt="windrose-icon" />

						<span class="font-normal text-base text-gt-color-gray-3">Windrose Overview</span>
					</div>

					<!-- Wind Rose Toggle -->
					<div class="flex items-center">
						<label class="relative inline-flex items-center cursor-pointer">
							<input
								bind:checked={windRoseToggle}
								type="checkbox"
								name="windRoseToggle"
								id="windRoseToggle"
								class="sr-only peer"
							/>
							<div
								class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
							></div>
						</label>
					</div>
					<!-- End of Wind Rose Toggle -->
				</div>
			</div>
		</div>
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex w-full {$expandedAccordion === 'windrose'
				? 'h-96'
				: 'h-80'} overflow-y-auto scrollbar gap-6 p-3 bg-gt-color-dark-transparent backdrop-blur-sm ease-out duration-150"
		>
			{#if windRoseToggle}
				<div class="flex flex-col w-full gap-3">
					<!-- Windrose -->
					<MeteorologyAccordionPm25
						meteorology={'windrose'}
						title={'Windrose'}
						latestMeasurementMet={null}
						chartId={'windRoseChart'}
						showChart={windRoseDataLength < 64}
						handleAccordion={null}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
						{exportData}
					/>
					<!-- End of Windrose -->
				</div>
			{:else}
				<div bind:this={topModalBody} class="flex flex-col w-full gap-3">
					<!-- Arah Angin -->
					<MeteorologyAccordionPm25
						meteorology={'arah-angin'}
						title={'Arah Angin'}
						latestMeasurementMet={latestMeasurementMet.wd > 0
							? parseFloat(latestMeasurementMet.wd).toFixed(2)
							: 0}
						chartId={'windDirectionChart'}
						showChart={windDirection.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Arah Angin -->

					<!-- Curah Hujan -->
					<MeteorologyAccordionPm25
						meteorology={'curah-hujan'}
						title={'Curah Hujan'}
						latestMeasurementMet={latestMeasurementMet.rain_intensity > 0
							? parseFloat(latestMeasurementMet.rain_intensity).toFixed(2)
							: 0}
						chartId={'rainIntensityChart'}
						showChart={rainIntensity.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Curah Hujan -->

					<!-- Kec. Angin -->
					<MeteorologyAccordionPm25
						meteorology={'kecepatan-angin'}
						title={'Kec. Angin'}
						latestMeasurementMet={latestMeasurementMet.ws > 0
							? parseFloat(latestMeasurementMet.ws).toFixed(2)
							: 0}
						chartId={'windSpeedChart'}
						showChart={windSpeed.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Kecepatan Angin -->

					<!-- Kelembaban -->
					<MeteorologyAccordionPm25
						meteorology={'kelembaban'}
						title={'Kelembaban'}
						latestMeasurementMet={latestMeasurementMet.humidity > 0
							? parseFloat(latestMeasurementMet.humidity).toFixed(2)
							: 0}
						chartId={'humidityChart'}
						showChart={humidity.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Kelembaban -->

					<!-- Suhu -->
					<MeteorologyAccordionPm25
						meteorology={'suhu'}
						title={'Suhu'}
						latestMeasurementMet={latestMeasurementMet.temperature > 0
							? parseFloat(latestMeasurementMet.temperature).toFixed(2)
							: 0}
						chartId={'temperatureChart'}
						showChart={temperature.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Suhu -->

					<!-- Solar Radius -->
					<MeteorologyAccordionPm25
						meteorology={'solar-radius'}
						title={'Solar Radiation'}
						latestMeasurementMet={latestMeasurementMet.sr > 0
							? parseFloat(latestMeasurementMet.sr).toFixed(2)
							: 0}
						chartId={'solarRadiusChart'}
						showChart={solarRadius.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Solar Radius -->

					<!-- Tekanan Udara -->
					<MeteorologyAccordionPm25
						meteorology={'tekanan-udara'}
						title={'Tekanan Udara'}
						latestMeasurementMet={latestMeasurementMet.pressure > 0
							? parseFloat(latestMeasurementMet.pressure).toFixed(2)
							: 0}
						chartId={'airPressureChart'}
						showChart={airPressure.length > 0}
						{handleAccordion}
						bind:separatorClass
						{setMeteorologyEl}
						{updateMeasurementData}
					/>
					<!-- End of Tekanan Udara -->
				</div>
			{/if}
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
