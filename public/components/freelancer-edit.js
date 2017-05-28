
let savedSingleDates = [];
let savedRepeatedDates = [];
let freelance = {};
let freelancerId = document.getElementById('root').getAttribute('data-user-freelancer');

const SINGLE_DATES_COLOR = 'green';
const REPEATED_DATES_COLOR = 'blue';

/**
 * Componenets
 */
class FreelancerSingleDateForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  resetForm() {
    document.getElementById('emergency-single-start').value = '';
    document.getElementById('emergency-single-end').value = '';
    document.getElementById('emergency-location-single').value = '';
  }

  handleSubmit(evt) {
    evt.preventDefault();
    renderError("");

    let start = document.getElementById('emergency-single-start').value;
    let end = document.getElementById('emergency-single-end').value;
    let date = document.getElementById('emergency-single-date').value;
    let location = document.getElementById('emergency-location-single').value;

    let startDate = new Date(date + 'T' + start);
    let endDate = new Date(date + 'T' + end);

    if(startDate >= endDate) {
      return renderError("Invalid time interval");
    }

    if(startDate < Date.now()) {
      return renderError("Past dates are not valid");
    }


    let day = Day(startDate, endDate, location);
    if(isConflicting(day)) {
      return renderError("Date conflicts with existing one");
    }

    savedSingleDates.push(day);
    // add to calendar
    $('#calendar').fullCalendar(
      'renderEvent', {
        title: day.location,
        start: new Date(day.begin),
        end: new Date(day.end),
        allDay: false,
        color: SINGLE_DATES_COLOR,
      },
      true //stick
    );

    updateDates();
    this.resetForm();
    document.getElementById('emergency-form-single-date').value = new Date().toJSON().slice(0,10);
  }

  render() {
    return (
      <form id="emergency-form-single-date" onSubmit={this.handleSubmit}>
        <label>Add specific date(s):</label>
        <input type="date" id="emergency-single-date" defaultValue={new Date().toJSON().slice(0,10)}/>
        From <input type="time" id="emergency-single-start" required/> to <input type="time" id="emergency-single-end" required/>
        in <input type="text" id="emergency-location-single" placeholder="Location" required /><br/>
        <input type="submit" id="emergency-single-submit" value="Add single date" />
      </form>
    );
  }
}

class FreelancerEmergencyRepetitionForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeCheck = this.changeCheck.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.generateDays = this.generateDays.bind(this);
  }

  resetForm(dayValue) {
    document.getElementById("emergency-time-" + dayValue + "-end").value = '';
    document.getElementById("emergency-time-" + dayValue + "-start").value = '';
    document.getElementById("emergency-location-" + dayValue).value = '';
  }

  handleSubmit(evt) {
    evt.preventDefault();
    renderError("");

    let form = evt.target;
    let daysInfo = form['recurrence-days'];
    let scheduledDays = [];
    let checkedCount = 0;

    let repetition = form.elements['emergency-repetition-type'].value;
    if(repetition == "weeks") {
      repetition = Number(document.getElementById('emergency-repetition-weeks').value);
    } else { // if (repetition == "until") {
      repetition = new Date(document.getElementById('emergency-repetition-end-date').value);
    }

    let thisRef = this;

    let feedback = daysInfo.forEach(function(day) {
      if(day.checked) {
        checkedCount++;
        let date = new Date(document.getElementById('emergency-repetition-start-date').value);
        // set first day after starting date
        let dayOffset = day.value - date.getDay();
        if(dayOffset < 0) {
          dayOffset += 7;
        }

        date.setDate(date.getDate() + dayOffset);

        let startString = document.getElementById("emergency-time-" + day.value + "-start").value;
        let endString = document.getElementById("emergency-time-" + day.value + "-end").value;
        let location = document.getElementById("emergency-location-" + day.value).value;

        let startDate = new Date(date);
        startDate.setHours(startString.split(':')[0]);
        startDate.setMinutes(startString.split(':')[1]);

        let endDate = new Date(date);
        endDate.setHours(endString.split(':')[0]);
        endDate.setMinutes(endString.split(':')[1]);

        // check valid time interval (non empty)
        if(startDate >= endDate) {
          renderError("Invalid time interval");
          thisRef.resetForm(day.value);
          return -1;
        }

        let dayObject = new Day(startDate, endDate, location, true);
        let dayCopies = thisRef.generateDays(repetition, dayObject);
        if(dayCopies.length > 0) { // if some dates were added
          // reset form
          resetRepetedDayInput(day.value, false);
          scheduledDays = scheduledDays.concat(dayCopies);
        }
      }
    });

    if(feedback < 0) return; // error already printed

    if(checkedCount == 0) return renderError("Schedule at least one day");
    savedRepeatedDates = savedRepeatedDates.concat(scheduledDays);
    updateDates(true);

  }

  /**
   * creates multiple Day objects (one week apart) based on repetition param
   * @param  {Object} repetition  either Number (of weeks) or Date (until)
   * @param  {Day}    day         day to repeat weekly
   * @return {Day[]}
   */
  generateDays(repetition, day) {
    let days = [];

    let copyAndIncrementWeek = (day, weeksAhead) => {
      let begin = new Date(day.begin);
      let end = new Date(day.end);
      let newBegin = new Date();
      let newEnd = new Date();
      newBegin.setTime(begin.getTime());
      newBegin.setDate(begin.getDate() + 7 * weeksAhead);
      newEnd.setTime(end.getTime());
      newEnd.setDate(end.getDate() + 7 * weeksAhead);
      let newDay = new Day(newBegin, newEnd, day.location, true);
      if(isConflicting(newDay)) {
        renderError("Your weekly schedule for " + dayStrings[newBegin.getDay()] + " conflicts with existing dates and was not saved");
        return -1; // add no dates
      }

      return newDay;
    }

    switch (typeof repetition) {
      case 'number': // create a day copy per week, for # of weeks
        for(let i = 0; i < repetition; i++) {
          let newDay = copyAndIncrementWeek(day, i);
          if(newDay == -1) {
            return []; // add no dates
          } else {
            days.push(newDay);
          }
        }
        break;

      case 'object': // create a day copy per week, until date
        let newDay;
        for(let i = 0; (newDay = copyAndIncrementWeek(day, i)) && new Date(newDay.begin) < repetition; i++) {
          if(newDay == -1) {
            return []; // add no dates
          } else {
            days.push(newDay);
          }
        }
    }

    return days;
  }

  // this is needed to fire a change event
  changeCheck(evt) {
    let current = evt.target.getAttribute('checked');
    evt.target.setAttribute('checked', !current);
  }

  onCheckChange(evt) {
    let check = evt.target;
    let day = evt.target.value;
    resetRepetedDayInput(day, check.checked);
  }

  onRadioChange(evt) {
    let radio = evt.target;
    let repetitionWeeks = document.getElementById('emergency-repetition-weeks');
    let repetitionUntil = document.getElementById('emergency-repetition-end-date');
    let isNumberOfWeeks = radio.value == "weeks";

    repetitionWeeks.disabled = !isNumberOfWeeks;
    repetitionWeeks.required = isNumberOfWeeks;
    repetitionUntil.disabled = isNumberOfWeeks;
  }


  render() {
    return (
      <form id="emergency-form-repetition" onSubmit={this.handleSubmit}>
        <div id="emergency-form-repetition-week">
          <label id="repeated-dates-label">Add repeated dates:</label>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="1" />
            <label>Mo</label>
            From <input type="time" id="emergency-time-1-start" disabled /> to <input type="time" id="emergency-time-1-end" disabled />
             in <input type="text" id="emergency-location-1" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="2" />
            <label>Tu</label>
            From <input type="time" id="emergency-time-2-start" disabled /> to <input type="time" id="emergency-time-2-end" disabled />
             in <input type="text" id="emergency-location-2" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="3" />
            <label>We</label>
            From <input type="time" id="emergency-time-3-start" disabled /> to <input type="time" id="emergency-time-3-end" disabled />
             in <input type="text" id="emergency-location-3" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="4" />
            <label>Th</label>
            From <input type="time" id="emergency-time-4-start" disabled /> to <input type="time" id="emergency-time-4-end" disabled />
             in <input type="text" id="emergency-location-4" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="5" />
            <label>Fr</label>
            From <input type="time" id="emergency-time-5-start" disabled /> to <input type="time" id="emergency-time-5-end" disabled />
             in <input type="text" id="emergency-location-5" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="6" />
            <label>Sa</label>
            From <input type="time" id="emergency-time-6-start" disabled /> to <input type="time" id="emergency-time-6-end" disabled />
             in <input type="text" id="emergency-location-6" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="0" />
            <label>Su</label>
            From <input type="time" id="emergency-time-0-start" disabled /> to <input type="time" id="emergency-time-0-end" disabled />
             in <input type="text" id="emergency-location-0" placeholder="Location" disabled />
          </span>
        </div>

        <div id="emergency-form-repetition-type">
          <label>Start schedule from:
            <input type="date" id="emergency-repetition-start-date" defaultValue={new Date().toJSON().slice(0,10)}/>
          </label>
          <label><input type="radio" name="emergency-repetition-type" value="weeks" defaultChecked={true} onChange={this.onRadioChange} />
            <input type="text" id="emergency-repetition-weeks" placeholder="Number of weeks" required/>
          </label>
          <label>
            <input type="radio" name="emergency-repetition-type" value="until" onChange={this.onRadioChange} />
            Until <input type="date" id="emergency-repetition-end-date" defaultValue={new Date().toJSON().slice(0,10)} disabled/>
          </label>
        </div>

        <input type="submit" id="emergency-repetition-submit" value="Update weekly schedule"/>
      </form>
    );
  }
}

