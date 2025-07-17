<script>
	import { fade, fly } from 'svelte/transition';
	import { ispuRankAsc } from '$lib/index';

	export let modalIspuRank = () => {};
	export let openSelectParamIspu;
	export let getArrayBy = () => {};
	export let selectValueParamIspus;
	export let selectedValueParamIspu;
	export let selectOpenParams;
	export let actSelectParamIspu = () => {};
	export let openSelectJenisStasiun;
	export let stationTypes;
	export let selectedStationType;
	export let selectOpenJenisStasiun;
	export let actSelectJenisStasiun = () => {};
	export let ispuRankAll;

	$: searchQuery = '';
	$: filteredStations = ispuRankAll;

	function handleSearch() {
		if (searchQuery) {
			filteredStations = ispuRankAll.filter((station) =>
				station.id_stasiun.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			filteredStations = ispuRankAll;
		}
	}

	function handleSort() {
		searchQuery = '';
		$ispuRankAsc = !$ispuRankAsc;
		ispuRankAll = ispuRankAll.reverse();
	}
</script>

<div transition:fade={{ duration: 150 }} class="fixed flex flex-end mt-16 z-10">
	<div
		class="ml-7 mt-7 justify-end w-[56rem] rounded-lg overflow-hidden shadow-lg border border-gt-color-dark-3-transparent"
	>
		<!-- Card Header -->
		<div
			class="bg-gt-color-dark border-b border-gt-color-dark-3 border-opacity-80 h-14 p-4 text-sm text-gt-color-gray font-bold items-center flex justify-between"
		>
			ISPU Rank by Parameter
			<button on:click={() => modalIspuRank(false)} class="cursor-pointer">
				<svg
					class="size-5 rotate-180"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M5.07601 16.4513C4.71771 16.7958 4.70654 17.3655 5.05106 17.7238C5.39557 18.0821 5.96531 18.0933 6.3236 17.7488L11.7236 12.6487C11.9001 12.4791 11.9998 12.2448 11.9998 12C11.9998 11.7552 11.9001 11.5209 11.7236 11.3513L6.3236 6.25125C5.96531 5.90674 5.39557 5.91791 5.05106 6.2762C4.70654 6.6345 4.71771 7.20424 5.07601 7.54875L9.80131 12L5.07601 16.4513Z"
						fill="#E5E7EB"
					/>
					<path
						d="M12.276 16.4513C11.9177 16.7958 11.9065 17.3655 12.2511 17.7238C12.5956 18.0821 13.1653 18.0933 13.5236 17.7488L18.9236 12.6487C19.1001 12.4791 19.1998 12.2448 19.1998 12C19.1998 11.7552 19.1001 11.5209 18.9236 11.3513L13.5236 6.25125C13.1653 5.90674 12.5956 5.91791 12.2511 6.2762C11.9065 6.6345 11.9177 7.20424 12.276 7.54875L17.0013 12L12.276 16.4513Z"
						fill="#E5E7EB"
					/>
				</svg>
			</button>
		</div>
		<!-- End of Card Header -->

		<!-- Card Body -->
		<div class="columns-2 flex h-[24rem]">
			<!-- Filter Bar -->
			<div
				class="inline-flex flex-col w-60 p-2 gap-2 bg-gt-color-dark backdrop-blur-0.5 justify-start items-start"
			>
				<!-- Parameter -->
				<div
					class="self-stretch flex-col justify-start items-start gap-3 flex border rounded-md p-3 border-gt-color-dark-3-transparent"
				>
					<div class="self-stretch justify-start items-center gap-3 inline-flex">
						<div class="flex flex-1 basis-0 h-6 pr-8 justify-start items-center">
							<div class="font-normal text-sm text-gt-color-gray">PARAMETER</div>
						</div>
					</div>

					<div class="relative inline-block text-left mt-1 w-full">
						<button
							on:click={openSelectParamIspu}
							type="button"
							class="whitespace-nowrap inline-flex w-full justify-between gap-x-1.5 rounded-md bg-gt-color-dark px-3 py-2 text-sm font-semibold text-[#F9FAFB] shadow-sm ring-1 ring-inset ring-gt-color-dark-3-transparent uppercase"
							id="menu-button"
							aria-expanded="true"
							aria-haspopup="true"
						>
							{getArrayBy(selectValueParamIspus, 'value', selectedValueParamIspu).label}
							<svg
								class=" ml-12 {selectOpenParams ? 'rotate-180' : ''} h-5 w-5 text-gray-400"
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

						<!-- Select Parameter Expanded -->
						{#if selectOpenParams}
							<div
								transition:fly={{ y: 20, duration: 150 }}
								class="absolute w-full left-0 right-0 z-50 mt-0 origin-top-right rounded-md bg-gt-color-dark shadow-lg ring-1 ring-gt-color-dark-3-transparent ring-opacity-5 focus:outline-none overflow-y-auto scrollbar max-h-40"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="menu-button"
								tabindex="-1"
							>
								<div class="divide-y divide-gt-color-dark-3-transparent" role="none">
									{#each selectValueParamIspus as parameter, index}
										<!-- svelte-ignore a11y-invalid-attribute -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<a
											on:click={() => (
												actSelectParamIspu(parameter.value),
												// addRankToStation(),
												($ispuRankAsc = false)
											)}
											class="block {selectedValueParamIspu == parameter.value
												? 'bg-[#3250e4] hover:bg-[#3758F9]'
												: 'hover:bg-slate-800'} px-4 py-2 text-sm text-[#F9FAFB] cursor-pointer"
											role="menuitem"
											tabindex="-1"
											id="menu-item-{index + 1}">{parameter.label}</a
										>
									{/each}
								</div>
							</div>
						{/if}
						<!-- End of Select Parameter Expanded -->
					</div>
				</div>
				<!-- End of Parameter -->

				<hr class="w-full border-gt-color-dark-3-transparent" />

				<!-- Jenis Stasiun -->
				<div
					class="self-stretch flex-col gap-3 justify-start items-start flex border rounded-md p-3 border-gt-color-dark-3-transparent"
				>
					<div class="self-stretch justify-start items-center gap-3 inline-flex">
						<div class="flex flex-1 basis-0 h-6 pr-8 justify-start items-center">
							<div class="text-gt-color-gray text-sm font-normal leading-normal">JENIS STASIUN</div>
						</div>
					</div>
					<div class="relative inline-block text-left mt-1 w-full">
						<div>
							<button
								on:click={openSelectJenisStasiun}
								type="button"
								class="inline-flex w-full gap-x-1.5 px-3 py-2 whitespace-nowrap rounded-md bg-gt-color-dark font-semibold text-sm text-gt-color-gray shadow-sm justify-between ring-1 ring-inset ring-gt-color-dark-3-transparent"
								id="menu-button"
								aria-expanded="true"
								aria-haspopup="true"
							>
								{getArrayBy(stationTypes, 'value', selectedStationType).label}

								<svg
									class="  ml-12 {selectOpenJenisStasiun ? 'rotate-180' : ''} h-5 w-5 text-gray-400"
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

						<!-- Expanded Select Jenis Stasiun -->
						{#if selectOpenJenisStasiun}
							<div
								transition:fly={{ y: 20, duration: 150 }}
								class="absolute max-h-36 left-0 right-0 z-10 origin-top-right rounded-md bg-gt-color-dark shadow-lg ring-1 ring-gt-color-dark-3-transparent ring-opacity-5 focus:outline-none overflow-y-scroll scrollbar"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="menu-button"
								tabindex="-1"
							>
								<div class="divide-y divide-gt-color-dark-3-transparent" role="none">
									{#each stationTypes as stationType}
										<!-- svelte-ignore a11y-invalid-attribute -->
										<a
											href="#"
											on:click={() => actSelectJenisStasiun(stationType.value)}
											class="block {selectedStationType == stationType.value
												? 'bg-[#3250e4] hover:bg-[#3758F9]'
												: 'bg-gt-color-dark hover:bg-slate-800'} px-4 py-2 text-sm text-gt-color-gray ease-in-out duration-150"
											role="menuitem"
											tabindex="-1"
											id="menu-item-0">{stationType.label}</a
										>
									{/each}
								</div>
							</div>
						{/if}
						<!-- End of Expanded Select Jenis Stasiun -->
					</div>
				</div>
				<!-- End of Jenis Stasiun -->
			</div>
			<!-- End of Filter Bar -->

			<!-- Main Expanded ISPU Rank Card Content -->
			<div
				class="w-full flex-col gap-3 p-3 inline-flex bg-gt-color-dark backdrop-blur-[6px] bg-opacity-80"
			>
				<div class="self-stretch justify-end items-center gap-3 inline-flex rounded-md mb-3">
					<!-- Search Bar -->
					<div
						class="flex grow shrink gap-3 basis-0 h-[38px] p-[8px] rounded-md shadow bg-gt-color-dark border border-gt-color-dark-3-transparent backdrop-blur-[6px] justify-start items-start focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-300 focus-within:shadow-md focus-within:shadow-indigo-300/25 ease-in-out duration-150"
					>
						<div class="justify-start items-center flex w-full">
							<div class="w-5 h-5 relative mr-[8px] cursor-pointer">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g id="heroicons-mini/magnifying-glass">
										<path
											id="Vector (Stroke)"
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M9 3.5C5.96243 3.5 3.5 5.96243 3.5 9C3.5 12.0376 5.96243 14.5 9 14.5C10.519 14.5 11.893 13.8852 12.8891 12.8891C13.8852 11.893 14.5 10.519 14.5 9C14.5 5.96243 12.0376 3.5 9 3.5ZM2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 10.6625 15.4197 12.1906 14.4517 13.3911L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L13.3911 14.4517C12.1906 15.4197 10.6625 16 9 16C5.13401 16 2 12.866 2 9Z"
											fill="#E5E7EB"
										/>
									</g>
								</svg>
							</div>

							<div class="w-px h-5 bg-gt-color-dark-3-transparent"></div>

							<input
								bind:value={searchQuery}
								on:input={handleSearch}
								class="w-full bg-transparent ml-2 text-[#FEFEFE] placeholder:text-[#6B7280] text-sm font-normal focus:outline-none leading-snug"
								placeholder="Cari peringkat berdasarkan stasiun"
							/>
						</div>
					</div>
					<!-- End of Search Bar -->

					<!-- Sort Button -->
					<button
						on:click={() => handleSort($ispuRankAsc)}
						type="button"
						class="flex gap-2 min-w-28 p-2 rounded-md bg-gt-color-dark hover:bg-slate-800 border border-gt-color-dark-3-transparent justify-between items-center focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/25 cursor-pointer ease-in-out duration-150"
					>
						<div class="text-center text-[#F9FAFB] text-sm font-normal">
							{!$ispuRankAsc ? 'Terburuk' : 'Terbaik'}
						</div>

						<div class="w-5 h-5 relative text-[#F9FAFB]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
								/>
							</svg>
						</div>
					</button>
					<!-- End of Sort Button -->
				</div>

				<!-- Table -->
				<div class="relative h-[300px] overflow-y-scroll scrollbar">
					<table class="w-full text-sm text-left rtl:text-right = dark:text-gray-400">
						<thead
							class="text-[#F9FAFB] rounded bg-gt-color-dark font-medium leading-relaxed sticky top-0 z-10"
						>
							<tr>
								<th scope="col" class="py-3 pl-3 rounded-l-md">NO</th>
								<th scope="col" class="py-3">Parameter</th>
								<th scope="col" class="py-3 flex justify-left items-center">
									<div class=" mr-2">
										<svg
											width="18"
											height="18"
											viewBox="0 0 18 18"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M14.7276 3.27265C14.464 3.00905 14.0366 3.00905 13.773 3.27265C13.5094 3.53626 13.5094 3.96364 13.773 4.22725C16.409 6.86329 16.409 11.1372 13.773 13.7732C13.5094 14.0368 13.5094 14.4642 13.773 14.7278C14.0366 14.9914 14.464 14.9914 14.7276 14.7278C17.8908 11.5645 17.8908 6.4359 14.7276 3.27265Z"
												fill="#E5E7EB"
											/>
											<path
												d="M4.22705 4.22725C4.49066 3.96364 4.49066 3.53626 4.22705 3.27265C3.96345 3.00905 3.53606 3.00905 3.27246 3.27265C0.109213 6.4359 0.109213 11.5645 3.27246 14.7278C3.53606 14.9914 3.96345 14.9914 4.22705 14.7278C4.49066 14.4642 4.49066 14.0368 4.22705 13.7732C1.59101 11.1372 1.59101 6.86329 4.22705 4.22725Z"
												fill="#E5E7EB"
											/>
											<path
												d="M11.2274 5.81824C11.491 5.55464 11.9184 5.55464 12.182 5.81824C13.9394 7.5756 13.9394 10.4248 12.182 12.1822C11.9184 12.4458 11.491 12.4458 11.2274 12.1822C10.9638 11.9186 10.9638 11.4912 11.2274 11.2276C12.4576 9.99746 12.4576 8.00299 11.2274 6.77284C10.9638 6.50923 10.9638 6.08185 11.2274 5.81824Z"
												fill="#E5E7EB"
											/>
											<path
												d="M6.77264 5.81824C7.03624 6.08185 7.03624 6.50923 6.77264 6.77284C5.54249 8.00299 5.54249 9.99746 6.77264 11.2276C7.03624 11.4912 7.03624 11.9186 6.77264 12.1822C6.50903 12.4458 6.08165 12.4458 5.81804 12.1822C4.06068 10.4248 4.06068 7.5756 5.81804 5.81824C6.08165 5.55464 6.50903 5.55464 6.77264 5.81824Z"
												fill="#E5E7EB"
											/>
											<path
												d="M9.90002 9.0002C9.90002 9.49726 9.49708 9.9002 9.00002 9.9002C8.50297 9.9002 8.10002 9.49726 8.10002 9.0002C8.10002 8.50315 8.50297 8.1002 9.00002 8.1002C9.49708 8.1002 9.90002 8.50315 9.90002 9.0002Z"
												fill="#E5E7EB"
											/>
										</svg>
									</div>
									Stasiun
								</th>
								<th scope="col" class="py-3">Jenis Stasiun</th>
								<th scope="col" class="py-3 rounded-r-md">Nilai ISPU</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredStations as ispuRank, index}
								{#if selectedStationType === ispuRank.tipe_stasiun || selectedStationType === 'all'}
									<tr
										in:fade={{ duration: 200 }}
										class={filteredStations.length - 1 > index
											? 'border-b border-gt-color-dark-3-transparent text-[#F9FAFB] text-md font-medium leading-relaxed'
											: ''}
									>
										<td class="px-3 py-4 text-left font-medium whitespace-nowrap dark:text-white">
											{index + 1}
										</td>
										<td class="text-left font-medium text-md text-[#F9FAFB] uppercase">
											{getArrayBy(selectValueParamIspus, 'value', selectedValueParamIspu).label}
										</td>
										<td class="text-left font-medium text-md text-[#F9FAFB]">
											{ispuRank.id_stasiun}
										</td>
										<td class="text-left">
											<div
												class="w-fit px-2.5 py-0.5 bg-gt-color-dark-3 bg-opacity-80 rounded-full"
											>
												<span class="font-normal text-xs text-[#F9FAFB] capitalize"
													>{ispuRank.tipe_stasiun}</span
												>
											</div>
										</td>
										<td class="text-left">
											{#if ispuRank.category === 'baik'}
												<div class="w-fit px-2.5 py-0.5 bg-[#22AD5C] rounded-full">
													<span class="font-normal text-sm text-[#F9FAFB]">
														{#if selectedValueParamIspu === 'pm10'}
															{ispuRank?.pm10 || 0}
														{:else if selectedValueParamIspu === 'pm25'}
															{ispuRank?.pm25 || 0}
														{:else if selectedValueParamIspu === 'so2'}
															{ispuRank?.so2 || 0}
														{:else if selectedValueParamIspu === 'co'}
															{ispuRank?.co || 0}
														{:else if selectedValueParamIspu === 'o3'}
															{ispuRank?.o3 || 0}
														{:else if selectedValueParamIspu === 'no2'}
															{ispuRank?.no2 || 0}
														{:else if selectedValueParamIspu === 'hc'}
															{ispuRank?.hc || 0}
														{/if}
													</span>
												</div>
											{:else if ispuRank.category === 'sedang'}
												<div class="w-fit px-2.5 py-0.5 bg-[#01A9DB] rounded-full">
													<span class="font-normal text-sm text-[#F9FAFB]">
														{#if selectedValueParamIspu === 'pm10'}
															{ispuRank?.pm10 || 0}
														{:else if selectedValueParamIspu === 'pm25'}
															{ispuRank?.pm25 || 0}
														{:else if selectedValueParamIspu === 'so2'}
															{ispuRank?.so2 || 0}
														{:else if selectedValueParamIspu === 'co'}
															{ispuRank?.co || 0}
														{:else if selectedValueParamIspu === 'o3'}
															{ispuRank?.o3 || 0}
														{:else if selectedValueParamIspu === 'no2'}
															{ispuRank?.no2 || 0}
														{:else if selectedValueParamIspu === 'hc'}
															{ispuRank?.hc || 0}
														{/if}
													</span>
												</div>
											{:else if ispuRank.category === 'tidak_sehat'}
												<div class="w-fit px-2.5 py-0.5 bg-[#FBBF24] rounded-full">
													<span class="font-normal text-sm text-[#F9FAFB]">
														{#if selectedValueParamIspu === 'pm10'}
															{ispuRank?.pm10 || 0}
														{:else if selectedValueParamIspu === 'pm25'}
															{ispuRank?.pm25 || 0}
														{:else if selectedValueParamIspu === 'so2'}
															{ispuRank?.so2 || 0}
														{:else if selectedValueParamIspu === 'co'}
															{ispuRank?.co || 0}
														{:else if selectedValueParamIspu === 'o3'}
															{ispuRank?.o3 || 0}
														{:else if selectedValueParamIspu === 'no2'}
															{ispuRank?.no2 || 0}
														{:else if selectedValueParamIspu === 'hc'}
															{ispuRank?.hc || 0}
														{/if}
													</span>
												</div>
											{:else if ispuRank.category === 'sangat_tidak_sehat'}
												<div class="w-fit px-2.5 py-0.5 bg-[#F23030] rounded-full">
													<span class="font-normal text-sm text-[#F9FAFB]">
														{#if selectedValueParamIspu === 'pm10'}
															{ispuRank?.pm10 || 0}
														{:else if selectedValueParamIspu === 'pm25'}
															{ispuRank?.pm25 || 0}
														{:else if selectedValueParamIspu === 'so2'}
															{ispuRank?.so2 || 0}
														{:else if selectedValueParamIspu === 'co'}
															{ispuRank?.co || 0}
														{:else if selectedValueParamIspu === 'o3'}
															{ispuRank?.o3 || 0}
														{:else if selectedValueParamIspu === 'no2'}
															{ispuRank?.no2 || 0}
														{:else if selectedValueParamIspu === 'hc'}
															{ispuRank?.hc || 0}
														{/if}
													</span>
												</div>
											{:else if ispuRank.category === 'berbahaya'}
												<div class="w-fit px-2.5 py-0.5 bg-[#0C0C0D] rounded-full">
													<span class="font-normal text-sm text-[#F9FAFB]">
														{#if selectedValueParamIspu === 'pm10'}
															{ispuRank?.pm10 || 0}
														{:else if selectedValueParamIspu === 'pm25'}
															{ispuRank?.pm25 || 0}
														{:else if selectedValueParamIspu === 'so2'}
															{ispuRank?.so2 || 0}
														{:else if selectedValueParamIspu === 'co'}
															{ispuRank?.co || 0}
														{:else if selectedValueParamIspu === 'o3'}
															{ispuRank?.o3 || 0}
														{:else if selectedValueParamIspu === 'no2'}
															{ispuRank?.no2 || 0}
														{:else if selectedValueParamIspu === 'hc'}
															{ispuRank?.hc || 0}
														{/if}
													</span>
												</div>
											{/if}
										</td>
									</tr>
								{/if}
							{:else}
								<tr in:fade={{ duration: 200 }}>
									<td
										class="py-0.5 text-center text-[#FEFEFE] justify-center items-center"
										colspan="5">Data tidak ditemukan</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<!-- End of Table -->
			</div>
			<!-- End of Main Expanded ISPU Rank Card Content -->
		</div>
		<!-- End of Card Body -->
	</div>
</div>
