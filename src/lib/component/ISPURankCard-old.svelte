<script>
	import { fade } from 'svelte/transition';

	export let ModalIspuRank = () => {};
	export let ispuRankAll;
	export let svgloading;
</script>

<div transition:fade={{ duration: 150 }} class="fixed flex mt-16 flex-end z-10">
	<div
		class="w-80 ml-7 mt-7 rounded-lg border border-[#374151] border-opacity-80 shadow-sm shadow-black justify-end overflow-hidden"
	>
		<!-- Card Header -->
		<div
			class="bg-[#111928] border-b border-[#374151] border-opacity-80 h-14 p-4 text-sm text-[#E5E7EB] font-bold items-center flex justify-between"
		>
			ISPU Rank
			<button on:click={() => ModalIspuRank(true)} class="cursor-pointer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
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
		<div class="flex flex-col gap-2 p-2 bg-[#111928] bg-opacity-80 backdrop-blur-[2px]">
			{#each ispuRankAll as ispuRank, index}
				{#if index < 4}
					<div class="flex flex-row gap-5 py-1.5 px-2 items-center justify-between">
						<div class="flex grow shrink basis-0 h-5 justify-center items-center gap-2">
							<!-- Parameter -->
							<div class="w-10 font-medium text-xs text-[#F9FAFB] uppercase">
								{ispuRank.parameter}
							</div>
							<!-- End of Parameter -->

							<!-- Station Column -->
							<div class="grow shrink basis-0 flex-col justify-end items-start gap-1.5 inline-flex">
								<div class="inline-flex self-stretch justify-between items-center gap-3">
									<!-- Station Name -->
									<div class="flex flex-row gap-3 items-center">
										<div class="w-4 h-4 relative">
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

										<span class="font-medium text-xs text-[#F9FAFB] items-center">
											{ispuRank.nama === 'pak jeki' ? 'Ciracas - Jakarta Timur' : ispuRank.nama}
										</span>
									</div>
									<!-- End of Station Name -->

									<!-- Station Type Badge -->
									<div
										class="w-[18px] h-[18px] px-[7.50px] py-[2.25px] bg-gray-700/opacity-80 rounded-[3px] border border-[#4B5563] justify-center items-center gap-[0.75px] flex bg-[#374151CC]"
									>
										<span class="font-medium text-center text-[#F9FAFB] text-xs">
											{#if ispuRank.tipe_stasiun === 'lowcost'}
												LC
											{:else if ispuRank.tipe_stasiun === 'middle'}
												M
											{:else if ispuRank.tipe_stasiun === 'reference'}
												R
											{/if}
										</span>
									</div>
									<!-- End of Station Type Badge -->
								</div>
							</div>
							<!-- End of Station Column -->
						</div>

						<!-- Badge -->
						{#if ispuRank.category === 'baik'}
							<div class="flex bg-[#22AD5C] px-2 py-0.5 justify-center items-center rounded-full">
								<span class="font-medium text-sm text-center text-[#F9FAFB]">
									{ispuRank.ispu_value}
								</span>
							</div>
						{:else if ispuRank.category === 'sedang'}
							<div class="flex bg-[#01A9DB] px-2 py-0.5 justify-center items-center rounded-full">
								<span class="font-medium text-sm text-center text-[#F9FAFB]">
									{ispuRank.ispu_value}
								</span>
							</div>
						{:else if ispuRank.category === 'tidak_sehat'}
							<div class="flex bg-[#FBBF24] px-2 py-0.5 justify-center items-center rounded-full">
								<span class="font-medium text-sm text-center text-[#F9FAFB]">
									{ispuRank.ispu_value}
								</span>
							</div>
						{:else if ispuRank.category === 'sangat_tidak_sehat'}
							<div class="flex bg-[#F23030] px-2 py-0.5 justify-center items-center rounded-full">
								<span class="font-medium text-sm text-center text-[#F9FAFB]">
									{ispuRank.ispu_value}
								</span>
							</div>
						{:else if ispuRank.category === 'berbahaya'}
							<div class="flex bg-[#0C0C0D] px-2 py-0.5 justify-center items-center rounded-full">
								<span class="font-medium text-sm text-center text-[#F9FAFB]">
									{ispuRank.ispu_value}
								</span>
							</div>
						{/if}
						<!-- End of Badge -->
					</div>

					{#if index < 3}
						<hr class="border-[#374151] bg-opacity-80" />
					{/if}
				{/if}
			{:else}
				<div class="justify-center items-center flex">
					{@html svgloading}
				</div>
			{/each}
			<!-- </ul> -->
		</div>
		<!-- End of Card Body -->
	</div>
</div>
