import { redirect } from '@sveltejs/kit';

export async function load() {
	// Access localStorage in a client-only block.
	if (typeof window !== 'undefined') {
		const accessToken = localStorage.getItem('accessToken');
		const userRole = localStorage.getItem('role');
		const username = localStorage.getItem('username');

		// Redirect to the root if no credentials are present
		if (!accessToken || !userRole) {
			throw redirect(302, '/');
		}

		return {
			userRole,
			username
		};
	}

	// If server-side rendering is required, return defaults
	return {
		userRole: '',
		username: ''
	};
}
