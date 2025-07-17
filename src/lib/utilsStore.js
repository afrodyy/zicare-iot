import moment from 'moment';
import { writable } from 'svelte/store';

export const monthMap = writable({
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12
});

export function formatDateDmyHis(date) {
	return new Date(date)
		.toLocaleString('id-ID', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone: 'UTC'
		})
		.replace(',', '')
		.replace(/\//g, '-')
		.replace(/\./g, ':');
}

export function formatDateYmdHis(input) {
	const date = new Date(input);

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateDmy(date) {
	return new Date(date)
		.toLocaleString('id-ID', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			timeZone: 'UTC'
		})
		.replace(',', '')
		.replace(/\//g, '-')
		.replace(/\./g, ':');
}

export function formatDateYmd(date) {
	const d = new Date(date);
	const year = d.getUTCFullYear();
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDateHis(date) {
	return new Date(date)
		.toLocaleString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone: 'UTC'
		})
		.replace(',', '')
		.replace(/\//g, '-');
}

export function getBackDate(date, dayInterval) {
	date.setDate(date.getDate() - dayInterval);
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	return formattedDate;
}

export function generateTimeIntervalsInSecond(intervalInSeconds) {
	const times = [];
	let hour = 0;
	let minute = 0;
	let second = 0;

	while (hour < 24) {
		const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
		times.push(formattedTime);

		second += intervalInSeconds;
		if (second >= 60) {
			second -= 60;
			minute++;
		}
		if (minute >= 60) {
			minute = 0;
			hour++;
		}
	}

	return times;
}

export function generateTimeIntervals(interval) {
	const times = [];
	let hour = 0;
	let minute = 0;

	while (hour < 24) {
		const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
		times.push(formattedTime);

		minute += interval;
		if (minute === 60) {
			minute = 0;
			hour++;
		}
	}

	return times;
}

export function generateDateTimeIntervals(interval, startDate, endDate) {
	const dateTimes = [];
	let times;

	if (interval === '1 Sec') {
		times = generateTimeIntervalsInSecond(1);
	} else {
		times = generateTimeIntervals(interval);
	}

	let currentDate = new Date(startDate);
	const lastDate = new Date(endDate);

	while (currentDate <= lastDate) {
		const formattedDate = currentDate.toISOString().split('T')[0];

		times.forEach((time) => {
			dateTimes.push(`${formattedDate} ${time}`);
		});

		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dateTimes;
}

export function convertSingleDayToISO(singleDate) {
	const [day, month, year] = singleDate.split(' ');
	const monthIndex = new Date(`${month} 1`).getMonth();

	const startDate = new Date(Date.UTC(year, monthIndex, day, 0, 0, 0)).toISOString();

	const endDate = new Date(Date.UTC(year, monthIndex, day, 23, 59, 59)).toISOString();

	return { startDate, endDate };
}

export function getFirstAndLastDate(dateString) {
	const [monthString, yearString] = dateString.split(' ');

	let monthNumber;

	monthMap.subscribe((value) => {
		monthNumber = value[monthString];
	});

	const dayCount = new Date(parseInt(yearString), monthNumber, 0).getDate();
	const year = parseInt(yearString, 10);

	const monthIndex = new Date(`${monthString} 1`).getMonth();

	const firstDate = new Date(Date.UTC(year, monthIndex, 1)).toISOString();
	const lastDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59)).toISOString();

	return { firstDate, lastDate, dayCount };
}

export function getLast30MinuteInterval(date) {
	const minutes = moment(date).minute();
	return moment(date)
		.startOf('hour')
		.add(minutes >= 30 ? 30 : 0, 'minutes');
}

export function getLast60MinuteInterval(date) {
	return moment(date).startOf('hour');
}
