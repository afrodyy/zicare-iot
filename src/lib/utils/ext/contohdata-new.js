import { jakbar, jakut, jaktim, jaksel, jakpus } from '../geojson/jakarta';

export var stasiunUdara = [
	{
		id_station: 'BALIKPAPAN_BB',
		tipe_station: 'manual',
		nama: 'Balikpapan Baru',
		lat: -1.242379,
		lon: 116.859631,
		alamat: 'Balikpapan Baru',
		kota: 'Balikpapan',
		provinsi: 'Kaltim',
		icon: '1',
		geojson: '1',
		use_internet: 1,
		dbsource: '1',
		calculate_ispu: 1,
		is_deleted: 0,
		last_update: null,
		status: 'offline'
	},
	{
		id_station: 'DKI_CIRACAS',
		tipe_station: 'manual',
		nama: 'pak jeki',
		lat: -6.324831948180378,
		lon: 106.86689001138608,
		alamat: 'ciracas dki jakarta',
		kota: 'jakarta timur',
		provinsi: 'dki jakarta',
		icon: '1',
		geojson: '1',
		use_internet: 1,
		dbsource: '1',
		calculate_ispu: 1,
		is_deleted: 0,
		last_update: null,
		status: 'offline'
	},
	{
		id_station: 'DKI_PENJARINGAN',
		tipe_station: 'manual',
		nama: 'DKI 7 - Rusunawa Penjaringan',
		lat: -6.129308030415923,
		lon: 106.79575684232952,
		alamat: 'Penjaringan',
		kota: 'Jakarta',
		provinsi: 'DKI Jakarta',
		icon: '1',
		geojson: '1',
		use_internet: 1,
		dbsource: '1',
		calculate_ispu: 1,
		is_deleted: 0,
		last_update: null,
		status: 'offline'
	},
	{
		id_station: 'DKI_PULOMAS',
		tipe_station: 'manual',
		nama: 'DKI 11 - Pacuan Kuda Pulo Mas',
		lat: -6.17846467732303,
		lon: 106.88717854232955,
		alamat: 'Pulo Mas',
		kota: 'Jakarta',
		provinsi: 'DKI Jakarta',
		icon: '1',
		geojson: '1',
		use_internet: 1,
		dbsource: '1',
		calculate_ispu: 1,
		is_deleted: 0,
		last_update: null,
		status: 'offline'
	},
	{
		id_station: 'DKI_RAGUNAN',
		tipe_station: 'manual',
		nama: 'DKI 8 - PPOP Ragunan',
		lat: -6.304420728716271,
		lon: 106.8289196394899,
		alamat: 'DKI Jakarta',
		kota: 'Jakarta',
		provinsi: 'DKI Jakarta',
		icon: '1',
		geojson: '1',
		use_internet: 1,
		dbsource: '1',
		calculate_ispu: 1,
		is_deleted: 0,
		last_update: null,
		status: 'offline'
	}
];

export var industri = [
	{
		tipe: 'I',
		name: 'Industri Kalideres',
		lat: -6.128948656354494,
		lng: 106.70333862304689,
		status: 'baik',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'L',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'I',
		name: 'Industri Cilandak',
		lat: -6.3036962708121695,
		lng: 106.79122924804689,
		status: 'sedang',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'L',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'I',
		name: 'Industri Cipayung',
		lat: -6.3173459703266115,
		lng: 106.91295804101485,
		status: 'tidak_sehat',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'I',
		name: 'Industri Pasar Rebo',
		lat: -6.3350900413976925,
		lng: 106.8529400419354,
		status: 'sangat_tidak_sehat',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 100
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'I',
		name: 'Industri Tanah Abang',
		lat: -6.19175525417492,
		lng: 106.81312404932042,
		status: 'bahaya',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	}
];

export var transportasi = [
	{
		tipe: 'T',
		name: 'Transportasi Pesangrahan',
		lat: -6.2531892651486025,
		lng: 106.76095136934222,
		status: 'baik',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'T',
		name: 'Transportasi jakarsa',
		lat: -6.330995309852224,
		lng: 106.8254807366837,
		status: 'sedang',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'T',
		name: 'Transportasi Penjaraingan',
		lat: -6.114611328564151,
		lng: 106.78154584828097,
		status: 'tidak_sehat',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'T',
		name: 'Transportasi Palmerah',
		lat: -6.1903899724953,
		lng: 106.80076736195718,
		status: 'sangat_tidak_sehat',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	},
	{
		tipe: 'T',
		name: 'Transportasi Johar Baru',
		lat: -6.1876593985507675,
		lng: 106.86323728140482,
		status: 'bahaya',
		id: 988871,
		is_online: true,
		last_updated: new Date(),
		last_updated_by: 'Admin',
		dampak_kesehatan: [
			{
				note: 'Batuk'
			},
			{
				note: 'Iritasi Mata'
			},
			{
				note: 'Sakit Kepala'
			},
			{
				note: 'Risiko Serangan Jantung'
			}
		],
		saran_kesehatan:
			'Hindari aktivitas fisik yang terlalu lama di luar ruangan, pertimbangkan untuk melakukan aktivitas di dalam ruangan.',
		warning_system: 'Data tidak tertarik.',
		ispu: [
			{
				id: 1,
				nama: 'SO2',
				status: 'R',
				value: 218
			},
			{
				id: 2,
				nama: 'HC',
				status: 'LC',
				value: 216
			},
			{
				id: 3,
				nama: '03',
				status: 'L',
				value: 10
			}
		],
		ispu_s02: {
			status: 'R',
			value: 10
		},
		ispu_hc: {
			status: 'LC',
			value: 216
		},
		ispu_03: {
			status: 'L',
			value: 10
		}
	}
];

export var demografi_jumlah_penduduk = [
	{
		wilayah: 'Jakarta Utara',
		geojson: jakut,
		value: 500000
	},
	{
		wilayah: 'Jakarta Pusat',
		geojson: jakpus,
		value: 530000
	},
	{
		wilayah: 'Jakarta Timur',
		geojson: jaktim,
		value: 520000
	},
	{
		wilayah: 'Jakarta Barat',
		geojson: jakbar,
		value: 30000
	},
	{
		wilayah: 'Jakarta Selatan',
		geojson: jaksel,
		value: 5300
	}
];

export var demografi_luas_wilayah = [
	{
		wilayah: 'Jakarta Utara',
		geojson: jakut,
		value: 100000
	},
	{
		wilayah: 'Jakarta Pusat',
		geojson: jakpus,
		value: 153000
	},
	{
		wilayah: 'Jakarta Timur',
		geojson: jaktim,
		value: 120000
	},
	{
		wilayah: 'Jakarta Barat',
		geojson: jakbar,
		value: 53000
	},
	{
		wilayah: 'Jakarta Selatan',
		geojson: jaksel,
		value: 3000
	}
];

export var demografi_kepadatan_penduduk = [
	{
		wilayah: 'Jakarta Utara',
		geojson: jakut,
		value: 1500000
	},
	{
		wilayah: 'Jakarta Pusat',
		geojson: jakpus,
		value: 1530000
	},
	{
		wilayah: 'Jakarta Timur',
		geojson: jaktim,
		value: 1520000
	},
	{
		wilayah: 'Jakarta Barat',
		geojson: jakbar,
		value: 530000
	},
	{
		wilayah: 'Jakarta Selatan',
		geojson: jaksel,
		value: 53000
	}
];
