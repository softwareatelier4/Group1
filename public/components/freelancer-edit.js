function renderError(errorString) {
  document.getElementById('emergency-single-date-error').innerHTML = errorString;
}



class FreelancerEmergencySingleDate extends React.Component {
  constructor(props) {
    super(props);
    this.deleteDate = this.deleteDate.bind(this);
  }

  deleteDate(evt) {
    console.log(evt.target.parentNode);
  }

  render() {
    let day = this.props.day;
    let timeSettings = { hour12: false,  hour: "numeric",  minute: "numeric" } ;
    return (
      <li>
        {
          day.day.toLocaleDateString('en-GB')
          + " from " + day.begin.toLocaleTimeString('en-US',  timeSettings)
          + " to " + day.end.toLocaleTimeString('en-US',  timeSettings)
          + " in " + day.location
        }
        <input type="button" value="Delete" onClick={this.deleteDate} />
      </li>
    );
  }
}

let testingDates = [
  new Day(new Date(), new Date(), "L", false),
  new Day(new Date(), new Date(), "L", false),
  new Day(new Date(), new Date(), "L", false)
];

renderSingleDates(testingDates);
function renderSingleDates(days) {
  // get single days (not set via weekly schedule)
  let singleDays = days.filter((day) => { return !day.isRepeated; });

  let dayList = singleDays.map((day, index) => <FreelancerEmergencySingleDate day={day} key={index} /> );
  console.log(dayList);
  ReactDOM.render(
    <ul>
      <label>Single dates saved:</label>
      {dayList}
    </ul>,
    document.getElementById('react-freelancer-emergency-single-list')
  );
}



class FreelancerSingleDateForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    let start = document.getElementById('emergency-single-start').value;
    let end = document.getElementById('emergency-single-end').value;
    let date = document.getElementById('emergency-single-date').value;
    let location = document.getElementById('emergency-location-single').value;

    let startDate = new Date(date + 'T' + start);
    let endDate = new Date(date + 'T' + end);

    if(startDate >= endDate) {
      document.getElementById('emergency-single-date-error').innerHTML = "Invalid time interval";
      return;
    }

    let day = Day(startDate, endDate, location);
    console.log(day);

    // TODO ajax
    let freelancerId = document.getElementById('root').getAttribute('data-user-freelancer');
    // ajaxRequest("PUT", freelancerId + "/availability", {}, {}, function(newDays) {
    //   if(!newDays) {
    //     console.log("No data received");
    //   }
    // });
    //
    testingDates.push(day);
    renderSingleDates(testingDates);
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

    let form = evt.target;
    let daysInfo = form['recurrence-days'];
    let scheduledDays = [];

    let repetition = form.elements['emergency-repetition-type'].value;
    if(repetition == "weeks") {
      repetition = Number(document.getElementById('emergency-repetition-weeks').value);
    } else { // if (repetition == "until") {
      repetition = new Date(document.getElementById('emergency-repetition-end-date').value);
      console.log(repetition);
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
          renderError("Invalid time interval");
          return;
        }

        let dayObject = new Day(startDate, endDate, location);
        let dayCopies = thisRef.generateDays(repetition, dayObject);

        scheduledDays = scheduledDays.concat(dayCopies);
      }
    });

    //TODO ajax
    if(scheduledDays.length == 0) return renderError("Schedule at least a one day");

    console.log(scheduledDays);

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
      return new Day(newBegin, newEnd, day.location)
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

    endInput.disabled = !evt.target.checked;
    endInput.required = evt.target.checked;

    locationInput.disabled = !evt.target.checked;
    locationInput.required = evt.target.checked;
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
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

  }
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

function renderPage() {
  ReactDOM.render(<FreelancerEditView />, document.getElementById('react-freelancer-edit'));
};

renderPage();
