'use strict';

let locationsTemp = [
  "Bellinzona",
  "Lugano",
  "Mendrisio"
];

// Container for the search bar and the search button
class SearchContainer extends React.Component {
  searchRequest(e) {
    // Function triggers only on button click (!e.keyCode) or enter key pressed
    if (!e.keyCode || e.keyCode == 13) {
      let searchWarning = document.getElementById('search-warning');
      let searchName = document.getElementById('search-name').value;
      
      if (searchName.match(/[^A-Za-z ]/)) {
        searchWarning.innerHTML = "Only alphabetic characters allowed.";
        return;
      }
      searchWarning.innerHTML = "";
      let category = document.getElementById('filter-category-dropdown').value;
      let location = document.getElementById('filter-location-dropdown').value;
      let query = `/search?keyword=${searchName}`;
        // + (category ? `&category=${category}` : '')
        // + (location ? `&location=${location}` : '');
      ajaxRequest('GET', query, { ajax : true }, {}, renderFreelancers);
    }
  }
  render() {
    return (
      <div id="search-container">
        <div id="search-bar">
          <input id="search-name" placeholder="What service do you need?" onKeyDown={this.searchRequest} />
          <button id="search-btn" onClick={this.searchRequest}>Search</button>
        </div>
        <div id="search-warning"></div>
      </div>
    );
  }
}

// Container for all filters
class FiltersContainer extends React.Component {
  render() {
    let categories = [];
    for (let i = 0; i < this.props.categories.length; ++i) {
      let category = this.props.categories[i].categoryName;
      categories.push(<option value={category} key={i}>{category}</option>);
    }
    let locations = [];
    for (let i = 0; i < this.props.locations.length; ++i) {
      let location = this.props.locations[i]
      locations.push(<option value={location} key={i}>{location}</option>);
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

// Button that redirects to `add freelancer form`
class FreelancerCreateBtn extends React.Component {
  redirectFreelancerForm() {
    document.location = '/freelance/new';
  }
  render () {
    return (<button id="freelancer-create-btn" onClick={this.redirectFreelancerForm}>Add a freelancer</button>);
  }
}

// Card which displays a freelancer's information
class FreelancerCard extends React.Component {
  redirectFreelancer(freelancer) {
    return function() {
      document.location = `/freelance/${freelancer.props._id}`;
    }
  }
  render () {
    let avgScore = !isNaN(this.props.avgScore) ? this.props.avgScore : '-';
    let price = this.props.price ? this.props.price.min + ' - ' + this.props.price.max + " CHF" : '-';
    return (
      <div className="freelancer-card" onClick={this.redirectFreelancer(this)}>
        <div className="freelancer-card-picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-card-info">
          <h1>{this.props.title}</h1>
          <h2>{this.props.firstName} {this.props.familyName}</h2>
          <span>{this.props.category}</span>
          <span>Average Score: {avgScore} / 5</span>
          <span>Price range: {price}</span>
        </div>
      </div>
    );
  }
}

// Container for all FreelancerCards
class FreelancersContainer extends React.Component {
  render() {
    let freelancers = [];
    for (let i = 0; i < this.props.freelancers.length; ++i) {
      let freelancer = this.props.freelancers[i];
      freelancers.push(<FreelancerCard
        urlPicture = {freelancer.urlPicture}
        firstName  = {freelancer.firstName}
        familyName = {freelancer.familyName}
        title      = {freelancer.title}
        category   = {freelancer.category.categoryName}
        avgScore   = {freelancer.avgScore}
        price      = {freelancer.price}
        _id        = {freelancer._id}
        key        = {i}
        />);
    }
    return (
      <div id="freelancers-container">
        {freelancers}
      </div>
    );
  }
}

// Hide a freelancer card if the filters don't match the attributes
function applyFilters() {
  let freelancers = document.getElementsByClassName('freelancer-card');
  let category = document.getElementById('filter-category-dropdown').value;
  let location = document.getElementById('filter-location-dropdown').value;
  for (let freelancer of freelancers) {
    let fCategory = freelancer.children[1].children[2].innerHTML;
    //let fLocation = freelancer.children[1].children[?].innerHTML;
    if (category && category !== fCategory) {//||
        //(location && location !== fLocation)) {
      freelancer.style.display = 'none';
    } else {
      freelancer.style.display = 'flex';
    }
  }
}

function renderPage(data) {
  renderSearch();
  ajaxRequest("GET", "/category", { ajax : true }, {}, renderFilters);
  renderFreelancerCreateBtn();
  ajaxRequest("GET", "/search", { ajax : true }, {}, renderFreelancers);
}

function renderSearch() {
  ReactDOM.render(<SearchContainer />, document.getElementById('react-search-container'));
}

function renderFilters(categories) {
  ReactDOM.render(<FiltersContainer categories={categories} locations={locationsTemp} />, document.getElementById('react-filters-container'));
}

function renderFreelancerCreateBtn() {
  ReactDOM.render(<FreelancerCreateBtn />, document.getElementById('react-freelancer-create-btn'));
}

function renderFreelancers(freelancers) {
  ReactDOM.render(<FreelancersContainer freelancers={freelancers} />, document.getElementById('react-freelancers-container'));
  applyFilters();
}

renderPage();
