<script>
	import '../app.css';
	import { page } from '$app/stores';
</script>

<section class="bg-white">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-sm text-center">
			<h1
				class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500"
			>
				{$page.status}
			</h1>
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{$page.error.message}.
			</p>
			<!-- <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p> -->

			<!-- svelte-ignore a11y-invalid-attribute -->
			<a
				href="/"
				class="inline-flex text-white bg-blue-800 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4"
				>Back to Homepage</a
			>
		</div>
	</div>
</section>
