<script>
	import { fade, fly } from 'svelte/transition';
	import { formMode, showUserModal, handleSweetAlert } from '$lib/index';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import axios from 'axios';
	import Swal from 'sweetalert2';

	export let selectedUser;
	export let roles;

	let passwordField;
	let passwordVisible = false;
	let passwordConfirmationField;
	let passwordConfirmationVisible = false;

	$: showRoles = false;
	$: filteredRoles = roles;
	$: selectedRole = {};

	$: username = '';
	$: name = '';
	$: role = '';
	$: email = '';
	$: password = '';
	$: passwordConfirmation = '';
	$: phone = '';
	$: address = '';
	$: payload = {};

	let dropdownRoleEl;

	$: if (showRoles) {
		if (dropdownRoleEl !== undefined && dropdownRoleEl !== null) {
			dropdownRoleEl.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}
	}

	const createUser = async () => {
		Swal.fire({
			title: 'Apakah data yang diinput sudah sesuai?',
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Ya',
			cancelButtonText: 'Tidak',
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				title: 'font-medium text-lg text-gt-color-gray',
				confirmButton:
					'bg-gt-color-dark-3-transparent hover:bg-gt-color-dark-3-transparent text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150',
				cancelButton:
					'bg-gt-color-primary hover:bg-gt-color-primary-hover text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				if (payload.password === passwordConfirmation) {
					try {
						const response = await axios.post('/api/auth/register', payload, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem('accessToken')}`
							}
						});

						if (response.status === 200) {
							const message = response.data.message;
							handleSweetAlert('success', message);
						}
					} catch (error) {
						const response = error.response;

						if (response) {
							const message = response.data.message;

							if (response.status === 400 || response.status === 422) {
								handleSweetAlert('error', message);
							} else if (response.status === 500) {
								handleSweetAlert('error', message);
							}
						}
					}
				} else {
					handleSweetAlert('info', 'Kolom Password Confirmation harus sama dengan kolom Password.');
				}
			}
		});
	};

	const updateUser = async () => {
		Swal.fire({
			title: 'Apakah data yang diinput sudah sesuai?',
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Ya',
			cancelButtonText: 'Tidak',
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				title: 'font-medium text-lg text-gt-color-gray',
				confirmButton:
					'bg-gt-color-dark-3-transparent hover:bg-gt-color-dark-3-transparent text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150',
				cancelButton:
					'bg-gt-color-primary hover:bg-gt-color-primary-hover text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				if (payload.password && payload.password !== passwordConfirmation) {
					handleSweetAlert('info', 'Kolom Password Confirmation harus sama dengan kolom Password.');
					return;
				}

				try {
					const response = await axios.put('/api/auth/user', payload, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
							'Content-Type': 'application/json'
						},
						params: {
							id: selectedUser.id
						}
					});

					if (response.status === 200) {
						const message = response.data.message;
						handleSweetAlert('success', message);
					}
				} catch (error) {
					const response = error.response;
					console.error(error);

					if (response) {
						const message = response.data.error || response.data;
						const errorStatuses = [400, 404, 422, 405];
						if (errorStatuses.includes(response.status)) {
							handleSweetAlert('error', message);
						}
					}
				}
			}
		});
	};

	function togglePasswordVisibility(confirmation = false) {
		if (confirmation) {
			passwordConfirmationVisible = !passwordConfirmationVisible;
			passwordConfirmationField.type = passwordConfirmationVisible ? 'text' : 'password';
		} else {
			passwordVisible = !passwordVisible;
			passwordField.type = passwordVisible ? 'text' : 'password';
		}
	}

	function handleKeyDown(event, type) {
		if (event.key === 'Enter') {
			togglePasswordVisibility();
		} else if (event.key === 'Escape') {
			handleClose(type, false);
		}
	}

	function searchRole(event) {
		const query = event.target.value;
		filteredRoles = roles.filter((role) => role.role.toLowerCase().includes(query.toLowerCase()));
	}

	onMount(async () => {
		if ($formMode === 'update') {
			username = selectedUser.username;
			name = selectedUser.name;
			role = selectedUser.role;
			email = selectedUser.email;
			phone = selectedUser.phone;
			address = selectedUser.address;
		}
	});

	afterUpdate(() => {
		// Initialize payload with common fields
		payload = {
			username,
			name,
			role,
			email
		};

		// Add fields conditionally
		if ($formMode === 'create') {
			payload.password = password;
		} else {
			if (password) payload.password = password;
		}

		if (phone) payload.phone = phone;
		if (address) payload.address = address;
	});

	onDestroy(() => {
		$formMode = '';
		selectedUser = null;
		payload = null;
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="relative z-50"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div class="fixed inset-0 bg-black/45 transition-opacity" aria-hidden="true"></div>

	<div
		transition:fly={{ y: 200, duration: 300 }}
		class="fixed inset-0 z-10 w-screen overflow-y-auto"
	>
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-lg border border-gt-color-dark-3-transparent text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl"
			>
				<!-- Header -->
				<div
					class="flex flex-row h-16 gap-2 px-4 py-3 bg-gt-color-dark border-b border-gt-color-dark-3-transparent items-center"
				>
					{#if $formMode === 'create'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
							/>
						</svg>
					{/if}

					{#if $formMode === 'read'}
						<span class="font-normal">Detail User</span>
					{:else if $formMode === 'create'}
						<span class="font-normal">Tambah Data User</span>
					{:else if $formMode === 'update'}
						<span class="font-normal">Ubah Data User</span>
					{/if}
				</div>
				<!-- End of Header -->

				<!-- Body -->
				<div class="bg-gt-color-dark-5 p-3 max-h-[600px] 2xl:max-h-[680px] overflow-auto scrollbar">
					<div
						class="flex flex-col gap-3 bg-gt-color-dark p-6 rounded-md border border-gt-color-dark-3-transparent"
					>
						{#if $formMode === 'create'}
							<!-- Username -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="username" class="font-normal text-sm text-gt-color-gray capitalize"
									>Username <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={username}
									type="text"
									name="username"
									id="username"
									class="bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: johndoe"
									autocomplete="off"
								/>
							</div>
							<!-- End of Username -->

							<!-- Nama Lengkap -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="name" class="font-normal text-sm text-gt-color-gray capitalize"
									>Nama Lengkap <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={name}
									type="text"
									name="name"
									id="name"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: John Doe"
									autocomplete="off"
								/>
							</div>
							<!-- End of Nama Lengkap -->

							<!-- Role -->
							<div class="flex flex-col gap-2 pb-1">
								<span class="font-normal text-sm text-gt-color-gray capitalize"
									>role <span class="text-xs text-red-500">*</span></span
								>

								<div class="relative">
									<button
										on:click={() => (showRoles = !showRoles)}
										type="button"
										class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									>
										<span>{!role ? 'Pilih hak akses pengguna' : role}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="size-4 text-zicare-text-lightgray {showRoles
												? 'rotate-180'
												: ''} ease-in-out duration-150"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>

									{#if showRoles}
										<div
											bind:this={dropdownRoleEl}
											transition:fly={{ y: 25, duration: 150 }}
											class="absolute left-0 z-20 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="menu-button"
											tabindex="-1"
										>
											<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
												<!-- Input untuk pencarian -->
												<input
													on:input={(e) => searchRole(e)}
													type="text"
													name="search-city"
													id="search-city"
													class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
													placeholder="Pencarian..."
													autocomplete="off"
												/>
											</div>

											<div class="py-1" role="none">
												{#if filteredRoles.length > 0}
													{#each filteredRoles as item, index}
														<!-- svelte-ignore a11y-invalid-attribute -->
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<a
															in:fade={{ duration: 200 }}
															on:click={() => ((role = item.role), (showRoles = false))}
															class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
															role="menuitem"
															tabindex="-1"
															id={'role-' + (index + 1)}>{item.role}</a
														>
													{/each}
												{:else}
													<span
														in:fade={{ duration: 200 }}
														class="block self-center mb-2 text-sm text-gt-color-gray text-center"
														>Data hak akses tidak ditemukan</span
													>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							</div>
							<!-- End of Role -->

							<!-- Email -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="email" class="font-normal text-sm text-gt-color-gray capitalize"
									>Email <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={email}
									type="email"
									name="email"
									id="email"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: johndoe@gmail.com"
									autocomplete="off"
								/>
							</div>
							<!-- End of Email -->

							<!-- No. Telepon -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="phone" class="font-normal text-sm text-gt-color-gray capitalize"
									>No. Telepon</label
								>

								<input
									bind:value={phone}
									type="text"
									name="phone"
									id="phone"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: 081234567890"
									autocomplete="off"
								/>
							</div>
							<!-- End of No. Telepon -->

							<!-- Address -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="address" class="font-normal text-sm text-gt-color-gray capitalize"
									>Address</label
								>

								<textarea
									bind:value={address}
									name="address"
									id="address"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: Jl. Raya Antasari no.52 RT 04/05 Cilandak Barat, Cilandak, Jakarta Selatan"
									autocomplete="off"
								></textarea>
							</div>
							<!-- End of Address -->

							<!-- Password -->
							<div class="relative flex flex-col gap-2 pb-1">
								<label for="password" class="font-normal text-sm text-gt-color-gray capitalize"
									>Password <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:this={passwordField}
									bind:value={password}
									type="password"
									name="password"
									id="password"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									autocomplete="off"
								/>
								{#if passwordVisible}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility()}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								{:else}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility()}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								{/if}
							</div>
							<!-- End of Password -->

							<!-- Password Confirmation -->
							<div class="relative flex flex-col gap-2 pb-1">
								<label
									for="passwordConfirmation"
									class="font-normal text-sm text-gt-color-gray capitalize"
									>Password Confirmation <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:this={passwordConfirmationField}
									bind:value={passwordConfirmation}
									type="password"
									name="passwordConfirmation"
									id="passwordConfirmation"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									autocomplete="off"
								/>
								{#if passwordConfirmationVisible}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility(true)}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								{:else}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility(true)}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								{/if}
							</div>
							<!-- End of Password Confirmation -->
						{:else if $formMode === 'update'}
							<!-- Username -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="username" class="font-normal text-sm text-gt-color-gray capitalize"
									>Username <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={username}
									type="text"
									name="username"
									id="username"
									class="bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: johndoe"
									autocomplete="off"
								/>
							</div>
							<!-- End of Username -->

							<!-- Nama Lengkap -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="name" class="font-normal text-sm text-gt-color-gray capitalize"
									>Nama Lengkap <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={name}
									type="text"
									name="name"
									id="name"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: John Doe"
									autocomplete="off"
								/>
							</div>
							<!-- End of Nama Lengkap -->

							<!-- Role -->
							<div class="flex flex-col gap-2 pb-1">
								<span class="font-normal text-sm text-gt-color-gray capitalize"
									>role <span class="text-xs text-red-500">*</span></span
								>

								<div class="relative">
									<button
										on:click={() => (showRoles = !showRoles)}
										type="button"
										class="flex flex-row w-full justify-between items-center bg-transparent px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									>
										<span>{!role ? 'Pilih hak akses pengguna' : role}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="size-4 text-zicare-text-lightgray {showRoles
												? 'rotate-180'
												: ''} ease-in-out duration-150"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>

									{#if showRoles}
										<div
											bind:this={dropdownRoleEl}
											transition:fly={{ y: 25, duration: 150 }}
											class="absolute left-0 z-20 w-full mt-px max-h-56 overflow-y-auto origin-top-left rounded-lg bg-gt-color-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gt-color-dark-3-transparent scrollbar"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="menu-button"
											tabindex="-1"
										>
											<div class="sticky top-0 z-20 bg-gt-color-dark p-2">
												<!-- Input untuk pencarian -->
												<input
													on:input={(e) => searchRole(e)}
													type="text"
													name="search-city"
													id="search-city"
													class="w-full h-8 p-2 rounded-md bg-gt-color-dark font-light text-sm text-white placeholder:text-sm focus:outline-none border border-gt-color-dark-3-transparent"
													placeholder="Pencarian..."
													autocomplete="off"
												/>
											</div>

											<div class="py-1" role="none">
												{#if filteredRoles.length > 0}
													{#each filteredRoles as item, index}
														<!-- svelte-ignore a11y-invalid-attribute -->
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<a
															in:fade={{ duration: 200 }}
															on:click={() => ((role = item.role), (showRoles = false))}
															class="block px-4 py-2 mx-1 text-sm text-gt-color-gray hover:bg-gt-color-dark-3-transparent hover:cursor-pointer rounded-lg ease-in-out duration-100"
															role="menuitem"
															tabindex="-1"
															id={'role-' + (index + 1)}>{item.role}</a
														>
													{/each}
												{:else}
													<span
														in:fade={{ duration: 200 }}
														class="block self-center mb-2 text-sm text-gt-color-gray text-center"
														>Data hak akses tidak ditemukan</span
													>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							</div>
							<!-- End of Role -->

							<!-- Email -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="email" class="font-normal text-sm text-gt-color-gray capitalize"
									>Email <span class="text-xs text-red-500">*</span></label
								>

								<input
									bind:value={email}
									type="email"
									name="email"
									id="email"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: johndoe@gmail.com"
									autocomplete="off"
								/>
							</div>
							<!-- End of Email -->

							<!-- No. Telepon -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="phone" class="font-normal text-sm text-gt-color-gray capitalize"
									>No. Telepon</label
								>

								<input
									bind:value={phone}
									type="text"
									name="phone"
									id="phone"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: 081234567890"
									autocomplete="off"
								/>
							</div>
							<!-- End of No. Telepon -->

							<!-- Address -->
							<div class="flex flex-col gap-2 pb-1">
								<label for="address" class="font-normal text-sm text-gt-color-gray capitalize"
									>Address</label
								>

								<textarea
									bind:value={address}
									name="address"
									id="address"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									placeholder="Cth: Jl. Raya Antasari no.52 RT 04/05 Cilandak Barat, Cilandak, Jakarta Selatan"
									autocomplete="off"
								></textarea>
							</div>
							<!-- End of Address -->

							<!-- Password -->
							<div class="relative flex flex-col gap-2 pb-1">
								<label for="password" class="font-normal text-sm text-gt-color-gray capitalize"
									>Password</label
								>

								<input
									bind:this={passwordField}
									bind:value={password}
									type="password"
									name="password"
									id="password"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									autocomplete="off"
								/>
								{#if passwordVisible}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility()}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								{:else}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility()}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								{/if}
							</div>
							<!-- End of Password -->

							<!-- Password Confirmation -->
							<div class="relative flex flex-col gap-2 pb-1">
								<label
									for="passwordConfirmation"
									class="font-normal text-sm text-gt-color-gray capitalize"
									>Password Confirmation</label
								>

								<input
									bind:this={passwordConfirmationField}
									bind:value={passwordConfirmation}
									type="password"
									name="passwordConfirmation"
									id="passwordConfirmation"
									class="{$formMode
										? 'bg-transparent'
										: 'bg-gt-color-dark-3-transparent'} px-3 py-2.5 rounded-md border border-gt-color-dark-3-transparent font-light text-sm text-gt-color-gray focus:ring-1 outline-none focus:ring-indigo-300 focus:shadow-md focus:shadow-indigo-300/40 ease-in-out duration-150"
									autocomplete="off"
								/>
								{#if passwordConfirmationVisible}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility(true)}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
								{:else}
									<svg
										in:fade={{ duration: 200 }}
										on:click={() => togglePasswordVisibility(true)}
										on:keydown={handleKeyDown}
										role="button"
										tabindex="0"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mb-4 mx-3 focus:outline-none"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								{/if}
							</div>
							<!-- End of Password Confirmation -->
						{/if}
					</div>
				</div>
				<!-- End of Body -->

				<!-- Footer -->
				<div class="flex flex-row-reverse gap-3 px-4 py-3 bg-gt-color-dark">
					{#if $formMode === 'create'}
						<button
							on:click={() => createUser()}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-primary hover:bg-gt-color-primary-hover px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm sm:mt-0 sm:w-auto ease-in-out duration-150"
							>Simpan</button
						>
					{:else if $formMode === 'update'}
						<button
							on:click={() => updateUser()}
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-primary hover:bg-gt-color-primary-hover px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm sm:mt-0 sm:w-auto ease-in-out duration-150"
							>Simpan</button
						>
					{/if}

					<button
						on:click={() => ($showUserModal = false)}
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-gt-color-dark-3-transparent px-3 py-2 text-sm font-normal text-gt-color-gray shadow-sm hover:bg-gt-color-dark-2 sm:mt-0 sm:w-auto ease-in-out duration-150"
						>Tutup</button
					>
				</div>
				<!-- End of Footer -->
			</div>
		</div>
	</div>
</div>
