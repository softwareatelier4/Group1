'use strict';

// class CardClaiming extends React.Component {
//   render() {
//     return (
//
//     );
//   }
// }

class CardCategory extends React.Component {
  removeCategory(e) {
    // TODO: make delete request to server
    // Remove element from HTML
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  }
  render() {
    return (
      <div className="card-category" data-name={this.props.name} data-_id={this.props._id}>
        <div><span>{this.props.name}</span></div>
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
        if (categories[i]['data-name'] === name)
          return false;
      return true;
    }
    if (!e.keyCode || e.keyCode == 13) {
      let name = document.getElementById('new-category-input').value;
      if (name) {
        if (isNameUnique(name)) {
          // ajaxRequest('POST', `/admin/add`, { ajax : true }, { name : name }, renderAdminView);
          // TODO add
        } else {
          console.log('Name already exists');
        }
      } else {
        console.log('No category name given');
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
      let username = document.getElementById('login-form-username').value;
      let password = document.getElementById('login-form-password').value;
      let query = `?username=${username}&password=${password}`;
      ajaxRequest('GET', `/admin/login${query}`, { ajax : true }, null, renderAdminView);
    }
  }
  render () {
    return (
      <div id="login-form">
        <input id="login-form-username" name="username" placeholder="Username" onKeyDown={this.login} />
        <input id="login-form-password" name="password" placeholder="Password" onKeyDown={this.login} />
        <button id="login-form-btn" name="login-btn" onClick={this.login}>Login</button>
      </div>
    );
  }
}

function renderAdminView(data) {
  if (data && data.valid) {
    ReactDOM.render(<AdminView data={data} />, document.getElementById('react-main'));
  } else {
    console.log('wrong password');
  }
}

function renderPage() {
  // ReactDOM.render(<AdminLogin />, document.getElementById('react-main'));
  ajaxRequest('GET', `/admin/login?username=admin&password=asd`, { ajax : true }, null, renderAdminView);
};

renderPage();
