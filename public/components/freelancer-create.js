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


class CreationForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.claim = this.claim.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    // create freelancer
    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }

    let form = this;

    ajaxRequest("POST", "/freelance", {}, formData, function(data) {
      if(form.props.isMyself) {
        // send claim request if registering myself
        form.claim(data._id);
      } else {
        window.location = "/freelance/" + data._id;
      }

    });
  }

  claim(createdFreelancerId) {
    let files = document.getElementById('freelancer-claim-form-files').files;
    if (files.length === 0) {
      let message = document.getElementById('freelancer-claim-form-message');
      message.innerHTML = 'No file was given';
    } else {
      ajaxRequest('POST', '/claim/new', { ajax : true }, { freelancerId : createdFreelancerId }, function(claim) {
        if (claim._id) {
          // Send files
          let claimid = document.getElementById('freelancer-claim-form-claimid');
          claimid.value = claim._id;

          // Submit files
          let formData = new FormData(document.getElementById('freelancer-claim-form-form'));
          ajaxRequest('POST', '/claim/upload', null, formData, function(status) {
            if(status == 202) {
              // redirect to the created profile
              window.location = "/freelance/" + createdFreelancerId;
            } else {
              console.log(status.error);
            }
          });

        } else {
          let message = document.getElementById('freelancer-claim-form-message');
          message.innerHTML = 'Freelancer or user are already in a claim procedure, or you are not logged in';
        }
      });
    }
  }

  render() {
    return (
      <div className="freelancer-form">
        <div className="freelancer-form-header">
          <h1 id="freelancer-form-title">{ this.props.isMyself ? 'Create your own freelancer profile' : 'Create a freelancer profile for someone else' }</h1>
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
              <input ref="familyName" className="family-name" name="family-name" type="text"/>
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
            <select name="category" ref="category" required>
              <option value="" selected disabled hidden>Please select a job category</option>
              {this.props.categories}
            </select>
          </div>

          <div className="group">
            <input ref="address" className="address" name="address" type="text" required/>
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
          <div id="react-claim-form-root"></div>
          <input name="submit-button" className="submit-button" type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

/**
 * Sends AJAX request and render the correct creation form
 * @param  {Boolean} isMyself `true` if it should render the "Add myself as freelancer" form
 */
function doAjaxAndRenderForm(isMyself) {
  ajaxRequest("GET",
    "/category",
    { ajax : true }, {},
    function(data) { renderComponent(data, isMyself) }
  );
}

/**
 * Render form component as a result of AJAX
 * @param  {Object}  data
 * @param  {Boolean} isMyself
 */
function renderComponent(data, isMyself) {
  const categories = data;
  const listCategories = categories.map((category, index) =>
    <option key={index} value={category._id}>{category.categoryName}</option>
  );

  ReactDOM.render(
   <CreationForm
    categories={listCategories}
    isMyself={isMyself}
  />,
   document.getElementById('freelancer-root')
  );

  // render claiming form
  if(isMyself) {
    ReactDOM.render(
      <FreelancerClaimForm />,
      document.getElementById('react-claim-form-root')
    );
  }
}

/**
 * Claim Form Component (same as freelancer page)
 */
class FreelancerClaimForm extends React.Component {
  // clain() in CreationForm

  render() {
    return (
      <div id="freelancer-claim-form">
        <form id="freelancer-claim-form-form" encType="multipart/form-data" action="/claim/upload" method="post">
          <input id="freelancer-claim-form-claimid" type="hidden" name="claimid" value=""/>
          <input type="hidden" name="freelancerid" value={this.props.freelancerid} />
          <input id="freelancer-claim-form-files" name="idfile" type="file" multiple="true" />
        </form>
        <div id="freelancer-claim-form-message"></div>
      </div>
    );
  }
}

/**
 * Form Type Buttons Component
 */
class FreelancerTypeButtons extends React.Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
  }

  showForm(evt) {
    let isMyself = evt.target.id == "freelancer-myself";
    // check user is logged in
    if(isMyself && !document.getElementById('freelancer-root').getAttribute('data-username')) {
      alert("You need to login to create your own freelancer profile");
      return;
    } else if(isMyself && document.getElementById('freelancer-root').getAttribute('data-user-freelancer')) {
      alert("You already have your own freelancer profile");
      return;
    }

    doAjaxAndRenderForm(isMyself);
  }

  render() {
    return (
      <div id="freelancer-type">
        <button id="freelancer-other" onClick={this.showForm}>Add someone else</button>
        <button id="freelancer-myself" onClick={this.showForm}>Add yourself</button>
      </div>
    );
  }
}

function renderFreelancerTypeButtons() {
  ReactDOM.render(
    <FreelancerTypeButtons />,
    document.getElementById('freelancer-root')
  );
}

/**
 * Render components function
 */
//TODO check url #myself
renderFreelancerTypeButtons()
