'use strict';

class FreelancerCard extends React.Component {
  render() {
      return (
        <div className="freelancer-card"><b>{this.props.name}</b></div>
      );
  }
}

class FreelancersContainer extends React.Component {
  render() {
    let freelancers = [];
    for (let i = 0; i < this.props.freelancers.length; ++i) {
      freelancers.push(<FreelancerCard name={this.props.freelancers[i]} key={i} />);
    }
    return (
      <div id="freelancers-container">
        {freelancers}
      </div>
    );
  }
}

let list = [ 'a', 'b', 'c' ];

function renderComponent(data) {
  ReactDOM.render(<FreelancersContainer freelancers={list} />,
                  document.getElementById('react-freelancers-container'));
}

//ajaxRequest("GET", "/search", { ajax : true }, {}, renderComponent);
renderComponent();
