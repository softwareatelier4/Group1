'use strict';

/**
 * Freelancer View Components
 * CSS styling in css/freelancer.css
 */

let userName;
let documents;

ajaxRequest("GET", window.location, { ajax : true }, {}, renderComponent);

function renderComponent(data) {
  // freelancer info
  if (data.owner) {
    userName = data.owner.username;
  }

  const tags = data.tags;

  let listTags;
  if(tags && tags[0] != null) {
    listTags = tags.map((tag, index) =>
      <li key={index}>
        {tag.tagName}
      </li>
    );
  } else {
    listTags = [];
  }

  let categoryName = 'Other';

  if (data.category) {
    categoryName = data.category.categoryName;
  }

  ReactDOM.render(
    <FreelancerView
      first={data.firstName}
      last={data.familyName}
      title={data.title}
      category={categoryName}
      avgScore={data.avgScore}
      reviewCount={data.reviews.length}
      price={data.price}
      description={data.description}
      phone={data.phone}
      address={data.address}
      email={data.email}
      tags={listTags}
      urlPicture = {data.urlPicture}
      _id={data._id}
      state={data.state}
    />,

    document.getElementById('freelancer-root')
  );

  documents = data.category.documents;

  renderReviews(data);
}

function renderReviews(data) {
  let reviews = data.reviews;
  // sort by date
  reviews.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const listReviews = reviews.map((review, index) =>
    <Review
      key={index}
      id={review._id}
      author={review.author}
      text={review.text}
      score={review.score}
      date={review.date}
      reviewCount={reviews.length}
      reply={review.reply}
      display={(review.text && review.text != "Enter text...") ? "inherit" : "none"}
    />
  );

  if(document.getElementById('freelancer-logged-reviews-root')) { // if user logged in, show review form
    ReactDOM.render(
      <div className="freelancer-reviews">
        <ReviewForm />
        {listReviews}
      </div>,

      document.getElementById('freelancer-logged-reviews-root')
    );
  }  else if(document.getElementById('freelancer-reviews-root')) {
    ReactDOM.render(
      <div className="freelancer-reviews">
        <p>Login to be able to write a review</p>
        {listReviews}
      </div>,

      document.getElementById('freelancer-reviews-root')
    );
  }
}

class Name extends React.Component {
  render() {
    return (<h1 className="freelancer-header-name">{this.props.first} {this.props.last}</h1>);
  }
}

class Contact extends React.Component {
  render() {
    return (
      <address>
        <span>Phone: <a>{this.props.phone}</a></span>
        <span>Address: <a className="freelancer-address">{this.props.address}</a></span>
        <span>Email: <a className="freelancer-email" href={"mailto:" + this.props.email}>{this.props.email}</a></span>
      </address>
    );
  }
}

class FreelancerView extends React.Component {
  render() {
    return (
      <div className="freelancer-view">
        <FreelancerClaim
          _id={this.props._id}
          state={this.props.state}
        />
        <FreelancerHeader
          urlPicture={this.props.urlPicture || ""}
          first={this.props.first}
          last={this.props.last}
          title={this.props.title}
          category={this.props.category}
          reviewCount={this.props.reviewCount}
          avgScore={this.props.avgScore}
          price={this.props.price}
        />
        <Contact phone={this.props.phone} address={this.props.address} email={this.props.email}/>
        <div className="freelancer-description">{this.props.description}</div>
        <Tags tags={this.props.tags}/>
      </div>
    );
  }
}

