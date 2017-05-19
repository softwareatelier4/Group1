
ajaxRequest("GET", window.location + "?ajax=true", {}, {}, renderComponent);

function renderComponent(data) {

  // call the variable "freelancers" because pls sennó poi non capisco
  // filter user freelancers to just verified
  // sort user freelancers by avgScore
  let freelancers = data.freelancer;
  freelancers.filter(function(f) {
    return f.state == 'verified';
  });
  freelancers.sort(function(f1, f2) {
    return f2.avgScore - f1.avgScore;
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
    let isOwner = this.props.user == 'you';
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
        isOwner      = {isOwner}
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
  constructor(props) {
    super(props);
  }

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
        <EditDelete show={this.props.isOwner} freelancerID={this.props._id}/>
      </div>
    );
  }
}

class EditDelete extends React.Component {
  constructor(props) {
    super(props);
  }

  editFreelancer(freelancerID) {
    return function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      alert("TODO: Edit " + freelancerID)
    }
  }
  deleteFreelancer(freelancerID) {
    return function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      alert("TODO: Delete " + freelancerID)
    }
  }

  render() {
    if (this.props.show) {
      return (
        <div className="freelancer-edit-delete-buttons">
          <button
            className="modify-button freelancer-edit"
            onClick={this.editFreelancer(this.props.freelancerID)}
          >Edit</button>
          <button
            className="modify-button freelancer-delete"
            onClick={this.deleteFreelancer(this.props.freelancerID)}
          >Delete</button>
        </div>
      );
    } else {
      return (
        <div className="freelancer-edit-delete-buttons"></div>
      );
    }
  }

}
