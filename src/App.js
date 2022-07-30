import LoginPage from "./components/LoginPage";
import React from "react";
import MainPage from "./components/MainPage";
import AuctionPage from "./components/AuctionPage";
import { Button } from "@mui/material";
import styles from "./App.module.css";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: undefined,
      buttons: (
        <div>
          <Button variant="contained" onClick={this.activateAuction}>Auction Stats</Button>
          <Button variant="contained" onClick={this.activateBazaar}>Bazaar Stats</Button>
        </div>
      ),
  }
}

  activateBazaar = () => {
    this.setState({
      page: (
        <MainPage />
      ),
      buttons: undefined,
    });
  }

  activateAuction = () => {
    this.setState({
      page: (
        <AuctionPage />
      ),
      buttons: undefined,
    });
  };

  render() {
    return (
      <div className={styles.App}>
        <h1 className={styles.appTitle}>Live Hypixel Stats</h1>
          {this.state.buttons}
          {this.state.page}
      </div>
    );
  }
}

export default App;
