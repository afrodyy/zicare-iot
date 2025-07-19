<script>
	import axios from 'axios';
	import {
		isPm25App,
		isLoading,
		mainContainerHeight,
		headerHeight,
		componentsGap,
		handleSweetAlert
	} from '$lib/index';
	import { fade, fly } from 'svelte/transition';
	import { onMount, afterUpdate } from 'svelte';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/themes/dark.css';
	import '$src/flatpickr-custom.css';
	import 'flatpickr/dist/plugins/monthSelect/style.css';
	import ExcelJS from 'exceljs';
	import ISPUTablePM25 from '$lib/component/ISPUTablePM25.svelte';
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
	import moment from 'moment';
	import { goto } from '$app/navigation';
	import Signal from '../../../lib/component/icon/Signal.svelte';

	export let data = {};

	let accessToken;
	let userRole;
	let userRoles = [];
	let mainContentHeight;
	let startDateEl;
	let endDateEl;

	$: startDate = '';
	$: endDate = '';
	$: formattedStartDate = '';
	$: formattedEndDate = '';

	let filterContainerHeight;
	let tabContentHeight;
	let containerContentHeight;
	let resizeObserver;

	$: masterStations = [];
	$: selectedRoom = {};
	$: selectedRoomLength = Object.keys(selectedRoom).length;
	$: searchQuery = '';

	$: ispus = [];
	$: paginatedIspus = []; // Data yang ditampilkan sesuai halaman saat ini

	$: currentPage = 1;
	$: entriesShown = 25;
	$: entriesShownOpen = false;
	$: totalItems = 0;
	$: totalPages = 0;
	$: masterRoomDropdown = false;

	$: validation = {};
	$: tabActive = 'room-data';
	let lastTabActive = tabActive;

	let metrics = ['temperature', 'humidity', 'air_pressure'];

	$: chartInstance = null;
	$: chartData = {};
	$: {
		metrics.forEach((metric) => {
			chartData[metric] = [];
		});
	}

	let masterRooms = [];
	let roomDatas = [];

	const getMasterStation = async () => {
		const tipe_station = $isPm25App ? 'dlh_dki_pm25' : null;

		try {
			const response = await axios.get('/api/master/station', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
				// params: {
				// 	tipe_station
				// }
			});

			masterStations = response.data.data.station;
			masterStations = masterStations.filter((station) => {
				return station.tipe_station === 'lowcost' || station.tipe_station === 'dlh_dki_pm25';
			});
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang', true);
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	const getRoles = async () => {
		try {
			const response = await axios.get('/api/auth/roles', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});

			userRoles = await response.data.data.roles;
		} catch (error) {
			const response = error.response;

			if (response) {
				if (response.status === 401) {
					handleSweetAlert('warning', 'Sesi anda telah berakhir, silahkan login ulang', true);
					localStorage.clear();
				} else {
					handleSweetAlert('error', response.data.message);
				}
			}

			$isLoading = false;
		}
	};

	function handleEntriesShown(entries) {
		if (paginatedIspus.length > 0) {
			entriesShown = entries;
			currentPage = 1;
			updatePaginatedData();
			fetchPages();
		} else {
			entriesShown = entries;
		}
	}

	function updatePaginatedData() {
		const start = (currentPage - 1) * entriesShown;
		const end = start + entriesShown;
		paginatedIspus = ispus.slice(start, end); // Slice data to simulate pagination
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

	function handleSelectRoom(room) {
		const id = room.id;
		const selectedRoomData = roomDatas.filter((item) => item.room_id === id);

		selectedRoom = { ...room, data: selectedRoomData };
		generateChartData(selectedRoom.data);
	}

	function handleSearch() {
		if ($isPm25App) {
			filteredStations = masterStations.filter((station) =>
				station.nama.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			filteredStations = masterStations.filter((station) =>
				station.id_station.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
	}

	async function handleFilter(refresh = false) {
		if (refresh) {
			location.reload();
		} else {
			if (selectedRoomLength === 0 || startDate === '' || endDate === '') {
				if (selectedRoomLength === 0) {
					validation.field = 'station';
					validation.message = 'Pilih lokasi terlebih dahulu!';
				} else if (startDate === '') {
					validation.field = 'startDate';
					validation.message = 'Pilih tanggal mulai terlebih dahulu!';
				} else if (endDate === '') {
					validation.field = 'endDate';
					validation.message = 'Pilih tanggal akhir terlebih dahulu!';
				}

				handleSweetAlert('error', validation.message);
			} else {
				formattedStartDate = new Date(startDate).toISOString();
				formattedEndDate = new Date(endDate).toISOString();

				if (formattedStartDate > formattedEndDate) {
					validation.field = 'startDate';
					validation.message = 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir!';

					handleSweetAlert('error', validation.message);
				}
			}
		}
	}

	function updateContainerContentHeight(filterContainerHeight, tabContentHeight) {
		let mainContentHeight;

		mainContainerHeight.subscribe((value) => {
			mainContentHeight =
				value - $headerHeight - filterContainerHeight - tabContentHeight - $componentsGap * 3 - 4;
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

	async function generateChartData(data) {
		const startDateTime = moment(data.at(0).time).format('YYYY-MM-DD HH:mm:ss');
		const endDateTime = moment(data.at(-1).time).format('YYYY-MM-DD HH:mm:ss');
		const timeInterval = 60;
		const dateTimeIntervals = generateDateTime(startDateTime, endDateTime, timeInterval);

		for (let i = 0; i < dateTimeIntervals.length; i++) {
			const matchingDateTime = await data.find((item) => {
				return moment(item.time).format('YYYY-MM-DD HH:mm:ss') === dateTimeIntervals[i];
			});

			if (matchingDateTime) {
				const utcDate = new Date(matchingDateTime.time).getTime();

				metrics.forEach((metric) =>
					chartData[metric].push({
						date: utcDate,
						value: matchingDateTime[metric] === null ? 0 : parseFloat(matchingDateTime[metric])
					})
				);
			} else {
				const date = new Date(dateTimeIntervals[i].replace(' ', 'T') + '.000Z');

				metrics.forEach((metric) =>
					chartData[metric].push({
						date: date.getTime(),
						value: 0
					})
				);
			}
		}

		// console.log(chartData);
	}

	function defLineChartOld() {
		am5.ready(function () {
			const root = am5.Root.new('chartdiv');
			chartInstance = root;

			// Set themes
			// https://www.amcharts.com/docs/v5/concepts/themes/
			root.setThemes([am5themes_Animated.new(root)]);

			// Create chart
			// https://www.amcharts.com/docs/v5/charts/xy-chart/
			let chart = root.container.children.push(
				am5xy.XYChart.new(root, {
					panX: true,
					panY: true,
					wheelX: 'panX',
					wheelY: 'zoomX',
					pinchZoomX: true,
					paddingLeft: 0
				})
			);

			// Add cursor
			// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
			let cursor = chart.set(
				'cursor',
				am5xy.XYCursor.new(root, {
					behavior: 'none'
				})
			);
			cursor.lineY.set('visible', false);

			// Create axes
			// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
			let xAxis = chart.xAxes.push(
				am5xy.DateAxis.new(root, {
					maxDeviation: 0.5,
					baseInterval: {
						timeUnit: 'hour',
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

			let yAxis = chart.yAxes.push(
				am5xy.ValueAxis.new(root, {
					maxDeviation: 1,
					renderer: am5xy.AxisRendererY.new(root, {
						pan: 'zoom'
					})
				})
			);

			let yRenderer = yAxis.get('renderer');

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

			// Add series
			// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
			const series = chart.series.push(
				am5xy.SmoothedXLineSeries.new(root, {
					name: 'Temperature',
					xAxis: xAxis,
					yAxis: yAxis,
					valueYField: 'value',
					valueXField: 'date',
					tooltip: am5.Tooltip.new(root, {
						labelText: '{name}: {valueY}'
					})
				})
			);

			series.fills.template.setAll({
				visible: true,
				fillOpacity: 0.2
			});

			series.data.setAll(chartData['temperature']);
			series.appear(1000);

			// Create legend
			let legend = chart.children.push(
				am5.Legend.new(root, {
					centerX: am5.percent(0),
					x: am5.percent(15),
					y: am5.percent(100),
					layout: root.horizontalLayout,
					useDefaultMarker: true
				})
			);

			legend.itemContainers.template.setAll({
				paddingTop: 8
			});

			legend.markers.template.setAll({
				width: 10,
				height: 10
			});

			legend.markerRectangles.template.setAll({
				cornerRadiusTL: 10,
				cornerRadiusTR: 10,
				cornerRadiusBL: 10,
				cornerRadiusBR: 10
			});

			legend.labels.template.setAll({
				fill: am5.color('#FEFEFE'),
				fontSize: 12,
				fontWeight: 500
			});

			legend.data.setAll(chart.series.values);
			// End of legend

			// Make stuff animate on load
			// https://www.amcharts.com/docs/v5/concepts/animations/
			chart.appear(1000, 100);
		});
	}

	function defLineChart() {
		if (chartInstance) chartInstance.dispose();

		am5.ready(function () {
			// Root
			let root = am5.Root.new('chartdiv');
			chartInstance = root;
			root.setThemes([am5themes_Animated.new(root)]);

			// Chart
			let chart = root.container.children.push(
				am5xy.XYChart.new(root, {
					panX: true,
					panY: true,
					wheelX: 'panX',
					wheelY: 'zoomX',
					pinchZoomX: true,
					paddingLeft: 0
				})
			);

			let cursor = chart.set(
				'cursor',
				am5xy.XYCursor.new(root, {
					behavior: 'none'
				})
			);
			cursor.lineY.set('visible', false);

			// X Axis (time)
			let xAxis = chart.xAxes.push(
				am5xy.DateAxis.new(root, {
					maxDeviation: 0.2,
					baseInterval: { timeUnit: 'hour', count: 1 },
					renderer: am5xy.AxisRendererX.new(root, {}),
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

			// Y Axis (value)
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

			yRenderer.grid.template.setAll({
				stroke: am5.color('#FEFEFE'),
				strokeWidth: 2,
				strokeDasharray: [5, 5]
			});

			// Function to create series
			function createSeries(metric, name, color) {
				const series = chart.series.push(
					am5xy.SmoothedXLineSeries.new(root, {
						name,
						xAxis,
						yAxis,
						valueYField: 'value',
						valueXField: 'date',
						tooltip: am5.Tooltip.new(root, {
							labelText: `{name}: {valueY}`
						})
					})
				);

				series.strokes.template.setAll({ stroke: color });
				series.fills.template.setAll({
					visible: true,
					fillOpacity: 0.2
				});
				series.data.setAll(chartData[metric]);
				series.appear(1000);
			}

			// Tambahkan tiga series
			const colors = {
				temperature: am5.color(0xff0000),
				humidity: am5.color(0x00aaff),
				air_pressure: am5.color(0x00cc66)
			};

			metrics.forEach((metric) => {
				let name = '';

				if (metric === 'temperature') {
					name = metric.replace('_', ' ') + ' (°C)';
				} else if (metric === 'humidity') {
					name = metric.replace('_', ' ') + ' (g/m³)';
				} else {
					name = metric.replace('_', ' ') + ' (hPa)';
				}

				createSeries(metric, name, colors[metric]);
			});

			// Create legend
			let legend = chart.children.push(
				am5.Legend.new(root, {
					centerX: am5.percent(0),
					x: am5.percent(15),
					y: am5.percent(100),
					layout: root.horizontalLayout,
					useDefaultMarker: true
				})
			);

			legend.itemContainers.template.setAll({
				paddingTop: 8
			});

			legend.markers.template.setAll({
				width: 10,
				height: 10
			});

			legend.markerRectangles.template.setAll({
				cornerRadiusTL: 10,
				cornerRadiusTR: 10,
				cornerRadiusBL: 10,
				cornerRadiusBR: 10
			});

			legend.labels.template.setAll({
				fill: am5.color('#FEFEFE'),
				fontSize: 12,
				fontWeight: 500
			});

			legend.data.setAll(chart.series.values);
			// End of legend

			chart.appear(1000, 100);
		});
	}

	async function exportToExcel() {
		const fileName = $isPm25App
			? `ISPU_Report_${selectedRoom.name}`
			: `ISPU_Report_${selectedRoom.id}`;

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Data ISPU');

		if ($isPm25App) {
			worksheet.mergeCells('A1:B1');
			worksheet.mergeCells('A2:B2');
		} else {
			worksheet.mergeCells('A1:M1');
			worksheet.mergeCells('A2:M2');
			worksheet.mergeCells('B3:M3');
			worksheet.mergeCells('B4:M4');
			worksheet.mergeCells('B5:M5');
		}

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
			moment.utc(formattedStartDate).format('YYYY-MM-DD HH:mm:ss') +
			' - ' +
			moment.utc(formattedEndDate).format('YYYY-MM-DD HH:mm:ss');
		dateValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		dateValueRow.font = { size: 12, bold: true };

		const idStationLabelRow = worksheet.getCell('A4');
		idStationLabelRow.value = 'ID Stasiun:';
		idStationLabelRow.alignment = { vertical: 'middle', horizontal: 'left' };
		idStationLabelRow.font = { size: 12, bold: true };

		const idStationValueRow = worksheet.getCell('B4');
		idStationValueRow.value = selectedRoom.id;
		idStationValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		idStationValueRow.font = { size: 12, bold: true };

		const stationTypeLabelRow = worksheet.getCell('A5');
		stationTypeLabelRow.value = $isPm25App ? 'Nama Stasiun:' : 'Tipe Stasiun:';
		stationTypeLabelRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationTypeLabelRow.font = { size: 12, bold: true };

		const stationValueValueRow = worksheet.getCell('B5');
		stationValueValueRow.value = $isPm25App
			? selectedRoom.name
			: selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1);
		stationValueValueRow.alignment = { vertical: 'middle', horizontal: 'left' };
		stationValueValueRow.font = { size: 12, bold: true };

		let columnTitles = [];

		if ($isPm25App) {
			columnTitles = ['Waktu', 'PM2.5'];
		} else {
			columnTitles = ['Waktu', 'PM10', 'PM2.5', 'SO2', 'CO', 'O3', 'NO2', 'HC'];
		}
		worksheet.addRow(columnTitles);

		// Changes 5 Mar 2025, sebelumnya ga difilter
		ispus.forEach((ispu) => {
			if (ispu.is_filter === 0) {
				if ($isPm25App) {
					worksheet.addRow([moment(ispu.waktu).format('YYYY-MM-DD HH:mm:ss'), ispu.pm25 || 0]);
				} else {
					worksheet.addRow([
						moment(ispu.waktu).format('YYYY-MM-DD HH:mm:ss'),
						ispu.pm10 || 0,
						ispu.pm25 || 0,
						ispu.so2 || 0,
						ispu.co || 0,
						ispu.o3 || 0,
						ispu.no2 || 0,
						ispu.hc || 0
					]);
				}
			}
		});

		const startColumn = 'A';
		const endColumn = $isPm25App ? 'B' : 'M';
		const row = 6;

		for (let col = startColumn.charCodeAt(0); col <= endColumn.charCodeAt(0); col++) {
			const cellAddress = String.fromCharCode(col) + row;
			const cell = worksheet.getCell(cellAddress);
			cell.font = { bold: true };
		}

		let columnWidths = [];

		if ($isPm25App) {
			columnWidths = [
				{ start: 1, end: 1, width: 18 }, // A
				{ start: 2, end: 2, width: 16 } // B to G
			];
		} else {
			columnWidths = [
				{ start: 1, end: 11, width: 12 }, // A
				{ start: 2, end: 8, width: 12 }, // B to G
				{ start: 9, end: 13, width: 16 } // H to N
			];
		}

		columnWidths.forEach(({ start, end, width }) => {
			for (let col = start; col <= end; col++) {
				worksheet.getColumn(col).width = width;
			}
		});

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

	async function getRoomData() {
		try {
			const response = await fetch('/sensor_data_rs.json');

			if (!response.ok) {
				throw Error('Room data not found');
			}

			roomDatas = await response.json();
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		resizeObserver = new ResizeObserver(() => {
			containerContentHeight = updateContainerContentHeight(
				filterContainerHeight,
				tabContentHeight
			);
		});

		resizeObserver.observe(document.querySelector('.filter-container'));
		resizeObserver.observe(document.querySelector('.tab-content'));

		accessToken = localStorage.getItem('accessToken');
		userRole = localStorage.getItem('role');

		if (accessToken && userRole) {
			if (userRole.includes('pm25')) {
				$isPm25App = true;
			}

			await getMasterStation();
			await getRoles();
			await getMasterRoom();
			await getRoomData();

			if (userRoles.length > 0) {
				const matchRole = userRoles.filter((role) => {
					return role.role === userRole;
				});
			}

			if (data.id_stasiun && data.tipe_stasiun && data.nama) {
				selectedRoom = {
					id: data.id_stasiun,
					type: data.tipe_stasiun,
					name: data.nama
				};
				selectedRoomLength = Object.keys(selectedRoom).length;

				handleFilter();
			}
		} else {
			return goto('/');
		}
	});

	afterUpdate(() => {
		if (tabActive !== lastTabActive) {
			lastTabActive = tabActive; // Update the stored state

			if (tabActive === 'room-data') {
				// Helper function to calculate the last 30-minute interval
				function getLast60MinuteInterval() {
					const now = new Date();
					const minutes = now.getMinutes();
					const adjustedMinutes = Math.floor(minutes / 60) * 60; // Round down to the nearest 60 minutes
					now.setMinutes(adjustedMinutes, 0, 0); // Set minutes and reset seconds and milliseconds
					now.setSeconds(0, 0); // Ensure seconds and milliseconds are 0 (redundant but explicit)

					return now;
				}

				// Helper function to calculate the start date (-6 days with the same time as end date)
				function getStartDateMinus6Days(endDate) {
					const startDate = new Date(endDate);
					startDate.setDate(startDate.getDate() - 6); // Subtract 6 days

					return startDate;
				}

				// Initialize endDate picker
				endDate = getLast60MinuteInterval(); // Default end date: last 30-minute interval
				endDate = moment(endDate).format('DD MMM YYYY HH:mm');

				const endDatePicker = flatpickr(endDateEl, {
					enableTime: true,
					time_24hr: true,
					defaultHour: 23,
					defaultDate: endDate,
					dateFormat: 'd M Y H:i',
					onReady: (selectedDates, dateStr, instance) => {
						instance.calendarContainer.children[0].children[1].children[0].children[0].style.webkitAppearance =
							'none';
					}
				});

				// Initialize startDate picker with -6 days from the end date
				startDate = getStartDateMinus6Days(endDate); // Default start date
				startDate = moment(startDate).format('DD MMM YYYY HH:mm');

				flatpickr(startDateEl, {
					enableTime: true,
					time_24hr: true,
					defaultHour: 0,
					defaultDate: startDate,
					dateFormat: 'd M Y H:i',
					onReady: (selectedDates, dateStr, instance) => {
						instance.calendarContainer.children[0].children[1].children[0].children[0].style.webkitAppearance =
							'none';
					},
					onChange: (selectedDates) => {
						if (selectedDates.length > 0) {
							// Update endDate picker with constraints
							const newStartDate = selectedDates[0];
							const maxEndDate = new Date(newStartDate);
							maxEndDate.setMonth(maxEndDate.getMonth() + 1); // Ensure max end date is 1 month from start
							endDatePicker.set('minDate', newStartDate);
							endDatePicker.set('maxDate', maxEndDate);
						}
					}
				});
			} else if (
				tabActive === 'grafik' &&
				Object.keys(selectedRoom).length > 0 &&
				selectedRoom.data.length > 0
			) {
				defLineChart();
			}
		}
	});
</script>

<svelte:head>
	<title>ZiCare Hospital Air Quality Monitoring System | Room Data</title>
</svelte:head>

<!-- Filter Tab -->
<div
	bind:clientHeight={filterContainerHeight}
	in:fade={{ duration: 200 }}
	class="filter-container p-4 mb-6 rounded-lg bg-gt-color-dark bg-opacity-80 border border-gt-color-dark-3-transparent shadow shadow-black"
>
	<div class="flex flex-row flex-wrap gap-4 items-end">
		<!-- Stasiun -->
		<div class="flex flex-1 flex-col gap-2">
			<span class="font-normal text-sm text-gt-color-gray">ROOM</span>

			<div class="relative">
				<button
					on:click={() => {
						masterRoomDropdown = !masterRoomDropdown;
					}}
					type="button"
					class="flex flex-row w-full gap-4 p-2 rounded-lg border {validation?.field === 'station'
						? 'border-red-500'
						: 'border-gt-color-dark-3-transparent'}  bg-gt-color-dark bg-opacity-80 items-center justify-between focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 duration-150"
				>
					<div class="flex flex-row w-full gap-3 items-center overflow-hidden">
						{#if selectedRoomLength > 0}
							<Signal iconClass="size-5" />

							<span
								class="w-full font-normal text-left text-sm text-gt-color-gray text-nowrap capitalize"
								>{selectedRoom.name}</span
							>
						{:else}
							<span class="w-full font-normal text-left text-sm text-gt-color-gray text-nowrap"
								>Pilih Ruangan</span
							>
						{/if}
					</div>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gt-color-gray {masterRoomDropdown
							? 'rotate-180'
							: ''} ease-in-out duration-150"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</button>

				{#if masterRoomDropdown}
					<div
						transition:fly={{ y: 25, duration: 150 }}
						class="absolute w-full max-h-44 top-10 right-0 z-10 origin-top-right rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent overflow-y-scroll scrollbar"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
						tabindex="-1"
					>
						<!-- Container untuk pencarian, bersifat fixed -->
						<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
							<!-- Input untuk pencarian -->
							<input
								type="text"
								placeholder="Pencarian..."
								class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
								bind:value={searchQuery}
								on:input={handleSearch}
							/>
						</div>

						<!-- Daftar dropdown yang bisa di-scroll -->
						<div class="flex flex-col gap-1 p-1">
							{#each masterRooms as room, index}
								<button
									on:click={() => {
										handleSelectRoom(room);
										masterRoomDropdown = !masterRoomDropdown;
									}}
									type="button"
									class="flex flex-row gap-3 items-center px-2 py-1.5 hover:bg-slate-800 hover:cursor-pointer rounded-md"
								>
									<span class="text-left text-xs text-gt-color-gray capitalize">{room.name}</span>
								</button>

								{#if index + 1 !== masterRooms.length}
									<hr class="border-slate-800" />
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<!-- End of Stasiun -->

		<!-- From Date -->
		<div class="flex flex-1 flex-col gap-2">
			<span class="font-normal text-sm text-gt-color-gray">FROM DATE</span>

			<div
				class="flex flex-row gap-2 p-2 rounded-lg border {validation?.field === 'startDate'
					? 'border-red-500'
					: 'border-gt-color-dark-3-transparent'}  bg-gt-color-dark bg-opacity-80 focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150"
			>
				<div class="flex flex-row w-full gap-3">
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
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
						/>
					</svg>

					<input
						bind:this={startDateEl}
						bind:value={startDate}
						type="text"
						id="startDateEl"
						placeholder="01 Jan 2024 00:00"
						class="w-full bg-transparent text-white text-sm focus:outline-none"
					/>
				</div>
			</div>
		</div>
		<!-- From Date -->

		<!-- To Date -->
		<div class="flex flex-1 flex-col gap-2">
			<span class="font-normal text-sm text-gt-color-gray">TO DATE</span>

			<div
				class="flex flex-row gap-2 p-2 rounded-lg border {validation?.field === 'endDate'
					? 'border-red-500'
					: 'border-gt-color-dark-3-transparent'} bg-gt-color-dark bg-opacity-80 focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150"
			>
				<div class="flex flex-row w-full gap-3">
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
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
						/>
					</svg>

					<input
						bind:this={endDateEl}
						bind:value={endDate}
						type="text"
						id="startDateEl"
						placeholder="01 Jan 2024 23:00"
						class="w-full bg-transparent text-white text-sm focus:outline-none"
					/>
				</div>
			</div>
		</div>
		<!-- To Date -->

		<!-- Search -->
		<button
			on:click={() => handleFilter()}
			type="button"
			class="flex self-end gap-2 p-2 h-[2.35rem] rounded-lg bg-gt-color-dark hover:bg-slate-800 border border-gt-color-dark-3-transparent items-center focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150"
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
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</button>
		<!-- End of Search -->

		<!-- Refresh -->
		<button
			on:click={() => handleFilter(true)}
			type="button"
			class="flex self-end gap-2 p-2 h-[2.35rem] rounded-lg bg-gt-color-dark hover:bg-slate-800 border border-gt-color-dark-3-transparent items-center focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150"
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
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg>
		</button>
		<!-- End of Refresh -->

		{#if tabActive === 'data-ispu' && ispus.length > 0}
			<button
				in:fade={{ duration: 200 }}
				on:click={() => exportToExcel()}
				type="button"
				class="flex self-end gap-2 p-2 h-[2.35rem] rounded-lg bg-gt-color-dark hover:bg-slate-800 border border-gt-color-dark-3-transparent items-center focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 duration-150"
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
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>
				<span class="font-normal text-sm text-gt-color-gray">Export to Excel</span>
			</button>
		{/if}
	</div>
</div>
<!-- End of Filter Tab -->

<!-- Content Tab -->
<div bind:clientHeight={tabContentHeight} in:fade={{ duration: 200 }} class="tab-content">
	<div class="flex justify-between items-center">
		<div
			class="flex bg-gt-color-dark border-gt-color-dark-3-transparent border-t border-l border-r rounded-t-lg"
		>
			<button
				on:click={() => {
					tabActive = 'room-data';
				}}
				class="px-4 py-2.5 border-b-2 {tabActive === 'room-data'
					? 'border-b-gt-color-primary'
					: 'hover:bg-slate-800 border-transparent'} text-primary font-normal text-base ease-in-out duration-150"
				>Room Data</button
			>
			<button
				on:click={() => {
					tabActive = 'grafik';
				}}
				class="px-4 py-2.5 border-b-2 {tabActive === 'grafik'
					? 'border-b-gt-color-primary'
					: 'hover:bg-slate-800 border-transparent'} text-primary font-normal text-base ease-in-out duration-150"
				>Grafik</button
			>
		</div>
	</div>
</div>
<!-- End of Content Tab -->

<!-- Main Content -->
{#if tabActive === 'room-data'}
	<div
		in:fade={{ duration: 200 }}
		class="flex flex-col gap-4 p-4 pb-3 bg-gt-color-dark-transparent bg-opacity-80 border border-gt-color-dark-3 rounded-b-lg rounded-tr-lg shadow shadow-black overflow-auto"
		style="height: {containerContentHeight}px;"
	>
		<!-- First Row -->
		<div class="flex items-center justify-between">
			<div class="flex flex-row gap-2 items-center">
				{#if selectedRoomLength > 0}
					<img src="/icons/signal.svg" alt="Signal Icon" />

					<h2 class="text-base font-medium capitalize">
						{selectedRoom.name}
					</h2>
				{/if}
			</div>

			<div class="flex flex-row gap-4 items-center">
				<!-- Entries Shown -->
				<button
					on:click={() => {
						entriesShownOpen = !entriesShownOpen;
					}}
					type="button"
					class="relative flex rounded-lg border border-gt-color-dark-3 focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md focus-within:shadow-indigo-400/25 ease-in-out duration-150 items-center"
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
								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(10)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown === 10
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="menu-item-0">10</a
								>

								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(25)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown === 25
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="entries-shown-1">25</a
								>

								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(50)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown === 50
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="entries-shown-2">50</a
								>

								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(75)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown === 75
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="entries-shown-3">75</a
								>

								<!-- svelte-ignore a11y-invalid-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<a
									on:click={() => handleEntriesShown(100)}
									class="block px-4 py-2 mx-1 mb-1 text-sm text-gt-color-gray {entriesShown === 100
										? 'bg-gt-color-primary hover:bg-gt-color-primary-hover'
										: 'hover:bg-slate-800'} hover:bg-slate-800 hover:cursor-pointer rounded-lg"
									role="menuitem"
									tabindex="-1"
									id="entries-shown-4">100</a
								>
							</div>
						</div>
					{/if}
				</button>
				<!-- End of Entries Shown -->
			</div>
		</div>
		<!-- End of First Row -->

		<!-- Second Row -->
		<ISPUTablePM25 {mainContentHeight} bind:selectedRoom {currentPage} {entriesShown} />
		<!-- End of Second Row -->
	</div>
{:else if tabActive === 'grafik'}
	<div
		in:fade={{ duration: 200 }}
		class="flex flex-col max-w-full overflow-hidden p-4 pb-2 bg-gt-color-dark bg-opacity-80 border border-gt-color-dark-3 rounded-b-lg rounded-tr-lg"
		style="height: {containerContentHeight}px;"
	>
		{#if Object.keys(selectedRoom).length > 0 && selectedRoom.data.length > 0}
			<div id="chartdiv" class="w-full h-full"></div>
		{:else}
			<div class="w-full">
				<span class="text-center">Data tidak ditemukan</span>
			</div>
		{/if}
	</div>
{/if}

<!-- End of Main Content -->
