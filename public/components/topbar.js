/**
 * Topbar components, shared among multiple pages
 * Some components may not rendered, based on the page
 */

/**
 * Title component
 */
class JobAdvisorTitle extends React.Component {
  render () {
    return (<a href='/' id="title">JobAdvisor</a>);
  }
}

function renderTitle() {
  ReactDOM.render(<JobAdvisorTitle/>, document.getElementById('react-title'));
};

/**
 * Home button component
 */
class FreelancerHomeBtn extends React.Component {
  redirect() {
    document.location = '/';
  }
  render () {
    return (<button id="freelancer-home-btn" onClick={this.redirect}>Home</button>);
  }
}

function renderFreelancerHomeBtn() {
  ReactDOM.render(<FreelancerHomeBtn />, document.getElementById('react-freelancer-home-btn'));
};

/**
 * Login form component
 */
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const formData = {
      username : this.refs['login-username'].value,
      password : this.refs['login-password'].value
    };

    ajaxRequest("POST", "/user/login", {}, formData, function(status) {
      console.log(status);
      if(status == 202) {
        location.reload(); // session started, get logged in version of the website
      } else {
        alert("Wrong username or password");
      }
    });
  }

  render () {
    return (
      <form id="login-form" onSubmit={this.handleSubmit}>
        <input id="login-username" ref="login-username" name="login-username" type="text" placeholder="username" required/>
        <input id="login-password" ref="login-password" name="login-password" type="password" placeholder="password" required/>
        <input id="login-submit" ref="login-submit" name="login-submit" className="login-submit" type="submit" value="Login"/>
      </form>
    );
  }
}

function renderLoginForm() {
  ReactDOM.render(<LoginForm />, document.getElementById('react-login'));
}

/**
 * Logout Button component
 */
class LogoutButton extends React.Component {
  logout() {
    ajaxRequest("GET", "/user/logout", {}, {}, function(status) {
      if(status == 202) {
        window.location = '/';
      }
    });
  }

  render () {
    return (<button id="freelancer-logout-btn" onClick={this.logout}>Logout</button>);
  }
}

function renderLogoutButton() {
  ReactDOM.render(<LogoutButton />, document.getElementById('react-logout'));
}

/**
 * Register Button component
 */
class RegisterButton extends React.Component {
  register() {
    window.location = '/user/register';
  }

  render () {
    return (<button id="user-register-btn" onClick={this.register}>Register</button>);
  }
}

function renderRegisterButton() {
  ReactDOM.render(<RegisterButton />, document.getElementById('react-register'));
}

// call rendering functions
renderTitle();

// render home button (not in homepage)
if(document.getElementById('react-freelancer-home-btn')) {
  renderFreelancerHomeBtn();
}

// Either render login form or logout button, based on whether user already logged in
if(document.getElementById('react-login')) {
  renderLoginForm();
  renderRegisterButton();
} else if(document.getElementById('react-logout')) {
  renderLogoutButton();
}
