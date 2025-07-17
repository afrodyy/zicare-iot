<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import LoginModal from './LoginModal.svelte';
	import { isPm25App, currentUrl, showModeling } from '$lib/index';
	import Swal from 'sweetalert2';

	export let handleModeling = () => {};

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

	function handleAcl(role) {
		profileDropdownOpen = !profileDropdownOpen;

		if (role === 'super-admin') {
			localStorage.setItem('role', 'super-admin');
		} else if (role === 'admin') {
			localStorage.setItem('role', 'admin');
		}

		getUserRole();
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

		<!-- <button
			on:click={handleModeling}
			type="button"
			class="flex flex-row w-48 gap-4 p-3 mt-auto mb-3 rounded-lg text-start items-center leading-tight transition-all hover:bg-gt-color-primary hover:bg-opacity-80 {$showModeling
				? 'bg-gt-color-primary bg-opacity-80 text-gt-color-gray-3'
				: ''}
        hover:text-gt-color-gray-3 focus:text-gt-color-gray-3 outline-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="#F9FAFB"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
				/>
			</svg>

			Modeling
		</button> -->
		<p class="mt-auto text-xs text-center">Powered by GreenTeams</p>
	</nav>

	<!-- Bottom Logo -->
	<!-- <div class="relative w-48 pt-8 px-4 mb-5 mx-auto bottom-1">
		<div class="text-xs font-normal text-gt-color-gray mb-3">
			<label for="" class="">POWERED BY</label>
		</div>
		<div class="text-sm text-gt-color-gray">
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="105"
					height="33"
					viewBox="0 0 105 33"
					fill="none"
				>
					<g clip-path="url(#clip0_5178_30971)">
						<path
							d="M40.448 20.9602C41.1628 20.9602 41.778 20.8401 42.2942 20.5998C42.8099 20.3596 43.3489 19.9758 43.912 19.4485L45.2485 20.8201C43.9472 22.2621 42.3681 22.9828 40.5101 22.9828C38.6521 22.9828 37.1104 22.3852 35.8858 21.1893C34.6606 19.994 34.0483 18.4817 34.0483 16.6529C34.0483 14.8242 34.6724 13.3008 35.921 12.0815C37.169 10.8627 38.7458 10.2527 40.6507 10.2527C42.5556 10.2527 44.1464 10.9559 45.4243 12.3627L44.1054 13.8041C43.5188 13.2416 42.9651 12.849 42.4437 12.6264C41.9222 12.4037 41.3099 12.2924 40.6062 12.2924C39.3634 12.2924 38.3204 12.6938 37.4767 13.4965C36.6329 14.2992 36.2105 15.3252 36.2105 16.5733C36.2105 17.8213 36.6294 18.8649 37.4673 19.7027C38.3052 20.5412 39.2983 20.9602 40.4474 20.9602H40.448Z"
							fill="#F9FAFB"
						/>
						<path
							d="M59.929 10.5515V12.5033H53.3706V15.7558H59.2605V17.6021H53.3706V20.8898H60.1399V22.8416H51.2964V10.5515H59.929Z"
							fill="#F9FAFB"
						/>
						<path
							d="M70.9528 12.4506V22.8416H68.878V12.4506H65.1509V10.5515H74.6806V12.4506H70.9528Z"
							fill="#F9FAFB"
						/>
						<path
							d="M85.0886 12.4506V22.8416H83.0138V12.4506H79.2866V10.5515H88.8163V12.4506H85.0886Z"
							fill="#F9FAFB"
						/>
						<path
							d="M95.3565 20.0461L94.1261 22.8416H91.9106L97.3259 10.5515H99.5413L104.957 22.8416H102.741L101.511 20.0461H95.3565ZM100.667 18.1295L98.4339 13.0658L96.2009 18.1295H100.667Z"
							fill="#F9FAFB"
						/>
						<path d="M36.0693 25.9412H36.5797V27.7723H36.0693V25.9412Z" fill="#F9FAFB" />
						<path
							d="M37.8846 26.3859H37.335V25.9412H38.941V26.3859H38.3914V27.7723H37.884V26.3859H37.8846Z"
							fill="#F9FAFB"
						/>
						<path
							d="M40.7951 27.5004L41.0775 27.1629C41.258 27.307 41.4596 27.3826 41.6711 27.3826C41.807 27.3826 41.8803 27.3357 41.8803 27.2572V27.252C41.8803 27.1758 41.8199 27.1342 41.5715 27.0768C41.1818 26.9877 40.8807 26.8781 40.8807 26.5014V26.4961C40.8807 26.1562 41.1502 25.9102 41.5896 25.9102C41.9008 25.9102 42.1445 25.9939 42.3432 26.1533L42.0895 26.5119C41.9219 26.3941 41.7391 26.3314 41.5768 26.3314C41.4537 26.3314 41.3934 26.3836 41.3934 26.4492V26.4545C41.3934 26.5383 41.4561 26.5746 41.7098 26.6326C42.1311 26.724 42.3924 26.86 42.3924 27.2027V27.208C42.3924 27.5818 42.0971 27.8045 41.6518 27.8045C41.3271 27.8045 41.0189 27.7025 40.7939 27.501L40.7951 27.5004Z"
							fill="#F9FAFB"
						/>
						<path
							d="M43.0986 26.8623V26.8571C43.0986 26.3315 43.5223 25.9049 44.0877 25.9049C44.6531 25.9049 45.0715 26.3262 45.0715 26.8518V26.8571C45.0715 27.3826 44.6479 27.8092 44.0824 27.8092C43.517 27.8092 43.0986 27.3879 43.0986 26.8623ZM44.5529 26.8623V26.8571C44.5529 26.5928 44.3619 26.3625 44.0818 26.3625C43.8018 26.3625 43.6189 26.5875 43.6189 26.8518V26.8571C43.6189 27.1213 43.81 27.3516 44.0871 27.3516C44.3643 27.3516 44.5529 27.1266 44.5529 26.8623Z"
							fill="#F9FAFB"
						/>
						<path
							d="M45.858 25.9412H46.3654V27.3276H47.252V27.7723H45.8574V25.9412H45.858Z"
							fill="#F9FAFB"
						/>
						<path
							d="M47.916 26.9695V25.9412H48.4316V26.959C48.4316 27.2233 48.5652 27.3486 48.7691 27.3486C48.973 27.3486 49.1066 27.2285 49.1066 26.9719V25.9412H49.6223V26.9561C49.6223 27.5473 49.2848 27.8063 48.7645 27.8063C48.2441 27.8063 47.9172 27.542 47.9172 26.969L47.916 26.9695Z"
							fill="#F9FAFB"
						/>
						<path
							d="M50.8919 26.3859H50.3423V25.9412H51.9483V26.3859H51.3987V27.7723H50.8913V26.3859H50.8919Z"
							fill="#F9FAFB"
						/>
						<path d="M52.7041 25.9412H53.2145V27.7723H52.7041V25.9412Z" fill="#F9FAFB" />
						<path
							d="M54.0093 26.8623V26.8571C54.0093 26.3315 54.4329 25.9049 54.9983 25.9049C55.5638 25.9049 55.9821 26.3262 55.9821 26.8518V26.8571C55.9821 27.3826 55.5585 27.8092 54.9931 27.8092C54.4276 27.8092 54.0093 27.3879 54.0093 26.8623ZM55.4636 26.8623V26.8571C55.4636 26.5928 55.2726 26.3625 54.9925 26.3625C54.7124 26.3625 54.5296 26.5875 54.5296 26.8518V26.8571C54.5296 27.1213 54.7206 27.3516 54.9978 27.3516C55.2749 27.3516 55.4636 27.1266 55.4636 26.8623Z"
							fill="#F9FAFB"
						/>
						<path
							d="M56.7681 25.9412H57.2415L57.995 26.9092V25.9412H58.4972V27.7723H58.0524L57.2702 26.768V27.7723H56.7681V25.9412Z"
							fill="#F9FAFB"
						/>
						<path
							d="M61.6826 27.6182C61.5285 27.736 61.3504 27.8039 61.1383 27.8039C60.7644 27.8039 60.4844 27.6076 60.4844 27.2754V27.2701C60.4844 27.0422 60.6074 26.8699 60.8559 26.7574C60.7721 26.6373 60.7357 26.5242 60.7357 26.4071V26.4018C60.7357 26.1352 60.9531 25.9049 61.3111 25.9049C61.6434 25.9049 61.8555 26.1088 61.8555 26.376V26.3813C61.8555 26.6063 61.7113 26.758 61.4969 26.8576L61.7008 27.0563C61.7611 26.9701 61.8186 26.8705 61.8736 26.7662L62.2082 26.9338C62.1326 27.0727 62.0541 27.2033 61.9674 27.3211L62.2135 27.5643L61.8707 27.8104L61.682 27.6194L61.6826 27.6182ZM61.4236 27.3516L61.123 27.0457C61.0316 27.1008 60.9924 27.1711 60.9924 27.2444V27.2496C60.9924 27.3569 61.0814 27.4301 61.2068 27.4301C61.2801 27.4301 61.3533 27.3985 61.4242 27.3516H61.4236ZM61.4523 26.4047V26.3994C61.4523 26.3104 61.3949 26.253 61.3111 26.253C61.2273 26.253 61.1646 26.3186 61.1646 26.4153V26.4205C61.1646 26.4914 61.1963 26.5512 61.259 26.6297C61.3896 26.5723 61.4523 26.5014 61.4523 26.4047Z"
							fill="#F9FAFB"
						/>
						<path
							d="M64.0485 27.5004L64.331 27.1629C64.5114 27.307 64.713 27.3826 64.9245 27.3826C65.0605 27.3826 65.1337 27.3357 65.1337 27.2572V27.252C65.1337 27.1758 65.0733 27.1342 64.8249 27.0768C64.4353 26.9877 64.1341 26.8781 64.1341 26.5014V26.4961C64.1341 26.1562 64.4036 25.9102 64.8431 25.9102C65.1542 25.9102 65.398 25.9939 65.5966 26.1533L65.3429 26.5119C65.1753 26.3941 64.9925 26.3314 64.8302 26.3314C64.7071 26.3314 64.6468 26.3836 64.6468 26.4492V26.4545C64.6468 26.5383 64.7095 26.5746 64.9632 26.6326C65.3845 26.724 65.6458 26.86 65.6458 27.2027V27.208C65.6458 27.5818 65.3505 27.8045 64.9052 27.8045C64.5806 27.8045 64.2724 27.7025 64.0474 27.501L64.0485 27.5004Z"
							fill="#F9FAFB"
						/>
						<path
							d="M66.3521 26.8623V26.8571C66.3521 26.3315 66.7757 25.9049 67.3411 25.9049C67.9065 25.9049 68.3249 26.3262 68.3249 26.8518V26.8571C68.3249 27.3826 67.9013 27.8092 67.3358 27.8092C66.7704 27.8092 66.3521 27.3879 66.3521 26.8623ZM67.8063 26.8623V26.8571C67.8063 26.5928 67.6153 26.3625 67.3352 26.3625C67.0552 26.3625 66.8724 26.5875 66.8724 26.8518V26.8571C66.8724 27.1213 67.0634 27.3516 67.3405 27.3516C67.6177 27.3516 67.8063 27.1266 67.8063 26.8623Z"
							fill="#F9FAFB"
						/>
						<path
							d="M69.1118 25.9412H70.5767V26.3859H69.6192V26.6971H70.4853V27.1184H69.6192V27.7723H69.1118V25.9412Z"
							fill="#F9FAFB"
						/>
						<path
							d="M71.7762 26.3859H71.2266V25.9412H72.8326V26.3859H72.283V27.7723H71.7756V26.3859H71.7762Z"
							fill="#F9FAFB"
						/>
						<path
							d="M73.4552 25.9412H73.9913L74.3106 27.0006L74.664 25.936H75.1011L75.4544 27.0006L75.7737 25.9412H76.2993L75.687 27.7858H75.2446L74.8755 26.7317L74.5093 27.7858H74.0669L73.4546 25.9412H73.4552Z"
							fill="#F9FAFB"
						/>
						<path
							d="M77.4205 25.9284H77.9098L78.6896 27.7729H78.1453L78.0117 27.446H77.3051L77.1744 27.7729H76.6406L77.4205 25.9284ZM77.8646 27.0504L77.6607 26.5301L77.4539 27.0504H77.8646Z"
							fill="#F9FAFB"
						/>
						<path
							d="M79.3892 25.9412H80.2552C80.5352 25.9412 80.7286 26.0145 80.8517 26.1399C80.9589 26.2447 81.014 26.3859 81.014 26.5664V26.5717C81.014 26.8518 80.8645 27.0375 80.6372 27.1342L81.0743 27.7723H80.4884L80.1198 27.2174H79.8972V27.7723H79.3897V25.9412H79.3892ZM80.2312 26.8207C80.404 26.8207 80.503 26.7369 80.503 26.6033V26.5981C80.503 26.4539 80.3981 26.3807 80.2282 26.3807H79.896V26.8201H80.2306L80.2312 26.8207Z"
							fill="#F9FAFB"
						/>
						<path
							d="M81.7915 25.9412H83.2645V26.3731H82.2942V26.6502H83.1731V27.0504H82.2942V27.341H83.278V27.7729H81.7921V25.9418L81.7915 25.9412Z"
							fill="#F9FAFB"
						/>
						<path
							d="M85.3071 25.9412H86.0923C86.5552 25.9412 86.8534 26.1791 86.8534 26.5846V26.5899C86.8534 27.0217 86.5212 27.249 86.0659 27.249H85.8145V27.7723H85.3071V25.9412ZM86.0554 26.8518C86.2358 26.8518 86.346 26.7574 86.346 26.6139V26.6086C86.346 26.4516 86.2358 26.3678 86.053 26.3678H85.8151V26.8518H86.056H86.0554Z"
							fill="#F9FAFB"
						/>
						<path
							d="M87.5898 25.9412H88.4559C88.7359 25.9412 88.9293 26.0145 89.0523 26.1399C89.1596 26.2447 89.2146 26.3859 89.2146 26.5664V26.5717C89.2146 26.8518 89.0652 27.0375 88.8379 27.1342L89.275 27.7723H88.6891L88.3205 27.2174H88.0979V27.7723H87.5904V25.9412H87.5898ZM88.4324 26.8207C88.6053 26.8207 88.7043 26.7369 88.7043 26.6033V26.5981C88.7043 26.4539 88.5994 26.3807 88.4295 26.3807H88.0973V26.8201H88.4318L88.4324 26.8207Z"
							fill="#F9FAFB"
						/>
						<path
							d="M89.9307 26.8623V26.8571C89.9307 26.3315 90.3543 25.9049 90.9197 25.9049C91.4852 25.9049 91.9035 26.3262 91.9035 26.8518V26.8571C91.9035 27.3826 91.4799 27.8092 90.9145 27.8092C90.349 27.8092 89.9307 27.3879 89.9307 26.8623ZM91.385 26.8623V26.8571C91.385 26.5928 91.1939 26.3625 90.9139 26.3625C90.6338 26.3625 90.451 26.5875 90.451 26.8518V26.8571C90.451 27.1213 90.642 27.3516 90.9191 27.3516C91.1963 27.3516 91.385 27.1266 91.385 26.8623Z"
							fill="#F9FAFB"
						/>
						<path
							d="M92.4253 25.9412H92.9931L93.4091 27.1002L93.8251 25.9412H94.3823L93.6394 27.7858H93.1683L92.4253 25.9412Z"
							fill="#F9FAFB"
						/>
						<path d="M95.0923 25.9412H95.6026V27.7723H95.0923V25.9412Z" fill="#F9FAFB" />
						<path
							d="M96.4604 25.9412H97.1671C97.821 25.9412 98.2007 26.318 98.2007 26.8465V26.8518C98.2007 27.3803 97.8163 27.7729 97.1571 27.7729H96.461V25.9418L96.4604 25.9412ZM97.1747 27.3229C97.4782 27.3229 97.6798 27.1553 97.6798 26.86V26.8547C97.6798 26.5617 97.4782 26.3918 97.1747 26.3918H96.9679V27.3229H97.1747Z"
							fill="#F9FAFB"
						/>
						<path
							d="M98.9834 25.9412H100.456V26.3731H99.4861V26.6502H100.365V27.0504H99.4861V27.341H100.47V27.7729H98.984V25.9418L98.9834 25.9412Z"
							fill="#F9FAFB"
						/>
						<path
							d="M101.251 25.9412H102.117C102.398 25.9412 102.591 26.0145 102.714 26.1399C102.821 26.2447 102.876 26.3859 102.876 26.5664V26.5717C102.876 26.8518 102.727 27.0375 102.5 27.1342L102.937 27.7723H102.351L101.982 27.2174H101.759V27.7723H101.252V25.9412H101.251ZM102.093 26.8207C102.266 26.8207 102.365 26.7369 102.365 26.6033V26.5981C102.365 26.4539 102.26 26.3807 102.091 26.3807H101.758V26.8201H102.093L102.093 26.8207Z"
							fill="#F9FAFB"
						/>
						<path
							d="M18.7012 32.9999C17.8082 32.9999 16.9182 32.8822 16.0545 32.6372C14.6606 32.2417 12.2325 31.1619 10.286 28.2585C7.92582 28.5128 5.55101 27.9228 3.34789 25.6622C-0.758947 21.447 -1.07711 14.6255 2.60785 9.79388C5.06 6.57826 7.46058 5.46029 9.73695 5.42162C11.2481 2.99056 13.1688 1.86556 14.6102 1.34584C18.5453 -0.0738893 23.3459 1.38158 26.0243 4.80521C26.7778 5.76849 27.0889 7.01713 26.878 8.23236C26.6723 9.41654 25.9827 10.4572 24.9848 11.087C22.1659 12.8665 19.2186 11.1544 16.3686 9.49799C14.4368 8.37592 12.5553 7.28256 10.637 7.04994C9.53012 9.20912 8.76371 12.3843 8.89613 17.056C9.00512 20.9126 9.76683 24.1294 11.0899 26.5365C13.1887 26.0923 15.3391 24.9556 17.4549 23.8365C20.8082 22.0628 23.9752 20.3888 26.5698 21.8771C27.5477 22.4378 28.2332 23.3642 28.5004 24.4845C28.7887 25.6921 28.5561 26.99 27.8623 28.0447C25.825 31.1431 22.2461 32.9988 18.7012 32.9994V32.9999ZM11.9922 27.938C13.1852 29.5206 14.6969 30.6046 16.4875 31.1132C20.1321 32.148 24.3584 30.4915 26.5387 27.1751C26.9934 26.4831 27.1469 25.637 26.96 24.8525C26.7953 24.1611 26.377 23.5927 25.7817 23.2511C23.9442 22.197 21.1516 23.6736 18.1955 25.2369C16.2784 26.2505 14.1614 27.3703 11.9922 27.938ZM8.86039 7.10267C7.25551 7.4097 5.60726 8.47201 3.86703 10.7542C0.65492 14.9665 0.919177 20.9003 4.48226 24.5566C6.03793 26.1533 7.6932 26.7556 9.39945 26.7304C8.26508 24.4605 7.43304 21.3533 7.31293 17.1011C7.18754 12.6644 7.8432 9.44232 8.86039 7.10267ZM11.5317 5.60209C13.5485 6.02748 15.4446 7.12963 17.1649 8.12924C19.8303 9.67787 22.1325 11.0161 24.1399 9.74818C24.7686 9.3515 25.187 8.71693 25.3182 7.96224C25.453 7.18763 25.2555 6.39252 24.778 5.78197C22.5455 2.92845 18.4059 1.66224 15.1487 2.83646C14.0852 3.21967 12.7182 4.00365 11.5323 5.60267L11.5317 5.60209Z"
							fill="#F9FAFB"
						/>
					</g>
					<defs>
						<clipPath id="clip0_5178_30971">
							<rect
								width="104.914"
								height="32.1943"
								fill="white"
								transform="translate(0.0429688 0.805664)"
							/>
						</clipPath>
					</defs>
				</svg>
			</span>
		</div>
	</div> -->
	<!-- End of Bottom Logo -->

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
