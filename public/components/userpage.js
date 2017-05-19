
ajaxRequest("GET", window.location + "?ajax=true", {}, {}, renderComponent);

function renderComponent(data) {

  // sort user freelancers by avgScore
  // also call the variable "freelancers" because porcoddue sennó poi non capisco
  let freelancers = data.freelancer;
  freelancers.sort(function(a, b) {
    return b.avgScore - a.avgScore;
  });

  let username = data.username;
  const loggedUser = document.getElementById('react-user-page-root').getAttribute('data-username');
  if (loggedUser && loggedUser == username) {
    username = "you";
  }

  ReactDOM.render(
    <UserPage
      user={username}
      freelancers={freelancers}
    />,
    document.getElementById('react-user-page-root')
  );
}

class UserPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let freelancersList = [];
    for (var i = 0; i < this.props.freelancers.length; i++) {
      let freelancer = this.props.freelancers[i];
      let categoryName = 'Other';
      let categoryId = '';
      if (freelancer.category) {
        categoryName = freelancer.category.categoryName;
        categoryId = freelancer.category._id;
      }
      freelancersList.push(<FreelancerCard
        urlPicture = {freelancer.urlPicture}
        firstName  = {freelancer.firstName}
        familyName = {freelancer.familyName}
        title      = {freelancer.title}
        category   = {categoryName}
        categoryID = {categoryId}
        avgScore   = {freelancer.avgScore}
        price      = {freelancer.price}
        _id        = {freelancer._id}
        key        = {i}
      />);
    }
    return (
      <div id="user-page-content">
        <h1 id="user-page-title">Freelancer profiles owned by {this.props.user}</h1>
        <div id="user-page-list">{freelancersList}</div>
      </div>
    )
  }
};

// Card which displays a reduced version of a freelancer's information
class FreelancerCard extends React.Component {
  formatAvgScore(avgScore) {
    if (isNaN(avgScore)) {
      return '-';
    } else {
      return avgScore;
    }
  }
  formatPrice(price) {
    if (price) {
      return price.min + ' - ' + price.max + ' CHF';
    } else {
      return '-';
    }
  }
  redirectFreelancer(freelancer) {
    return function() {
      document.location = `/freelance/${freelancer.props._id}`;
    }
  }
  render () {
    return (
      <div
        className="freelancer-card"
        onClick={this.redirectFreelancer(this)}
        data-category={this.props.category}
      >
        <div className="freelancer-card-picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-card-info">
          <h1 className="job-title  ">{this.props.title}</h1>
          <h2>{this.props.firstName} {this.props.familyName}</h2>
          <span>Average Score: {this.formatAvgScore(this.props.avgScore)} / 5</span>
          <span>Price range: {this.formatPrice(this.props.price)}</span>
        </div>
        <span className="category" data-category={this.props.categoryID}>{this.props.category}</span>
      </div>
    );
  }
}
