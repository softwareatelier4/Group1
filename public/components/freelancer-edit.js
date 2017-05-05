
let savedSingleDates = [];
let savedRepeatedDates = [];
let freelancerId = document.getElementById('root').getAttribute('data-user-freelancer');

function renderError(errorString) {
  document.getElementById('emergency-single-date-error').innerHTML = errorString;
}


/**
 * Componenets
 */
class FreelancerSingleDateForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    savedSingleDates.push(day);
    updateDates();
    document.getElementById('emergency-form-single-date').reset();

  }

  render() {
    return (
      <form id="emergency-form-single-date" onSubmit={this.handleSubmit}>
        <label>Select specific day(s):</label>
        <input type="date" id="emergency-single-date" defaultValue={new Date().toJSON().slice(0,10)}/>
        From <input type="time" id="emergency-single-start" required/> to <input type="time" id="emergency-single-end" required/>
        <input type="text" id="emergency-location-single" placeholder="Location" required />
        <input type="submit" value="+" />
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

    this.generateDays = this.generateDays.bind(this);
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

    daysInfo.forEach(function(day) {
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
          return renderError("Invalid time interval");
        }

        let dayObject = new Day(startDate, endDate, location, true);
        let dayCopies = thisRef.generateDays(repetition, dayObject);

        scheduledDays = scheduledDays.concat(dayCopies);
      }
    });

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
      let newBegin = new Date();
      let newEnd = new Date();
      newBegin.setTime(day.begin.getTime());
      newBegin.setDate(day.begin.getDate() + 7 * weeksAhead);
      newEnd.setTime(day.end.getTime());
      newEnd.setDate(day.end.getDate() + 7 * weeksAhead);
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
        for(let i = 0; (newDay = copyAndIncrementWeek(day, i)).day < repetition; i++) {
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
    let day = evt.target.value;
    let startInput = document.getElementById('emergency-time-' + day + '-start');
    let endInput = document.getElementById('emergency-time-' + day + '-end');
    let locationInput = document.getElementById('emergency-location-' + day);

    startInput.disabled = !evt.target.checked;
    startInput.required = evt.target.checked;
    startInput.value = '';

    endInput.disabled = !evt.target.checked;
    endInput.required = evt.target.checked;
    endInput.value = '';


    locationInput.disabled = !evt.target.checked;
    locationInput.required = evt.target.checked;
    locationInput.value = '';

    // handle special case when only checked day is unchecked (delete all repeated days)


    if(!day.checked) {
      savedRepeatedDates = savedRepeatedDates.filter(function(repeatedDay) {
        console.log('rep',repeatedDay.begin.toLocaleString());
        return new Date(repeatedDay.begin.toLocaleString()).getDay() != day;
      });

      updateDates();
    }

  }

  onRadioChange(evt) {
    let radio = evt.target;
    let repetitionWeeks = document.getElementById('emergency-repetition-weeks');
    let isNumberOfWeeks = radio.value == "weeks";
    repetitionWeeks.disabled = !isNumberOfWeeks;
    repetitionWeeks.required = isNumberOfWeeks;
  }


  render() {
    return (
      <form id="emergency-form-repetition" onSubmit={this.handleSubmit}>
        <div id="emergency-form-repetition-week">
          <label>Weekly schedule:</label>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="1" />
            <label>Mo</label>
            From <input type="time" id="emergency-time-1-start" disabled /> to <input type="time" id="emergency-time-1-end" disabled />
            <input type="text" id="emergency-location-1" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="2" />
            <label>Tu</label>
            From <input type="time" id="emergency-time-2-start" disabled /> to <input type="time" id="emergency-time-2-end" disabled />
            <input type="text" id="emergency-location-2" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="3" />
            <label>We</label>
            From <input type="time" id="emergency-time-3-start" disabled /> to <input type="time" id="emergency-time-3-end" disabled />
            <input type="text" id="emergency-location-3" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="4" />
            <label>Th</label>
            From <input type="time" id="emergency-time-4-start" disabled /> to <input type="time" id="emergency-time-4-end" disabled />
            <input type="text" id="emergency-location-4" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="5" />
            <label>Fr</label>
            From <input type="time" id="emergency-time-5-start" disabled /> to <input type="time" id="emergency-time-5-end" disabled />
            <input type="text" id="emergency-location-5" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="6" />
            <label>Sa</label>
            From <input type="time" id="emergency-time-6-start" disabled /> to <input type="time" id="emergency-time-6-end" disabled />
            <input type="text" id="emergency-location-6" placeholder="Location" disabled />
          </span>
          <span>
            <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" onClick={this.updateCheck} onChange={this.onCheckChange} value="7" />
            <label>Su</label>
            From <input type="time" id="emergency-time-7-start" disabled /> to <input type="time" id="emergency-time-7-end" disabled />
            <input type="text" id="emergency-location-7" placeholder="Location" disabled />
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
            Until <input type="date" id="emergency-repetition-end-date" defaultValue={new Date().toJSON().slice(0,10)}/>
          </label>
        </div>

        <input type="submit" />
      </form>
    );
  }
}

class FreelancerEmergencyForm extends React.Component {
  render() {
    return (
      <div>
        <FreelancerSingleDateForm />
        <FreelancerEmergencyRepetitionForm />
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
          date.toLocaleDateString('en-GB')
          + " from " + begin.toLocaleTimeString('en-US',  timeSettings)
          + " to " + end.toLocaleTimeString('en-US',  timeSettings)
          + " in " + day.location
        }
        <input type="button" value="Delete" onClick={this.deleteDate} />
      </li>
    );
  }
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
  ReactDOM.render(
    <ul>
      <label>Single dates saved:</label>
      {dayList}
    </ul>,
    document.getElementById('react-freelancer-emergency-single-list')
  );
}

function renderRepeatedDates(days) {
  savedRepeatedDates = days.filter((day) => { return day.isRepeated; });
  let form = document.getElementById('emergency-form-repetition');

  savedRepeatedDates.forEach(function(day) {
    let dayOfWeek = new Date(day.day).getDay();
    let end = document.getElementById('emergency-time-' + dayOfWeek + '-end');
    let begin = document.getElementById('emergency-time-' + dayOfWeek + '-start');
    let location = document.getElementById('emergency-location-' + dayOfWeek + '');
    let check = end.parentNode.firstChild;
    if(check.checked) {
      return; // already set this day of the week
    } else {
      check.checked = true;
    }

    end.value = new Date(day.end).toLocaleTimeString();
    begin.value = new Date(day.begin).toLocaleTimeString();
    location.value = day.location;
  });
}

/**
 * Sends AJAX request to save `savedSingleDates` + `savedRepeatedDates`
 */
function updateDates() {
  let emergencyDates = savedSingleDates.concat(savedRepeatedDates);
  ajaxRequest("PUT", freelancerId + "/availability", {}, emergencyDates, function(status) {
    if(status == 204) {
      renderSingleDates(savedSingleDates);
      renderRepeatedDates(savedRepeatedDates);
    } else {
      console.log(status);
    }
  });
}


/**
 * On load
 */
renderPage();
// get saved days
ajaxRequest('GET', freelancerId, { ajax: true }, {}, function(freelancer) {
  renderSingleDates(freelancer.availability);
  renderRepeatedDates(freelancer.availability);
});
