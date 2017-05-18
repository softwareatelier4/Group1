
ajaxRequest("GET", window.location, { ajax : true }, {}, renderComponent);

renderComponent(data) {

  // sort user freelancers by avgScore
  let freelancers = data.freelancers;
  freelancers.sort(function(a, b) {
    return b.avgScore - a.avgScore;
  });

  ReactDOM.render(
    <UserPage
      user={data.username}
      freelancers={freelancers}
    />,
    document.getElementById('react-user-page-root')
  );
}

class UserPage extends React.Component {
  render() {
    return (
      <div id="user-page-title">Freelancer profiles owned by {this.props.user}</div>
    )
  }
};
