class FreelancerCard extends React.Component {
  render() {
      return (
        <div className="freelancer-card"><b>{this.props.name}</b></div>
      );
  }
}

class FreelancersContainer extends React.Component {
  render() {
    return (
      <div id="freelancers-container">
        <FreelancerCard name="X" />
        <FreelancerCard name="Y" />
      </div>
    );
  }
}

ReactDOM.render(<FreelancersContainer />, document.getElementById('react-freelancers-container'));
