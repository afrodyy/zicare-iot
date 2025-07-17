<script>
	import moment from 'moment';

	export let mainContentHeight, selectedRoom, currentPage, entriesShown;

	function getEnvironmentalNote({ temperature, humidity, air_pressure }) {
		let score = 0;
		let notes = [];

		if (temperature >= 23 && temperature <= 26) {
			score++;
		} else {
			notes.push('Suhu tidak ideal');
		}

		if (humidity >= 45 && humidity <= 60) {
			score++;
		} else {
			notes.push('Kelembaban tidak ideal');
		}

		if (air_pressure >= 1010 && air_pressure <= 1015) {
			score++;
		} else {
			notes.push('Tekanan udara tidak ideal');
		}

		if (score === 3) return '✅ Ideal';
		if (score === 2) return `⚠️ Perlu perhatian (${notes.join(', ')})`;
		return `❌ Tidak ideal (${notes.join(', ')})`;
	}
</script>

<div
	class="w-full max-w-full overflow-y-auto scrollbar rounded-lg mb-3"
	style="height: {mainContentHeight}px;"
>
	<table class="w-full max-w-full overflow-y-auto scrollbar text-left text-gt-color-gray">
		<thead>
			<tr>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm rounded-l-lg">No.</th>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm">Waktu</th>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm">Suhu (°C)</th>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm">Kelembaban (g/m³)</th>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm">Tekanan Udara (hPa)</th>
				<th class="sticky top-0 bg-gt-color-dark-2 p-3 font-medium text-sm rounded-r-lg">Notes</th>
			</tr>
		</thead>
		<tbody>
			{#if Object.keys(selectedRoom).length > 0}
				{#each selectedRoom.data as data, index}
					<tr class="border-b border-gt-color-dark-3-transparent">
						<td class="p-3 font-light text-sm">
							{index + ((currentPage - 1) * entriesShown + 1)}.
						</td>
						<td class="p-3 font-light text-sm text-nowrap">
							{moment(data.time).format('YYYY-MM-DD HH:mm:ss')}
						</td>
						<td class="p-3 font-light text-sm">
							{data.temperature}°C
						</td>
						<td class="p-3 font-light text-sm">
							{data.humidity} g/m³
						</td>
						<td class="p-3 font-light text-sm">
							{data.air_pressure} hPa
						</td>
						<td class="p-3 font-light text-sm">
							{getEnvironmentalNote(data)}
						</td>
					</tr>
				{/each}
			{:else}
				<tr class="border-b border-gt-color-dark-3-transparent">
					<td colspan="5" class="p-3.5 font-light text-sm text-gt-color-gray text-center">
						Data tidak ditemukan
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
