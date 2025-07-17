<script>
	import { fade } from 'svelte/transition';

	export let openSelect;
	export let getArrayBy = () => {};
	export let selectValueUdara;
	export let selectValue;
	export let selectOpen;
	export let actSelect;
</script>

<div class="bottom-0 left-0 absolute">
	<div
		class="w-44 ml-7 mb-7 p-2 bg-gt-color-dark-transparent border border-gt-color-dark-3-transparent bg-opacity-80 backdrop-blur-[3px] shadow rounded-lg"
	>
		<span class="text-gt-color-gray font-medium text-sm">MAP VIEW</span>

		<div class="relative w-full text-left mt-3">
			<button
				on:click={openSelect}
				type="button"
				class="whitespace-nowrap w-full justify-left gap-x-1.5 rounded-md bg-gt-color-dark px-2 p-2 text-sm font-normal text-gt-color-gray ring-inset border border-gt-color-dark-3 flex justify-between items-center"
			>
				{getArrayBy(selectValueUdara, 'value', selectValue).label}
				<svg
					class="{selectValue == 'bw' ? 'ml-1' : 'ml-12'} {selectOpen
						? ''
						: 'rotate-180'} h-5 w-5 text-gt-color-gray ease-in-out duration-150"
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

			{#if selectOpen}
				<div
					transition:fade={{ duration: 150 }}
					class="absolute bottom-[84px] left-[-9px] right-0 z-10 w-44 origin-top-right rounded-md bg-gt-color-dark opacity-80 shadow-lg ring-opacity-5 focus:outline-none border border-gt-color-dark-3"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<div class="py-1 divide-y divide-gt-color-dark-3-transparent" role="none">
						{#each selectValueUdara as element}
							<!-- svelte-ignore a11y-invalid-attribute -->
							<a
								href="#"
								on:click={() => actSelect(element.value)}
								class="block {selectValue == element.value
									? 'bg-gt-color-dark'
									: ''} px-4 py-2 text-sm text-gt-color-gray"
								role="menuitem"
								tabindex="-1"
								id="menu-item-0">{element.label}</a
							>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
