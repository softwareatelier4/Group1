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
    let reqFiles = document.getElementById('required-docs').childElementCount;
    if (files.length < reqFiles) {
      let message = document.getElementById('freelancer-claim-form-message');
      message.innerHTML = 'Not enough required files submitted';
    } else {
      ajaxRequest('POST', '/claim/new', { ajax : true }, { freelancerId : createdFreelancerId }, function(claimData) {
        if (claimData._id) {
          // Send files
          let claimid = document.getElementById('freelancer-claim-form-claimid');
          let claimidOpt = document.getElementById('freelancer-claim-form-claimid-optional');
          claimid.value = claimData._id;
          claimidOpt.value = claimData._id;

          // Submit files
          let formDataRequired = new FormData(document.getElementById('freelancer-claim-form-form'));
          ajaxRequest('POST', '/claim/upload', null, formDataRequired, function(status) {
            if(status == 202) {
              let formDataOptional = new FormData(document.getElementById('freelancer-claim-form-form-optional'));
              ajaxRequest('POST', '/claim/uploadopt', null, formDataOptional, function(status) {
                if(status == 202) {
                  // redirect to the created profile
                  window.location = "/freelance/" + createdFreelancerId;
                } else {
                  console.log(status.error);
                }
              });
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
              <input ref="firstName" className="first-name" name="first-name" type="text" placeholder="First Name" required/>
              <span className="bar"></span>
            </div>

            <div className="group">
              <input ref="familyName" className="family-name" name="family-name" type="text" placeholder="Family Name"/>
              <span className="bar"></span>
            </div>
          </div>

          <div className="group">
            <input ref="title" className="job-title" name="job-title" type="text" placeholder="Job Title" required/>
            <span className="bar"></span>
          </div>

          <div className="category-selector">
            <span className="bar"></span>
            <label>
              Job Category
            </label>
            <select id="category-list" name="category" ref="category" required>
              <option value="" selected disabled hidden>Please select a job category</option>
              {this.props.categories}
            </select>
          </div>

          <div className="group">
            <input ref="description" className="job-description" name="job-description" type="text" placeholder="Job Description" required/>
            <span className="bar"></span>
          </div>

          <div className="group">
            <input ref="tags" className="job-tags" name="job-tags" type="text" placeholder="Job tags (separated by a comma)"/>
            <span className="bar"></span>
          </div>

          <div className="group">
            <input ref="urlPicture" className="picture-url" name="picture-url" type="text" placeholder="Picture URL"/>
            <span className="bar"></span>
          </div>

          <div className="group">
            <input ref="address" className="address" name="address" type="text" placeholder="Address" required/>
            <span className="bar"></span>
          </div>

          <div className="group">
            <input ref="phone" className="phone" name="phone" type="tel" placeholder="Phone Number" pattern='?\+?[0-9]+'/>
            <span className="bar"></span>
          </div>

          <div className="group">
            <input ref="email" className="email" name="email" type="email" placeholder="E-mail" required/>
            <span className="bar"></span>
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
    { ajax : true },
    {},
    function(data) { renderComponent(data, isMyself) }
  );
}

function switchCategory(e) {
  let selCategory = categories.filter(x => x.categoryName == e.target.options[e.target.selectedIndex].text)[0];
  let reqDocuments = selCategory.documents.filter(x => x.required).map((document, index) =>
      <li key={index}>
      {document.name}
      </li>
    );
  let optDocuments = selCategory.documents.filter(x => !(x.required)).map((document, index) =>
      <li key={index}>
      {document.name}
      </li>
    );
  ReactDOM.render(
    <FreelancerClaimForm reqDocs={reqDocuments} optDocs={optDocuments}/>,
    document.getElementById('react-claim-form-root')
  );
}

let categories;
/**
 * Render form component as a result of AJAX
 * @param  {Object}  data
 * @param  {Boolean} isMyself
 */
function renderComponent(data, isMyself) {
  categories = data;
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

    // update required documents based on selected categoy
    document.getElementById('category-list').addEventListener("change", switchCategory);
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
          <p>Upload these necessary documents:</p>
          <div id="required-docs">{this.props.reqDocs}</div>
          <input id="freelancer-claim-form-files" name="idfile" type="file" multiple="true" />
        </form>
        <form id="freelancer-claim-form-form-optional" encType="multipart/form-data" action="/claim/upload" method="post">
          <input id="freelancer-claim-form-claimid-optional" type="hidden" name="claimid" value=""/>
          <input type="hidden" name="freelancerid" value={this.props.freelancerid} />
          <p>Upload any other optional document such as:</p>
          <div id="optional-docs">{this.props.optDocs}</div>
          <input id="freelancer-claim-form-optional-files" name="idfileopt" type="file" multiple="true" />
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
  }

  render() {
    return (
      <div id="freelancer-type">
        <button id="freelancer-other" onClick={showForm}><br/><br/>By choosing this option <br/> you will create a new unclaimed freelancer card.</button>
        <button id="freelancer-myself" onClick={showForm}><br/><br/>By choosing this option <br/> you will create a freelancer and start the caliming process.</button>
      </div>
    );
  }
}

/**
 * Show correct form version
 * @param  {Object} evt either click event of boolean (if called directly)
 */
function showForm(evt) {
  let isMyself = (evt == true) || (evt.target && evt.target.id == "freelancer-myself");
  // check user is logged in
  if(isMyself && !document.getElementById('freelancer-root').getAttribute('data-username')) {
    alert("You need to login to create your own freelancer profile");
    window.location = '/freelance/new';
  }

  doAjaxAndRenderForm(isMyself);
}

function renderFreelancerTypeButtons() {
  ReactDOM.render(
    <FreelancerTypeButtons />,
    document.getElementById('freelancer-root')
  );
}

/**
 * Render components function
 *
 * if #myself or #other set in URL, go directly to respective form
 * (checks still in place for #myself)
 * */
if(window.location.hash) {
  let hash = window.location.hash.substring(1);
  switch (hash) {
    case 'myself':
      showForm(true); break;
    case 'other':
      showForm(false); break;
  }
} else {
  renderFreelancerTypeButtons();
}
