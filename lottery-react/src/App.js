import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manage: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ message: "Waiting on transaction success..." });
    const accounts = await web3.eth.getAccounts();
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      this.setState({ message: "You have been entered!" });
    } catch (error) {
      this.setState({ message: error.message });
    }
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      const lastWinner = await lottery.methods.lastWinner().call();
      this.setState({ message: "Congratulation to " + lastWinner + " !" });
    } catch (error) {
      this.setState({ message: error.message });
    }
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} <br /> There are
          currently {this.state.players.length} people entered, <br />
          competing to win {web3.utils.fromWei(
            this.state.balance,
            "ether"
          )}{" "}
          ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>
            <strong>Want to try your luck?</strong>
          </h4>
          <div>
            <label htmlFor="etherColumn">Amount of ether to enter: </label>
            <input
              id="etherColumn"
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button type="submit">Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
export default App;
