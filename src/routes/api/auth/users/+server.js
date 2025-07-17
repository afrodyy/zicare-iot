import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_USER_SERVICE_URL;

export async function GET({ request }) {
	const authorizationHeader = request.headers.get('Authorization');

	try {
		const response = await axios.get(`${apiUrl}/users`, {
			headers: {
				Authorization: authorizationHeader
			}
		});

		const data = response.data;

		return json(data);
	} catch (error) {
		const response = error.response;

		if (response.status === 401) {
			return json({ message: response.data.message }, { status: 401 });
		} else if (response.status === 404) {
			return json({ message: response.data.message, user: response.data.data }, { status: 404 });
		} else if (response.status === 500) {
			return json({ message: response.data.message, user: response.data.data }, { status: 500 });
		}
	}
}