class FreelancerEmergencyForm extends React.Component {
  render() {
    return (
      <div>
        <span id="emergency-date-error"></span>
        <FreelancerEmergencyRepetitionForm />
        <hr/>
        <FreelancerSingleDateForm />
      </div>
    );
  }
}

class FreelancerEmergencyView extends React.Component {
  render() {
    return (
			<div id="edit-schedule">
      	<FreelancerEmergencyForm />
				<CalendarView />
			</div>
    );
  }
}

/**
 * Helper and rendering functions
 */

function renderError(errorString) {
  document.getElementById('emergency-date-error').innerHTML = errorString;
}

function renderPage() {
  ReactDOM.render(<FreelancerMainView />, document.getElementById('react-freelancer-edit'));
};

/**
 * Sends AJAX request to save `savedSingleDates` + `savedRepeatedDates`
 */
function updateDates(rerenderCalendar) {
  let emergencyDates = savedSingleDates.concat(savedRepeatedDates);
  ajaxRequest("PUT", freelancerId + "/availability", {}, emergencyDates, function(status) {
    if(status == 204) {
      if(rerenderCalendar) renderCalendar();
    } else {
      console.log(status);
    }
  });
}

/**
 * checks a new date does not conflict with existing ones
 * @param  {Day}  day to save
 * @param  {Boolean} isRepeated `true` if date is from week schedule, `false` if single date
 * @return {Boolean}
 * `true` if `date` is a single date and it conflicts with any existing date (will show error to user)
 * `true` if `date` is from week schedule and it conflicts with single date, delete (override) existing single date (will show notification to user)
 * `false` if no conflicts
 */
function isConflicting(dayToAdd) {
  // check new date not conflicting with saved single dates
  for(let i = savedSingleDates.length - 1; i >= 0; i--) {
    let day = savedSingleDates[i];
    if(areOverlapping(dayToAdd, day)) {
      return true;
    }
  }

  // check new single date does not conflict with existing week schedule
  for (let i = 0; i < savedRepeatedDates.length; i++) {
    let day = savedRepeatedDates[i];
    if(areOverlapping(dayToAdd, day)) {
      return true;
    }
  }

  return false;
}

