'use strict';

let freelancerId = window.location.pathname.split( '/' )[1];
ajaxRequest("GET", "/freelance/" + freelancerId, {}, renderComponent);

function renderComponent(data) {
  ReactDOM.render(
    <FreelancerView
      first={data.name} last="TODO"
      category="TODO"
      phone={data.phone}
      address={data.address}
      email={data.email}
      avgScore={data.avgScore}
    />,

    document.getElementById('root')
  );
}

class Name extends React.Component {
  render () {
    return (<h1>{this.props.first} {this.props.last}</h1>);
  }
}

class Contact extends React.Component {
  render () {
    return (
      <address>
        <span>{this.props.phone}</span>
        <span>{this.props.address}</span>
        <span>{this.props.email}</span>
      </address>
    );
  }
}

class FreelancerView extends React.Component {
  render () {
    return <div>
        <Name first={this.props.first} last={this.props.last}/>
        <span>{this.props.category}</span>
        <span>Average Score: {this.props.avgScore} in 5</span>
        <Contact phone={this.props.phone} address={this.props.address} email={this.props.email}/>
      </div>
  }
}
