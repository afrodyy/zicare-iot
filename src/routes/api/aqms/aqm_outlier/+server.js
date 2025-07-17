import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function PUT({ request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const payload = await request.json();

	try {
		const response = await axios.put(`${apiUrl}/aqm_outlier`, payload.data, {
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
