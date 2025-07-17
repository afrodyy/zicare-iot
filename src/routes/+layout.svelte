<script>
	import { onMount } from 'svelte';
	import { isPm25App } from '$lib/index';
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	// import 'leaflet/dist/leaflet.css';

	$: userRole = '';

	onMount(() => {
		// const accessToken = localStorage.getItem('accessToken');
		// const currentUrl = $page.url.pathname;

		// if (!accessToken && !currentUrl.startsWith('/login')) {
		// 	alert('Anda harus login terlebih dahulu ke dalam sistem!');
		// 	goto('/login');
		// }

		userRole = localStorage.getItem('role');

		if (userRole && userRole.includes('admin-pm25')) {
			$isPm25App = true;
		}
	});
</script>

<slot />
