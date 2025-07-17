import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_USER_SERVICE_URL;

export async function POST({ request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const payload = await request.json();

	try {
		const response = await axios.post(`${apiUrl}/register`, payload, {
			headers: {
				Authorization: authorizationHeader
			}
		});

		const data = response.data;

		return json(data);
	} catch (error) {
		const response = error.response;

		if (response.status === 400) {
			return json({ message: response.data.message }, { status: 400 });
		} else if (response.status === 422) {
			return json({ error: response.data.message }, { status: 422 });
		} else if (response.status === 500) {
			return json({ message: response.data.message }, { status: 500 });
		}
	}
}