class FreelancerClaimForm extends React.Component {
  claim() {
    let files = document.getElementById('freelancer-claim-form-files').files;
    let reqFiles = document.getElementById('required-docs').childElementCount;
    if (files.length < reqFiles || files.length === 0) {
      let message = document.getElementById('freelancer-claim-form-message');
      message.innerHTML = 'Not enough required files submitted';
    } else {
      ajaxRequest('POST', '/claim/new', { ajax : true }, { freelancerId : this.props.freelancerid }, function(claimData) {
        if (claimData._id) {
          let claimBtn = document.getElementById('freelancer-claim-toggle-claim');
          claimBtn.classList.add('hidden');
          let duplicateBtn = document.getElementById('freelancer-claim-toggle-duplicate');
          duplicateBtn.classList.add('hidden');
          let freelancerClaim = document.getElementById('freelancer-claim');
          freelancerClaim.className = 'bg-yellow';
          let freelancerClaimStatusName = document.getElementById('freelancer-claim-status-name');
          freelancerClaimStatusName.innerHTML = 'IN PROGRESS';
          // Send files
          let claimid = document.getElementById('freelancer-claim-form-claimid');
          let claimidOpt = document.getElementById('freelancer-claim-form-claimid-optional');
          claimid.value = claimData._id;
          claimidOpt.value = claimData._id;

          // Submit files
          let formDataRequired = new FormData(document.getElementById('freelancer-claim-form-form'));
          ajaxRequest('POST', '/claim/upload', null, formDataRequired, function(status) {
            let formDataOptional = new FormData(document.getElementById('freelancer-claim-form-form-optional'));
            ajaxRequest('POST', '/claim/uploadopt', null, formDataOptional, function(status) {
              // Delete form
              let freelancerClaimForm = document.getElementById('freelancer-claim-form');
              freelancerClaimForm.parentNode.removeChild(freelancerClaimForm);
            });
          });
        } else if (claimData === 451) {
          let message = document.getElementById('freelancer-claim-form-message');
          message.innerHTML = 'Please log in to claim a freelancer profile';
        } else if (claimData === 452) {
          let message = document.getElementById('freelancer-claim-form-message');
          message.innerHTML = 'This user is already claiming/has already claimed a freelancer profile';
        } else if (claimData === 453) {
          let message = document.getElementById('freelancer-claim-form-message');
          message.innerHTML = 'This freelancer profile is already being claimed';
        } else {
          let message = document.getElementById('freelancer-claim-form-message');
          message.innerHTML = 'Something went wrong';
        }
      });
    }
  }

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
        <button id="freelancer-claim-btn" onClick={this.claim.bind(this)}>Claim</button>
        <div id="freelancer-claim-form-message"></div>
      </div>
    );
  }
}

class FreelancerDuplicateForm extends React.Component {
  render() {
    return (<div id="freelancer-duplicate-form">DUPLICATE FORM</div>);
  }
}

class FreelancerClaim extends React.Component {
  toggleForm(formName) {
    this.formVisible = 'none';
    return function() {
      if (this.props.state === 'not verified') {
        let freelancerClaim = document.getElementById('freelancer-claim');
        let duplicateBtn = document.getElementById('freelancer-claim-toggle-duplicate');
        let claimBtn = document.getElementById('freelancer-claim-toggle-claim');

        if (formName === 'claim') {
          if (this.formVisible !== 'claim') {
            this.formVisible = 'claim';
            // Hide duplicate form
            duplicateBtn.innerHTML = 'REPORT DUPLICATE';
            let freelancerDuplicateForm = document.getElementById('freelancer-duplicate-form');
            if (freelancerDuplicateForm) {
              freelancerDuplicateForm.parentNode.removeChild(freelancerDuplicateForm);
            }
            // Show claim form
            claimBtn.innerHTML = 'CANCEL';
            let listReqDocs = documents.filter(x => x.required).map((document, index) =>
              <li key={index}>
              {document.name}
              </li>
            );
            let listOptDocs = documents.filter(x => !(x.required)).map((document, index) =>
              <li key={index}>
              {document.name}
              </li>
            );
            addReactElement(<FreelancerClaimForm freelancerid={this.props._id} reqDocs={listReqDocs} optDocs={listOptDocs}/>, freelancerClaim);
          } else {
            this.formVisible = 'none';
            // Hide claim form
            claimBtn.innerHTML = 'CLAIM';
            claimBtn.innerHTML = 'CLAIM';
            let freelancerClaimForm = document.getElementById('freelancer-claim-form');
            if (freelancerClaimForm) {
              freelancerClaimForm.parentNode.removeChild(freelancerClaimForm);
            }
          }
        } else if (formName === 'duplicate') {
          if (this.formVisible !== 'duplicate') {
            this.formVisible = 'duplicate';
            // Hide claim form
            claimBtn.innerHTML = 'CLAIM';
            let freelancerClaimForm = document.getElementById('freelancer-claim-form');
            if (freelancerClaimForm) {
              freelancerClaimForm.parentNode.removeChild(freelancerClaimForm);
            }
            // Show duplicate form
            duplicateBtn.innerHTML = 'CANCEL';
            addReactElement(<FreelancerDuplicateForm />, freelancerClaim);
          } else {
            this.formVisible = 'none';
            // Hide duplicate form
            duplicateBtn.innerHTML = 'REPORT DUPLICATE';
            let freelancerDuplicateForm = document.getElementById('freelancer-duplicate-form');
            if (freelancerDuplicateForm) {
              freelancerDuplicateForm.parentNode.removeChild(freelancerDuplicateForm);
            }
          }
        }
      }
    };
  }

