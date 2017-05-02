class FreelancerEmergencyForm extends React.Component {
  render() {
    return (
      <form>
        <label>Recurrence</label>
        None: <input type="radio" name="recurrence" ref="recurrence" id="emergency-form-recurrence" value="none" required />
        Weekly: <input type="radio" name="recurrence" ref="recurrence" id="emergency-form-recurrence" value="weekly" required />
        Monthly: <input type="radio" name="recurrence" ref="recurrence" id="emergency-form-recurrence" value="monthly" required />
        <br/>
        <label>Recurrence days</label>
        Monday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="monday" />
        Tuesday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="tuesday" />
        Wednesday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="wednesday" />
        Thursday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="thursday" />
        Friday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="friday" />
        Saturday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="saturday" />
        Sunday: <input type="checkbox" name="recurrence-days" ref="recurrence-days" id="emergency-form-recurrence-day" value="sunday" />
        <br/>
        <input type="submit" />
      </form>
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
