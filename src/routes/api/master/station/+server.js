import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_MASTER_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_station = url.searchParams.get('id_station');
	const tipe_station = url.searchParams.get('tipe_station');
	const parent_id = url.searchParams.get('parent_id');
	const parent_id_station = url.searchParams.get('parent_id_station');
	const parent_tipe_station = url.searchParams.get('parent_tipe_station');

	try {
		const response = await axios.get(`${apiUrl}/station`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_station,
				tipe_station,
				parent_id,
				parent_id_station,
				parent_tipe_station
			}
		});

		const data = response.data;

		return json(data);
	} catch (error) {
		const response = error.response;

		if (response.status === 401) {
			return json({ message: response.data.message }, { status: 401 });
		} else if (response.status === 404) {
			return json({ message: response.data.message, station: response.data.data }, { status: 404 });
		} else if (response.status === 500) {
			return json({ message: response.data.message, station: response.data.data }, { status: 500 });
		}
	}
}

export async function POST({ request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const payload = await request.json();

	try {
		const response = await axios.post(`${apiUrl}/station`, payload, {
			headers: {
				Authorization: authorizationHeader,
				'Content-Type': 'application/json'
			}
		});

		const data = response.data;

		return json(data);
	} catch (error) {
		const response = error.response;

		if (response.status === 400) {
			return json({ error: response.data.message }, { status: 400 });
		} else if (response.status === 422) {
			return json({ error: response.data.message }, { status: 422 });
		} else if (response.status === 500) {
			return json({ error: 'Failed to connect to the service' }, { status: 500 });
		}
	}
}

export async function PUT({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_station = url.searchParams.get('id_station');
	const payload = await request.json();

	try {
		const response = await axios.put(`${apiUrl}/station/${id_station}`, payload, {
			headers: {
				Authorization: authorizationHeader,
				'Content-Type': 'application/json'
			}
		});

		const data = response.data;

		return json(data);
	} catch (error) {
		const response = error.response;

		if (response.status === 400) {
			return json({ error: response.data.message }, { status: 400 });
		} else if (response.status === 404) {
			return json({ error: response.data.message }, { status: 404 });
		} else if (response.status === 405) {
			return json({ error: response.data }, { status: 405 });
		} else if (response.status === 422) {
			return json({ error: response.data.message }, { status: 422 });
		} else if (response.status === 500) {
			return json({ error: 'Failed to connect to the service' }, { status: 500 });
		}
	}
}

export async function DELETE({ request }) {
	try {
		const url = new URL(request.url);
		const authorizationHeader = request.headers.get('Authorization');
		const id_station = url.searchParams.get('id_station');

		// Check if the request body exists before parsing
		let body = {};
		if (request.headers.get('Content-Length') !== '0') {
			body = await request.json();
		}

		const { tipe_station } = body;

		const response = await axios.delete(`${apiUrl}/station/${id_station}`, {
			data: {
				tipe_station
			},
			headers: {
				Authorization: authorizationHeader,
				'Content-Type': 'application/json'
			}
		});

		return json(response.data);
	} catch (error) {
		const response = error.response;

		if (response) {
			if (response.status === 400) {
				return json({ error: response.data.message }, { status: 400 });
			} else if (response.status === 422) {
				return json({ error: response.data.message }, { status: 422 });
			} else if (response.status === 500) {
				return json({ error: 'Failed to connect to the service' }, { status: 500 });
			}
		}

		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
