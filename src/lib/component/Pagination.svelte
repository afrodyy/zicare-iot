<script>
	import { fade } from 'svelte/transition';

	export let isLoading;
	export let datas;
	export let limit;
	export let totalItems;
	export let currentPage;
	export let hasNextPage;
	export let hasPreviousPage;
	export let getPages;
	export let goToPage = () => {};

	function handleGoToPage(page) {
		goToPage(page);
	}
</script>

<div class="flex items-center justify-between my-0">
	<div class="flex items-center space-x-2">
		{#if isLoading}
			<div class="animate-pulse w-full">
				<div class="h-3 w-1/4 bg-slate-600 rounded"></div>
			</div>
		{:else if !isLoading && datas.length > 0}
			<span in:fade={{ duration: 150 }} class="text-sm"
				>Showing {(currentPage - 1) * limit + 1} to
				{#if hasNextPage}
					{datas.length * currentPage}
				{:else}
					{totalItems}
				{/if}
				of {totalItems} data entries</span
			>
		{:else if !isLoading && datas.length < 1}
			<span in:fade={{ duration: 200 }} class="text-sm">Showing 0 to 0 of 0 data entries</span>
		{/if}
	</div>

	{#if totalItems > 0}
		<div class="flex items-center space-x-2">
			<nav class="flex space-x-2 items-center">
				<button
					on:click={() => handleGoToPage(currentPage - 1)}
					type="button"
					class="{!hasPreviousPage
						? 'cursor-not-allowed'
						: ''} bg-secondary text-sm text-[#E5E7EB] p-2 rounded-lg"
					disabled={hasPreviousPage === false}
				>
					Previous
				</button>

				{#each getPages as page}
					{#if page === '...'}
						<button
							type="button"
							aria-current="page"
							class="flex w-[30px] h-[30px] {currentPage === page
								? 'bg-[#3758F9]'
								: 'bg-secondary border border-[#374151CC]'} text-sm text-[#E5E7EB] justify-center items-center rounded-lg"
							>...</button
						>
					{:else}
						<button
							on:click={() => handleGoToPage(page)}
							type="button"
							aria-current="page"
							class="flex w-[30px] h-[30px] {currentPage === page
								? 'bg-[#3758F9]'
								: 'bg-secondary border border-[#374151CC]'} text-sm text-[#E5E7EB] justify-center items-center rounded-lg"
							>{page}</button
						>
					{/if}
				{/each}

				<button
					on:click={() => handleGoToPage(currentPage + 1)}
					type="button"
					class="{!hasNextPage ? 'cursor-not-allowed' : ''} bg-secondary text-sm text-[#E5E7EB]"
					disabled={!hasNextPage}>Next</button
				>
			</nav>
		</div>
	{/if}
</div>
