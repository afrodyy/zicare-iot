import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const parameter = url.searchParams.get('parameter');
	const tipe_stasiun = url.searchParams.get('tipe_stasiun');
	const page = url.searchParams.get('page');
	const size = url.searchParams.get('size');
	const asc = url.searchParams.get('asc');
	const is_filter = url.searchParams.get('is_filter');

	try {
		const response = await axios.get(`${apiUrl}/ispu_rank_all`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				parameter,
				tipe_stasiun,
				page,
				size,
				asc,
				is_filter
			}
		});

		return json(response.data);
	} catch (error) {
		const response = error.response;

		if (response.status === 400) {
			return json({ error: response.data.message }, { status: 400 });
		} else if (response.status === 404) {
			return json({ error: response.data.message, aqm_ispu: response.data.data }, { status: 404 });
		} else if (response.status === 405) {
			return json({ error: response.data }, { status: 405 });
		} else if (response.status === 422) {
			return json({ error: response.data.message }, { status: 422 });
		} else if (response.status === 500) {
			return json({ error: 'Failed to connect to the service' }, { status: 500 });
		}
	}
}
