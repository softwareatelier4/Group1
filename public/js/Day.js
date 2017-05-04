function Day(begin, end, location, day){

	if(!begin || !end || !location){
		console.log(69+' a field in a Day is undefined');
		return;
	}
	if(!(begin instanceof Date)){
		console.log('begin is of the wrong type. Must be Date.');
		return;
	}
	if (!(end instanceof Date)) {
		console.log('end is of the wrong type. Must be Date.');
		return;
	}
	if (!(typeof location === 'string')) {
		console.log('location is of the wrong type. Must be String.');
		return;
	}

	let a = {
		day: null,
		begin: begin,
		end: end,
		location: location
	}

	if(!day){
		a.day = new Date(begin.getUTCFullYear(),begin.getUTCMonth(),begin.getUTCDay(),12,0,0,0);
	} else if (day instanceof Date){
		a.day = day;
	} else{
		console.log(23+' Day.day is not of type Date');
		return;
	}

	return a;
}

function sortBegin(day1, day2){
	return day1.begin < day2.begin;
}

console.log('x')