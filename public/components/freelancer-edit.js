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

    let startDate = new Date(date + 'T' + start + 'Z'); // UTC date
    let endDate = new Date(date + 'T' + end + 'Z');

    if(startDate >= endDate) {
      document.getElementById('emergency-single-date-error').innerHTML = "Invalid time interval";
      return;
    }

    // TODO edit url
    let freelancerId = document.getElementById('root').getAttribute('data-user-freelancer');
    // ajaxRequest("PUT", freelancerId + "/availability", {}, {}, function(newDays) {
    //   if(!newDays) {
    //     console.log("No data received");
    //   }
    // });
  }
  render() {
    return (
      <form id="emergency-form-single-date" onSubmit={this.handleSubmit}>
        <label>Select specific day(s):</label>
        <input type="date" id="emergency-single-date" defaultValue={new Date().toJSON().slice(0,10)}/>
        From <input type="time" id="emergency-single-start"></input> to <input type="time" id="emergency-single-end"/>
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
  }

  handleSubmit(evt) {
    evt.preventDefault();

    let form = evt.target;
    let daysInfo = form['recurrence-days'];
    let scheduledDays = [];

    daysInfo.forEach(function(day) {
      if(day.checked) {
        let date = new Date(); // now TODO start date
        let dayOffset = day.value - date.getDay();
        if(dayOffset < 0) {
          dayOffset += 7;
        }

        date.setDate(date.getDay() + dayOffset);

        let startString = document.getElementById("emergency-time-" + day.value + "-start").value;
        let endString = document.getElementById("emergency-time-" + day.value + "-end").value;

        // check time is set
        if(!startString || !endString) {
          document.getElementById('emergency-single-date-error').innerHTML = "Invalid time interval";
          return;
        }

        let startDate = new Date(date); // UTC date
        startDate.setHours(startString.split(':')[0]);
        startDate.setMinutes(startString.split(':')[1]);

        let endDate = new Date(date); // UTC date
        endDate.setHours(endString.split(':')[0]);
        endDate.setMinutes(endString.split(':')[1]);

        // check valid time interval (non empty)
        if(startDate >= endDate) {
          document.getElementById('emergency-single-date-error').innerHTML = "Invalid time interval";
          return;
        }

        scheduledDays.push({ start: startDate , end: endDate });
      }
    });

    //TODO ajax
    console.log(scheduledDays);

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
    endInput.disabled = !evt.target.checked;
    locationInput.disabled = !evt.target.checked;
  }


  render() {
    return (
      <form id="emergency-form-repetition" onSubmit={this.handleSubmit}>
        <div id="emergency-form-repetition-week">
          <label>Week days</label>
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
