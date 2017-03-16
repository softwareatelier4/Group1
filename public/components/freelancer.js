'use strict';

/**
 * Freelancer View Components
 * CSS styling in css/freelancer.css
 */

ajaxRequest("GET", window.location, { ajax : true }, {}, renderComponent);

function renderComponent(data) {
  // freelancer info
  const tags = data.tags;
  const listTags = tags.map((tag, index) =>
    <li key={index}>
      {tag}
    </li>
  );

  ReactDOM.render(
    <FreelancerView
      first={data.firstName}
      last={data.familyName}
      title={data.title}
      category="TODO-category"
      phone={data.phone}
      address={data.address}
      email={data.email}
      avgScore={data.avgScore}
      tags={listTags}
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
          <div className="picture-placeholder"><img src={this.props.urlPicture} /></div>
          <div className="freelancer-header-info">
            <Name first={this.props.first} last={this.props.last}/>
            <span>{this.props.title}</span>
            <span>{this.props.category}</span>
            <span>Average Score: {this.props.avgScore} in 5</span>
          </div>
        </div>
        <Contact phone={this.props.phone} address={this.props.address} email={this.props.email}/>
        <Tags tags={this.props.tags}/>
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

class Tags extends React.Component {
  render () {
    return (
      <ul className="tag-list">
        {this.props.tags}
      </ul>
    )
  }
}
