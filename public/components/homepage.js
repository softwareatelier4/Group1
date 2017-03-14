class FreelancerCard extends React.Component {
  render() {
      return (
        <div class="freelancer-card"><b>{this.props.name}</b></div>
      );
  }
}

class FreelancersContainer extends React.Component {
  render() {
    return (
      <div id="freelancers-container">
        <FreelancerCard class="freelancer-card" name="X" />
        <FreelancerCard class="freelancer-card" name="X" />
      </div>
    );
  }
}

ReactDOM.render(<FreelancersContainer />, document.getElementById('freelancers-container'));
