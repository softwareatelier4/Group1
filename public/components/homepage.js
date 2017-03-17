'use strict';

let locationsTemp = [
  "Bellinzona",
  "Lugano",
  "Mendrisio"
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
      let query = `/search?keyword=${searchName}`;
        // + (category ? `&category=${category}` : '')
        // + (location ? `&location=${location}` : '');
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
      let name = this.props.categories[i].categoryName;
      categories.push(<option value={name} key={i}>{name}</option>);
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

class FreelancerCreateBtn extends React.Component {
  redirectFreelancerForm() {
    document.location = '/freelance/new';
  }
  render () {
    return (<button id="freelancer-create-btn" onClick={this.redirectFreelancerForm}>Add a new freelancer</button>);
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
      document.location = `/freelance/${freelancer.props._id}`;
    }
  }
  render () {
    return (
      <div className="freelancer-card" onClick={this.redirectFreelancer(this)}>
        <div className="freelancer-card-picture-placeholder"><img src={this.props.urlPicture} /></div>
        <div className="freelancer-card-info">
          <h1>{this.props.title}</h1>
          <FreelancerName first={this.props.first} last={this.props.last}/>
          <span>{this.props.category}</span>
          <span>Average Score: {this.props.avgScore} in 5</span>
          <span>Price range: {this.props.price ? this.props.price.min + " - " + this.props.price.max + " CHF" : " - "}</span>
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
        first={this.props.freelancers[i].firstName}
        last={this.props.freelancers[i].familyName}
        title={this.props.freelancers[i].title}
        category={this.props.freelancers[i].category.categoryName}
        avgScore={this.props.freelancers[i].avgScore}
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
  console.log(freelancers);
  ReactDOM.render(<FreelancersContainer freelancers={freelancers} />, document.getElementById('react-freelancers-container'));
  applyFilters();
}

renderPage();
