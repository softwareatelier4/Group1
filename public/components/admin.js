'use strict';

// class CardClaiming extends React.Component {
//   render() {
//     return (
//
//     );
//   }
// }

let g_username;
let g_password;

// Shitty tweak to append React element
function addReactElement(element, container) {
  let div = document.getElementById(container).appendChild(document.createElement('div'));
  ReactDOM.render(element, div);
  div.parentNode.appendChild(div.firstChild);
  div.parentNode.removeChild(div);
}

class CardCategory extends React.Component {
  removeCategory(e) {
    let cardCategory = e.target.parentNode;
    let query = `?username=${g_username}&password=${g_password}`;
    ajaxRequest('DELETE', `/admin/category${query}`, { ajax : true }, {}, function(res) {
      if (res === 204) {
        cardCategory.parentNode.removeChild(cardCategory);
      }
    });
  }
  render() {
    return (
      <div className="card-category" data-name={this.props.name} data-_id={this.props._id}>
        <div className="card-category-name"><span>{this.props.name}</span></div>
        <button onClick={this.removeCategory}>Remove</button>
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
          ajaxRequest('POST', `/admin/category`, { ajax : true }, {
            username : g_username,
            password : g_password,
            name : name
          }, function(res) {
            if (typeof res === 'object') {
              addReactElement(<CardCategory name={name} _id={res._id} />, 'admin-categories');
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
      categories.push(<CardCategory name={category.categoryName} _id={category._id} key={i} />);
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
          <button id="admin-btn-claimings" onClick={this.select('claimings')}>Claimings</button>
          <button id="admin-btn-settings" onClick={this.select('settings')}>Settings</button>
        </div>
        <div id="admin-content">
          <ContainerCategories categories={this.props.data.categories} />
          <div id="admin-claimings">CLAIMINGS</div>
          <div id="admin-settings">SETTINGS</div>
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
