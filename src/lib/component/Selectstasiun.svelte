<script>
	import { getArrayBy } from '$lib/utils/array';
	export let listPilihan = [];

	let pilihanTerbuka = false;
	let terPilih = {};
	let labelPilihan = 'Pilih';

	function bukaPilihan() {
		pilihanTerbuka = !pilihanTerbuka;
	}

	function memilih(value) {
		terPilih = getArrayBy(listPilihan, 'value', value);
		bukaPilihan();
	}
</script>

<div class="bg-[#111928] rounded-md w-50 m-2 p-2 opacity-80">
	<!-- <label for="viweMap" class="text-white ">Map View</label> -->
	<div class="relative inline-block text-left mt-1">
		<div>
			<button
				on:click={bukaPilihan}
				type="button"
				class="whitespace-nowrap inline-flex w-[15rem] justify-left items-center gap-x-1.5 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300"
				id="menu-button"
				aria-expanded="true"
				aria-haspopup="true"
			>
				<!-- {terPilih == 'bw' ? 'Batas Wilayah' : 'Satelit'} -->
				{labelPilihan}
				{#if !terPilih}
					{labelPilihan}
				{/if}
				{#if terPilih}
					{terPilih.label}
				{/if}

				{#if terPilih.label_singkat}
					<div class="text-white text-bold ml-2 mb-1 bg-gray-500 p-1 rounded-md">
						terPilih.label_singkat
					</div>
				{/if}
				<svg
					class=" {labelPilihan.length <= 5 ? 'ml-1' : 'ml-12'}  {pilihanTerbuka
						? 'rotate-180'
						: ''} h-5 w-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<div
			class="absolute {pilihanTerbuka
				? 'block'
				: 'hidden'} -top-[7.5rem] -left-[0.5rem] right-0 z-10 mt-2 w-[15rem] origin-top-right rounded-md bg-[#111928] shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="py-1 divide-y" role="none">
				{#each listPilihan as element}
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a
						href="#"
						on:click={() => memilih(element.value)}
						class="block {terPilih
							? 'bg-black'
							: ''} px-4 py-2 text-sm text-white justify-left items-center flex"
						role="menuitem"
						tabindex="-1"
						id="menu-item-0"
					>
						{element.label}
						{#if element.label_singkat}
							<div class="text-white text-bold ml-2 mb-1 bg-gray-500 p-1 rounded-md">
								{element.label_singkat}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
