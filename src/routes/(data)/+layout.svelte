<script>
	import '$src/app.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { afterUpdate, setContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import {
		isPm25App,
		mainContainerHeight,
		mainContainerWidth,
		headerHeight,
		formatDateDmyHis
	} from '$lib/index';
	import Swal from 'sweetalert2';
	import Square2x2 from '$lib/component/icon/Square2x2.svelte';
	import QueueList from '$lib/component/icon/QueueList.svelte';
	import UserGroup from '$lib/component/icon/UserGroup.svelte';
	import RectangleGroup from '$lib/component/icon/RectangleGroup.svelte';

	export let data;

	const contextValues = {
		formatDateDmyHis
	};

	setContext('appContext', contextValues);

	$: currentUrl = $page.url.pathname;
	$: ({ userRole } = data);
	$: profileDropdownOpen = false;

	function handleLogout() {
		Swal.fire({
			icon: 'info',
			title: 'Apakah anda yakin ingin logout dari sistem?',
			showCancelButton: true,
			confirmButtonText: 'Ya',
			cancelButtonText: 'Tidak',
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				title: 'font-medium text-lg text-gt-color-gray',
				htmlContainer: '!font-normal !text-base !text-gt-color-gray',
				confirmButton:
					'bg-gt-color-dark-3-transparent text-gt-color-gray px-4 py-1 rounded hover:bg-gt-color-dark-3-transparent transition ease-in-out duration-150',
				cancelButton:
					'bg-gt-color-primary hover:bg-gt-color-primary-hover text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				localStorage.clear();
				$isPm25App = false;
				goto('/');
			}
		});
	}

	afterUpdate(() => {
		if (userRole.includes('admin-pm25')) {
			$isPm25App = true;
		}
	});
</script>

<div
	bind:clientHeight={$mainContainerHeight}
	bind:clientWidth={$mainContainerWidth}
	class="flex h-screen w-screen bg-gt-color-dark-2 text-gt-color-gray"
