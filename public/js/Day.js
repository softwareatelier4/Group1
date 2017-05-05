/**
 * A Day object to use for emergency availability details
 * @param {Date} begin    available from (time) (day of week matters)
 * @param {Date} end      available until (time) (day of week matters)
 * @param {String} location available where
 * @param {Date} day      day of week (time is midnight by default, day of week is the same as `end` and `begin`)
 */

function Day(begin, end, location, isRepeated, day) {
	function dateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	}

	if(!begin || !end || !location) {
		return;
	}
	if(!(begin instanceof Date)) {
		return;
	}
	if (!(end instanceof Date)) {
		return;
	}
	if (!(typeof location === 'string')) {
		return;
	}
	let a = {
		day: null,
		begin: dateToUTC(begin),
		end: dateToUTC(end),
		location: location,
		isRepeated: isRepeated || false
	}

	if(!day) {
		a.day = new Date(begin.getUTCFullYear(), begin.getUTCMonth(), begin.getUTCDate(), 12, 0, 0, 0);
	} else if (day instanceof Date) {
		a.day = day;
	} else {
		return;
	}

	return a;
}

function sortBegin(day1, day2){
	return day1.begin < day2.begin;
}
