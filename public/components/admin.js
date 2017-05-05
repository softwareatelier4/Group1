'use strict';

let g_username;
let g_password;

// For broken claims
let g_emptyClaim = {
  _id : '000000000000000000000000',
  freelanceID : {
    _id : '000000000000000000000000',
    firstName : 'undefined',
    familyName : 'undefined'
  },
  userID : {
    _id : '000000000000000000000000',
    username : 'undefined'
  }
};

// Shitty tweak to append React element
function addReactElement(element, container) {
  let div = container.appendChild(document.createElement('div'));
  ReactDOM.render(element, div);
  div.parentNode.appendChild(div.firstChild);
  div.parentNode.removeChild(div);
}

class CardClaimComment extends React.Component {
  cancel(e) {
    let cardClaimComment = e.target.parentNode;
    cardClaimComment.parentNode.removeChild(cardClaimComment);
  }
  sendMessage(choice) {
    return function(e) {
      let claim = this.props.claim;
      let claimCard = e.target.parentNode.parentNode;
      let comment = e.target.parentNode.firstChild.value.replace(/\n/g, '<br>');
      let message = `Dear ${claim.userID.username},<br><br>We have decided to <b>${choice}</b> your claim request for the freelancer profile "${claim.freelanceID.firstName} ${claim.freelanceID.familyName}". The reasons are:<br><br>${comment}<br><br>Best regards,<br><br>JobAdvisor`;
      let query = `?username=${g_username}&password=${g_password}&claimid=${claim._id}&choice=${choice}&message=${message}&email=${claim.userID.email}`;
      ajaxRequest('DELETE', `/admin/claim${query}`, { ajax : true }, {}, function(res) {
        if (res === 204) {
          claimCard.parentNode.removeChild(claimCard);
        } else {
          console.log('ERROR sendig claim response');
        }
      });
    }
  }
  render() {
    return (
      <div className="card-claim-comment">
        <textarea rows="5"></textarea>
        <button onClick={this.cancel}>Cancel</button>
        <button onClick={this.sendMessage('accept').bind(this)}>Accept</button>
        <button onClick={this.sendMessage('reject').bind(this)}>Reject</button>
      </div>
    );
  }
}

class CardClaim extends React.Component {
  respond(e) {
    let cardClaim = e.target.parentNode.parentNode;
    if (cardClaim.lastChild.className === 'card-claim-comment') {
      cardClaim.removeChild(cardClaim.lastChild);
    }
    addReactElement(<CardClaimComment claim={this.props.claim} />, cardClaim);
  }
  render() {
    let claim = this.props.claim || g_emptyClaim;
    if (!claim || !claim.freelanceID || !claim.userID) {
      claim = g_emptyClaim;
    }
    let userLink = `/user/${claim.userID._id}`;
    let freelancerLink = `/freelance/${claim.freelanceID._id}`;
    let query = `?username=${g_username}&password=${g_password}&user=${claim.userID.username}&freelancer=${claim.freelanceID.firstName}-${claim.freelanceID.familyName}`;
    let downloadPath = `/admin/files/${this.props.claim._id}${query}`;
    return (
      <div className="card-claim">
        <div className="card-claim-row">
          <div><a target="_blank">{claim.userID.username}</a></div>
          <div><a href={freelancerLink} target="_blank">{claim.freelanceID.firstName} {claim.freelanceID.familyName}</a></div>
          <a href={downloadPath} download>Download files</a>
          <button onClick={this.respond.bind(this)}>Respond</button>
        </div>
      </div>
    );
  }
}

class ContainerClaims extends React.Component {
  render() {
    let claims = [];
    for (let i = 0; i < this.props.claims.length; ++i) {
      let claim = this.props.claims[i];
      claims.push(<CardClaim claim={claim} key={i} />);
    }
    return (
      <div id="admin-claims">
        {claims}
      </div>
    );
  }
}

// Categories