>
	<!-- Sidebar -->
	<div
		class="flex flex-col inset-y-0 z-20 border-r border-gt-color-dark-3 rounded-xl rounded-tl-none rounded-tr-none rounded-br-none bg-gt-color-dark text-gt-color-gray h-full shadow-xl shadow-blue-gray-900/5"
	>
		<nav
			class="flex flex-col justify-between min-w-[217px] p-6 font-sans text-base font-semibold text-gt-color-gray"
		>
			<!-- Green Teams Logo -->
			<div class="flex justify-center items-center">
				<span class="block justify-center items-center">
					<img src="/zicare-logo.svg" alt="Logo DLH DKI" class="w-32 h-32" />
				</span>
			</div>
			<!-- End of Green Teams Logo -->

			<!-- Dashboard -->
			<a href="/">
				<div
					role="button"
					tabindex="0"
					class="flex items-center w-48 p-3 mb-[12px] rounded-lg text-start leading-tight transition-all
              hover:bg-gt-color-primary hover:bg-opacity-80
              focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
              hover:text-gt-color-gray focus:text-gt-color-gray active:text-gt-color-gray outline-none"
				>
					<div class="grid place-items-center mr-4">
						<Square2x2 iconClass={'size-6'} />
					</div>
					Dashboard
				</div>
			</a>
			<!-- End of Dashboard -->

			<!-- Master Room -->
			<a href="/master-room">
				<div
					role="button"
					tabindex="0"
					class="{currentUrl.startsWith('/master-room')
						? 'bg-gt-color-primary'
						: ''} flex items-center w-48 p-3 mb-[12px] rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80
          focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
          hover:text-gt-color-gray focus:text-gt-color-gray active:text-gt-color-gray outline-none"
				>
					<div class="grid place-items-center mr-4">
						<QueueList iconClass={'size-6'} />
					</div>
					Master Room
				</div>
			</a>
			<!-- End of Master Room -->

			<!-- Room Details -->
			<a href="/room-data">
				<div
					role="button"
					tabindex="0"
					class=" {currentUrl.startsWith('/room-data')
						? 'bg-gt-color-primary'
						: ''}  flex items-center w-48 p-3 mb-[12px] rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80 focus:bg-gt-color-primary focus:bg-opacity-80 hover:text-gt-color-gray focus:text-gt-color-gray outline-none"
				>
					<div class="grid place-items-center mr-4">
						<RectangleGroup iconClass={'size-6'} />
					</div>
					Room Data
				</div>
			</a>
			<!-- End of Room Details -->

			{#if userRole.includes('super-admin')}
				<!-- Membership -->
				<a href="/membership">
					<div
						role="button"
						tabindex="0"
						class="{currentUrl.startsWith('/membership')
							? 'bg-gt-color-primary'
							: ''}  flex items-center w-48 p-3 rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80 focus:bg-gt-color-primary focus:bg-opacity-80 hover:text-gt-color-gray focus:text-gt-color-gray outline-none"
					>
						<div class="grid place-items-center mr-4">
							<UserGroup iconClass={'size-6'} />
						</div>
						Membership
					</div>
				</a>
				<!-- End of Membership -->
			{/if}
		</nav>
		<p class="mt-auto text-xs text-center mb-6">Powered by GreenTeams</p>
	</div>
	<!-- End of Sidebar -->

	<div class="flex flex-col w-full max-w-full overflow-hidden">
		<!-- Header -->
		<nav
			bind:clientHeight={$headerHeight}
			class="bg-gt-color-dark border-b border-gt-color-dark-3 top-0 z-10"
		>
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center justify-center sm:items-stretch sm:justify-start">
					<div class="sm:block">
						<div class="flex">
							<!-- svelte-ignore a11y-invalid-attribute -->
							<a
								href="#"
								class="rounded-md py-2 text-gt-color-gray text-lg font-semibold ml-8 flex justify-center items-center rounded-b-none"
								aria-current="page"
							>
								{#if currentUrl === '/status-stasiun'}
									Status Stasiun
								{:else if currentUrl === '/data-aqms'}
									Data AQMS
								{:else if currentUrl === '/data-ispu'}
									Data ISPU
								{:else if currentUrl === '/data-ispu/validate'}
									Validate ISPU
								{:else if currentUrl === '/membership'}
									Membership
								{/if}
							</a>
						</div>
					</div>
				</div>

				<div
					class=" sm:bg inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-10 space-x-5"
				>
					<button type="button" class="relative rounded-full p-1 text-gray-400">
						<span class="absolute -inset-1.5"></span>
						<span class="sr-only">View notifications</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="26"
							viewBox="0 0 24 26"
							fill="none"
						>
							<path
								d="M14.8569 19.0817C16.7514 18.857 18.5783 18.4116 20.3111 17.7719C18.8743 16.177 17.9998 14.0656 17.9998 11.75V11.0492C17.9999 11.0328 18 11.0164 18 11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11L5.9998 11.75C5.9998 14.0656 5.12527 16.177 3.68848 17.7719C5.4214 18.4116 7.24843 18.857 9.14314 19.0818M14.8569 19.0817C13.92 19.1928 12.9666 19.25 11.9998 19.25C11.0332 19.25 10.0799 19.1929 9.14314 19.0818M14.8569 19.0817C14.9498 19.3711 15 19.6797 15 20C15 21.6569 13.6569 23 12 23C10.3431 23 9 21.6569 9 20C9 19.6797 9.05019 19.3712 9.14314 19.0818"
								stroke="#E5E7EB"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<rect x="14" width="10" height="10" rx="5" fill="#E10E0E" />
						</svg>
					</button>

					<!-- Profile dropdown -->
					<div class="relative inline-block text-left h-full">
						<div>
							<button
								on:click={() => (profileDropdownOpen = !profileDropdownOpen)}
								type="button"
								class="w-fit h-[38px] justify-center items-center gap-3 inline-flex"
							>
								<div class="justify-center items-center gap-2 flex">
									<img
										class="w-8 h-8 relative rounded-[200px]"
										src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
										alt="User Logo"
									/>
									<div class="text-center text-gray-50 font-normal text-base text-nowrap">
										Administrator
									</div>
								</div>
								<div class="w-6 h-6 relative">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M19.5 8.25L12 15.75L4.5 8.25"
											stroke="#E5E7EB"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							</button>
						</div>

						{#if profileDropdownOpen}
							<div
								transition:fly={{ y: 25, duration: 150 }}
								class="absolute right-0 z-50 w-36 origin-top-right rounded-lg bg-gt-color-dark shadow shadow-black ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="menu-button"
								tabindex="-1"
							>
								<div class="py-1" role="none">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<a
										on:click={() => handleLogout()}
										class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-slate-800 hover:cursor-pointer rounded-lg"
										role="menuitem"
										tabindex="-1"
										id="menu-item-0">Logout</a
									>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</nav>
		<!-- End of Header -->

		<!-- Main Content -->
		<div class="{currentUrl === '/ai-assistant' ? '' : 'p-6'} bg-gt-color-dark-5">
			<slot />
		</div>
		<!-- End of Main Content -->
	</div>
</div>