/**
 * Handles check/uncheck of weekly schedule form, called by form and by calendar deletion
 * @param {Number} dayOfWeek 0: Sunday to 6: Saturday
 * @param {Boolean} checked value of checkbox corresponding to dayOfWeek
 */
function resetRepetedDayInput(dayOfWeek, checked) {
  let startInput = document.getElementById('emergency-time-' + dayOfWeek + '-start');
  let endInput = document.getElementById('emergency-time-' + dayOfWeek + '-end');
  let locationInput = document.getElementById('emergency-location-' + dayOfWeek);
  locationInput.parentNode.firstChild.checked = checked; // redudant for the form, needed for `deleteSavedDate`

  startInput.disabled = !checked;
  startInput.required = checked;

  endInput.disabled = !checked;
  endInput.required = checked;

  locationInput.disabled = !checked;
  locationInput.required = checked;

  startInput.value = '';
  endInput.value = '';
  locationInput.value = '';
}

/**
 * Called when deleting from calendar, deletes date(s) from saved ones
 * @param  {Date}  dateToDelete (begin)
 * @param  {Boolean} isRepeated   true if date is of weekly schedule (all occurrences are deleted)
 * @param  {Boolean} deleteAll   if true and `isRepeated = true`, delete all occurrences
 */
function deleteSavedDate(dateToDelete, isRepeated, deleteAll) {
  if(isRepeated) {
    // delete all occurences (same day and time interval)
    savedRepeatedDates = savedRepeatedDates.filter(function(day) {
      let isSameDay = new Date(day.begin).getDay() == dateToDelete.getDay();
      let isSameInterval = new Date(day.begin).toTimeString() == dateToDelete.toTimeString();
      // filter based on `deleteAll` param
      return (deleteAll && !isSameDay && !isSameInterval) // delete all occurrences
              || (!deleteAll && new Date(day.begin).toUTCString() != dateToDelete.toUTCString()) ; // delete single date
    });

  } else {
    savedSingleDates = savedSingleDates.filter(function(day) {
      return new Date(day.begin).toUTCString() != dateToDelete.toUTCString();
    });
  }
  updateDates(isRepeated);
}

/**
 * Render calendar with single and repeated saved dates
 */
function renderCalendar() {
  let calendarDefaultView = 'agendaWeek';
  if(document.getElementById('calendar').hasChildNodes()) { // keep same view if rerendering
    calendarDefaultView = $('#calendar').fullCalendar('getView').type;
  }

  $('#calendar').fullCalendar('destroy'); // reset

  let calendarSingleEvents = savedSingleDates.map((day) => {
    return {
      title: day.location,
      start: new Date(day.begin),
      end: new Date(day.end),
      allDay: false
    }
  });

  let calendarRepeatedEvents = savedRepeatedDates.map((day) => {
    return {
      title: day.location,
      start: new Date(day.begin),
      end: new Date(day.end),
      allDay: false
    }
  });

  $('#calendar').fullCalendar({
    eventSources: [
      {
        events: calendarSingleEvents,
        color: SINGLE_DATES_COLOR
      },

      {
        events: calendarRepeatedEvents,
        color: REPEATED_DATES_COLOR
      }

    ],

    eventRender: function(event, element) {
      let isRepeated = event.source != undefined && event.source.color == REPEATED_DATES_COLOR;

      // add delete button
      element.find(".fc-bg").css("pointer-events", "none");
        element.append("<button type='button' class='delete-event'>X</button>" );
        element.find(".delete-event").click(function(){

          if(isRepeated) {
            // confirmation dialog for deleting repeating events
            $.confirm({
              title: 'Delete event',
              content: 'You selected a repeating event, how do you want to proceed?',
              buttons: {
                deleteSingle: {
                  text: 'Delete only this event',
                  btnClass: 'btn-blue',
                  action: function() {
                    deleteSavedDate(new Date(event.start._i), isRepeated);
                  }
                },
                deleteAll: {
                  text: 'Delete all repetitions',
                  keys: ['enter', 'shift'],
                  action: function() {
                    deleteSavedDate(new Date(event.start._i), isRepeated, true);
                  }
                },
                cancel: function () {
                  return;
                },
              }
            });
          } else {
            deleteSavedDate(new Date(event.start._i), isRepeated);
            $('#calendar').fullCalendar('removeEvents', event._id);
          }
      });
    },

    header: {
      left:   'title',
      center: 'month, agendaWeek',
      right:  'today prev,next',
    },
    defaultView: calendarDefaultView,
    firstDay: 1,
    timezone: 'local',
    timeFormat: 'HH:mm',
    slotLabelFormat: 'HH:mm',
    allDaySlot: false,
    views: {
      week: {
        columnFormat: 'ddd D/M'
      }
    }
  });
}

