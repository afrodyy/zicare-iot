// airQualityStore.js
import { writable } from 'svelte/store';

// Create a store for air quality data
export const airQualityData = writable({
	loading: true,
	error: null,
	stations: [],
	interpolation: {},
	lastUpdated: null
});

// Fetch air quality data from API
export async function fetchAirQualityData() {
	airQualityData.update((state) => ({ ...state, loading: true, error: null }));

	try {
		const response = await fetch('/api/air-quality');

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		airQualityData.update((state) => ({
			...state,
			loading: false,
			stations: data.stations,
			interpolation: data.interpolation,
			lastUpdated: new Date()
		}));

		return data;
	} catch (error) {
		console.error('Failed to fetch air quality data:', error);

		airQualityData.update((state) => ({
			...state,
			loading: false,
			error: error.message || 'Failed to load air quality data'
		}));

		throw error;
	}
}

// Example API response format for reference
const exampleApiResponse = {
	stations: [
		{
			id: 'station1',
			name: 'Downtown',
			latitude: 29.7604,
			longitude: -95.3698,
			value: 48,
			timestamp: '2023-03-04T12:00:00Z',
			category: 'Good'
		}
		// More stations...
	],
	interpolation: {
		grid_values: [
			[45.2, 46.1, 47.3 /* ... */],
			[44.8, 45.9, 47.0 /* ... */]
			// More rows...
		],
		bounds: {
			north: 30.1369,
			south: 29.2013,
			east: -94.7477,
			west: -95.8315
		}
	},
	metadata: {
		timestamp: '2023-03-04T12:00:00Z',
		parameter: 'aqi',
		categories: {
			Good: { min: 0, max: 50, color: '#00E400' },
			Moderate: { min: 51, max: 100, color: '#FFFF00' }
			// More categories...
		}
	}
};

// airQualityApi.js
// If you're using SvelteKit or another server-side framework
export async function getAirQualityData(request) {
	// This would be the server-side implementation
	// You would fetch data from your PM2.5 data source

	try {
		// Example: fetch from a database or external API
		// const dbHelper = new DBHelper();
		// const data = dbHelper.fetch_data();
		// const processor = new PM25Processor();
		// const result = processor.generate_response(data);

		// For this example, we'll return mock data
		return {
			status: 200,
			body: exampleMockData
		};
	} catch (error) {
		console.error('Error fetching air quality data:', error);
		return {
			status: 500,
			body: { error: 'Failed to fetch air quality data' }
		};
	}
}

// Mock data for development/testing
const exampleMockData = {
	stations: [
		{ id: 'station1', name: 'Downtown', latitude: 29.7604, longitude: -95.3698, value: 48 },
		{ id: 'station2', name: 'North', latitude: 30.0369, longitude: -95.4252, value: 46 },
		{ id: 'station3', name: 'East', latitude: 29.7752, longitude: -95.1535, value: 50 },
		{ id: 'station4', name: 'South', latitude: 29.5829, longitude: -95.4432, value: 43 },
		{ id: 'station5', name: 'West', latitude: 29.7858, longitude: -95.7315, value: 47 },
		{ id: 'station6', name: 'Northwest', latitude: 29.9683, longitude: -95.6871, value: 52 },
		{ id: 'station7', name: 'Northeast', latitude: 29.9438, longitude: -95.2597, value: 49 },
		{ id: 'station8', name: 'Southwest', latitude: 29.5602, longitude: -95.6349, value: 45 },
		{ id: 'station9', name: 'Southeast', latitude: 29.5838, longitude: -95.0463, value: 42 },
		{ id: 'station10', name: 'Galveston', latitude: 29.3013, longitude: -94.7977, value: 38 },
		{ id: 'station11', name: 'Central', latitude: 29.7872, longitude: -95.3878, value: 53 },
		{ id: 'station12', name: 'Channel', latitude: 29.7328, longitude: -95.2075, value: 51 }
	],
	interpolation: {
		bounds: {
			north: 30.1369,
			south: 29.2013,
			east: -94.7477,
			west: -95.8315
		},
		// A 50x50 grid would be here with interpolated values
		grid_values: generateMockGridValues(50)
	},
	metadata: {
		timestamp: new Date().toISOString(),
		parameter: 'aqi',
		categories: {
			Good: { min: 0, max: 50, color: '#00E400' },
			Moderate: { min: 51, max: 100, color: '#FFFF00' },
			'Unhealthy for Sensitive Groups': { min: 101, max: 150, color: '#FF7E00' },
			Unhealthy: { min: 151, max: 200, color: '#FF0000' },
			'Very Unhealthy': { min: 201, max: 300, color: '#99004C' },
			Hazardous: { min: 301, max: 500, color: '#7E0023' }
		}
	}
};

function generateMockGridValues(size) {
	// Create a grid with a radial gradient for demo purposes
	const grid = [];
	const centerX = Math.floor(size / 2);
	const centerY = Math.floor(size / 2);
	const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

	for (let i = 0; i < size; i++) {
		const row = [];
		for (let j = 0; j < size; j++) {
			// Calculate distance from center
			const dx = j - centerX;
			const dy = i - centerY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const normDist = dist / maxDist;

			// Create a radial gradient effect
			// Higher in the middle (55), lower at edges (35)
			const value = 55 - normDist * 20;
			row.push(value);
		}
		grid.push(row);
	}
	return grid;
}
