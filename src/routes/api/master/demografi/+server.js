import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_MASTER_SERVICE_URL;

export async function GET({ url, request }) {
	const id_station = url.searchParams.get('id_station');
	const district_level = url.searchParams.get('district_level');
	const authorizationHeader = request.headers.get('Authorization');

	try {
		const response = await axios.get(`${apiUrl}/demografi`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_station,
				district_level
			}
		});

		// console.log(response.data, '<<<<<<<<<<<< Response measurement30min Server.js');

		return json(response.data);
	} catch (error) {
		console.error(error, '<<<<<<<<<<<< Error fetching data');
		return json({ error: 'Failed to connect to the service' }, { status: 500 });
	}
}