function updateForms(freelancer){
	freelance = freelancer;

	document.getElementById('email').value = freelancer.email;
	document.getElementById('description').value = freelancer.description;
	let temp = "";
	for( let tag of freelancer.tags){
		temp+=tag.tagName+", ";
	}
	document.getElementById('tags').value = temp;
	document.getElementById('phone').value = freelancer.phone;
	document.getElementById('address').value = freelancer.address;
	document.getElementById('pic').value = freelancer.urlPicture;
	document.getElementById('pricemin').value = freelancer.price.min;
	document.getElementById('pricemax').value = freelancer.price.max;
}

class CalendarView extends React.Component {
	render() {
		return (
			<div>
				<h3>Your emergency schedule:</h3>
				<ul id="calendar-legend">
					<li id="calendar-legend-single"> Single dates </li>
					<li id="calendar-legend-repeated"> Repeated dates </li>
				</ul>
				<div id='calendar'></div>
			</div>
		);
	};
}

class FreelancerMainView extends React.Component {
  select(pageName) {
    return function() {
      let btns = document.getElementById('edit-menu').children;
      for (let btn of btns) {
        if (btn.id === `edit-btn-${pageName}`) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      }
      let pages = document.getElementById('edit-content').children;
      for (let page of pages) {
        if (page.id === `edit-${pageName}`) {
          page.classList.add('selected');
        } else {
          page.classList.remove('selected');
        }
      }

      if(pageName == 'schedule') {
        renderCalendar();
      }
    }
  }
  render() {
    return (
      <div id="edit-view">
        <div id="edit-menu">
          <button className='edit-tab selected' id="edit-btn-info"  onClick={this.select('info')}>Edit Profile Information</button>
          <button className='edit-tab' id="edit-btn-schedule" onClick={this.select('schedule')}>Edit Emergency Availability</button>
        </div>
        <div id="edit-content">
          <FreelancerEditForm />
          <FreelancerEmergencyView />
        </div>
      </div>
    );
  }
}

