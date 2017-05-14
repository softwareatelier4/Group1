
let savedSingleDates = [];
let savedRepeatedDates = [];
let freelancerId = document.getElementById('root').getAttribute('data-user-freelancer');

const SINGLE_DATES_COLOR = 'green';

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
      this.resetForm();
      return renderError("Invalid time interval");
    }

    if(startDate < Date.now()) {
      this.resetForm();
      return renderError("Past dates are not valid");
    }


    let day = Day(startDate, endDate, location);
    if(isConflicting(day, false)) {
      return renderError("Date conflicts with existing one");
    }

    savedSingleDates.push(day);
    // add to calendar
    $('#calendar').fullCalendar('renderEvent', {
      title: day.location,
      start: new Date(day.begin),
      end: new Date(day.end),
      allDay: false,
      color: SINGLE_DATES_COLOR
    });

    updateDates();
    this.resetForm();
    document.getElementById('emergency-form-single-date').value = new Date().toJSON().slice(0,10);
  }

  render() {
    return (
      <form id="emergency-form-single-date" onSubmit={this.handleSubmit}>
        <label>Select specific day(s):</label>
        <input type="date" id="emergency-single-date" defaultValue={new Date().toJSON().slice(0,10)}/>
        From <input type="time" id="emergency-single-start" required/> to <input type="time" id="emergency-single-end" required/>
        in <input type="text" id="emergency-location-single" placeholder="Location" required />
        <input type="submit" value="Add single date" />
        <span id="emergency-single-date-error"></span>
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

    let repetition = form.elements['emergency-repetition-type'].value;
    if(repetition == "weeks") {
      repetition = Number(document.getElementById('emergency-repetition-weeks').value);
    } else { // if (repetition == "until") {
      repetition = new Date(document.getElementById('emergency-repetition-end-date').value);
    }

    let thisRef = this;

    let feedback = daysInfo.forEach(function(day) {
      if(day.checked) {
        let date = new Date(document.getElementById('emergency-repetition-start-date').value);
        // set first day after starting date
        let dayOffset = day.value - date.getDay();
        if(dayOffset < 0) {
          dayOffset += 7;
        }

        date.setDate(date.getDay() + dayOffset);

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

        scheduledDays = scheduledDays.concat(dayCopies);
      }
    });

    if(feedback < 0) return; // error already printed

    if(scheduledDays.length == 0) return renderError("Schedule at least a one day");
    savedRepeatedDates = scheduledDays;
    updateDates();
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
      if(isConflicting(newBegin, true)) renderError("Some single dates were removed as they conflicted with your weekly schedule");
      return new Day(newBegin, newEnd, day.location, true)
    }

    switch (typeof repetition) {
      case 'number': // create a day copy per week, for # of weeks
        for(let i = 0; i < repetition; i++) {
          days.push(copyAndIncrementWeek(day, i));
        }
        break;

      case 'object': // create a day copy per week, until date
        let newDay;
        for(let i = 0; (newDay = copyAndIncrementWeek(day, i)) && new Date(newDay.begin) < repetition; i++) {
          days.push(newDay);
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
    let startInput = document.getElementById('emergency-time-' + day + '-start');
    let endInput = document.getElementById('emergency-time-' + day + '-end');
    let locationInput = document.getElementById('emergency-location-' + day);

    startInput.disabled = !evt.target.checked;
    startInput.required = evt.target.checked;

    endInput.disabled = !evt.target.checked;
    endInput.required = evt.target.checked;

    locationInput.disabled = !evt.target.checked;
    locationInput.required = evt.target.checked;

    this.resetForm(day);

    // handle special case when only checked day is unchecked (delete all repeated days)
    if(!check.checked) {
      savedRepeatedDates = savedRepeatedDates.filter(function(repeatedDay) {
        return new Date(new Date(repeatedDay.begin)).getDay() != day;
      });

      updateDates();
    }

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
          <label>Weekly schedule (prefilled with previously saved schedule) <span id="emergency-repetition-saved-until"></span>:</label>
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
          <label>Use schedule from:
            <input type="date" id="emergency-repetition-start-date" defaultValue={new Date().toJSON().slice(0,10)}/>
          </label>
          <label><input type="radio" name="emergency-repetition-type" value="weeks" defaultChecked={true} onChange={this.onRadioChange} />
            <input type="text" id="emergency-repetition-weeks" placeholder="For a number of weeks" required/>
          </label>
          <label>
            <input type="radio" name="emergency-repetition-type" value="until" onChange={this.onRadioChange} />
            Until <input type="date" id="emergency-repetition-end-date" defaultValue={new Date().toJSON().slice(0,10)} disabled/>
          </label>
        </div>

        <input type="submit" value="Update weekly schedule"/>
      </form>
    );
  }
}

