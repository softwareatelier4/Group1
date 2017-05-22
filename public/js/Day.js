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

/**
 * Parses day.begin and day.end as Dates and returns object containing them
 * @param  {Day} day to parse
 * @return {Object}
 */
function parseInterval(day) {
	return {
		begin: new Date(day.begin),
		end: new Date(day.end)
	}
}

/**
 * Checks if two Days have overlapping intervals
 * @param  {Day} day1
 * @param  {Day} day2
 * @return {Boolean}
 */
function areOverlapping(day1, day2) {
	day1 = parseInterval(day1);
	day2 = parseInterval(day2);

	// e.g. a = [0, 10], b = [0, 5]
	let includes = function(a, b) {
		return a.begin <= b.begin && a.end >= b.end;
	}
	// inverse of includes
	// e.g. a = [0, 5], b = [0, 10]
	let isIncluded = function(a, b) {
		return includes(b, a);
	}
	// e.g. a = [0, 6], b = [5, 10]
	let precedes = function(a, b) {
		return a.begin <= b.begin && a.end >= b.begin && a.end <= b.end;
	}
	// inverse of precedes
	// e.g. a = [5, 10], b = [0, 6]
	let succedes = function(a, b) {
		return precedes(b, a);
	}

	return includes(day1, day2) || isIncluded(day1, day2) || precedes(day1, day2) || succedes(day1, day2);
}

const dayStrings = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
