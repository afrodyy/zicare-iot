<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import LoginModal from './LoginModal.svelte';
	import { isPm25App } from '$lib/index';
	import Swal from 'sweetalert2';

	$: isLogin = false;
	$: showLoginModal = false;

	let accessToken = '';
	let username = '';

	let sidebarvisible = false;
	$: profileDropdownOpen = false;
	$: userRole = '';

	const sidebarOpen = function () {
		sidebarvisible = !sidebarvisible;
	};

	function getUserRole() {
		userRole = localStorage.getItem('role');
		return userRole;
	}

	function handleClose(type, loggedIn) {
		showLoginModal = type;
		isLogin = loggedIn;
	}

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
				accessToken = null;
				isLogin = false;
				userRole = '';
				$isPm25App = false;

				location.reload(true);
			}
		});
	}

	onMount(() => {
		accessToken = localStorage.getItem('accessToken');
		username = localStorage.getItem('username');

		if (accessToken !== '' && accessToken !== null) {
			isLogin = true;
		}

		getUserRole();
	});
</script>

<!-- Navbar -->
<nav class="bg-gt-color-dark fixed top-0 w-full z-10">
	<div class="max-w-8xl">
		<div class="relative flex h-16 items-center justify-between min-w-full">
			<div
				class="flex items-center justify-center sm:items-stretch sm:justify-start sm:mb-[0rem] {isLogin
					? '-mr-40'
					: '-mr-72'}"
			>
				<div class="sm:block">
					<div class="flex">
						<a
							href="/"
							class="rounded-md px-[40px] text-gt-color-gray text-sm font-semibold leading-relaxed flex justify-center items-center rounded-b-none mr-72"
							aria-current="page"
						>
							<span class="mr-2 p-1 rounded-md bg-gt-color-primary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
								>
									<path
										d="M2 7.00006H9C9.59334 7.00006 10.1734 6.82412 10.6667 6.49447C11.1601 6.16483 11.5446 5.69629 11.7716 5.14811C11.9987 4.59993 12.0581 3.99673 11.9424 3.41479C11.8266 2.83285 11.5409 2.2983 11.1213 1.87874C10.7018 1.45918 10.1672 1.17346 9.58527 1.05771C9.00333 0.941951 8.40013 1.00136 7.85195 1.22842C7.30377 1.45549 6.83524 1.84 6.50559 2.33335C6.17595 2.8267 6 3.40672 6 4.00006M3 15.0001H14C14.5933 15.0001 15.1734 15.176 15.6667 15.5057C16.1601 15.8353 16.5446 16.3038 16.7716 16.852C16.9987 17.4002 17.0581 18.0034 16.9424 18.5853C16.8266 19.1673 16.5409 19.7018 16.1213 20.1214C15.7018 20.5409 15.1672 20.8267 14.5853 20.9424C14.0033 21.0582 13.4001 20.9988 12.8519 20.7717C12.3038 20.5446 11.8352 20.1601 11.5056 19.6668C11.1759 19.1734 11 18.5934 11 18.0001M1 11.0001H18C18.5933 11.0001 19.1734 10.8241 19.6667 10.4945C20.1601 10.1648 20.5446 9.69629 20.7716 9.14811C20.9987 8.59993 21.0581 7.99673 20.9424 7.41479C20.8266 6.83285 20.5409 6.2983 20.1213 5.87874C19.7018 5.45918 19.1672 5.17346 18.5853 5.05771C18.0033 4.94195 17.4001 5.00136 16.8519 5.22842C16.3038 5.45549 15.8352 5.84 15.5056 6.33335C15.1759 6.8267 15 7.40672 15 8.00006"
										stroke="#F9FAFB"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</a>
					</div>
				</div>
			</div>

			<!-- Logo DLH -->
			<div class="relative flex flex-row gap-2 items-center">
				<img src="/zicare-logo.svg" alt="Logo Zicare" class="w-28 h-28" />
			</div>
			<!-- End of Logo DLH -->

			<div
				class="absolute sm:bg inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-[40px] space-x-5"
			>
				<!-- Notif Icon -->
				<button
					type="button"
					class="relative rounded-full p-1 text-gray-400 hover:text-gt-color-gray focus:outline-none"
				>
					<span class="absolute -inset-1.5"></span>
					<span class="sr-only">View notifications</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
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
				<!-- End of Notif Icon -->

				<!-- Profile dropdown -->
				{#if isLogin}
					<div class="relative inline-block text-left h-full">
						<div>
							<button
								on:click={() => (profileDropdownOpen = !profileDropdownOpen)}
								type="button"
								class="w-fit h-[38px] justify-center items-center gap-3 inline-flex"
							>
								<div class="flex justify-center items-center gap-2">
									<img
										class="w-8 h-8 relative rounded-full"
										src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"
										alt="User Logo"
									/>
									<div class="text-center text-gt-color-gray font-normal text-base text-nowrap">
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
								class="absolute right-0 z-50 w-36 origin-top-right rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[#374151CC]"
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
				{:else}
					<button
						on:click={() => (showLoginModal = true)}
						class="bg-gt-color-primary hover:bg-gt-color-primary-hover px-3 py-1 rounded-md text-sm text-gt-color-gray-3"
						>Login</button
					>
				{/if}
			</div>
		</div>
	</div>
</nav>
<!-- End of Navbar -->

<!-- jika sembunyikan sidebar dengan -left-60  -->
<!-- Sidebar -->
<div
	class="fixed inset-y-0 {sidebarvisible
		? 'fade-in'
		: '-left-60 fade-out'}  min-w-[217px] z-20 flex flex-col bg-clip-border rounded-xl bg-gt-color-dark text-gt-color-gray h-full w-full max-w-[15rem] p-6 shadow-xl shadow-blue-gray-900/5"
