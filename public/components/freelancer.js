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
      {tag.tagName}
    </li>
  );

  ReactDOM.render(
    <FreelancerView
      first={data.firstName}
      last={data.familyName}
      title={data.title}
      category={data.category.categoryName}
      avgScore={data.avgScore}
      price={data.price}
      description={data.description}
      phone={data.phone}
      address={data.address}
      email={data.email}
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
  render() {
    return (<h1 className="freelancer-header-name">{this.props.first} {this.props.last}</h1>);
  }
}

class Contact extends React.Component {
  render() {
    return (
      <address>
        <span>Phone: <a>{this.props.phone}</a></span>
        <span>Address: <a className="freelancer-address">{this.props.address}</a></span>
        <span>Email: <a className="freelancer-email" href={"mailto:" + this.props.email}>{this.props.email}</a></span>
      </address>
    );
  }
}

class FreelancerView extends React.Component {
  render() {
    return (
      <div className="freelancer-view">
        <FreelancerHeader
          urlPicture={this.props.urlPicture || ""}
          first={this.props.first}
          last={this.props.last}
          title={this.props.title}
          category={this.props.category}
          avgScore={this.props.avgScore}
          price={this.props.price}
        />
        <Contact phone={this.props.phone} address={this.props.address} email={this.props.email}/>
        <div className="freelancer-description">{this.props.description}</div>
        <Tags tags={this.props.tags}/>
      </div>
    );
  }
}

class FreelancerHeader extends React.Component {

  render() {
    let price;
    if(!this.props.price) {
      price = "";
    } else {
      price = "Price range: " + this.props.price.min + " - " + this.props.price.max + " CHF";
    }

    return (
      <div className="freelancer-header">
        <div className="picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-header-info">
          <Name first={this.props.first} last={this.props.last}/>
          <span className="freelancer-header-title">{this.props.title}</span>
          <span>Average Score: {this.props.avgScore}/5</span>
          {price}
        </div>
        <span className="freelancer-category">{this.props.category}</span>
      </div>
  );
  }
}

class Review extends React.Component {
  render() {
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
  render() {
    return (
      <ul className="tag-list">
        {this.props.tags}
      </ul>
    )
  }
}
