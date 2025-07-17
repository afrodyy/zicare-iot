import { json } from '@sveltejs/kit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_AQMS_SERVICE_URL;

export async function GET({ url, request }) {
	const authorizationHeader = request.headers.get('Authorization');
	const id_stasiun = url.searchParams.get('id_stasiun');
	const date_from = url.searchParams.get('date_from');
	const date_to = url.searchParams.get('date_to');

	try {
		const response = await axios.get(`${apiUrl}/windrosemet`, {
			headers: {
				Authorization: authorizationHeader
			},
			params: {
				id_stasiun,
				date_from,
				date_to
			}
		});

		return json(response.data);
	} catch (error) {
		const response = error.response;

		if (response.status === 401) {
			return json(
				{
					success: response.data.success,
					message: response.data.message,
					data: response.data.data
				},
				{ status: 401 }
			);
		} else if (response.status === 404) {
			return json({ error: response.data.message, windrose: response.data.data }, { status: 404 });
		} else if (response.status === 422) {
			return json(
				{
					success: response.data.success,
					message: response.data.message,
					data: response.data.data
				},
				{ status: 422 }
			);
		} else if (response.status === 500) {
			return json(
				{
					success: response.data.success,
					message: response.data.message,
					data: response.data.data
				},
				{ status: 500 }
			);
		}
	}
}
