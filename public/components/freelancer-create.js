'use strict';

/**
 * Freelancer Creation View Components
 * CSS styling in css/freelancer-create.css
 */

/* Label model for paper input:
 *
 * <div class="group">
 *   <input type="text" required>
 *   <span class="highlight"></span>
 *   <span class="bar"></span>
 *   <label>Name</label>
 * </div>
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
        temp[field] = "#F44336";
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
          <div className="freelancer-form-header">
            <h1>Get started by creating your freelancer profile </h1>
          </div>
          <form onSubmit={this.handleSubmit}>

            <div className="names-input">
              <div className="group">
                <input ref="firstName" className="first-name" name="first-name" type="text" required/>
                <span className="bar"></span>
                <label style={{color: this.state.color.firstName}}>
                  First Name
                </label>
              </div>

              <div className="group">
                <input ref="familyName" className="family-name" name="family-name" type="text" required/>
                <span className="bar"></span>
                <label style={{color: this.state.color.firstName}}>
                  Family Name
                </label>
              </div>
            </div>

            <div className="group">
              <input ref="job-title" className="job-title" name="job-title" type="text" required/>
              <span className="bar"></span>
              <label style={{color: this.state.color.firstName}}>
                Job Title
              </label>
            </div>

            <label className="category-selector" style={{color: this.state.color.category}}>
              Job category:
              <select ref="category">
                <option value="selected">Please select a job category</option>
                <option value="1">One</option>
                <option value="2">Two</option>
              </select>
            </label>

            <div className="group">
              <input ref="address" className="address" name="address" type="text" required/>
              <span className="bar"></span>
              <label style={{color: this.state.color.firstName}}>
                Address
              </label>
            </div>

            <div className="group">
              <input ref="phone" className="phone" name="phone" type="text" required/>
              <span className="bar"></span>
              <label style={{color: this.state.color.firstName}}>
                Phone
              </label>
            </div>

            <div className="group">
              <input ref="email" className="email" name="email" type="text" required/>
              <span className="bar"></span>
              <label style={{color: this.state.color.firstName}}>
                Email
              </label>
            </div>

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
