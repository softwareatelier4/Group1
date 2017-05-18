class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    // create user
    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }

    let form = evt.target;
    let userName = document.getElementsByClassName('username')[0];
    let tick = document.getElementsByClassName('register-tick')[0];

    ajaxRequest("POST", "/user", {}, formData, function(data) {

      if (data == 409) { // existing username
        console.log("username taken");
        console.log(userName);
        userName.setCustomValidity("Username already exists");
        // HACKERONI MACCHERONI
        document.getElementsByClassName('submit-button')[0].click();
      }
      else { // ok
        const loginData = {
          username : formData.username,
          password : formData.password
        };

        // login the user
        ajaxRequest("POST", "/user/login", {}, loginData, function(status) {
          console.log(tick.checked);
          if(status == 202) {
            if (tick.checked) {
              window.location = '/freelance/new#myself';
            }
            else {
              window.location = '/';
            }
          }
        });
      }
    });
  }

  resetValidity(ev) {
    ev.target.setCustomValidity("");
  }

  checkPassword() {

    let password = document.getElementsByClassName('password')[0];
    let confirm = document.getElementsByClassName('confirm-password')[0];
    let submit =  document.getElementsByClassName('submit-button')[0];

    if (password.value != confirm.value || password.value == "") {
      password.style.border = "solid #F44336";
      confirm.style.border = "solid #F44336";
      submit.disabled = true;
    }
    else {
      password.style.border = "solid lightgreen";
      confirm.style.border = "solid lightgreen";
      submit.disabled = false;
    }
  }

  render() {
    return (
      <div></div>
    )
  }
};

ReactDOM.render(<UserPage />, document.getElementById('react-user-page-container'));
