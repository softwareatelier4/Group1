// Topbar
// Button that redirects to homepage

class JobAdvisorTitle extends React.Component {
  render () {
    return (<a href='/' id="title">JobAdvisor</a>);
  }
}

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

function renderTitle() {
  ReactDOM.render(<JobAdvisorTitle/>, document.getElementById('react-title'));
};

renderTitle();
// call rendering functions
if(document.getElementById('react-freelancer-home-btn')) {
  renderFreelancerHomeBtn();
}
