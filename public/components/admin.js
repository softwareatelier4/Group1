'use strict';

class LoginForm extends React.Component {
  login(e) {
    if (!e.keyCode || e.keyCode == 13) {
      let username = document.getElementById('login-form-username').value;
      let password = document.getElementById('login-form-password').value;
      let query = `?username=${username}&password=${password}`;
      ajaxRequest('GET', `/admin/login${query}`, { ajax : true }, null, renderAdminSettings);
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

function renderAdminSettings(data) {
  if (data && data.valid) {
    console.log('correct password');
  } else {
    console.log('wrong password');
  }
}

function renderPage() {
  ReactDOM.render(<LoginForm/>, document.getElementById('react-login-form'));
};

renderPage();
