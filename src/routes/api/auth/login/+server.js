import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_USER_SERVICE_URL;

export async function POST({ request }) {
	const { username, password } = await request.json();

	try {
		const response = await axios.post(
			`${apiUrl}/login`,
			{
				username,
				password
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		return json({ success: true, accessToken: response.data.data.accessToken });
	} catch (error) {
		const response = error.response;

		if (response.status === 400) {
			return json({ error: response.data.message }, { status: 400 });
		} else if (response.status === 500) {
			return json({ error: 'Failed to connect to the service' }, { status: 500 });
		}
	}
}
