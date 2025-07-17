export const load = async ({ url }) => {
	const id_stasiun = url.searchParams.get('id_stasiun') || undefined;
	const tipe_stasiun = url.searchParams.get('tipe_stasiun') || undefined;
	const nama = url.searchParams.get('nama') || undefined;

	return {
		id_stasiun,
		tipe_stasiun,
		nama
	};
};
