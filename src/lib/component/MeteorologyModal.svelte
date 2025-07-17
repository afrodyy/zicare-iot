<script>
	import { fade, fly } from 'svelte/transition';
	import {
		showComparisonStation,
		expandedAccordion,
		getLast30MinuteInterval,
		getLast60MinuteInterval,
		handleSweetAlert
	} from '$lib/index';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import * as am5radar from '@amcharts/amcharts5/radar';
	import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
	import axios from 'axios';
	import moment from 'moment';

	export let showMeteorologyModal, selectedAirStation, selectedChildStation;
	export let handleAccordion = () => {},
		handleMeteorologyModal = () => {};

	let accessToken;
	let lastSelectedAirStation = selectedAirStation;
	let separatorClass = 'bg-gt-color-cyan';
	$: windRoseToggle = false;
	let windRoseDataLength = 64;

	$: if (windRoseToggle) {
		$expandedAccordion = 'windrose';
	} else {
		$expandedAccordion = '';
	}

	$: measurementMet = [];
	$: latestMeasurementMet = [];
	$: measurementMetComparison = [];
	$: latestMeasurementMetComparison = [];
	$: windDirection = [];
	$: rainIntensity = [];
	$: windSpeed = [];
	$: humidity = [];
	$: temperature = [];
	$: solarRadius = [];
	$: airPressure = [];
	$: windDirectionComparison = [];
	$: rainIntensityComparison = [];
	$: windSpeedComparison = [];
	$: humidityComparison = [];
	$: temperatureComparison = [];
	$: solarRadiusComparison = [];
	$: airPressureComparison = [];
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

	function defWindRoseChart(chartData) {
		am5.ready(function () {
			/* Chart code */
			// Check if root already exists and dispose of it
			if (am5.registry.rootElements.length > 0) {
				am5.registry.rootElements.forEach((root) => {
					if (root.dom.id === 'windRoseChart') {
						root.dispose(); // Dispose the existing root
					}
				});
			}

			// Create root element
			// https://www.amcharts.com/docs/v5/getting-started/#Root_element
			const root = am5.Root.new('windRoseChart');

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
			const root = am5.Root.new(type);
			let chartData;
			let chartDataComparison;

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

			// console.log(chartData);

			if ($showComparisonStation) {
				// Assign chartData sesuai dengan tipe chart yang dipilih
				if (type === 'windDirectionChart') {
					chartDataComparison = windDirectionComparison;
				} else if (type === 'rainIntensityChart') {
					chartDataComparison = rainIntensityComparison;
				} else if (type === 'windSpeedChart') {
					chartDataComparison = windSpeedComparison;
				} else if (type === 'humidityChart') {
					chartDataComparison = humidityComparison;
				} else if (type === 'temperatureChart') {
					chartDataComparison = temperatureComparison;
				} else if (type === 'solarRadiusChart') {
					chartDataComparison = solarRadiusComparison;
				} else if (type === 'airPressureChart') {
					chartDataComparison = airPressureComparison;
				}
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
				verticalText = 'Curah Hujan (µg/Nm3)';
				valueYUnit = '{valueY} µg/Nm3';
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
				valueYUnit = '{valueY}%';
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

			if ($showComparisonStation) {
				var seriesSecondary = createSeries('value', '#A851DA');
				seriesSecondary.data.setAll(chartDataComparison);
			}

			// Animate the chart on load
			chart.appear(1000, 100);
		});
	}

	function generateChartData(type) {
		const getTimestampFromTime = (waktu) => {
			const dateOnly = waktu.split('T')[0]; // Mengambil hanya bagian tanggal
			return new Date(dateOnly).getTime(); // Mengubah menjadi timestamp
		};

		// Langkah 1: Mengelompokkan data berdasarkan tanggal
		const groupedData = measurementMet.reduce((acc, item) => {
			const timestamp = getTimestampFromTime(item.waktu);
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
					avg = values.reduce((sum, rain_intensity) => sum + rain_intensity, 0) / values.length;

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

	async function generateChartDataComparison(type) {
		const getTimestampFromTime = (waktu) => {
			const dateOnly = waktu.split('T')[0]; // Mengambil hanya bagian tanggal
			return new Date(dateOnly).getTime(); // Mengubah menjadi timestamp
		};

		// Langkah 1: Mengelompokkan data berdasarkan tanggal
		const groupedData = measurementMetComparison.reduce((acc, item) => {
			const timestamp = getTimestampFromTime(item.waktu);
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
					avg = values.reduce((sum, rain_intensity) => sum + rain_intensity, 0) / values.length;

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
			windDirectionComparison = dailyData.reverse();
		} else if (type === 'rainIntensityChart') {
			// Hasil akhir
			rainIntensityComparison = dailyData.reverse();
		} else if (type === 'windSpeedChart') {
			// Hasil akhir
			windSpeedComparison = dailyData.reverse();
		} else if (type === 'humidityChart') {
			// Hasil akhir
			humidityComparison = dailyData.reverse();
		} else if (type === 'temperatureChart') {
			// Hasil akhir
			temperatureComparison = dailyData.reverse();
		} else if (type === 'solarRadiusChart') {
			// Hasil akhir
			solarRadiusComparison = dailyData.reverse();
		} else if (type === 'airPressureChart') {
			// Hasil akhir
			airPressureComparison = dailyData.reverse();
		}
	}

	function clearChartDataComparison(type) {
		if (type === 'windDirectionChart') {
			windDirectionComparison = [];
		} else if (type === 'rainIntensityChart') {
			rainIntensityComparison = [];
		} else if (type === 'windSpeedChart') {
			windSpeedComparison = [];
		} else if (type === 'humidityChart') {
			humidityComparison = [];
		} else if (type === 'temperatureChart') {
			temperatureComparison = [];
		} else if (type === 'solarRadiusChart') {
			solarRadiusComparison = [];
		} else if (type === 'airPressureChart') {
			airPressureComparison = [];
		}
	}

	const getMeasurementMet = async () => {
		const today = new Date();
		const pastDate = new Date(today);
		pastDate.setDate(today.getDate() - 6);
		// const date_from = '2024-06-05T00:00:00.000Z';
		// const date_to = '2024-06-11T23:59:59.000Z';

		const date_from =
			getLast30MinuteInterval(moment().subtract(6, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		const date_to = getLast30MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';

		try {
			const response = await axios.get('/api/aqms/measurement30min', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedAirStation.id_station,
					tipe_stasiun: selectedAirStation.tipe_station,
					// date_from: pastDate.toISOString(),
					// date_to: today.toISOString()
					date_from,
					date_to
				}
			});

			measurementMet = response.data.data.aqms_30_min;
			console.log(measurementMet);
			latestMeasurementMet = measurementMet[0];
		} catch (error) {
			console.log(error);
		}
	};

	const getMeasurementMetComparison = async () => {
		const today = new Date();
		const pastDate = new Date(today);
		pastDate.setDate(today.getDate() - 6);
		const date_from = '2024-06-05T00:00:00.000Z';
		const date_to = '2024-06-11T23:59:59.000Z';

		// const date_from =
		// 	getLast60MinuteInterval(moment().subtract(6, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		// const date_to = getLast60MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';

		try {
			const response = await axios.get('/api/aqms/measurementMet', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun: selectedChildStation.id_station,
					tipe_stasiun: selectedChildStation.tipe_station,
					// date_from: pastDate.toISOString(),
					// date_to: today.toISOString()
					date_from,
					date_to
				}
			});

			measurementMetComparison = response.data.data.aqms_met;
			latestMeasurementMetComparison = measurementMetComparison[0];
		} catch (error) {
			console.log(error);
		}
	};

	const getWindRoseData = async () => {
		const id_stasiun = selectedAirStation.id_station;
		const date_from =
			getLast30MinuteInterval(moment().subtract(1, 'days').subtract(30, 'minutes')).format(
				'YYYY-MM-DDTHH:mm:ss.SSS'
			) + 'Z';
		const date_to =
			getLast30MinuteInterval(moment().subtract(30, 'minutes')).format('YYYY-MM-DDTHH:mm:ss.SSS') +
			'Z';

		// const date_from =
		// 	getLast60MinuteInterval(moment().subtract(6, 'days')).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		// const date_to = getLast60MinuteInterval(moment()).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';

		try {
			const response = await axios.get('/api/aqms/windrosemet', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: {
					id_stasiun,
					date_from,
					date_to
				}
			});

			return await response.data.data.windrose;
		} catch (error) {
			const response = error.response;

			if (response) {
				const statusCode = response.status;

				if (statusCode === 401) {
					alert(response.data.message);

					localStorage.clear();
					goto('/');
				} else if (statusCode === 422) {
					console.log(response.data.message, '<<< Err 422');
					handleSweetAlert('info', 'Tidak ada data untuk ditampilkan');
					const data = [
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					];
					return data;
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

	async function handleShowChart(chartType, showChart, chartInstance) {
		if (showChart) {
			if (chartType === 'windRoseChart') {
				const windRoseData = await getWindRoseData();
				// const windRoseData = [
				// 	[3, 4, 1, 0, 1, 2, 4, 0, 2, 2, 4, 0, 1, 0, 4, 3],
				// 	[0, 1, 1, 2, 0, 3, 2, 2, 1, 3, 1, 3, 1, 4, 1, 3],
				// 	[1, 4, 2, 1, 3, 0, 3, 0, 3, 1, 0, 4, 4, 0, 2, 2],
				// 	[0, 3, 3, 2, 4, 4, 0, 0, 3, 0, 4, 4, 1, 0, 3, 0]
				// ];

				windRoseDataLength = windRoseData.flat().filter((value) => value === 0).length;

				if (windRoseDataLength < 64) defWindRoseChart(windRoseData);
			} else {
				generateChartData(chartType);

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

	onMount(async () => {
		accessToken = localStorage.getItem('accessToken');
		await getMeasurementMet();

		if (selectedChildStation !== null) {
			await getMeasurementMetComparison();
		}
	});

	afterUpdate(async () => {
		if (selectedAirStation.id_stasiun !== lastSelectedAirStation.id_stasiun) {
			lastSelectedAirStation = selectedAirStation;

			await getMeasurementMet();

			if (selectedChildStation !== null) {
				await getMeasurementMetComparison();
			}
		}

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

		if ($expandedAccordion in chartMap) {
			let { type, instance } = chartMap[$expandedAccordion];

			if ($showComparisonStation) {
				clearChartDataComparison(type);
				if (instance !== null) {
					instance.dispose();
					instance = null;
				}

				if (type !== 'windRoseChart') {
					await generateChartDataComparison(type);
				}

				handleShowChart(type, true, instance);
			} else {
				clearChartDataComparison(type);

				if (instance !== null) {
					instance.dispose();
					instance = null;
				}

				handleShowChart(type, true, instance);
			}
		} else {
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
	});

	onDestroy(() => {
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
	transition:fade={{ duration: 200 }}
	class="fixed flex top-1 right-[38.5rem] mt-16 flex-end z-50"
>
	<div
		class="justify-end mt-7 w-[23rem] overflow-hidden shadow-lg border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div
			class="flex flex-col bg-gt-color-dark gap-2 p-6 border-b border-gt-color-dark-3-transparent"
		>
			<div class="flex flex-row gap-3 justify-between">
				<span class="font-bold text-base text-gt-color-gray-3">Meteorologi</span>

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
						class="size-5 text-gt-color-gray-3"
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

					<span class="font-medium text-xs text-gt-color-gray-3">DATA STASIUN</span>
				</div>

				<div class="h-8 flex flex-row gap-2 justify-between">
					<div class="flex flex-row gap-3">
						<div class="flex flex-row gap-2 items-center">
							<div class="w-4 h-4 rounded {separatorClass}"></div>

							<div class="flex flex-row gap-3 rounded-lg p-2 justify-between items-center w-full">
								<span class="font-medium text-xs text-gt-color-gray-3"
									>{selectedAirStation.nama}</span
								>

								<span
									class="py-0.5 px-2.5 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-gt-color-gray capitalize"
									>{selectedAirStation.tipe_station}</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Stasiun Udara Pembanding -->
			{#if $showComparisonStation}
				<div in:fly={{ y: 20, duration: 150 }} class="h-8 flex flex-row gap-2 justify-between">
					<div class="flex flex-row gap-3">
						<div class="flex flex-row gap-2 items-center">
							<div class="w-4 h-4 rounded bg-[#AA52DD]"></div>

							<div class="flex flex-row gap-3 rounded-lg p-2 justify-between items-center w-full">
								<span class="font-medium text-xs text-gt-color-gray-3 text-nowrap"
									>{selectedChildStation.nama}</span
								>

								<span
									class="py-0.5 px-2.5 rounded-full bg-gt-color-dark-3 bg-opacity-80 font-normal text-xs text-gt-color-gray text-nowrap capitalize"
									>{selectedChildStation.tipe_station}</span
								>
							</div>
						</div>
					</div>
				</div>
			{/if}
			<!-- End of Stasiun Udara Pembanding -->

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
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex w-full {$expandedAccordion === 'windrose'
				? 'h-96'
				: 'h-80'} overflow-y-auto scrollbar gap-6 p-3 bg-gt-color-dark-transparent backdrop-blur-sm ease-out duration-150"
		>
			{#if windRoseToggle}
				{#if windRoseDataLength < 64}
					<div class="flex w-full">
						<!-- Windrose -->
						<div class="flex flex-col w-full gap-2 pb-3">
							<div bind:this={windRoseEl} in:fade={{ y: 50, duration: 150 }} class="flex flex-col">
								<div id="windRoseChart" class="w-full h-96"></div>
							</div>
						</div>
						<!-- End of Windrose -->
					</div>
				{:else}
					<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3 pb-3 mt-3">
						<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
						<span class="font-medium text-sm text-gt-color-gray"
							>Tidak ada data untuk ditampilkan di grafik</span
						>
					</div>
				{/if}
			{:else}
				<div class="flex flex-col w-full gap-3">
					<!-- Arah Angin -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'arah-angin'}
							<div
								on:click={() =>
									$expandedAccordion === 'arah-angin'
										? ($expandedAccordion = '')
										: handleAccordion('arah-angin')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Arah Angin</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.wd || 0}</span
											>
											<div
												class="w-1.5 h-1.5 rounded-full border border-gt-color-gray self-start mt-1"
											></div>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray"
													>{latestMeasurementMetComparison?.wd || 0}</span
												>
												<div
													class="w-1.5 h-1.5 rounded-full border border-gt-color-gray self-start mt-1"
												></div>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'arah-angin'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'arah-angin'
												? ($expandedAccordion = '')
												: handleAccordion('arah-angin')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Arah Angin</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if windDirection.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Wind Speed Chart -->
									<div id="windDirectionChart" class="w-full h-52"></div>
									<!-- End of Wind Speed Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Arah Angin -->

					<!-- Curah Hujan -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'curah-hujan'}
							<div
								on:click={() =>
									$expandedAccordion === 'curah-hujan'
										? ($expandedAccordion = '')
										: handleAccordion('curah-hujan')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Curah Hujan</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.rain_intensity || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
												>mm/h</span
											>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray"
													>{latestMeasurementMetComparison?.rain_intensity || 0}</span
												>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
													>µg/Nm3</span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'curah-hujan'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'curah-hujan'
												? ($expandedAccordion = '')
												: handleAccordion('curah-hujan')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Curah Hujan</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if rainIntensity.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Wind Speed Chart -->
									<div id="rainIntensityChart" class="w-full h-52"></div>
									<!-- End of Wind Speed Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Curah Hujan -->

					<!-- Kec. Angin -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'kecepatan-angin'}
							<div
								on:click={() =>
									$expandedAccordion === 'kecepatan-angin'
										? ($expandedAccordion = '')
										: handleAccordion('kecepatan-angin')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Kec. Angin</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.ws || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">m/s</span
											>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray"
													>{latestMeasurementMetComparison?.ws || 0}</span
												>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
													>m/s</span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'kecepatan-angin'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'kecepatan-angin'
												? ($expandedAccordion = '')
												: handleAccordion('kecepatan-angin')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Kec. Angin</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if windSpeed.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Wind Speed Chart -->
									<div id="windSpeedChart" class="w-full h-52"></div>
									<!-- End of Wind Speed Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Kecepatan Angin -->

					<!-- Kelembaban -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'kelembaban'}
							<div
								on:click={() =>
									$expandedAccordion === 'kelembaban'
										? ($expandedAccordion = '')
										: handleAccordion('kelembaban')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Kelembaban</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.humidity || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">%</span>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray">
													{latestMeasurementMetComparison?.humidity || 0}
												</span>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">%</span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'kelembaban'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'kelembaban'
												? ($expandedAccordion = '')
												: handleAccordion('kelembaban')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Kelembaban</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if windSpeed.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Wind Speed Chart -->
									<div id="humidityChart" class="w-full h-52"></div>
									<!-- End of Wind Speed Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Kelembaban -->

					<!-- Suhu -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'suhu'}
							<div
								on:click={() =>
									$expandedAccordion === 'suhu'
										? ($expandedAccordion = '')
										: handleAccordion('suhu')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Suhu</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.temperature || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5">°C</span>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray">
													{latestMeasurementMetComparison?.temperature || 0}
												</span>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
													>°C</span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'suhu'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'suhu'
												? ($expandedAccordion = '')
												: handleAccordion('suhu')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Suhu</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if temperature.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Temperature Chart -->
									<div id="temperatureChart" class="w-full h-52"></div>
									<!-- End of Temperature Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Suhu -->

					<!-- Solar Radius -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'solar-radius'}
							<div
								on:click={() =>
									$expandedAccordion === 'solar-radius'
										? ($expandedAccordion = '')
										: handleAccordion('solar-radius')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Solar Radiation</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.sr || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
												>watt/m<sup>2</sup></span
											>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray">
													{latestMeasurementMetComparison?.sr || 0}
												</span>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
													>watt/m<sup>2</sup></span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'solar-radius'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'solar-radius'
												? ($expandedAccordion = '')
												: handleAccordion('solar-radius')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Solar Radiation</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if solarRadius.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Temperature Chart -->
									<div id="solarRadiusChart" class="w-full h-52"></div>
									<!-- End of Temperature Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>

					<hr class="border-gt-color-dark-3 bg-opacity-80" />
					<!-- End of Solar Radius -->

					<!-- Tekanan Udara -->
					<div class="flex flex-col w-full gap-2">
						{#if $expandedAccordion !== 'tekanan-udara'}
							<div
								on:click={() =>
									$expandedAccordion === 'tekanan-udara'
										? ($expandedAccordion = '')
										: handleAccordion('tekanan-udara')}
								role="presentation"
								class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
							>
								<!-- Kiri -->
								<div class="flex flex-row gap-4">
									<span class="w-28 font-normal text-base text-gt-color-gray">Tekanan Udara</span>
									<div class="flex flex-col gap-1.5">
										<div class="flex flex-row gap-2 items-center">
											<div class="w-1 h-4 rounded-lg {separatorClass}"></div>
											<span class="text-base font-normal text-gt-color-gray"
												>{latestMeasurementMet?.pressure || 0}</span
											>
											<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
												>mBar</span
											>
										</div>

										{#if $showComparisonStation}
											<div class="flex flex-row gap-2 items-center">
												<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
												<span class="text-base font-normal text-gt-color-gray">
													{latestMeasurementMetComparison?.pressure || 0}
												</span>
												<span class="text-xs font-normal text-gt-color-gray self-end mb-0.5"
													>mBar</span
												>
											</div>
										{/if}
									</div>
								</div>

								<!-- Kanan -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5 text-gt-color-gray-3"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</div>
						{/if}

						{#if $expandedAccordion === 'tekanan-udara'}
							<div
								in:fly={{ y: 50, duration: 150 }}
								class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
							>
								<!-- Atas -->
								<div class="flex flex-row w-full gap-4 items-center justify-between">
									<div
										on:click={() =>
											$expandedAccordion === 'tekanan-udara'
												? ($expandedAccordion = '')
												: handleAccordion('tekanan-udara')}
										role="presentation"
										class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
									>
										<span class="font-normal text-base text-gt-color-gray">Tekanan Udara</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-5 text-gt-color-gray-3 rotate-180"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</div>
								</div>
							</div>

							{#if solarRadius.length > 0}
								<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
									<!-- Temperature Chart -->
									<div id="airPressureChart" class="w-full h-52"></div>
									<!-- End of Temperature Chart -->
								</div>
							{:else}
								<div in:fade={{ duration: 200 }} class="flex flex-row gap-2 items-center pl-3">
									<div class="w-1.5 h-1.5 rounded-full bg-gt-color-gray"></div>
									<span class="font-medium text-sm text-gt-color-gray"
										>Tidak ada data untuk ditampilkan di grafik</span
									>
								</div>
							{/if}
						{/if}
					</div>
					<!-- End of Tekanan Udara -->
				</div>
			{/if}
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
