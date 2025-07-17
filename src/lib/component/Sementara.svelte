<div
	class="flex flex-col gap-6 p-3 bg-[#111928] bg-opacity-80 backdrop-blur-[6px] divide-y divide-[#374151CC] overflow-y-scroll relative scrollbar max-h-[25rem]"
>
	<CollapsibleSection
		headerText={`<div class="inline-flex gap-3 rounded justify-start items-start">
										<div class="grow shrink basis-0 h-[58px] justify-start items-start gap-2 flex">
											<div class="w-[60px] text-gray-50 text-base font-medium">PM10</div>
											<div class="grow shrink basis-0 flex-col justify-end items-start gap-1.5 inline-flex">
												<div class="self-stretch justify-start items-center gap-2 inline-flex">
													<div class="w-1 h-4 bg-emerald-400 rounded-lg"></div>
													<div class="text-center text-gray-50 text-base font-medium">32</div>
													<div class="w-12 justify-start items-end gap-2.5 flex">
														<div class="w-12 text-gray-50 text-xs font-normal leading-tight">µg/Nm3</div>
													</div>
												</div>
												<div class="self-stretch justify-start items-center gap-2 ${!selectedAirStationKedua ? 'hidden' : ''} inline-flex">
													<div class="w-1 h-4 bg-purple-500 rounded-lg"></div>
													<div class="text-center text-gray-50 text-base font-medium">31</div>
													<div class="w-12 justify-start items-end gap-2.5 flex">
														<div class="w-12 text-gray-50 text-xs font-normal leading-tight">µg/Nm3</div>
													</div>
												</div>
											</div>
										</div>
									</div>`}
		headerTextClose={`<div class="px-3 py-1.5 rounded justify-start items-start gap-6 inline-flex">
											<div class="grow shrink basis-0 h-10 justify-start items-start gap-2 flex">
												<div class="w-[60px] text-gray-50 text-base font-medium">PM10</div>
											</div>
										</div>`}
	>
		<div class="p-2">
			<ul class="list-disc ml-5 text-white font-bold">
				<li>Chart</li>
			</ul>
		</div>

		<Chart></Chart>
		<div class="p-2">
			<ul class="list-disc ml-5 text-white font-bold">
				<li>Countour</li>
			</ul>
		</div>
		<!-- <MapsDemo></MapsDemo> -->
		<div class="p-2">
			<ul class="list-disc ml-5 text-white font-bold">
				<li>Heatmap</li>
			</ul>
		</div>
		<Heatmaps></Heatmaps>
	</CollapsibleSection>

	<CollapsibleSection
		headerText={`<div class=" px-3 py-1.5 rounded justify-start items-start gap-6 inline-flex">
											<div class="grow shrink basis-0 h-[58px] justify-start items-start gap-2 flex">
												<div class="w-[60px] text-gray-50 text-base font-medium">PM10</div>
												<div class="grow shrink basis-0 flex-col justify-end items-start gap-1.5 inline-flex">
													<div class="self-stretch justify-start items-center gap-2 inline-flex">
														<div class="w-1 h-4 bg-emerald-400 rounded-lg"></div>
														<div class="text-center text-gray-50 text-base font-medium">32</div>
														<div class="w-12 justify-start items-end gap-2.5 flex">
															<div class="w-12 text-gray-50 text-xs font-normal">µg/Nm3</div>
														</div>
													</div>
													<div class="self-stretch justify-start items-center gap-2 ${!selectedAirStationKedua ? 'hidden' : ''} inline-flex">
														<div class="w-1 h-4 bg-purple-500 rounded-lg"></div>
														<div class="text-center text-gray-50 text-base font-medium">31</div>
														<div class="w-12 justify-start items-end gap-2.5 flex">
															<div class="w-12 text-gray-50 text-xs font-normal">µg/Nm3</div>
														</div>
													</div>
												</div>
											</div>
											<div class="w-6 justify-center items-end gap-2.5 flex">
												<div class="w-6 h-6 relative"></div>
											</div>
										</div>`}
		headerTextClose={`<div class=" px-3 py-1.5 rounded justify-start items-start gap-6 inline-flex">
														<div class="grow shrink basis-0 h-10 justify-start items-start gap-2 flex">
															<div class="w-[60px] text-gray-50 text-base font-medium">PM10</div>
															
														</div>
														
													</div>`}
	>
		<div class="p-2">
			<ul class="list-disc ml-5 text-white font-bold">
				<li>Countour</li>
			</ul>
		</div>
		<div class="p-2">
			<ul class="list-disc ml-5 text-white font-bold">
				<li>Heatmap</li>
			</ul>
		</div>
	</CollapsibleSection>
</div>
