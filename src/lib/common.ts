export function formatTime(seconds: number) {
	const pad = (n: number) => String(n).padStart(2, '0');

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	let timeString = `${hours > 0 ? pad(minutes) : minutes}:${pad(Math.floor(seconds % 60))}`;

	if (hours > 0) timeString = `${hours}:` + timeString;

	return timeString;
}

export function getGridSize(arr: any[]): [number, number] {
	let [col, row] = [0, 0];

	for (let i = 1; i < 10; i++) {
		col = i;

		if (col * row >= arr.length) return [col, row];

		row = i;

		if (col * row >= arr.length) return [col, row];
	}

	throw new Error(`Excedded max grid size with length of ${arr.length}`);
}

export function getReadableDate(time: Date | number | string, includeTime = false): string {
	const date = typeof time !== 'object' ? new Date(time) : time;
	return date.toLocaleDateString([], {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: includeTime ? '2-digit' : undefined,
		minute: includeTime ? '2-digit' : undefined
	});
}

export function getReadableTime(time: Date | number | string) {
	const date = typeof time !== 'object' ? new Date(time) : time;
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