class FreelancerEditForm extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
    this.renderFeedback = this.renderFeedback.bind(this);
	}

  renderFeedback(feedbackString) {
    document.getElementById('edit-feedback').innerHTML = feedbackString;
  }


	handleSubmit(evt) {
		evt.preventDefault();

		// create freelancer
		const formData = {};
		let price = {};
		for (const field in this.refs) {
 			if(this.refs[field].value !== "" && field !== "price-min" &&
			field !== "price-max" && freelance[field] != this.refs[field].value){
					formData[field] = this.refs[field].value;
			} else if (field === "price-min" && freelance.price.min != this.refs[field].value ){
				if(!(isNaN(this.refs[field].value))){
					price.min = Number(this.refs[field].value);
				} else{
					console.log("Please insert a number.");
				}
			} else if (field === "price-max" && freelance.price.max != this.refs[field].value ){
				if(!(isNaN(this.refs[field].value))){
					price.max = Number(this.refs[field].value);
				} else{
					console.log("Please insert a number.");
				}
			}
		}
		if(price.hasOwnProperty('min')){
			if(price.hasOwnProperty('max')){
				if(price.max < price.min){
					let temp = price.max;
					price.max = price.min;
					price.min = temp;
				}
				formData.price = price;
			} else {
				price.max = freelance.price.max;
				if(price.max < price.min){
					let temp = price.max;
					price.max = price.min;
					price.min = temp;
				}
				formData.price = price;
			}
		} else if(price.hasOwnProperty('max')){
			if(price.hasOwnProperty('min')){
				if(price.max < price.min){
					let temp = price.max;
					price.max = price.min;
					price.min = temp;
				}
				formData.price = price;
			} else {
				price.min = Number(freelance.price.min);
				if(price.max < price.min){
					let temp = price.max;
					price.max = price.min;
					price.min = temp;
				}

				formData.price = price;
			}
		}

		let form = this;
		ajaxRequest("PUT", "/freelance/"+freelancerId+"/edit", {}, formData, function(data) {
      if(!data.error) {
        form.renderFeedback("Information updated successfully");
				ajaxRequest('GET', freelancerId + '?ajax=true', {}, {}, function(freelancer) {
					updateForms(freelancer);
			  });
      } else {
        console.log(data.error);
        form.renderFeedback("An error occurred");
      }
		});
	}

  render() {
    return (
			<div id="edit-info"  className='selected'>
        <span id="edit-feedback"></span>
        <form onSubmit={this.handleSubmit} id="freelancer-edit-form">


          <div className="group">
            <input form="freelancer-edit-form" ref="description" className="job-description" name="job-description" type="text" id="description" />
            <span className="bar"></span>
            <label>
              Job Description
            </label>
          </div>

          <div className="group">
            <input ref="address" className="address" name="address" type="text" id="address"/>
            <span className="bar"></span>
            <label>
              Address
            </label>
          </div>

          <div className="group">
            <input ref="phone" className="phone" name="phone" type="tel"  id="phone"/>
            <span className="bar"></span>
            <label>
              Phone
            </label>
          </div>

          <div className="group">
            <input ref="email" className="email" name="email" type="email" id="email"/>
            <span className="bar"></span>
            <label>
              Email
            </label>
          </div>

          <div className="group">
            <input ref="urlPicture" className="picture-url" name="picture-url" type="text" id="pic"/>
            <span className="bar"></span>
            <label>
              Picture URL
            </label>
          </div>

          <div className="group">
            <input ref="tags" className="job-tags" name="job-tags" type="text" id="tags"/>
            <span className="bar"></span>
            <label>
              Job tags (separated by a comma)
            </label>
          </div>

					<div className="group">
            <input ref="price-min" className="price-min" name="price-min" type="text" id="pricemin"/>
            <span className="bar"></span>
            <label>
              Min price/hour
            </label>
          </div>
					<div className="group">
            <input ref="price-max" className="price-max" name="price-max" type="text" id="pricemax"/>
            <span className="bar"></span>
            <label>
              Max price/hour
            </label>
          </div>


          <div id="react-claim-form-root"></div>
          <input name="submit-button" className="submit-button" type="submit" value="Submit"/>
        </form>

			</div>
    );
  }
}


/**
 * On load
 */
if(document.getElementById('react-freelancer-edit')) {
  renderPage();
  // get and render saved days
  ajaxRequest('GET', freelancerId + '?ajax=true', {}, {}, function(freelancer) {
    let days = freelancer.availability;
    savedRepeatedDates = days.filter((day) => { return day.isRepeated; });
    savedSingleDates = days.filter((day) => { return !day.isRepeated; });

		updateForms(freelancer);

    console.log('Saved days', days);
    renderCalendar();
  });
}