class CardCategoryDocuments extends React.Component {
  deleteDoc (e) {
    alert("Not implemented yet ¯\\_(ツ)_/¯")
  }
  render() {
    let docs = [];
    for (let i = 0; i < this.props.documents.length; ++i) {
      let doc = this.props.documents[i];
      let isRequired = (doc.required) ? 'required' : 'not required';
      docs.push(
        <li key={i}>
          <span className="card-category-document-name">{doc.name}</span>
          <span className="card-category-document-required">{isRequired}</span>
          <button className="card-category-document-delete-btn" onClick={this.deleteDoc.bind(this)}>x</button>
        </li>
      );
    }
    return (
      <div className="card-category-documents" style={{display: 'none'}}>
        <ul>
          {docs}
        </ul>
      </div>
    )
  }
}

class CardCategory extends React.Component {
  // resetName(e) {
  //   let categoryNameSpan = e.target.parentNode.children[1];
  //   categoryNameSpan.innerHTML = this.originalName;
  //   this.editName(e);
  // }
  editName(e) {
    if (!e.keyCode || e.keyCode == 13) {
      let categoryNameBtn = e.target.parentNode.children[0];
      let categoryNameSpan = e.target.parentNode.children[1];
      let categoryDocuments = e.target.parentNode.parentNode.children[2];

      // start editing
      if (!this.editable) {
        this.editable = true;
        this.originalName = categoryNameSpan.innerText;
        categoryNameBtn.innerHTML = 'OK';
        categoryNameSpan.setAttribute('contenteditable', true);
        categoryNameSpan.focus();
        // show documents cards
        categoryDocuments.style.display = "initial";
      }

      // end editing
      else {
        this.editable = false;
        categoryNameBtn.innerHTML = 'Edit';
        categoryNameSpan.setAttribute('contenteditable', false);
        if (this.originalName !== categoryNameSpan.innerText) {
          let query = `?username=${g_username}&password=${g_password}&id=${this.props._id}`;
          ajaxRequest('PUT', `/admin/category${query}`, { ajax : true }, {
            categoryName : categoryNameSpan.innerText
          }, function(category) {
            if (!category._id) {
              categoryNameSpan.innerHTML = this.originalName;
            }
          });
        }
        // hide documents cards
        categoryDocuments.style.display = "none";
      }
    }
  }
  removeCategory(e) {
    let cardCategory = e.target.parentNode;
    let categoryId = cardCategory.getAttribute('data-_id');
    let query = `?username=${g_username}&password=${g_password}&id=${categoryId}`;
    ajaxRequest('DELETE', `/admin/category${query}`, { ajax : true }, {}, function(res) {
      if (res === 204) {
        cardCategory.parentNode.removeChild(cardCategory);
      }
    });
  }
  render() {
    return (
      <div className="card-category" data-name={this.props.name} data-_id={this.props._id}>
        <div className="card-category-name">
          <button onClick={this.editName.bind(this)}>Edit</button>
          <span onKeyDown={this.editName.bind(this)}>{this.props.name}</span>
        </div>
        <button onClick={this.removeCategory}>Remove</button>
        <CardCategoryDocuments documents={this.props.documents} />
      </div>
    );
  }
}

