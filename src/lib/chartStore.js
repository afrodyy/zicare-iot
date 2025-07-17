import { writable } from 'svelte/store';

export const windSpeedChartData = writable(null);
export const windSpeedChart = writable(null);
export const showWindSpeedChart = writable(false);

export function defWindSpeedLineChart(windSpeed) {
	am5.ready(function () {
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		var root = am5.Root.new('windSpeedChart');
		windSpeedChart = root;

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([am5themes_Animated.new(root)]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
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

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		var cursor = chart.set(
			'cursor',
			am5xy.XYCursor.new(root, {
				behavior: 'none'
			})
		);
		cursor.lineY.set('visible', false);

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		var xAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
				maxDeviation: 0.5,
				baseInterval: {
					timeUnit: 'day',
					count: 1
				},
				renderer: am5xy.AxisRendererX.new(root, {
					// minGridDistance: 80,
					// minorGridEnabled: true,
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

		var yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				maxDeviation: 1,
				renderer: am5xy.AxisRendererY.new(root, {
					pan: 'zoom'
				})
			})
		);

		yAxis.children.moveValue(
			am5.Label.new(root, {
				text: 'Kecepatan Angin (m/s)',
				rotation: -90,
				y: am5.p50,
				centerX: am5.p50,
				fill: am5.color('#F9FAFB')
			}),
			0
		);

		let yRenderer = yAxis.get('renderer');

		yRenderer.grid.template.setAll({
			stroke: am5.color('#FEFEFE'),
			strokeWidth: 2,
			strokeDasharray: [5, 5]
		});

		yRenderer.labels.template.setAll({
			fill: am5.color('#FEFEFE'),
			fontSize: 12,
			fontWeight: 400
		});

		var tooltip = am5.Tooltip.new(root, {
			labelText: '{valueY} m/s',
			autoTextColor: false,
			getFillFromSprite: false,
			getStrokeFromSprite: false,
			getLabelFillFromSprite: false
		});

		tooltip.label.setAll({
			fill: am5.color('#F9FAFB')
		});

		tooltip.get('background').setAll({
			fill: am5.color('#111928'),
			fillOpacity: 1
		});

		tooltip.get('background').set('stroke', am5.color('#111928'));

		let customLabel = am5.Label.new(root, {
			text: 'Custom Vertical Label',
			rotation: -90, // Rotasi label agar vertikal
			textAlign: 'center',
			centerX: am5.p50,
			centerY: am5.p50,
			x: am5.p0, // Posisi X label
			y: am5.p10 // Posisi Y label
		});

		yAxis.axisHeader.children.push(customLabel);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		var series = chart.series.push(
			am5xy.SmoothedXLineSeries.new(root, {
				name: 'Series',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value',
				valueXField: 'date',
				tooltip: tooltip,
				fill: am5.color('#1BD5A6'),
				stroke: am5.color('#1BD5A6')
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
					radius: 8,
					stroke: am5.color('#133F41'),
					strokeWidth: 6,
					fill: am5.color('#1BD5A6')
				})
			});
		});

		series.data.setAll(windSpeed);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear(1000);
		chart.appear(1000, 100);
	}); // end am5.ready()
}
