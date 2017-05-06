/**
 * A Day object to use for emergency availability details
 * @param {Date} begin    available from (time) (day of week matters)
 * @param {Date} end      available until (time) (day of week matters)
 * @param {String} location available where
 * @param {Date} day      day of week (time is midnight by default, day of week is the same as `end` and `begin`)
 */

function Day(begin, end, location, isRepeated, day) {

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
		begin: begin.toUTCString(),
		end: end.toUTCString(),
		location: location,
		isRepeated: isRepeated || false
	}

	if(!day) {
		a.day = begin.toUTCString();
	} else if (day instanceof Date) {
		a.day = day.toUTCString();
	} else {
		return;
	}

	return a;
}

function sortBegin(day1, day2){
	return new Date(day1.begin) < new Date(day2.begin);
}

/**
 * Get HH:MM time string of the given date (no timezone conversions applied)
 * @param  {Date} date
 * @return {String} 
 */
function toTimeString(date) {
	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
}