class ContainerCategories extends React.Component {
  addCategory(e) {
    let isNameUnique = function(name) {
      let categories = document.getElementById('admin-categories').children;
      for (let i = 1; i < categories.length; ++i)
        if (categories[i].getAttribute('data-name').toLowerCase() === name.toLowerCase())
          return false;
      return true;
    }
    if (!e.keyCode || e.keyCode == 13) {
      let name = document.getElementById('new-category-input').value;
      if (name) {
        if (isNameUnique(name)) {
          let query = `?username=${g_username}&password=${g_password}`;
          ajaxRequest('POST', `/admin/category${query}`, { ajax : true }, { categoryName : name }, function(res) {
            if (res && res._id) {
              let adminCategories = document.getElementById('admin-categories');
              addReactElement(<CardCategory name={name} _id={res._id} documents={res.documents}/>, adminCategories);
              let newCategoryMessage = document.getElementById('new-category-message');
              newCategoryMessage.innerHTML = '';
            }
          });
        } else {
          let newCategoryMessage = document.getElementById('new-category-message');
          newCategoryMessage.innerHTML = '<span>Chosen category name already exists</span>';
        }
      } else {
        let newCategoryMessage = document.getElementById('new-category-message');
        newCategoryMessage.innerHTML = '<span>No category name given</span>';
      }
    }
  }
  render() {
    let categories = [];
    for (let i = 0; i < this.props.categories.length; ++i) {
      let category = this.props.categories[i];
      categories.push(<CardCategory name={category.categoryName} _id={category._id} key={i} documents={category.documents} />);
    }
    return (
      <div id="admin-categories" className="selected">
        <div id="new-category" className="card-category">
          <input id="new-category-input" placeholder="New category name" onKeyDown={this.addCategory}/>
          <div id="new-category-message"></div>
          <button onClick={this.addCategory}>Add</button>
        </div>
        {categories}
      </div>
    );
  }
}

class AdminView extends React.Component {
  select(pageName) {
    return function() {
      let btns = document.getElementById('admin-menu').children;
      for (let btn of btns) {
        if (btn.id === `admin-btn-${pageName}`) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      }
      let pages = document.getElementById('admin-content').children;
      for (let page of pages) {
        if (page.id === `admin-${pageName}`) {
          page.classList.add('selected');
        } else {
          page.classList.remove('selected');
        }
      }
    }
  }
  render() {
    return (
      <div id="admin-view">
        <div id="admin-menu">
          <button id="admin-btn-categories" className="selected" onClick={this.select('categories')}>Categories</button>
          <button id="admin-btn-claims" onClick={this.select('claims')}>Claims</button>
        </div>
        <div id="admin-content">
          <ContainerCategories categories={this.props.data.categories} />
          <ContainerClaims claims={this.props.data.claims} />
        </div>
      </div>
    );
  }
}

class AdminLogin extends React.Component {
  login(e) {
    if (!e.keyCode || e.keyCode == 13) {
      g_username = document.getElementById('login-form-username').value;
      g_password = document.getElementById('login-form-password').value;
      if (!g_username) {
        let loginFormMessage = document.getElementById('login-form-message');
        loginFormMessage.innerHTML = 'Missing username';
      } else if (!g_password) {
        let loginFormMessage = document.getElementById('login-form-message');
        loginFormMessage.innerHTML = 'Missing password';
      } else {
        let query = `?username=${g_username}&password=${g_password}`;
        ajaxRequest('GET', `/admin/login${query}`, { ajax : true }, null, renderAdminView);
      }
    }
  }
  render () {
    return (
      <div id="login-form">
        <input id="login-form-username" name="username" placeholder="Username" onKeyDown={this.login} />
        <input id="login-form-password" type="password" name="password" placeholder="Password" onKeyDown={this.login} />
        <button id="login-form-btn" name="login-btn" onClick={this.login}>Login</button>
        <div id="login-form-message"></div>
      </div>
    );
  }
}

function renderAdminView(data) {
  if (data && data.valid) {
    ReactDOM.render(<AdminView data={data} />, document.getElementById('react-main'));
  } else {
    let loginFormMessage = document.getElementById('login-form-message');
    loginFormMessage.innerHTML = 'Wrong username or password';
  }
}

function renderPage() {
  ReactDOM.render(<AdminLogin />, document.getElementById('react-main'));
  // g_username = 'admin';
  // g_password = 'asd';
  // ajaxRequest('GET', `/admin/login?username=${g_username}&password=${g_password}`, { ajax : true }, null, renderAdminView);
};

renderPage();
