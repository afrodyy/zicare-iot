<script>
	import { fade } from 'svelte/transition';

	export let totalItems, masterRooms, currentPage, entriesShown;
</script>

<div class="max-w-full overflow-auto scrollbar">
	<table class="min-w-full text-left">
		<thead>
			<tr>
				<th
					class="sticky top-0 p-3 bg-gt-color-dark-2 rounded-l-lg font-medium text-sm text-gt-color-gray"
					>No.</th
				>
				<th class="sticky top-0 p-3 bg-gt-color-dark-2 font-medium text-sm text-gt-color-gray"
					>Name</th
				>
				<th
					class="sticky top-0 p-3 bg-gt-color-dark-2 rounded-r-lg font-medium text-sm text-gt-color-gray"
				>
					Action
				</th>
			</tr>
		</thead>
		<tbody>
			{#if totalItems > 0}
				{#each masterRooms as room, index}
					<tr class="border-b border-gt-color-dark-3-transparent">
						<td in:fade={{ duration: 200 }} class="p-3 font-light text-sm text-gt-color-gray"
							>{index + ((currentPage - 1) * entriesShown + 1)}.</td
						>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-gt-color-gray text-nowrap">{room.name}</td
						>
						<td
							in:fade={{ duration: 200 }}
							class="p-3 font-light text-sm text-gt-color-gray text-nowrap"
						>
							<a
								href={'/master-room/detail/' + room.id}
								class="p-1.5 mx-1 rounded text-xs bg-gt-color-primary hover:bg-gt-color-primary-hover ease-in-out duration-150"
								>Detail</a
							>
							<a
								href={'/master-room/edit/' + room.id}
								class="p-1.5 mx-1 rounded text-xs bg-blue-500 hover:bg-blue-600 ease-in-out duration-150"
								>Edit</a
							>
							<a
								href={'/master-room/delete/' + room.id}
								class="p-1.5 mx-1 rounded text-xs bg-red-500 hover:bg-red-600 ease-in-out duration-150"
								>Delete</a
							>
						</td>
					</tr>
				{/each}
			{:else}
				<tr class="border-b border-gt-color-dark-3-transparent">
					<td
						in:fade={{ duration: 200 }}
						colspan="3"
						class="p-3.5 font-light text-sm text-gt-color-gray text-center">Data tidak ditemukan</td
					>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
