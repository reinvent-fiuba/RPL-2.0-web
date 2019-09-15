import React from "react";
import ReactDOM from "react-dom";
import "./app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('http://0.0.0.0:3001/api/submit', {
      method: 'POST',
      body: JSON.stringify({
        quantity: this.state.quantity
      })
    })
    .then(response => response.json())
    .then(state => this.setState(state));
  };

  render() {
    return (
      <div className="app">
        <p> RPL 2.0 </p>
        <form onSubmit={this.handleSubmit}>
            <label htmlFor="quantity">Enter quantity: </label>
            <input
              id="quantity"
              type="number"
              value={this.state.quantity}
              onChange={this.handleChange}
            />
            <button type="submit">Submit</button>
          </form>
      </div>
    )};
};

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
