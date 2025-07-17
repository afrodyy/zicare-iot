import { writable } from 'svelte/store';
import Swal from 'sweetalert2';

export const isPm25App = writable(true);
export const currentUrl = writable();
export const mainContainerHeight = writable();
export const mainContainerWidth = writable();
export const headerHeight = writable();
export const componentsGap = writable(24);
export const isLoading = writable(false);
export const expandedAccordion = writable('');
export const ispuRankAsc = writable(false);
export const formMode = writable('read');
export const showStationModal = writable(false);
export const showUserModal = writable(false);
export const searchQuery = writable('');
export const showModeling = writable(false);

export * from './dashboardStore';
export * from './chartStore';
export * from './utilsStore';

export function handleSweetAlert(state, message, isLogout = false) {
	if (state === 'success') {
		Swal.fire({
			icon: 'success',
			text: message,
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				htmlContainer: '!font-normal !text-gt-color-gray !capitalize',
				confirmButton:
					'bg-gt-color-primary text-gt-color-gray px-4 py-1 rounded hover:bg-gt-color-primary-hover transition ease-in-out duration-150'
			}
		}).then((result) => {
			if (result.isConfirmed) {
				location.reload();
			}
		});
	} else if (state === 'error') {
		Swal.fire({
			icon: 'error',
			text: message,
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				htmlContainer: '!font-normal !text-gt-color-gray',
				confirmButton:
					'bg-red-500 text-gt-color-gray px-4 py-1 rounded hover:bg-red-600 transition ease-in-out duration-150'
			}
		});
	} else if (state === 'info') {
		Swal.fire({
			icon: 'info',
			text: message,
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				htmlContainer: '!font-normal !text-gt-color-gray',
				confirmButton:
					'bg-gt-color-primary hover:bg-gt-color-primary text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			}
		});
	} else if (state === 'warning' && isLogout) {
		Swal.fire({
			icon: 'warning',
			text: message,
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				htmlContainer: '!font-normal !text-gt-color-gray',
				confirmButton:
					'bg-gt-color-primary hover:bg-gt-color-primary text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			},
			willClose: () => {
				window.location.href = '/';
			}
		});
	} else if (state === 'warning') {
		Swal.fire({
			icon: 'warning',
			text: message,
			customClass: {
				popup: 'bg-gt-color-dark rounded-lg shadow-lg shadow-black',
				htmlContainer: '!font-normal !text-gt-color-gray',
				confirmButton:
					'bg-gt-color-primary hover:bg-gt-color-primary text-gt-color-gray px-4 py-1 rounded transition ease-in-out duration-150'
			}
		});
	}
}
