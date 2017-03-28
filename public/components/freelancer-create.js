'use strict';

/**
 * Freelancer Creation View Components
 * CSS styling in css/freelancer-create.css
 */

/* Label model for paper input:
 *
 * <div class="group">
 *   <input type="text" required>
 *   <span class="bar"></span>
 *   <label>Name</label>
 * </div>
 */

ajaxRequest("GET", "/category", { ajax : true }, {}, renderComponent);

function renderComponent(data) {
  const categories = data;
  const listCategories = categories.map((category, index) =>
    <option key={index} value={category._id}>{category.categoryName}</option>
  );

  ReactDOM.render(
   <CreationForm categories={listCategories}/>,
   document.getElementById('freelancer-root')
  );
}

class CreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }

    ajaxRequest("POST", "/freelance", {}, formData, function(data) {
      window.location = "/freelance/" + data._id;
    });
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
               <label>
                First Name
              </label>
            </div>

            <div className="group">
              <input ref="familyName" className="family-name" name="family-name" type="text" />
              <span className="bar"></span>
               <label>
                Family Name
              </label>
            </div>
          </div>

          <div className="group">
            <input ref="title" className="job-title" name="job-title" type="text" required/>
            <span className="bar"></span>
             <label>
              Job Title
            </label>
          </div>

          <div className="category-selector">
            <span className="bar"></span>
            <label>
              Job Category
            </label>
            <select ref="category">
              <option selected disabled hidden>Please select a job category</option>
              {this.props.categories}
            </select>
          </div>

          <div className="group">
            <input ref="address" className="address" name="address" type="text"/>
            <span className="bar"></span>
            <label>
              Address
            </label>
          </div>

          <div className="group">
            <input ref="phone" className="phone" name="phone" type="tel" pattern='?\+?[0-9]+'/>
            <span className="bar"></span>
            <label>
              Phone
            </label>
          </div>

          <div className="group">
            <input ref="email" className="email" name="email" type="email" required/>
            <span className="bar"></span>
            <label>
              Email
            </label>
          </div>

          <input className="submit-button" type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}
