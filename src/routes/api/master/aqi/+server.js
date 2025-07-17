import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_MASTER_SERVICE_URL;

export async function GET({ request }) {
	const authorizationHeader = request.headers.get('Authorization');

	try {
		const response = await axios.get(`${apiUrl}/aqi`, {
			headers: {
				Authorization: authorizationHeader
			}
		});

		// console.log(response.data, '<<<<<<<<<<<< Response measurement30min Server.js');

		return json(response.data);
	} catch (error) {
		console.error(error, '<<<<<<<<<<<< Error fetching data');
		return json({ error: 'Failed to connect to the service' }, { status: 500 });
	}
}
