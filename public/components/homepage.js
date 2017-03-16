'use strict';

let listTemp = [
  {
    urlPicture: "",
    first: "Mich",
    last: "Lustro",
    title: "USI student",
    category: "??",
    score: "10",
    price: { min: 20, max: 50 },
    _id: "a"
  },
  {
    urlPicture: "",
    first: "Ame",
    last: "Zucc",
    title: "USI student",
    category: "??",
    score: "10",
    price: { min: 10, max: 1024 },
    _id: "b"
  },
  {
    urlPicture: "",
    first: "Ame",
    last: "Zucc",
    title: "USI student",
    category: "??",
    score: "10",
    price: { min: 10, max: 1024 },
    _id: "c"
  }
];

let categoriesTemp = [
  "Informatics",
  "Management"
];

let locationsTemp = [
  "Bellinzona",
  "Lugano",
  "Mendrision"
];

class SearchContainer extends React.Component {
  searchRequest(e) {
    if (!e.keyCode || e.keyCode == 13) {
      let searchWarning = document.getElementById('search-warning');
      let searchName = document.getElementById('search-name').value;
      if (searchName.length < 3) {
        searchWarning.innerHTML = "At least 3 characters needed.";
        return;
      }
      if (searchName.match(/[^A-Za-z ]/)) {
        searchWarning.innerHTML = "Only alphabetic characters allowed.";
        return;
      }
      searchWarning.innerHTML = "";
      let category = document.getElementById('filter-category-dropdown').value;
      let location = document.getElementById('filter-location-dropdown').value;
      let query = `/search?keyword=${searchName}`
        + (category ? `&category=${category}` : '')
        + (location ? `&location=${location}` : '');
      ajaxRequest('GET', query, { ajax : true }, {}, renderFreelancers);
    }
  }
  render() {
    return (
      <div id="search-container">
        <input id="search-name" placeholder="Who?" onKeyDown={this.searchRequest} />
        <button id="search-btn" onClick={this.searchRequest}>Search</button>
        <div id="search-warning"></div>
      </div>
    );
  }
}

class FiltersContainer extends React.Component {
  render() {
    let categories = [];
    for (let i = 0; i < this.props.categories.length; ++i) {
      categories.push(<option value={this.props.categories[i]} key={i}>{this.props.categories[i]}</option>);
    }
    let locations = [];
    for (let i = 0; i < this.props.locations.length; ++i) {
      locations.push(<option value={this.props.locations[i]} key={i}>{this.props.locations[i]}</option>);
    }
    return (<div id="filters-container">
      <div id="filters">
        <div id="filter-category">
          <span>Category: </span>
          <select id="filter-category-dropdown" defaultValue="">
            <option value="">Anything</option>
            {categories}
          </select>
        </div>
        <div id="filter-location">
          <span>Location: </span>
          <select id="filter-location-dropdown" defaultValue="">
            <option value="">Anywhere</option>
            {locations}
          </select>
        </div>
      </div>
    </div>);
  }
}

class FreelancerName extends React.Component {
  render () {
    return (<h2>{this.props.first} {this.props.last}</h2>);
  }
}

class FreelancerCard extends React.Component {
  redirectFreelancer(freelancer) {
    return function() {
      document.location = `/freelancer/${freelancer._id}`;
    }
  }
  render () {
    this._id = this.props._id;
    return (
      <div className="freelancer-card" onClick={this.redirectFreelancer(this)}>
        <div className="freelancer-card-picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-card-info">
          <h1>{this.props.title}</h1>
          <FreelancerName first={this.props.first} last={this.props.last}/>
          <span>{this.props.category}</span>
          <span>Average Score: {this.props.avgScore} in 5</span>
          <span>Price range: {this.props.price.min + " - " + this.props.price.max + " CHF"}</span>
        </div>
      </div>
    );
  }
}

class FreelancersContainer extends React.Component {
  render() {
    let freelancers = [];
    for (let i = 0; i < this.props.freelancers.length; ++i) {
      freelancers.push(<FreelancerCard
        urlPicture={this.props.freelancers[i].urlPicture}
        first={this.props.freelancers[i].first}
        last={this.props.freelancers[i].last}
        title={this.props.freelancers[i].title}
        category={this.props.freelancers[i].category}
        score={this.props.freelancers[i].avgScore}
        price={this.props.freelancers[i].price}
        _id={this.props.freelancers[i]._id}
        key={i}
        />);
    }
    return (
      <div id="freelancers-container">
        {freelancers}
      </div>
    );
  }
}

function renderPage(data) {
  renderSearch();
  ajaxRequest("GET", "/filters", { ajax : true }, {}, renderFilters);
  ajaxRequest("GET", "/search", { ajax : true }, {}, renderFreelancers);
}

function renderSearch() {
  ReactDOM.render(<SearchContainer />, document.getElementById('react-search-container'));
}

function renderFilters(data) {
  ReactDOM.render(<FiltersContainer categories={categoriesTemp} locations={locationsTemp} />, document.getElementById('react-filters-container'));
}

function renderFreelancers(data) {
  ReactDOM.render(<FreelancersContainer freelancers={listTemp} />, document.getElementById('react-freelancers-container'));
}

renderPage();