class FreelancerEmergencyForm extends React.Component {
  render() {
    return (
      <div>
        <FreelancerEmergencyRepetitionForm />
        <hr/>
        <FreelancerSingleDateForm />
      </div>
    );
  }
}

class FreelancerEditView extends React.Component {
  render() {
    return (
      <FreelancerEmergencyForm />
    );
  }
}

class FreelancerEmergencySingleDate extends React.Component {
  constructor(props) {
    super(props);
    this.deleteDate = this.deleteDate.bind(this);
  }

  deleteDate(evt) {
    let index = evt.target.parentNode.getAttribute('data-key');
    savedSingleDates.splice(index, 1);
    updateDates();
  }

  render() {
    let day = this.props.day;
    let begin = new Date(day.begin);
    let end = new Date(day.end);
    let date = new Date(day.day);
    let timeSettings = { hour12: false,  hour: "numeric",  minute: "numeric" } ;
    return (
      <li data-key={this.props.dataKey}>
        {
          dayStrings[date.getDay()] + ' '
          + date.toLocaleDateString('en-GB')
          + " from " + begin.toLocaleTimeString('en-US',  timeSettings)
          + " to " + end.toLocaleTimeString('en-US',  timeSettings)
          + " in " + day.location
        }
        <input type="button" value="Delete" onClick={this.deleteDate} />
      </li>
    );
  }
}

/**
 * Helper and rendering functions
 */

function renderError(errorString) {
  document.getElementById('emergency-single-date-error').innerHTML = errorString;
}

function renderPage() {
  ReactDOM.render(<FreelancerEditView />, document.getElementById('react-freelancer-edit'));
};

/**
 * Render list of single days
 * @param  {Day[]} days array of days to display
 */
function renderSingleDates(days) {
  // get single days (not set via weekly schedule)
  savedSingleDates = days.filter((day) => { return !day.isRepeated; });

  let dayList = savedSingleDates.map((day, index) => <FreelancerEmergencySingleDate day={day} key={index} dataKey={index} /> );
  // display dates sorted
  dayList.sort(function (a, b) {
    return new Date(a.props.day.begin) - new Date(b.props.day.begin);
  });
  ReactDOM.render(
    <ul>
      <label>Single dates saved:</label>
      {dayList}
    </ul>,
    document.getElementById('react-freelancer-emergency-single-list')
  );
}

/**
 * fill in checkboxes based on saved data
 * @param  {Day[]} days to display (may also contain non-repeated ones, they are filtered)
 */
