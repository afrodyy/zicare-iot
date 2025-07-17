import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_stasiun = url.searchParams.get('id_stasiun');

	try {
		const response = await axios.get(`${apiUrl}/ispu_forecast`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_stasiun
			}
		});

		return json(response.data);
	} catch (error) {
		const response = error.response;

		if (response.status === 401) {
			return json({ message: response.data.message }, { status: 401 });
		} else if (response.status === 404) {
			return json(
				{ message: response.data.message, aqm_ispu: response.data.data },
				{ status: 404 }
			);
		} else if (response.status === 500) {
			return json(
				{ message: response.data.message, aqm_ispu: response.data.data },
				{ status: 500 }
			);
		}
	}
}