>
	<nav
		class="flex flex-col justify-center font-sans text-base font-semibold text-gt-color-gray-3 h-full"
	>
		<!-- Top Logo -->
		<div class="flex justify-center items-center">
			<img src="/zicare-logo.svg" alt="Logo Zicare" class="w-32 h-32" />
		</div>
		<!-- End of Top Logo -->

		<!-- Dashboard -->
		<a transition:fade={{ duration: 200 }} href="/">
			<div
				role="button"
				tabindex="0"
				class="flex items-center w-48 p-3 mb-3 rounded-lg text-start leading-tight transition-all
          bg-gt-color-primary
          hover:bg-gt-color-primary hover:bg-opacity-80
          focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
          hover:text-gt-color-gray-3 focus:text-gt-color-gray-3 active:text-gt-color-gray-3 outline-none"
			>
				<div class="grid place-items-center mr-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="25"
						viewBox="0 0 24 25"
						fill="none"
					>
						<path
							d="M3.75 6.33044C3.75 5.0878 4.75736 4.08044 6 4.08044H8.25C9.49264 4.08044 10.5 5.0878 10.5 6.33044V8.58044C10.5 9.82308 9.49264 10.8304 8.25 10.8304H6C4.75736 10.8304 3.75 9.82308 3.75 8.58044V6.33044Z"
							stroke="#F9FAFB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M3.75 16.0804C3.75 14.8378 4.75736 13.8304 6 13.8304H8.25C9.49264 13.8304 10.5 14.8378 10.5 16.0804V18.3304C10.5 19.5731 9.49264 20.5804 8.25 20.5804H6C4.75736 20.5804 3.75 19.5731 3.75 18.3304V16.0804Z"
							stroke="#F9FAFB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M13.5 6.33044C13.5 5.0878 14.5074 4.08044 15.75 4.08044H18C19.2426 4.08044 20.25 5.0878 20.25 6.33044V8.58044C20.25 9.82308 19.2426 10.8304 18 10.8304H15.75C14.5074 10.8304 13.5 9.82308 13.5 8.58044V6.33044Z"
							stroke="#F9FAFB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M13.5 16.0804C13.5 14.8378 14.5074 13.8304 15.75 13.8304H18C19.2426 13.8304 20.25 14.8378 20.25 16.0804V18.3304C20.25 19.5731 19.2426 20.5804 18 20.5804H15.75C14.5074 20.5804 13.5 19.5731 13.5 18.3304V16.0804Z"
							stroke="#F9FAFB"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				Dashboard
			</div>
		</a>
		<!-- End of Dashboard -->

		{#if isLogin}
			<!-- Master Room -->
			<a transition:fade={{ duration: 200 }} href="/master-room">
				<div
					role="button"
					tabindex="0"
					class="flex items-center w-48 p-3 mb-3 rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80
        focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
        hover:text-gt-color-gray-3 focus:text-gt-color-gray-3 active:text-gt-color-gray-3 outline-none"
				>
					<div class="grid place-items-center mr-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
							/>
						</svg>
					</div>
					Master Room
				</div>
			</a>
			<!-- End of Master Room -->

			<!-- Room Data -->
			<a transition:fade={{ duration: 200 }} href="/room-data">
				<div
					role="button"
					tabindex="0"
					class="flex items-center w-48 p-3 mb-3 rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80
        focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
        hover:text-gt-color-gray-3 focus:text-gt-color-gray-3 active:text-gt-color-gray-3 outline-none"
				>
					<div class="grid place-items-center mr-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
							/>
						</svg>
					</div>
					Room Data
				</div>
			</a>
			<!-- End of Room Data -->

			{#if userRole.includes('super-admin')}
				<!-- Membership -->
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a transition:fade={{ duration: 200 }} href="/membership">
					<div
						role="button"
						tabindex="0"
						class="flex items-center w-48 p-3 mb-3 rounded-lg text-start leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80
        focus:bg-gt-color-primary focus:bg-opacity-80 active:bg-gt-color-primary active:bg-opacity-80
        hover:text-gt-color-gray-3 focus:text-gt-color-gray-3 active:text-gt-color-gray-3 outline-none"
					>
						<div class="grid place-items-center mr-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="25"
								viewBox="0 0 24 25"
								fill="none"
							>
								<path
									d="M18.0002 19.0496C18.2477 19.07 18.498 19.0804 18.7508 19.0804C19.7992 19.0804 20.8056 18.9012 21.7413 18.5717C21.7476 18.4921 21.7508 18.4117 21.7508 18.3304C21.7508 16.6736 20.4077 15.3304 18.7508 15.3304C18.1232 15.3304 17.5406 15.5232 17.059 15.8527M18.0002 19.0496C18.0002 19.0599 18.0002 19.0702 18.0002 19.0804C18.0002 19.3054 17.9879 19.5275 17.9637 19.7461C16.207 20.7541 14.1709 21.3304 12.0002 21.3304C9.82957 21.3304 7.79352 20.7541 6.03675 19.7461C6.01263 19.5275 6.00024 19.3054 6.00024 19.0804C6.00024 19.0702 6.00027 19.0599 6.00032 19.0497M18.0002 19.0496C17.9943 17.873 17.6497 16.7766 17.059 15.8527M17.059 15.8527C15.9931 14.1856 14.1257 13.0804 12.0002 13.0804C9.87504 13.0804 8.0079 14.1854 6.94193 15.8521M6.94193 15.8521C6.46047 15.5229 5.8782 15.3304 5.25098 15.3304C3.59412 15.3304 2.25098 16.6736 2.25098 18.3304C2.25098 18.4117 2.2542 18.4921 2.26054 18.5717C3.19617 18.9012 4.20264 19.0804 5.25098 19.0804C5.50332 19.0804 5.75323 19.0701 6.00032 19.0497M6.94193 15.8521C6.35095 16.7761 6.00623 17.8728 6.00032 19.0497M15.0002 7.08044C15.0002 8.7373 13.6571 10.0804 12.0002 10.0804C10.3434 10.0804 9.00024 8.7373 9.00024 7.08044C9.00024 5.42359 10.3434 4.08044 12.0002 4.08044C13.6571 4.08044 15.0002 5.42359 15.0002 7.08044ZM21.0002 10.0804C21.0002 11.3231 19.9929 12.3304 18.7502 12.3304C17.5076 12.3304 16.5002 11.3231 16.5002 10.0804C16.5002 8.8378 17.5076 7.83044 18.7502 7.83044C19.9929 7.83044 21.0002 8.8378 21.0002 10.0804ZM7.50024 10.0804C7.50024 11.3231 6.49288 12.3304 5.25024 12.3304C4.0076 12.3304 3.00024 11.3231 3.00024 10.0804C3.00024 8.8378 4.0076 7.83044 5.25024 7.83044C6.49288 7.83044 7.50024 8.8378 7.50024 10.0804Z"
									stroke="#F9FAFB"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
						Membership
					</div>
				</a>
				<!-- End of Membership -->
			{/if}
		{/if}

		<p class="mt-auto text-xs text-center">Powered by GreenTeams</p>
	</nav>

	<!-- Sidebar Toggle -->
	{#if isLogin}
		<button
			on:click={sidebarOpen}
			class="bg-gt-color-dark border-white absolute text-dark-purple rounded-full text-3xl -right-5 top-1/2 z-20 w-10 h-10 cursor-pointer justify-center items-center flex"
		>
			<span class="text-gt-color-gray {sidebarvisible ? 'rotate-180' : 'ml-3'} ">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					aria-hidden="true"
					class="w-5 h-3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
				</svg>
			</span>
		</button>
	{/if}
	<!-- End of Sidebar Toggle -->
</div>
<!-- End of Sidebar -->

{#if showLoginModal}
	<LoginModal {handleClose} />
{/if}

<slot />

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-50%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-50%);
		}
	}

	.fade-in {
		animation: fadeIn 0.2s ease-in-out;
	}

	.fade-out {
		animation: fadeOut 0.2s ease-in-out;
	}
</style>
