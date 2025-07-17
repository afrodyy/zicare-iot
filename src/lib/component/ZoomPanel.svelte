<script>
	export let zoomIn = () => {};
	export let zoomOut = () => {};
</script>

<div class="bottom-[7rem] right-0 absolute">
	<div
		class="flex bg-gt-color-dark bg-opacity-80 border-[0.75px] border-gt-color-dark-3-transparent mb-7 mr-7 w-70 rounded-lg backdrop-blur-[3px] p-2 gap-2"
	>
		<button on:click={zoomIn} title="Zoom In" class="cursor-pointer justify-center items-center">
			<span class="">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5">
					<g id="Icon/Outline/zoom-in">
						<path
							id="Icon"
							d="M21.875 21L15.875 15M10.875 7V10M10.875 10V13M10.875 10H13.875M10.875 10H7.875M17.875 10C17.875 13.866 14.741 17 10.875 17C7.00901 17 3.875 13.866 3.875 10C3.875 6.13401 7.00901 3 10.875 3C14.741 3 17.875 6.13401 17.875 10Z"
							stroke="#E5E7EB"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				</svg>
			</span>
		</button>

		<div class="w-[1px] h-6 bg-gt-color-dark-3-transparent m-auto"></div>

		<button on:click={zoomOut} title="Zoom Out" class="cursor-pointer justify-center items-center">
			<span class="">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5">
					<g id="Icon/Outline/zoom-out">
						<path
							id="Icon"
							d="M21.125 21L15.125 15M13.125 10H7.125M17.125 10C17.125 13.866 13.991 17 10.125 17C6.25901 17 3.125 13.866 3.125 10C3.125 6.13401 6.25901 3 10.125 3C13.991 3 17.125 6.13401 17.125 10Z"
							stroke="#E5E7EB"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				</svg>
			</span>
		</button>
	</div>
</div>
