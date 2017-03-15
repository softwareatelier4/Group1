'use strict';

/**
 * Freelancer View Components
 * CSS styling in css/freelancer.css
 */

let freelancerId = window.location.pathname.split( '/' )[1];
ajaxRequest("GET", "/freelance/" + freelancerId, {}, renderComponent);

function renderComponent(data) {

  // freelancer info
  ReactDOM.render(
    <FreelancerView
      first={data.firstName} last={data.familyName}
      category="TODO-category"
      phone={data.phone}
      address={data.address}
      email={data.email}
      avgScore={data.avgScore}
    />,

    document.getElementById('freelancer-root')
  );

  // reviews
  const reviews = data.reviews;
  const listReviews = reviews.map((review, index) =>
    <Review
      key={index}
      author={review.author}
      text={review.text}
      score={review.score}
      date={review.date}
    />
  );

  ReactDOM.render(
    <div className="freelancer-reviews">
      {listReviews}
    </div>,

    document.getElementById('freelancer-reviews-root')
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
        <span>Phone: <a>{this.props.phone}</a></span>
        <span>Address: <a>{this.props.address}</a></span>
        <span>Email: <a>{this.props.email}</a></span>
      </address>
    );
  }
}

class FreelancerView extends React.Component {

  render () {
    return (
      <div className="freelancer-view">
        <div className="freelancer-header">
          <div className="picture-placeholder"></div>
          <div className="freelancer-header-info">
            <Name first={this.props.first} last={this.props.last}/>
            <div>{this.props.category}</div>
            <span>Average Score: {this.props.avgScore} in 5</span>
          </div>
        </div>
        <Contact phone={this.props.phone} address={this.props.address} email={this.props.email}/>
      </div>
    );
  }
}

class Review extends React.Component {
  render () {
    return (
      <article>
        <div className="review-header">
          <span className="review-author">{this.props.author}</span>
          <span className="review-date">Date: {this.props.date}</span>
          <span className="review-score">Score: {this.props.score}/5</span>
        </div>
        <div className="review-text">{this.props.text}</div>
      </article>
    );
  }
}
