<script>
	import L from 'leaflet';
	import 'leaflet.heat';
	import 'leaflet-contour';
	import { onMount } from 'svelte';

	function makeid(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	const MapsId = makeid(5);
	const data = {
		x: [
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
			[8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625]
		],
		y: [
			[47.42, 47.42, 47.42, 47.42, 47.42, 47.42, 47.42],
			[47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4],
			[47.38, 47.38, 47.38, 47.38, 47.38, 47.38, 47.38],
			[47.36, 47.36, 47.36, 47.36, 47.36, 47.36, 47.36],
			[47.34, 47.34, 47.34, 47.34, 47.34, 47.34, 47.34],
			[47.32, 47.32, 47.32, 47.32, 47.32, 47.32, 47.32],
			[47.3, 47.3, 47.3, 47.3, 47.3, 47.3, 47.3]
		],
		z: [
			[null, null, null, null, null, null, null],
			[null, null, null, 2, null, null, null],
			[null, null, 2, 5, 2, null, null],
			[null, 2, 5, 10, 5, 2, null],
			[null, null, 2, 5, 2, null, null],
			[null, null, null, 2, null, null, null],
			[null, null, null, null, null, null, null]
		]
	};

	const colors = [
		{
			color: '#89b9f0',
			point: 0
		},
		{
			color: '#eb0e0e',
			point: 1
		}
	];
	function getColor(value, min, max, colors) {
		function hex(c) {
			var s = '0123456789abcdef';
			var i = parseInt(c, 10);
			if (i === 0 || isNaN(c)) return '00';
			i = Math.round(Math.min(Math.max(0, i), 255));
			return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
		}
		function trim(s) {
			return s.charAt(0) === '#' ? s.substring(1, 7) : s;
		}
		function convertToRGB(hex) {
			var color = [];
			color[0] = parseInt(trim(hex).substring(0, 2), 16);
			color[1] = parseInt(trim(hex).substring(2, 4), 16);
			color[2] = parseInt(trim(hex).substring(4, 6), 16);
			return color;
		}
		function convertToHex(rgb) {
			return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
		}

		if (value === null || isNaN(value)) {
			return '#ffffff';
		}
		if (value > max) {
			return colors[colors.length - 1].color;
		}
		if (value < min) {
			return colors[0].color;
		}
		var loc = (value - min) / (max - min);
		if (loc < 0 || loc > 1) {
			return '#fff';
		} else {
			var index = 0;
			for (var i = 0; i < colors.length - 1; i++) {
				if (loc >= colors[i].point && loc <= colors[i + 1].point) {
					index = i;
				}
			}
			var color1 = convertToRGB(colors[index].color);
			var color2 = convertToRGB(colors[index + 1].color);

			var f = (loc - colors[index].point) / (colors[index + 1].point - colors[index].point);
			var rgb = [
				color1[0] + (color2[0] - color1[0]) * f,
				color1[1] + (color2[1] - color1[1]) * f,
				color1[2] + (color2[2] - color1[2]) * f
			];

			return `#${convertToHex(rgb)}`;
		}
	}

	onMount(() => {
		var map = L.map(MapsId).setView([47.35, 8.57], 13);

		L.tileLayer(
			'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
			{
				maxZoom: 18,
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
					'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1
			}
		).addTo(map);

		L.contour(data, {
			thresholds: 5,
			style: (feature) => {
				return {
					color: getColor(feature.geometry.value, 0, 10, colors),
					opacity: 0,
					fillOpacity: 1
				};
			},
			onEachFeature: onEachContour()
		}).addTo(map);
	});

	function onEachContour() {
		return function onEachFeature(feature, layer) {
			layer.bindPopup(`<table><tbody><tr><td>${feature.value}°C</td></tr></tbody></table>`);
		};
	}
</script>

<div class="min-w-[155px] min-h-100 min-h-max h-[155px] m-2 rounded-md">
	<div id={MapsId} class="min-w-[155px] min-h-100 min-h-max h-[155px]"></div>
</div>