function renderRepeatedDates(days) {
  savedRepeatedDates = days.filter((day) => { return day.isRepeated; });
  let form = document.getElementById('emergency-form-repetition');
  let displayUntil = document.getElementById('emergency-repetition-saved-until');
  displayUntil.innerHTML = "";
  savedRepeatedDates.forEach(function(day) {
    let dayOfWeek = new Date(day.begin).getDay();
    let end = document.getElementById('emergency-time-' + dayOfWeek + '-end');
    let begin = document.getElementById('emergency-time-' + dayOfWeek + '-start');
    let location = document.getElementById('emergency-location-' + dayOfWeek + '');
    let check = end.parentNode.firstChild;
    if(check.checked) {
      let lastDay = savedRepeatedDates[savedRepeatedDates.length - 1];
      displayUntil.innerHTML = "Repeats until " + new Date(lastDay.begin).toLocaleDateString('en-GB');
      return; // already set this day of the week
    } else {
      check.checked = true;
      end.disabled = false;
      end.required = true;
      begin.disabled = false;
      begin.required = true;
      location.disabled = false;
      location.required = true;
    }

    end.value = toTimeString(new Date(day.end));
    begin.value = toTimeString(new Date(day.begin));
    location.value = day.location;
  });
}

/**
 * Sends AJAX request to save `savedSingleDates` + `savedRepeatedDates`
 */
function updateDates(rerenderCalendar) {
  let emergencyDates = savedSingleDates.concat(savedRepeatedDates);
  console.log("savedRepeatedDates", savedRepeatedDates);
  ajaxRequest("PUT", freelancerId + "/availability", {}, emergencyDates, function(status) {
    if(status == 204) {
      renderSingleDates(savedSingleDates);
      renderRepeatedDates(savedRepeatedDates);
      if(rerenderCalendar) renderCalendar();
    } else {
      console.log(status);
    }
  });
}

/**
 * checks a new date does not conflict with existing ones
 * @param  {Date}  date to save
 * @param  {Boolean} isRepeated `true` if date is from week schedule, `false` if single date
 * @return {Boolean}
 * `true` if `date` is a single date and it conflicts with any existing date (will show error to user)
 * `true` if `date` is from week schedule and it conflicts with single date, delete (override) existing single date (will show notification to user)
 * `false` if no conflicts
 */
function isConflicting(dayToAdd, isRepeated) {
  let conflict = false;
  // check new date not conflicting with saved single dates
  for(let i = savedSingleDates.length - 1; i >= 0; i--) {
    let day = savedSingleDates[i];
    if(areOverlapping(dayToAdd, day)) {
      conflict = true;
      if(isRepeated) {
        savedSingleDates.splice(i, 1); // TODO change
      } else {
        return conflict; // new single date conflicting with previous ones, trigger error at once
      }
    }
  }

  // repeaded dates cannot conflict with each other because of how they are input
  if(isRepeated) return conflict;

  // check new single date does not conflict with existing week schedule
  for (let i = 0; i < savedRepeatedDates.length; i++) {
    let day = savedRepeatedDates[i];
    if(areOverlapping(dayToAdd, day)) {
      return true;
    }
  }

  return conflict;
}

function deleteSavedDate(dateToDelete, calendarEventId, isRepeated) {
  if(isRepeated) {
    //TODO delete all
  } else {
    savedSingleDates = savedSingleDates.filter(function(day) {
      return new Date(day.begin).toUTCString() != dateToDelete.toUTCString();
    });
  }
  updateDates();
}

function renderCalendar() {
  let calendarSingleEvents = savedSingleDates.map((day) => {
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
      }

    ],

    eventRender: function(event, element) {
      // add delete button
      element.find(".fc-bg").css("pointer-events", "none");
        element.append("<button type='button' class='delete-event'>X</button>" );
        element.find(".delete-event").click(function(){
          deleteSavedDate(new Date(event.start._i), false);
          $('#calendar').fullCalendar('removeEvents',event._id);
      });
    },

    header: {
      left:   'title',
      center: 'month, agendaWeek',
      right:  'today prev,next',
    },
    defaultView: 'agendaWeek',
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

/**
 * On load
 */
if(document.getElementById('react-freelancer-edit')) {
  renderPage();
  // get and render saved days
  ajaxRequest('GET', freelancerId, { ajax: true }, {}, function(freelancer) {
    renderSingleDates(freelancer.availability);
    renderRepeatedDates(freelancer.availability);
    renderCalendar();
  });
}
