// var Name = React.createClass({
//   render: function () {
//     return <h1>{this.props.first} {this.props.last}</h1>;
//   }
// });

console.log(window.location.pathname.split( '/' )[1])
ajaxRequest("GET", "/freelancer"+window.location.pathname.split( '/' )[1], {}, renderComponent);

function renderComponent(data) {
  ReactDOM.render(<View
    first="Lara" last="jfida"
    category="Programming"
    phone="3331231234"
    address="Via del kiwi 7, Hawaii, 1234"
    avgScore="4.0"/>,

    document.getElementById('root')
  );
}

class Name extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {props};
  // }

  render () {
    return (<h1>{this.props.first} {this.props.last}</h1>);
  }
}

var Contact = React.createClass({
  render: function () {
    return <span>{this.props.phone}</span>;
  }
});

var View = React.createClass({
  render: function () {
    return <div>
        <Name first={this.props.first} last={this.props.last}/>
        <span>{this.props.category}</span>
        <span>Average Score: {this.props.avgScore} in 5</span>
        <Contact phone={this.props.phone} address={this.props.address}/>
      </div>
  }
});
