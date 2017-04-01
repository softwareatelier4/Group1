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
      let searchName = document.getElementById('search-what').value;
      if (searchName.match(/[^A-Za-z ]/)) {
        searchWarning.innerHTML = 'Only alphabetic characters allowed.';
        return;
      }
      searchWarning.innerHTML = '';
      let query = `/search?keyword=${searchName}`;
      let origin = document.getElementById('search-where').value;
      if (origin)
        query += `&origin=${origin}`;
      ajaxRequest('GET', query, { ajax : true }, {}, renderFreelancers);
    }
  }
  render() {
    return (
      <div id="search-container">
        <div id="search-bar">
          <input id="search-what" placeholder="What?" onKeyDown={this.searchRequest} />
          <input id="search-where" placeholder="Where?" onKeyDown={this.searchRequest} />
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
          <select id="filter-category-dropdown" defaultValue="" onChange={applyFilters}>
            <option value="">Anything</option>
            {categories}
          </select>
        </div>
        <div id="filter-location">
          <span>Location: </span>
          <select id="filter-location-dropdown" defaultValue="" onChange={applyFilters}>
            <option value="">Anywhere</option>
            {locations}
          </select>
        </div>
        <div id="filter-distance">
          <span id="max-distance-label">Max distance: </span>
          <input id="filter-distance-temp" placeholder="Distance in km" type="range" min="0" max="1" step="0.1" onKeyDown={applyFilters} onInput={applyFilters}/>
        </div>
        <div id="filter-duration">
          <span id="max-duration-label">Max duration: </span>
          <input id="filter-duration-temp" placeholder="Duration in minutes" type="range" min="0" max="1" step="0.1" onKeyDown={applyFilters} onInput={applyFilters}/>
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
  formatDistance(distance) {
    if (!distance || distance !== Number.MAX_SAFE_INTEGER) {
      return (distance / 1000).toFixed(2) + ' km';
    } else {
      return '-';
    }
  }
  formatDuration(duration) {
    if (!duration || duration !== Number.MAX_SAFE_INTEGER) {
      return ', ' + (duration / 3600).toFixed(2) + ' h';
    } else {
      return '';
    }
  }
  redirectFreelancer(freelancer) {
    return function() {
      document.location = `/freelance/${freelancer.props._id}`;
    }
  }
  render () {
    return (
      <div className="freelancer-card" onClick={this.redirectFreelancer(this)} data-category={this.props.category} data-distance={this.props.distance} data-duration={this.props.duration}>
        <div className="freelancer-card-picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-card-info">
          <h1>{this.props.title}</h1>
          <h2>{this.props.firstName} {this.props.familyName}</h2>
          <span>{this.props.category}</span>
          <span>Average Score: {this.formatAvgScore(this.props.avgScore)} / 5</span>
          <span>Price range: {this.formatPrice(this.props.price)}</span>
          <span>Distance: {this.formatDistance(this.props.distance)}{this.formatDuration(this.props.duration)}</span>
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
        distance   = {freelancer.distance}
        duration   = {freelancer.duration}
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

function filterDistanceTest(e) {
  if (e.keyCode && e.keyCode == 13) {
    applyFilters();
  }
}

// Hide a freelancer card if the filters don't match the attributes
function applyFilters() {
  let freelancers = document.getElementsByClassName('freelancer-card');
  let category = document.getElementById('filter-category-dropdown').value;
  let location = document.getElementById('filter-location-dropdown').value;
  // TODO: remove hardcoded values as soon as the seed is fixed and we decide on the format.
  let distance = Number(document.getElementById('filter-distance-temp').value) * 9007199254740992;
  document.getElementById('max-distance-label').innerHTML = "Max distance: " + distance + " km";
  let duration = Number(document.getElementById('filter-duration-temp').value) * 9007199254740992;
  document.getElementById('max-duration-label').innerHTML = "Max duration: " + duration + " m";
  for (let freelancer of freelancers) {
    let fCategory = freelancer.getAttribute('data-category');
    let fDistance = Number(freelancer.getAttribute('data-distance'));
    let fDuration = Number(freelancer.getAttribute('data-duration'));
    //let fLocation = freelancer.getAttribute('data-location');
    if ((category && category !== fCategory) ||
        (distance && fDistance > distance)   ||
        (duration && fDuration > duration)) {//||
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
  // Sort by distance
  freelancers.sort(function(a, b) {
    if (a.distance < b.distance) {
      return -1;
    } else if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  });
  ReactDOM.render(<FreelancersContainer freelancers={freelancers} />, document.getElementById('react-freelancers-container'));
  applyFilters();
}

renderPage();
