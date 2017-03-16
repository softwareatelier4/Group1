'use strict';

/**
 * Freelancer Creation View Components
 * CSS styling in css/freelancer-create.css
 */


class CreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.labelColors = {};
    this.state = { color : {} };
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const formData = {};
    for (const field in this.refs) {
      if(this.refs[field].value) {
        formData[field] = this.refs[field].value;
        let temp = this.state.color;
        temp[field] = "inherit";
        this.setState({ color: temp });
      } else {
        let temp = this.state.color;
        temp[field] = "red";
        this.setState({ color: temp });
      }
    }
    //ajaxRequest("POST", "/freelance", {}, formData, console.log);
  }

  render() {
    return (
        <div className="freelancer-form">
          <form onSubmit={this.handleSubmit}>
            <label style={{color: this.state.color.firstName || "inherit"}}>
              First Name: <input ref="firstName" className="first-name" name="first-name"/>
            </label>
            <label style={{color: this.state.color.familyName || "inherit"}}>
              Family Name: <input ref="familyName" className="family-name" name="family-name"/>
            </label>
            <label style={{color: this.state.color.title || "inherit"}}>
              Job title: <input ref="title" className="job-title" name="job-title"/>
            </label>
            <label style={{color: this.state.color.category || "inherit"}}>
              Job category:
              <select ref="category">
                <option value="selected">Please select a job category</option>
                <option value="1">One</option>
                <option value="2">Two</option>
              </select>
            </label>

            <label style={{color: this.state.color.address || "inherit"}}>
              Address: <input ref="address" className="address" name="address"/>
            </label>
            <label style={{color: this.state.color.phone || "inherit"}}>
              Phone: <input ref="phone" className="phone" name="phone"/>
            </label>
            <label style={{color: this.state.color.email || "inherit"}}>
              Email: <input ref="email" className="email" name="email"/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </div>
    );
  }
}

ReactDOM.render(
 <CreationForm />,
 document.getElementById('freelancer-root')
);
