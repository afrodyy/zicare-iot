<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { jwtDecode } from 'jwt-decode';
	import { isLoading } from '$lib/index';
	import { fade, fly } from 'svelte/transition';

	export let handleClose = () => {};

	let username = '';
	let password = '';
	let passwordVisible = true;
	let passwordField;
	let validations = '';

	function togglePasswordVisibility() {
		passwordVisible = !passwordVisible;
		passwordField.type = passwordVisible ? 'text' : 'password';
	}

	function handleKeyDown(event, type) {
		if (event.key === 'Enter') {
			togglePasswordVisibility();
		} else if (event.key === 'Escape') {
			handleClose(type, false);
		}
	}

	const handleLogin = async () => {
		$isLoading = true;

		setTimeout(async () => {
			try {
				const response = await axios.post(
					'/api/auth/login',
					{
						username,
						password
					},
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				);

				const accessToken = response.data.accessToken;
				const decodedToken = jwtDecode(accessToken);

				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('username', username);
				localStorage.setItem('role', decodedToken.role);

				$isLoading = false;
				handleClose(false, true);
				location.reload(true);
			} catch (error) {
				validations = error.response.data.error;
				$isLoading = false;
			}
		});
	};

	onMount(() => {
		togglePasswordVisibility();
	});
</script>

<div
	transition:fade={{ duration: 200 }}
	class="relative z-20"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" aria-hidden="true"></div>

	<div
		transition:fly={{ y: 350, duration: 300 }}
		on:click={handleClose(false, false)}
		on:keydown={handleKeyDown(false)}
		role="presentation"
		class="fixed inset-0 z-10 w-screen overflow-y-auto"
	>
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				role="presentation"
				on:click|stopPropagation
				class="relative transform flex flex-col gap-8 p-6 border border-gt-color-dark-3-transparent overflow-hidden rounded-lg bg-gt-color-dark text-left shadow-xl transition-all w-96"
			>
				<!-- Logo -->
				<div class="flex flex-col gap-6">
					<!-- <img src="/images/green-teams-logo.svg" class="h-14" alt="Green Teams Logo" /> -->
					<img
						src="/zicare-logo.svg"
						class="h-40 w-40 self-center -m-10 -mb-16"
						alt="Green Teams Logo"
					/>

					<div class="flex flex-col gap-1">
						<!-- <span class="font-medium text-base text-gt-color-gray text-center"
							>Welcome to Green Teams CT <br /> Monitoring Dashboard</span
						> -->
						<span class="font-medium text-sm text-gt-color-gray text-center"
							>Zicare Hospital Air Quality Monitoring System</span
						>
					</div>
				</div>
				<!-- End of Logo -->

				<!-- Form -->
				<form on:submit|preventDefault={handleLogin} class="flex flex-col gap-6">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-2">
							<label for="username" class="font-normal text-sm text-gt-color-gray">Username</label>
							<input
								bind:value={username}
								type="text"
								id="username"
								class="py-2 px-3 bg-transparent border border-gt-color-dark-3-transparent rounded-md placeholder:text-[#6B7280] placeholder:text-base placeholder:font-normal text-gt-color-gray text-base font-normal focus:outline-none focus:ring-1 focus:[#374151] transition ease-in-out duration-200"
								autocomplete="off"
							/>
						</div>

						<div class="flex flex-col gap-2 relative">
							<label for="password" class="font-normal text-sm text-gt-color-gray">Password</label>
							<input
								bind:value={password}
								bind:this={passwordField}
								id="password"
								class="py-2 px-3 bg-transparent border border-gt-color-dark-3-transparent rounded-md placeholder:text-[#6B7280] placeholder:text-base placeholder:font-normal text-gt-color-gray text-base font-normal focus:outline-none focus:ring-1 focus:[#374151] transition ease-in-out duration-200"
							/>
							{#if passwordVisible}
								<svg
									on:click={togglePasswordVisibility}
									on:keydown={handleKeyDown}
									role="button"
									tabindex="0"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mx-2 focus:outline-none"
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
									on:click={togglePasswordVisibility}
									on:keydown={handleKeyDown}
									role="button"
									tabindex="0"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="absolute bottom-0 right-0 size-4 text-gt-color-gray my-3 mx-2 focus:outline-none"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							{/if}
						</div>
						<div class="flex justify-end">
							<span class="font-light text-xs text-gt-color-bluelight-2">Forgot Password</span>
						</div>
					</div>

					<div class="flex flex-col">
						<button
							type="submit"
							class="py-2 px-7 bg-gt-color-primary hover:bg-gt-color-primary-hover rounded-md transition ease-in-out duration-200"
						>
							{#if $isLoading}
								<div in:fade={{ y: 20, duration: 150 }} class="flex flex-row items-center">
									<svg
										class="animate-spin ml-24 mr-2 h-6 w-6 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span class="font-normal text-sm text-white">LOGIN</span>
								</div>
							{:else}
								<span in:fade={{ y: 20, duration: 150 }} class="font-normal text-sm text-white"
									>LOGIN</span
								>
							{/if}
						</button>

						{#if validations}
							<span class="mt-2 font-light text-sm text-red-500 text-center">{validations}</span>
						{/if}
					</div>
				</form>
				<!-- End of Form -->
			</div>
		</div>
	</div>
</div>
