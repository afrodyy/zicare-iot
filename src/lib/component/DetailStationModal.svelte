<script>
	import { fade } from 'svelte/transition';

	export let selectedAirStation;
	export let demographyModal;
	export let totalPopulationChecked;
	export let areaSizeChecked;
	export let populationDensityChecked;
	export let demography;
	export let handleTotalPopulationToggle = () => {};

	function formatDateDmyHis(date) {
		return new Date(date)
			.toLocaleString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
				// timeZone: 'UTC'
			})
			.replace(',', '')
			.replace(/\//g, '-');
	}
</script>

<div transition:fade={{ duration: 200 }} class="fixed flex flex-end mt-16 z-10">
	<div
		class="justify-end w-56 ml-7 mt-7 shadow-sm shadow-black border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div class="bg-gt-color-dark border-b border-gt-color-dark-3-transparent h-50 rounded-t-lg p-3">
			<div class="flex flex-col gap-3">
				<div class="flex gap-3 items-center">
					<img src="/images/air-station.png" alt="" />
					<span class="font-semibold text-base text-gt-color-gray">
						{selectedAirStation.nama}
						<!-- {selectedAirStation.name} -->
					</span>
				</div>

				<div class="flex flex-row gap-2 items-center">
					<svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-6">
						<path
							d="M14.7275 0.272563C14.4639 0.00895862 14.0365 0.00895867 13.7729 0.272563C13.5093 0.536166 13.5093 0.963553 13.7729 1.22716C16.4089 3.8632 16.4089 8.13706 13.7729 10.7731C13.5093 11.0367 13.5093 11.4641 13.7729 11.7277C14.0365 11.9913 14.4639 11.9913 14.7275 11.7277C17.8907 8.56445 17.8907 3.43581 14.7275 0.272563Z"
							fill="#E5E7EB"
						/>
						<path
							d="M4.22693 1.22716C4.49054 0.963553 4.49054 0.536166 4.22693 0.272563C3.96333 0.00895867 3.53594 0.00895862 3.27234 0.272563C0.109091 3.43581 0.109091 8.56445 3.27234 11.7277C3.53594 11.9913 3.96333 11.9913 4.22693 11.7277C4.49054 11.4641 4.49054 11.0367 4.22693 10.7731C1.59089 8.13706 1.59089 3.8632 4.22693 1.22716Z"
							fill="#E5E7EB"
						/>
						<path
							d="M11.2273 2.81815C11.4909 2.55455 11.9183 2.55455 12.1819 2.81815C13.9392 4.57551 13.9392 7.42475 12.1819 9.18211C11.9183 9.44572 11.4909 9.44572 11.2273 9.18211C10.9637 8.91851 10.9637 8.49112 11.2273 8.22752C12.4574 6.99737 12.4574 5.0029 11.2273 3.77275C10.9637 3.50914 10.9637 3.08176 11.2273 2.81815Z"
							fill="#E5E7EB"
						/>
						<path
							d="M6.77252 2.81815C7.03612 3.08176 7.03612 3.50914 6.77252 3.77275C5.54236 5.0029 5.54236 6.99737 6.77252 8.22752C7.03612 8.49112 7.03612 8.91851 6.77252 9.18211C6.50891 9.44572 6.08153 9.44572 5.81792 9.18211C4.06056 7.42475 4.06056 4.57551 5.81792 2.81815C6.08153 2.55455 6.50891 2.55455 6.77252 2.81815Z"
							fill="#E5E7EB"
						/>
						<path
							d="M9.8999 6.00011C9.8999 6.49717 9.49696 6.90011 8.9999 6.90011C8.50285 6.90011 8.0999 6.49717 8.0999 6.00011C8.0999 5.50306 8.50285 5.10011 8.9999 5.10011C9.49696 5.10011 9.8999 5.50306 9.8999 6.00011Z"
							fill="#E5E7EB"
						/>
					</svg>

					<span class="font-normal text-sm text-gt-color-gray uppercase">
						<!-- REFERENCE STATION -->
						{selectedAirStation.tipe_station}
					</span>
				</div>
			</div>
		</div>
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex flex-col gap-3 p-3 bg-gt-color-dark bg-opacity-80 backdrop-blur-[6px] {demographyModal
				? 'max-h-[34.5rem]'
				: 'max-h-[25rem]'} rounded-b-lg overflow-y-auto relative scrollbar ease-in-out duration-150"
		>
			<!-- Station Identity -->
			<div class="flex flex-row justify-between items-top">
				<div class="flex flex-col gap-2">
					<span class="text-sm font-semibold text-gt-color-gray">ID STASIUN</span>
					<span class="text-sm font-normal text-gt-color-gray"
						>{selectedAirStation.ispu_data.id_stasiun}</span
					>
					<!-- <span class="text-sm font-normal text-gt-color-gray">{selectedAirStation.id}</span> -->
				</div>

				<!-- {#if selectedAirStation.is_online} -->
				<span
					class="py-0.5 px-2 h-fit rounded-full {selectedAirStation.status === 'online'
						? 'bg-[#60B527]'
						: 'bg-[#E10E0E]'} text-sm text-[#ECFBD3] capitalize">{selectedAirStation.status}</span
				>
				<!-- {:else}
					<span class="py-0.5 px-2 h-fit rounded-full bg-[#E10E0E] text-sm text-[#ECFBD3]"
						>Offline</span
					>
				{/if} -->
			</div>

			<div class="flex flex-row justify-between">
				<span class="font-medium text-xs text-nowrap italic text-gt-color-gray">Last Update</span>
				<span class="ml-1 font-normal text-right text-xs text-gt-color-gray text-wrap"
					>{selectedAirStation?.last_update
						? formatDateDmyHis(selectedAirStation?.last_update)
						: 'Not Updated'}</span
				>
			</div>
			<!-- End of Station Identity -->

			<hr class="border-gt-color-dark-3-transparent" />

			<!-- Health Impact -->
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-2 items-center">
					{#if selectedAirStation.aqi.category === 'baik'}
						<span class="h-5 w-5 bg-[#22AD5C] rounded-full"></span>
					{:else if selectedAirStation.aqi.category === 'sedang'}
						<span class="h-5 w-5 bg-[#01A9DB] rounded-full"></span>
					{:else if selectedAirStation.aqi.category === 'tidak_sehat'}
						<span class="h-5 w-5 bg-[#FBBF24] rounded-full"></span>
					{:else if selectedAirStation.aqi.category === 'sangat_tidak_sehat'}
						<span class="h-5 w-5 bg-[#F23030] rounded-full"></span>
					{:else if selectedAirStation.aqi.category === 'berbahaya'}
						<span class="h-5 w-5 bg-[#0C0C0D] rounded-full"></span>
					{/if}
					<span class="font-normal text-sm text-gt-color-gray capitalize"
						>{selectedAirStation.aqi.category.replace(/_/g, ' ')}</span
					>
				</div>

				<div class="flex flex-col gap-1 p-2 rounded-md border border-gt-color-dark-3-transparent">
					<span class="text-xs font-medium text-gt-color-gray">Dampak Kesehatan</span>

					<ul class="flex flex-col gap-0.5 list-disc pl-4">
						<li class="font-normal text-xs text-gt-color-gray">
							{selectedAirStation.aqi.health_impact}
						</li>
					</ul>
				</div>
			</div>
			<!-- End of Health Impact -->

			<hr class="border-gt-color-dark-3-transparent" />

			<!-- Recommendation -->
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-2 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gt-color-gray"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
						/>
					</svg>

					<span class="font-normal text-sm text-gt-color-gray">Yang Harus Dilakukan</span>
				</div>

				<div class="flex flex-col gap-1 p-2 rounded-md border border-gt-color-dark-3-transparent">
					<span class="text-xs font-medium text-gt-color-gray"
						>{selectedAirStation.aqi.recommendation}</span
					>
				</div>
			</div>
			<!-- End of Recommendation -->

			<hr class="border-gt-color-dark-3-transparent" />

			<!-- Warning System -->
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-2 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gt-color-gray"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
						/>
					</svg>

					<span class="font-normal text-sm text-gt-color-gray">Warning System</span>
				</div>

				<div class="flex flex-col gap-1 p-2 rounded-md border border-gt-color-dark-3-transparent">
					<span class="text-xs font-medium text-gt-color-gray"
						>{selectedAirStation?.warning_system || 'Tidak ada peringatan.'}</span
					>
				</div>
			</div>
			<!-- End of Warning System -->

			<!-- Demography -->
			{#if demographyModal}
				<div in:fade={{ duration: 150 }} class="flex flex-col gap-2">
					<div class="flex flex-row gap-2 items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="ml-1"
						>
							<path
								d="M15 14.9997C15.4167 14.9997 15.771 14.854 16.063 14.5627C16.355 14.2713 16.5007 13.917 16.5 13.4997C16.5 13.083 16.3543 12.729 16.063 12.4377C15.7717 12.1463 15.4173 12.0003 15 11.9997C14.5833 11.9997 14.2293 12.1457 13.938 12.4377C13.6467 12.7297 13.5007 13.0837 13.5 13.4997C13.5 13.9163 13.646 14.2707 13.938 14.5627C14.23 14.8547 14.584 15.0003 15 14.9997ZM15 17.9997C15.5 17.9997 15.9667 17.883 16.4 17.6497C16.8333 17.4163 17.1917 17.0913 17.475 16.6747C17.0917 16.4413 16.6917 16.2703 16.275 16.1617C15.8583 16.053 15.4333 15.999 15 15.9997C14.5667 15.9997 14.1417 16.0537 13.725 16.1617C13.3083 16.2697 12.9083 16.4407 12.525 16.6747C12.8083 17.0913 13.1667 17.4163 13.6 17.6497C14.0333 17.883 14.5 17.9997 15 17.9997ZM2 17.9997C1.45 17.9997 0.979333 17.804 0.588 17.4127C0.196667 17.0213 0.000666667 16.5503 0 15.9997V1.99968C0 1.44968 0.196 0.979009 0.588 0.587676C0.98 0.196342 1.45067 0.000342417 2 -0.000324249H16C16.55 -0.000324249 17.021 0.195676 17.413 0.587676C17.805 0.979676 18.0007 1.45034 18 1.99968V8.69968C17.6833 8.54968 17.3583 8.42068 17.025 8.31268C16.6917 8.20468 16.35 8.12534 16 8.07468V1.99968H2V15.9997H8.05C8.1 16.3663 8.17933 16.7163 8.288 17.0497C8.39667 17.383 8.52567 17.6997 8.675 17.9997H2ZM2 14.9997V15.9997V1.99968V8.07468V7.99968V14.9997ZM4 13.9997H8.075C8.125 13.6497 8.20433 13.308 8.313 12.9747C8.42167 12.6413 8.54233 12.3163 8.675 11.9997H4V13.9997ZM4 9.99968H10.1C10.6333 9.49968 11.2293 9.08301 11.888 8.74968C12.5467 8.41634 13.2507 8.19134 14 8.07468V7.99968H4V9.99968ZM4 5.99968H14V3.99968H4V5.99968ZM15 19.9997C13.6167 19.9997 12.4377 19.5123 11.463 18.5377C10.4883 17.563 10.0007 16.3837 10 14.9997C10 13.6163 10.4877 12.4373 11.463 11.4627C12.4383 10.488 13.6173 10.0003 15 9.99968C16.3833 9.99968 17.5627 10.4873 18.538 11.4627C19.5133 12.438 20.0007 13.617 20 14.9997C20 16.383 19.5123 17.5623 18.537 18.5377C17.5617 19.513 16.3827 20.0003 15 19.9997Z"
								fill="#F9FAFB"
							/>
						</svg>

						<span class="font-normal text-sm text-gt-color-gray">Demografi</span>
					</div>

					<!-- Toggle -->
					<div
						class="flex flex-col w-full gap-2 p-2 rounded-md border border-gt-color-dark-3-transparent"
					>
						<div class="flex flex-col gap-1 text-white">
							<div class="flex flex-row justify-between">
								<span class="font-light text-xs text-gt-color-gray">Min</span>
								<span class="font-light text-xs text-gt-color-gray">Max</span>
							</div>

							<img src="/images/color-palette.svg" alt="Color Palette" />
						</div>

						<div class="flex flex-col w-full gap-3">
							<!-- Total Population -->
							<div class="flex flex-col gap-2 rounded">
								<div class="flex flex-row w-full gap-2 items-center justify-between">
									<span class="font-normal text-sm text-gt-color-gray text-nowrap"
										>Jumlah Penduduk</span
									>

									<input
										class="h-3.5 w-8 mr-0.5 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-[#3758F9] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-[#3758F9] checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-[#3758F9] checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-[#3758F9] dark:checked:after:bg-white"
										type="checkbox"
										role="switch"
										id="flexSwitchCheckDefault"
										on:click={handleTotalPopulationToggle(totalPopulationChecked)}
										bind:checked={totalPopulationChecked}
									/>
								</div>

								<div class="flex flex-row justify-between items-center">
									<span class="font-normal text-sm text-gt-color-gray">
										{#if demography !== undefined && demography.population && !isNaN(demography.population)}
											{Number(demography.population).toLocaleString('id-ID')}
										{:else}
											Data tidak tersedia
										{/if}
									</span>

									<span class="font-light text-xs text-gt-color-gray text-wrap mr-1">Jiwa</span>
								</div>
							</div>
							<!-- End of Total Population -->

							<hr class="border-gt-color-dark-3-transparent" />

							<!-- Area Size -->
							<div class="flex flex-col gap-2 rounded">
								<div class="flex flex-row w-full gap-2 items-center justify-between">
									<span class="font-normal text-sm text-gt-color-gray text-nowrap"
										>Luas Wilayah</span
									>

									<input
										class="h-3.5 w-8 mr-0.5 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-[#3758F9] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-[#3758F9] checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-[#3758F9] checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-[#3758F9] dark:checked:after:bg-white"
										type="checkbox"
										role="switch"
										id="flexSwitchCheckDefault"
										bind:checked={areaSizeChecked}
									/>
								</div>

								<div class="flex flex-row justify-between items-center">
									<span class="font-normal text-sm text-gt-color-gray">
										{#if demography !== undefined && demography.area && !isNaN(demography.area)}
											{Number(demography.area).toLocaleString('id-ID')}
										{:else}
											Data tidak tersedia
										{/if}
									</span>
									<span class="font-light text-xs text-gt-color-gray text-wrap mr-1"
										>km<sup>2</sup></span
									>
								</div>
							</div>
							<!-- End of Area Size -->

							<hr class="border-gt-color-dark-3-transparent" />

							<!-- Population Density -->
							<div class="flex flex-col gap-2 rounded">
								<div class="flex flex-row w-full gap-2 items-center justify-between">
									<span class="font-normal text-sm text-gt-color-gray text-wrap"
										>Kepadatan Penduduk</span
									>

									<input
										class="h-3.5 w-8 mr-0.5 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-[#3758F9] checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-[#3758F9] checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-[#3758F9] checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-[#3758F9] dark:checked:after:bg-white"
										type="checkbox"
										role="switch"
										id="flexSwitchCheckDefault"
										bind:checked={populationDensityChecked}
									/>
								</div>

								<div class="flex flex-row justify-between items-center">
									<span class="font-normal text-sm text-gt-color-gray text-wrap mr-1">
										{#if demography !== undefined && demography.density && !isNaN(demography.density)}
											{Number(demography.density).toLocaleString('id-ID')}
										{:else}
											Data tidak tersedia
										{/if}
									</span>
									<span class="font-light text-xs text-gt-color-gray">Jiwa/km<sup>2</sup></span>
								</div>
							</div>
							<!-- End of Population Density -->
						</div>
					</div>
					<!-- End of Toggle -->
				</div>
			{/if}
			<!-- Demography -->
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
