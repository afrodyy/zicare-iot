<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { handleSweetAlert } from '$lib/index';

	export let showMeteorologyModal = false;
	export let demographyModal = false;
	export let showForecastModal = false;
	export let handleMeteorologyModal = () => {};
	export let handleDemographyModal = () => {};
	export let handleForecastModal = () => {};

	let userRole = '';

	onMount(() => {
		userRole = localStorage.getItem('role');
	});
</script>

<div transition:fade={{ duration: 200 }} class="fixed flex top-1 right-0 flex-end mt-16 mr-7">
	<div
		class="bg-opacity-80 justify-end mt-7 w-44 rounded-lg overflow-hidden shadow-sm shadow-black bg-gt-color-dark border-gt-color-dark-3-transparent border backdrop-blur-[6px] p-3"
	>
		<div class="h-50 text-gt-color-gray mb-3">
			<div class="items-center flex font-normal">
				INDIKATOR <br /> PENDUKUNG
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<!-- Meteorology Button -->
			<button
				on:click={() => {
					if (userRole) {
						showMeteorologyModal = !showMeteorologyModal;
						handleMeteorologyModal();
					} else {
						handleSweetAlert('error', 'Anda harus login terlebih dahulu!');
					}
				}}
				class="p-2 w-full justify-left items-center rounded-md {showMeteorologyModal
					? 'bg-gt-color-primary'
					: ''} flex text-sm ease-in-out duration-150"
			>
				<span
					class="bg-gt-color-primary w-[26px] h-[26px] rounded p-1 flex justify-center items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="14"
						viewBox="0 0 16 14"
						fill="none"
					>
						<path
							d="M11.75 10.75C11.5511 10.75 11.3603 10.671 11.2197 10.5303C11.079 10.3897 11 10.1989 11 10C11 9.80109 11.079 9.61033 11.2197 9.46968C11.3603 9.32902 11.5511 9.25001 11.75 9.25001C12.9905 9.25001 14 8.24051 14 7.00001C14 5.75951 12.9905 4.75001 11.75 4.75001C11.5677 4.75001 11.375 4.78076 11.1425 4.84751L10.3363 5.07776L10.1975 4.25051C10.0826 3.55185 9.72305 2.9168 9.18313 2.45876C8.6432 2.00072 7.95804 1.74951 7.25 1.75001C6.80454 1.75043 6.36475 1.84996 5.96251 2.04137C5.56027 2.23278 5.20565 2.51128 4.92435 2.85669C4.64305 3.2021 4.44213 3.60577 4.33613 4.03844C4.23013 4.47111 4.22172 4.92194 4.3115 5.35826L4.4945 6.25751L3.4295 6.24551C2.67275 6.25001 2 6.92276 2 7.75001C2 8.57726 2.67275 9.25001 3.5 9.25001C3.69891 9.25001 3.88968 9.32902 4.03033 9.46968C4.17098 9.61033 4.25 9.80109 4.25 10C4.25 10.1989 4.17098 10.3897 4.03033 10.5303C3.88968 10.671 3.69891 10.75 3.5 10.75C1.8455 10.75 0.5 9.40451 0.5 7.75001C0.500774 7.08492 0.722152 6.43887 1.12945 5.91309C1.53675 5.3873 2.10696 5.01148 2.75075 4.84451L2.75 4.75001C2.75 2.26826 4.76825 0.250006 7.25 0.250006C8.18187 0.248463 9.091 0.537758 9.85061 1.07755C10.6102 1.61735 11.1824 2.38073 11.4875 3.26126C13.6917 3.07826 15.5 4.84601 15.5 7.00001C15.5 9.06776 13.8177 10.75 11.75 10.75ZM6.875 10.75L7.625 8.50001L8.375 10.75C8.41413 10.8686 8.42457 10.9949 8.40544 11.1183C8.38631 11.2418 8.33816 11.3589 8.26496 11.4602C8.19175 11.5614 8.09557 11.6438 7.98432 11.7007C7.87308 11.7575 7.74993 11.7872 7.625 11.7872C7.50007 11.7872 7.37692 11.7575 7.26568 11.7007C7.15443 11.6438 7.05825 11.5614 6.98504 11.4602C6.91184 11.3589 6.86369 11.2418 6.84456 11.1183C6.82543 10.9949 6.83587 10.8686 6.875 10.75ZM9.125 12.25L9.875 10L10.625 12.25C10.6641 12.3686 10.6746 12.4949 10.6554 12.6183C10.6363 12.7418 10.5882 12.8589 10.515 12.9602C10.4418 13.0614 10.3456 13.1438 10.2343 13.2007C10.1231 13.2575 9.99993 13.2872 9.875 13.2872C9.75007 13.2872 9.62693 13.2575 9.51568 13.2007C9.40443 13.1438 9.30825 13.0614 9.23504 12.9602C9.16184 12.8589 9.11369 12.7418 9.09456 12.6183C9.07543 12.4949 9.08587 12.3686 9.125 12.25ZM4.625 12.25L5.375 10L6.125 12.25C6.16413 12.3686 6.17457 12.4949 6.15544 12.6183C6.13631 12.7418 6.08816 12.8589 6.01496 12.9602C5.94175 13.0614 5.84557 13.1438 5.73432 13.2007C5.62308 13.2575 5.49993 13.2872 5.375 13.2872C5.25007 13.2872 5.12692 13.2575 5.01568 13.2007C4.90443 13.1438 4.80825 13.0614 4.73504 12.9602C4.66184 12.8589 4.61369 12.7418 4.59456 12.6183C4.57543 12.4949 4.58587 12.3686 4.625 12.25Z"
							fill="#F9FAFB"
						/>
					</svg>
				</span>

				<div class="text-white text-bold ml-[8px]">Meteorologi</div>
			</button>
			<!-- End of Meteorology Button -->

			<hr class="border-1 border-gt-color-dark-3-transparent" />

			<!-- Demography Button -->
			<button
				on:click={() => handleDemographyModal()}
				class="p-2 w-full justify-left items-center rounded-md {demographyModal
					? 'bg-gt-color-primary'
					: ''} flex text-sm ease-in-out duration-150"
			>
				<span
					class=" bg-gt-color-primary w-[26px] h-[26px] rounded p-1 flex justify-center items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
					>
						<path
							d="M13.5 13.5C13.8125 13.5 14.0782 13.3907 14.2972 13.1722C14.5162 12.9537 14.6255 12.688 14.625 12.375C14.625 12.0625 14.5157 11.797 14.2972 11.5785C14.0787 11.36 13.813 11.2505 13.5 11.25C13.1875 11.25 12.922 11.3595 12.7035 11.5785C12.485 11.7975 12.3755 12.063 12.375 12.375C12.375 12.6875 12.4845 12.9532 12.7035 13.1722C12.9225 13.3912 13.188 13.5005 13.5 13.5ZM13.5 15.75C13.875 15.75 14.225 15.6625 14.55 15.4875C14.875 15.3125 15.1438 15.0687 15.3563 14.7562C15.0688 14.5812 14.7687 14.453 14.4562 14.3715C14.1438 14.29 13.825 14.2495 13.5 14.25C13.175 14.25 12.8562 14.2905 12.5438 14.3715C12.2313 14.4525 11.9312 14.5807 11.6437 14.7562C11.8562 15.0687 12.125 15.3125 12.45 15.4875C12.775 15.6625 13.125 15.75 13.5 15.75ZM3.75 15.75C3.3375 15.75 2.9845 15.6033 2.691 15.3097C2.3975 15.0162 2.2505 14.663 2.25 14.25V3.75C2.25 3.3375 2.397 2.9845 2.691 2.691C2.985 2.3975 3.338 2.2505 3.75 2.25H14.25C14.6625 2.25 15.0157 2.397 15.3097 2.691C15.6038 2.985 15.7505 3.338 15.75 3.75V8.775C15.5125 8.6625 15.2688 8.56575 15.0187 8.48475C14.7687 8.40375 14.5125 8.34425 14.25 8.30625V3.75H3.75V14.25H8.2875C8.325 14.525 8.3845 14.7875 8.466 15.0375C8.5475 15.2875 8.64425 15.525 8.75625 15.75H3.75ZM3.75 13.5V14.25V3.75V8.30625V8.25V13.5ZM5.25 12.75H8.30625C8.34375 12.4875 8.40325 12.2313 8.48475 11.9813C8.56625 11.7312 8.65675 11.4875 8.75625 11.25H5.25V12.75ZM5.25 9.75H9.825C10.225 9.375 10.672 9.0625 11.166 8.8125C11.66 8.5625 12.188 8.39375 12.75 8.30625V8.25H5.25V9.75ZM5.25 6.75H12.75V5.25H5.25V6.75ZM13.5 17.25C12.4625 17.25 11.5782 16.8845 10.8472 16.1535C10.1163 15.4225 9.7505 14.538 9.75 13.5C9.75 12.4625 10.1158 11.5782 10.8472 10.8472C11.5788 10.1163 12.463 9.7505 13.5 9.75C14.5375 9.75 15.422 10.1158 16.1535 10.8472C16.885 11.5788 17.2505 12.463 17.25 13.5C17.25 14.5375 16.8843 15.422 16.1528 16.1535C15.4213 16.885 14.537 17.2505 13.5 17.25Z"
							fill="#F9FAFB"
						/>
					</svg>
				</span>
				<div class="text-white text-bold ml-[8px]">Demografi</div>
			</button>
			<!-- End of Demography Button -->

			<hr class="border-1 border-gt-color-dark-3-transparent" />

			<!-- Forecast Button -->
			<button
				on:click={() => handleForecastModal()}
				class="p-2 w-full justify-left items-center rounded-md {showForecastModal
					? 'bg-gt-color-primary'
					: ''} flex text-sm ease-in-out duration-150"
			>
				<span
					class=" bg-gt-color-primary w-[26px] h-[26px] rounded p-1 flex justify-center items-center"
				>
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
							d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
						/>
					</svg>
				</span>
				<div class="text-white text-bold ml-[8px]">Forecast</div>
			</button>
		</div>
	</div>
</div>