  render() {
    let bgColor = 'bg-orange';
    let isLogged = document.getElementById('freelancer-logged-reviews-root');
    let claimBtn = '';
    let claimDisabled = false;
    let claimText = 'CLAIM';
    let duplicateBtn = '';
    let duplicateDisabled = false;
    let duplicateText = 'REPORT DUPLICATE';
    if (this.props.state === 'verified') {
      bgColor = 'bg-green';
      claimBtn = 'hidden';
      duplicateBtn = 'hidden';
    } else if (this.props.state === 'in progress') {
      bgColor = 'bg-yellow';
      claimBtn = 'hidden';
      duplicateBtn = 'hidden';
    } else if (!isLogged) {
      claimDisabled = true;
      claimText = 'LOGIN TO CLAIM';
      duplicateDisabled = true;
      duplicateText = 'LOGIN TO REPORT DUPLICATE'
    }
    return (
      <div id="freelancer-claim" className={bgColor}>
        <div id="freelancer-claim-status">
          <div id="freelancer-claim-status-name">{this.props.state.toUpperCase()}</div>
          <button onClick={this.toggleForm('claim').bind(this)} id="freelancer-claim-toggle-claim" className={claimBtn} disabled={claimDisabled}>{claimText}</button>
          <button onClick={this.toggleForm('duplicate').bind(this)} id="freelancer-claim-toggle-duplicate" className={claimBtn} disabled={duplicateDisabled}>{duplicateText}</button>
        </div>
      </div>
    );
  }
}

class FreelancerHeader extends React.Component {

  render() {
    let price;
    if(!this.props.price) {
      price = "";
    } else {
      price = "Price range: " + this.props.price.min + " - " + this.props.price.max + " CHF";
    }

    return (
      <div className="freelancer-header">
        <div className="picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-header-info">
          <Name first={this.props.first} last={this.props.last}/>
          <span className="freelancer-header-title">{this.props.title}</span>
          <span>{"Average Score: " + this.props.avgScore + "/5 (" + this.props.reviewCount + " reviews)"}</span>
          {price}
        </div>
        <span className="freelancer-category">{this.props.category}</span>
      </div>
  );
  }
}

class ReviewForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let form = evt.target;

    const formData = {};
    formData['score'] = form.elements['score'].value;
    formData['text'] = form.elements['comment'].value;
    formData['author'] = document.getElementById('freelancer-logged-reviews-root').getAttribute('data-username');

    ajaxRequest("POST", window.location + "/review", {}, formData, function() {
      /**
       * we discard received data, we get and re-render all reviews and freelance info
       * since we do not update them live, and here we would have to render the component
       * again anyway (new review and new average)
       */
       ajaxRequest("GET", window.location, { ajax : true }, {}, function(data) {
         renderComponent(data);
         // reset form
         document.getElementById("review-form").reset();
       });
    });
  }

  generateRadioButtons() {
    const MAX_SCORE = 5;
    let group = [];
    for(let i = 1; i <= MAX_SCORE; i++) {
      let radio = document.createElement("input");
      group.push(<span key={i}><input type="radio" name="score" ref="score" id={"score-" + i} value={i} required/><label> {i} </label></span>);
    }
    return group;
  }

  render() {
    return (
      <div className="review-form">
        <h3>Post a review</h3>
        <form id="review-form" onSubmit={this.handleSubmit} method="post">
          <div className="score-selector">
            <label>Score: </label>
            {this.generateRadioButtons()}
          </div>
          <textarea className="review-form-comment" name="comment" placeholder="Enter text...">
          </textarea>
          <input name="submit-button" className="submit-button" type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

class ReplyForm extends React.Component {

  handleSubmitReply(e) {
    e.preventDefault();
    let form = e.target;

    const formData = {};
    formData['text'] = form.elements['comment'].value;
    formData['author'] = document.getElementById('freelancer-logged-reviews-root').getAttribute('data-username');
    formData['score'] = 0;
    formData['reply'] = form.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
    ajaxRequest("POST", window.location + "/review", {}, formData, function() {
      /**
       * we discard received data, we get and re-render all reviews and freelance info
       * since we do not update them live, and here we would have to render the component
       * again anyway (new review and new average)
       */
       ajaxRequest("GET", window.location, { ajax : true }, {}, function(data) {
         renderReviews(data);
       });
    });
  }

  render() {
    return (
      <div className="reply-form">
        <h5>Post reply:</h5>
        <form id="review-form" onSubmit={this.handleSubmitReply} method="post">
          <textarea className="review-form-comment" name="comment" placeholder="Enter reply...">
          </textarea>
          <input name="submit-button" className="submit-button" type="submit" value="Reply"/>
        </form>
      </div>
    )
  }
}

class Review extends React.Component {

  constructor(props) {
    super(props);
    this.state = { replying: false };
  }

  replyToReview(e) {
    this.setState({
      replying: !this.state.replying
    })
  }

  render() {
    let isOwner;
    if (document.getElementById('freelancer-logged-reviews-root') != null) {
      isOwner = (document.getElementById('freelancer-logged-reviews-root').getAttribute('data-username') == userName);
    } else {
      isOwner = false;
    }
    return (
      <article style={{display: this.props.display}} data-id={this.props.id}>
        <div className="review-header">
          <span className="review-author">{this.props.author}</span>
          <span className="review-date">Date: {this.props.date}</span>
          <span className="review-score">Score: {this.props.score}/5</span>
        </div>
        <div className="review-text">{this.props.text}</div>
        <div className="reply-container">
          {this.props.reply ? (<span>{this.props.reply ?
            (<div>
              <p className="reply-date">{this.props.reply.date}</p>
              <p className="reply-text">{this.props.reply.text}</p>
              </div>) : (null)}</span>) :
          (
            <div>
            {this.state.replying ? (<ReplyForm/>) : (null)}
            {isOwner ? (
              <button onClick={this.replyToReview.bind(this)}>
                {this.state.replying ? ("Cancel") : ("Reply")}
              </button>
              ) : (null)}

            </div>
          )}
        </div>
      </article>
    );
  }
}

class Tags extends React.Component {
  render() {
    return (
      <ul className="tag-list">
        {this.props.tags}
      </ul>
    )
  }
}

// Shitty tweak to append React element
function addReactElement(element, container) {
  let div = container.appendChild(document.createElement('div'));
  ReactDOM.render(element, div);
  div.parentNode.appendChild(div.firstChild);
  div.parentNode.removeChild(div);
}
