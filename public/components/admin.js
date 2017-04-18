'use strict';

class LoginForm extends React.Component {
  login(e) {
    if (!e.keyCode || e.keyCode == 13) {
      console.log("LOGIN");
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

function renderPage() {
  ReactDOM.render(<LoginForm/>, document.getElementById('react-login-form'));
};

renderPage();
