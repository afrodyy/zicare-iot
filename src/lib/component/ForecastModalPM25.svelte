<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import DarkCloudRainy from '$lib/component/icon/DarkCloudRainy.svelte';
	import FilledArrow from '$lib/component/icon/FilledArrow.svelte';
	import FilledWater from '$lib/component/icon/FilledWater.svelte';
	import moment from 'moment';
	import 'moment/locale/id';
	import ChevronDown from './ChevronDown.svelte';

	export let showForecastModal;
	export let selectedAirStation;
	export let handleForecastModal = () => {};

	$: weatherForecasts = [];
	$: showWeatherForecast = [];
	$: currentPm25 = selectedAirStation.pm25;

	onMount(async () => {
		weatherForecasts = selectedAirStation.forecast.forecast;
		showWeatherForecast = weatherForecasts.map((_) => {
			return {
				show: false
			};
		});
	});

	onDestroy(() => {
		weatherForecasts = [];
		showWeatherForecast = [];
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed flex top-1 right-[38.5rem] mt-16 flex-end z-50"
>
	<div
		class="justify-end mt-7 w-[24rem] overflow-hidden shadow-lg border border-gt-color-dark-3-transparent rounded-lg"
	>
		<!-- Modal Header -->
		<div
			class="flex flex-col bg-gt-color-dark gap-3 p-6 border-b border-gt-color-dark-3-transparent"
		>
			<!-- Title -->
			<div class="flex flex-row gap-3 justify-between">
				<span class="font-bold text-base text-gt-color-gray">Prediksi ISPU</span>

				<button
					on:click={(() => (showForecastModal = !showForecastModal), handleForecastModal)}
					type="button"
					class="text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gt-color-gray"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<!-- End of Title -->
		</div>
		<!-- End of Modal Header -->

		<!-- Modal Body -->
		<div
			class="flex flex-col w-full max-w-full max-h-96 overflow-auto scrollbar gap-2 py-3 px-3 bg-gt-color-dark-transparent backdrop-blur-sm ease-out duration-150"
		>
			<div class="flex flex-row gap-2 items-center">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5.75 2C6.16421 2 6.5 2.33579 6.5 2.75V4H13.5V2.75C13.5 2.33579 13.8358 2 14.25 2C14.6642 2 15 2.33579 15 2.75V4H15.25C16.7688 4 18 5.23122 18 6.75V15.25C18 16.7688 16.7688 18 15.25 18H4.75C3.23122 18 2 16.7688 2 15.25V6.75C2 5.23122 3.23122 4 4.75 4H5V2.75C5 2.33579 5.33579 2 5.75 2ZM4.75 7.5C4.05964 7.5 3.5 8.05964 3.5 8.75V15.25C3.5 15.9404 4.05964 16.5 4.75 16.5H15.25C15.9404 16.5 16.5 15.9404 16.5 15.25V8.75C16.5 8.05964 15.9404 7.5 15.25 7.5H4.75Z"
						fill="#E5E7EB"
					/>
				</svg>

				<span class="text-gt-color-gray-3">7 Days forecast</span>
			</div>
			<hr class="border border-gt-color-dark-3-transparent" />

			{#each weatherForecasts as forecast, index}
				{#if !moment(forecast.date).add(7, 'hours').isBefore(moment(), 'day')}
					<button
						on:click={() => {
							showWeatherForecast[index].show = !showWeatherForecast[index].show;
						}}
						type="button"
						class="flex flex-row py-1 px-2 w-full justify-between items-center hover:bg-slate-800 duration-150 rounded-lg"
					>
						<div class="flex flex-row w-44 justify-between items-center">
							<span class="text-sm text-gt-color-gray w-fit text-nowrap rounded-lg"
								>{moment(forecast.date).add(7, 'hours').isSame(moment(), 'day')
									? 'Today'
									: moment(forecast.date).format('dddd')}</span
							>

							{#if moment(forecast.date).add(7, 'hours').isSame(moment(), 'day')}
								{#if currentPm25 < 50}
									<span
										class="py-1 inline-block items-center px-3 rounded-full bg-[#22AD5C] text-gt-color-gray text-sm"
										>{currentPm25}</span
									>
								{:else if currentPm25 < 100}
									<span
										class="py-1 inline-block items-center px-3 rounded-full bg-[#01A9DB] text-gt-color-gray text-sm"
										>{currentPm25}</span
									>
								{:else if currentPm25 < 200}
									<span
										class="py-1 inline-block items-center px-3 rounded-full bg-[#FBBF24] text-gt-color-gray text-sm"
										>{currentPm25}</span
									>
								{:else if currentPm25 <= 300}
									<span
										class="py-1 inline-block items-center px-3 rounded-full bg-[#F23030] text-gt-color-gray text-sm"
										>{currentPm25}</span
									>
								{:else if currentPm25 > 300}
									<span
										class="py-1 inline-block items-center px-3 rounded-full bg-[#0C0C0D] text-gt-color-gray text-sm"
										>{currentPm25}</span
									>
								{/if}
							{:else if Math.max(...forecast.predictions.map((p) => p.prediction_pm25)) < 50}
								<span
									class="py-1 inline-block items-center px-3 rounded-full bg-[#22AD5C] text-gt-color-gray text-sm"
									>{parseFloat(
										Math.max(...forecast.predictions.map((p) => p.prediction_pm25))
									).toFixed(2)}</span
								>
							{:else if Math.max(...forecast.predictions.map((p) => p.prediction_pm25)) < 100}
								<span
									class="py-1 inline-block items-center px-3 rounded-full bg-[#01A9DB] text-gt-color-gray text-sm"
									>{parseFloat(
										Math.max(...forecast.predictions.map((p) => p.prediction_pm25))
									).toFixed(2)}</span
								>
							{:else if Math.max(...forecast.predictions.map((p) => p.prediction_pm25)) < 200}
								<span
									class="py-1 inline-block items-center px-3 rounded-full bg-[#FBBF24] text-gt-color-gray text-sm"
									>{parseFloat(
										Math.max(...forecast.predictions.map((p) => p.prediction_pm25))
									).toFixed(2)}</span
								>
							{:else if Math.max(...forecast.predictions.map((p) => p.prediction_pm25)) <= 300}
								<span
									class="py-1 inline-block items-center px-3 rounded-full bg-[#F23030] text-gt-color-gray text-sm"
									>{parseFloat(
										Math.max(...forecast.predictions.map((p) => p.prediction_pm25))
									).toFixed(2)}</span
								>
							{:else if Math.max(...forecast.predictions.map((p) => p.prediction_pm25)) > 300}
								<span
									class="py-1 inline-block items-center px-3 rounded-full bg-[#0C0C0D] text-gt-color-gray text-sm"
									>{parseFloat(
										Math.max(...forecast.predictions.map((p) => p.prediction_pm25))
									).toFixed(2)}</span
								>
							{/if}
						</div>

						<button type="button" class="text-gt-color-gray-3">
							<ChevronDown
								strokeWidth={1.5}
								customClass={'size-5'}
								condition={showWeatherForecast[index].show}
							/>
						</button>
					</button>

					{#if showWeatherForecast[index].show}
						<div
							in:fly={{ y: 20, duration: 200 }}
							class="w-full flex bg-gt-color-dark-2-transparent rounded-xl"
						>
							<div
								class="p-3 flex flex-row gap-3 items-center w-full overflow-x-auto scrollbar flex-nowrap"
							>
								{#each forecast?.predictions as prediction}
									{#if !moment(prediction.ds).isBefore(moment())}
										<div class="flex flex-col gap-2 items-center">
											<span class="font-medium text-gt-color-gray-3 text-sm"
												>{moment(prediction?.ds).format('HH')}</span
											>
											{#if prediction?.prediction_pm25 < 50}
												<span
													class="py-1 inline-block items-center px-2 rounded-full bg-[#22AD5C] text-gt-color-gray text-sm"
													>{parseFloat(prediction?.prediction_pm25).toFixed(2)}</span
												>
											{:else if prediction?.prediction_pm25 < 100}
												<span
													class="py-1 inline-block items-center px-2 rounded-full bg-[#01A9DB] text-gt-color-gray text-sm"
													>{parseFloat(prediction?.prediction_pm25).toFixed(2)}</span
												>
											{:else if prediction?.prediction_pm25 < 200}
												<span
													class="py-1 inline-block items-center px-2 rounded-full bg-[#FBBF24] text-gt-color-gray text-sm"
													>{parseFloat(prediction?.prediction_pm25).toFixed(2)}</span
												>
											{:else if prediction?.prediction_pm25 < 300}
												<span
													class="py-1 inline-block items-center px-2 rounded-full bg-[#F23030] text-gt-color-gray text-sm"
													>{parseFloat(prediction?.prediction_pm25).toFixed(2)}</span
												>
											{:else if prediction?.prediction_pm25 > 300}
												<span
													class="py-1 inline-block items-center px-2 rounded-full bg-[#0C0C0D] text-gt-color-gray text-sm"
													>{parseFloat(prediction?.prediction_pm25).toFixed(2)}</span
												>
											{/if}
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					{#if weatherForecasts.length - 1 !== index}
						<hr class="border border-gt-color-dark-3-transparent" />
					{/if}
				{/if}
			{/each}
		</div>
		<!-- End of Modal Body -->
	</div>
</div>
