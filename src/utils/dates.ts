const daysInMonth = (month: number, year: number) => 32 - new Date(year, month, 32).getDate();

function isWeekday(year: number, month: number, day: number) {
	let d: number = new Date(year, month, day).getDay();
	return d != 0 && d != 6;
}

function getWeekdaysInMonth(month: number, year: number) {
	let days = daysInMonth(month, year);
	let weekdays = 0;
	for (let i = 0; i < days; i++) {
		if (isWeekday(year, month, i + 1)) weekdays++;
	}
	return weekdays;
}

function getDay(date: Date) {
	// get day number from 0 (monday) to 6 (sunday)
	let day = date.getDay();
	if (day === 0) day = 7; // make Sunday (0) the last day
	return day - 1;
}

export { daysInMonth, getWeekdaysInMonth, isWeekday, getDay };
