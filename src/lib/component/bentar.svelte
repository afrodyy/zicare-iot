<div class="flex flex-col w-full gap-2">
	{#if expandedAccordion !== 'pm10'}
		<div
			on:click={() =>
				expandedAccordion === 'pm10' ? (expandedAccordion = '') : handleAccordion('pm10')}
			in:fly={{ y: -50, duration: 150 }}
			role="presentation"
			class="flex flex-row w-full gap-6 py-1 px-2 rounded justify-between hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
		>
			<!-- Kiri -->
			<div class="flex flex-row gap-4">
				<span class="w-12 font-normal text-base text-[#F9FAFB]">PM10</span>

				<div class="flex flex-col gap-1.5">
					<div class="flex flex-row gap-2 items-center">
						<div class="w-1 h-4 rounded-lg bg-gt-color-cyan"></div>
						<span class="text-base font-normal text-[#F9FAFB]">
							{selectedAirStation?.ispu_data?.pm10 || 0}
						</span>

						<span class="text-xs font-normal text-[#F9FAFB]">µg/Nm3</span>
					</div>

					{#if $showComparisonStation}
						<div class="flex flex-row gap-2 items-center">
							<div class="w-1 h-4 rounded-lg bg-[#AA52DD]"></div>
							<span class="text-base font-normal text-[#F9FAFB]">
								{selectedChildStation?.ispu_data?.pm10 || 0}
							</span>
							<span class="text-xs font-normal text-[#F9FAFB]">µg/Nm3</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Kanan -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5 text-[#E5E7EB]"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		</div>
	{/if}

	{#if expandedAccordion === 'pm10'}
		<div
			in:fly={{ y: 50, duration: 150 }}
			class="flex flex-col w-full gap-4 py-1 px-2 rounded justify-between items-center"
		>
			<!-- Atas -->
			<div class="flex flex-row w-full gap-4 items-center justify-between">
				<div
					on:click={() =>
						expandedAccordion === 'pm10' ? (expandedAccordion = '') : handleAccordion('pm10')}
					role="presentation"
					class="flex flex-row w-full px-2 rounded justify-between items-center hover:bg-slate-500 transition ease-in-out duration-150 cursor-pointer"
				>
					<span class="font-normal text-base text-[#F9FAFB]">PM10</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-[#E5E7EB]"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
					</svg>
				</div>

				<div class="p-1 rounded-md bg-[#111928] bg-opacity-80 border border-[#374151CC]">
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9.25 1.375L6.25 4.375L3.25 5.5L2.125 6.625L7.375 11.875L8.5 10.75L9.625 7.75L12.625 4.75M4.75 9.25L1.375 12.625M8.875 1L13 5.125"
							stroke="#F9FAFB"
							stroke-width="1"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>

			<!-- Bawah -->
			<div class="flex flex-col w-full gap-3 rounded-lg">
				<!-- Time Data -->
				<div class="flex flex-row w-full gap-1.5">
					<div
						class="flex flex-row gap-2 p-1 rounded-md border border-[#374151CC] bg-[#111928] bg-opacity-80 items-center"
					>
						<span class="font-normal text-xs text-[#F9FAFB]">Hari</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4 text-[#F9FAFB]"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					</div>

					<div
						class="flex flex-row gap-2 p-1 rounded-md border border-[#374151CC] bg-[#111928] bg-opacity-80 items-center"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4.0625 1.25V2.9375M11.9375 1.25V2.9375M1.25 13.0625V4.625C1.25 3.69302 2.00552 2.9375 2.9375 2.9375H13.0625C13.9945 2.9375 14.75 3.69302 14.75 4.625V13.0625M1.25 13.0625C1.25 13.9945 2.00552 14.75 2.9375 14.75H13.0625C13.9945 14.75 14.75 13.9945 14.75 13.0625M1.25 13.0625V7.4375C1.25 6.50552 2.00552 5.75 2.9375 5.75H13.0625C13.9945 5.75 14.75 6.50552 14.75 7.4375V13.0625"
								stroke="#E5E7EB"
								stroke-width="1.125"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span class="font-normal text-xs text-[#F9FAFB] text-nowrap">22 feb 24 - 22 feb 24</span
						>
					</div>

					<div
						class="flex flex-row gap-2 p-1 rounded-md border border-[#374151CC] bg-[#111928] bg-opacity-80 items-center"
					>
						<span class="font-normal text-xs text-[#F9FAFB] text-nowrap">Unduh Data</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4 text-[#F9FAFB]"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<!-- Contour Map -->
			<!-- <div class="flex flex-row gap-2 items-center pl-3">
                <div class="w-1.5 h-1.5 rounded-full bg-[#F9FAFB]"></div>
                <span class="font-medium text-sm text-[#F9FAFB]">Contour</span>
            </div> -->

			<!-- Map -->
			<!-- <img src="/images/contour-map.svg" alt="Contour Map" /> -->
			<!-- End of Contour Map -->

			<!-- Heat Map -->
			<!-- <div class="flex flex-row gap-2 items-center pl-3">
                <div class="w-1.5 h-1.5 rounded-full bg-[#F9FAFB]"></div>
                <span class="font-medium text-sm text-[#F9FAFB]">Heatmap</span>
            </div> -->

			<!-- Map -->
			<!-- <img src="/images/heat-map.svg" alt="Heat Map" /> -->
			<!-- End of Heat Map -->

			<!-- Chart -->
			<div class="flex flex-row gap-2 items-center pl-3">
				<div class="w-1.5 h-1.5 rounded-full bg-[#F9FAFB]"></div>
				<span class="font-medium text-sm text-[#F9FAFB]">Chart</span>
			</div>

			<!-- PM10 Chart -->
			<div in:fade={{ y: 50, duration: 150 }} class="flex flex-col gap-3">
				<div id="pm10Chart" class="w-full h-52 bg-[#374151] bg-opacity-20 rounded-md"></div>
			</div>
			<!-- End of PM10 Chart -->
		</div>
	{/if}
</div>
