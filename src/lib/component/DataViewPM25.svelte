<script>
	// export let showModeling = false;
	export let showGridLayer = () => {};
	export let showGrid = () => {};
	export let actViewDataUdaraPm25 = () => {};
	export let viewDataUdara = () => {};
	// export let handleModeling = () => {};
</script>

<div class="bottom-0 right-0 absolute">
	<div class="flex justify-end">
		<div
			class="bg-gt-color-dark-transparent border-gt-color-dark-3 bg-opacity-80 backdrop-blur-[3px] border mr-7 mb-7 w-70 p-2.5 items-center rounded-lg"
		>
			<span class="font-medium text-sm text-gt-color-gray mb-3">DATA VIEW</span>
			<div class="flex gap-3 mt-3">
				<button
					on:click={showGridLayer}
					title="Grid"
					class="cursor-pointer w-8 h-8 {showGrid
						? 'bg-gt-color-primary shadow shadow-gt-color-primary'
						: 'bg-gt-color-dark-2-transparent'}  rounded-md justify-center items-center flex flex-col"
				>
					<span class="">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="size-5">
							<g clip-path="url(#clip0_5178_14603)">
								<path
									stroke={showGrid ? '#F9FAFB' : '#6B7280'}
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M0 0V1.44H0.96V0.96H1.44V0H0.96H0ZM2.4 0V0.96H4.32V0H2.4ZM5.4 0C5.6568 5.5848 5.4 11.2896 5.4 16.92H0V18.6H5.4V24H7.08V18.6H24V16.92H7.08C6.8808 11.3114 7.17 5.49744 7.08 0H5.4ZM8.16 0V0.96H10.08V0H8.16ZM11.04 0V0.96H11.52V1.44H12.48V0.96H12.96V0H11.04ZM13.92 0V0.96H15.84V0H13.92ZM16.8 0V0.96H17.28V1.44H18.24V0.96H18.72V0H16.8ZM19.68 0V0.96H21.6V0H19.68ZM22.56 0V0.96H23.04V1.44H24V0H22.56ZM0 2.4V4.32H0.96V2.4H0ZM11.52 2.4V4.32H12.48V2.4H11.52ZM17.28 2.4V4.32H18.24V2.4H17.28ZM23.04 2.4V4.32H24V2.4H23.04ZM0 5.28V7.2H0.96V6.72H1.44V5.76H0.96V5.28H0ZM11.52 5.28V5.76H11.04V6.72H11.52V7.2H12.48V6.72H12.96V5.76H12.48V5.28H11.52ZM17.28 5.28V5.76H16.8V6.72H17.28V7.2H18.24V6.72H18.72V5.76H18.24V5.28H17.28ZM23.04 5.28V5.76H22.56V6.72H23.04V7.2H24V5.28H23.04ZM2.4 5.76V6.72H4.32V5.76H2.4ZM8.16 5.76V6.72H10.08V5.76H8.16ZM13.92 5.76V6.72H15.84V5.76H13.92ZM19.68 5.76V6.72H21.6V5.76H19.68ZM0 8.16V10.08H0.96V8.16H0ZM11.52 8.16V10.08H12.48V8.16H11.52ZM17.28 8.16V10.08H18.24V8.16H17.28ZM23.04 8.16V10.08H24V8.16H23.04ZM0 11.04V12.96H0.96V12.48H1.44V11.52H0.96V11.04H0ZM11.52 11.04V11.52H11.04V12.48H11.52V12.96H12.48V12.48H12.96V11.52H12.48V11.04H11.52ZM17.28 11.04V11.52H16.8V12.48H17.28V12.96H18.24V12.48H18.72V11.52H18.24V11.04H17.28ZM23.04 11.04V11.52H22.56V12.48H23.04V12.96H24V11.04H23.04ZM2.4 11.52V12.48H4.32V11.52H2.4ZM8.16 11.52V12.48H10.08V11.52H8.16ZM13.92 11.52V12.48H15.84V11.52H13.92ZM19.68 11.52V12.48H21.6V11.52H19.68ZM0 13.92V15.84H0.96V13.92H0ZM11.52 13.92V15.84H12.48V13.92H11.52ZM17.28 13.92V15.84H18.24V13.92H17.28ZM23.04 13.92V15.84H24V13.92H23.04ZM0 19.68V21.6H0.96V19.68H0ZM11.52 19.68V21.6H12.48V19.68H11.52ZM17.28 19.68V21.6H18.24V19.68H17.28ZM23.04 19.68V21.6H24V19.68H23.04ZM0 22.56V24H1.44V23.04H0.96V22.56H0ZM11.52 22.56V23.04H11.04V24H12.96V23.04H12.48V22.56H11.52ZM17.28 22.56V23.04H16.8V24H18.72V23.04H18.24V22.56H17.28ZM23.04 22.56V23.04H22.56V24H24V22.56H23.04ZM2.4 23.04V24H4.32V23.04H2.4ZM8.16 23.04V24H10.08V23.04H8.16ZM13.92 23.04V24H15.84V23.04H13.92ZM19.68 23.04V24H21.6V23.04H19.68Z"
									fill="#F9FAFB"
								/>
							</g>
							<defs>
								<clipPath id="clip0_5178_14603">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</span>
				</button>

				<div class="w-px h-8 bg-gt-color-gray m-auto"></div>

				<button
					on:click={actViewDataUdaraPm25}
					title="Udara"
					class="cursor-pointer w-8 h-8 {viewDataUdara
						? 'bg-gt-color-primary shadow shadow-gt-color-primary'
						: 'bg-gt-color-dark-2-transparent'} rounded-md justify-center items-center flex"
				>
					<span class="">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="size-5">
							<path
								d="M3 8H10C10.5933 8 11.1734 7.82405 11.6667 7.49441C12.1601 7.16477 12.5446 6.69623 12.7716 6.14805C12.9987 5.59987 13.0581 4.99667 12.9424 4.41473C12.8266 3.83279 12.5409 3.29824 12.1213 2.87868C11.7018 2.45912 11.1672 2.1734 10.5853 2.05765C10.0033 1.94189 9.40013 2.0013 8.85195 2.22836C8.30377 2.45543 7.83524 2.83994 7.50559 3.33329C7.17595 3.82664 7 4.40666 7 5M4 16H15C15.5933 16 16.1734 16.1759 16.6667 16.5056C17.1601 16.8352 17.5446 17.3038 17.7716 17.852C17.9987 18.4001 18.0581 19.0033 17.9424 19.5853C17.8266 20.1672 17.5409 20.7018 17.1213 21.1213C16.7018 21.5409 16.1672 21.8266 15.5853 21.9424C15.0033 22.0581 14.4001 21.9987 13.8519 21.7716C13.3038 21.5446 12.8352 21.1601 12.5056 20.6667C12.1759 20.1734 12 19.5933 12 19M2 12H19C19.5933 12 20.1734 11.8241 20.6667 11.4944C21.1601 11.1648 21.5446 10.6962 21.7716 10.1481C21.9987 9.59987 22.0581 8.99667 21.9424 8.41473C21.8266 7.83279 21.5409 7.29824 21.1213 6.87868C20.7018 6.45912 20.1672 6.1734 19.5853 6.05765C19.0033 5.94189 18.4001 6.0013 17.8519 6.22836C17.3038 6.45543 16.8352 6.83994 16.5056 7.33329C16.1759 7.82664 16 8.40666 16 9"
								stroke={viewDataUdara ? '#F9FAFB' : '#6B7280'}
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</button>

				<!-- <button
					on:click={() => handleModeling()}
					title="Modeling"
					class="cursor-pointer w-8 h-8 {showModeling
						? 'bg-gt-color-primary shadow shadow-gt-color-primary'
						: 'bg-gt-color-dark-2-transparent'} rounded-md justify-center items-center flex"
				>
					<span class="">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke={showModeling ? '#F9FAFB' : '#6B7280'}
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
							/>
						</svg>
					</span>
				</button> -->
			</div>
		</div>
	</div>
</div>
