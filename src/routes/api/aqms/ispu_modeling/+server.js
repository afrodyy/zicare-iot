import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function GET() {
	try {
		const response = await axios.get('https://ai-service.greenteams.co/api/pm25_modelling');

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
