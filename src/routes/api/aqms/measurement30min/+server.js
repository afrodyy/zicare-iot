import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_stasiun = url.searchParams.get('id_stasiun');
	const tipe_stasiun = url.searchParams.get('tipe_stasiun');
	const date_from = url.searchParams.get('date_from');
	const date_to = url.searchParams.get('date_to');
	const page = url.searchParams.get('page');
	const size = url.searchParams.get('size');
	const asc = url.searchParams.get('asc');

	try {
		const response = await axios.get(`${apiUrl}/measurement30min`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_stasiun,
				tipe_stasiun,
				date_from,
				date_to,
				page,
				size,
				asc
			}
		});

		return json(response.data);
	} catch (error) {
		const response = error.response;

		if (response.status === 401) {
			return json({ message: response.data.message }, { status: 401 });
		} else if (response.status === 404) {
			return json(
				{ message: response.data.message, aqms_30_min: response.data.data },
				{ status: 404 }
			);
		} else if (response.status === 500) {
			return json(
				{ message: response.data.message, aqms_30_min: response.data.data },
				{ status: 500 }
			);
		}
	}
}
