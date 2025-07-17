import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_stasiun = url.searchParams.get('id_stasiun');
	const tipe_stasiun = url.searchParams.get('tipe_stasiun');
	const date_from = url.searchParams.get('date_from');
	const date_to = url.searchParams.get('date_to');

	try {
		const response = await axios.get(`${apiUrl}/ispu_data`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_stasiun,
				tipe_stasiun,
				date_from,
				date_to
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
