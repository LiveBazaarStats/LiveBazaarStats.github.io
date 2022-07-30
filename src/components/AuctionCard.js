import { Button } from "@mui/material";
import React from "react";
import styles from "./AuctionCard.module.css";

class AuctionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        itemInfo: undefined,
    };
  }

  showMore = () => {
    this.setState({
        itemInfo: (
            <div className={styles.ItemInfo}>
        <div dangerouslySetInnerHTML={{ __html: this.props.itemLore }}></div>
        <Button variant="contained" onClick={() => {navigator.clipboard.writeText("/viewauction " + this.props.uuid)}}>Copy Auction Command</Button>
        <Button variant="contained" onClick={this.hideMore}>Hide</Button>
            </div>
        ),
    });
    }

    hideMore = () => {
        this.setState({
            itemInfo: undefined,
        });
    }

  render() {
    return (
      <div className={styles.AuctionCard} >
        <p className={styles.ItemName}>{this.props.itemName}</p>
        <p className={styles.ItemPrice}>{this.props.itemPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        <p className={styles.itemProfit}>{this.props.itemPotentialProfit.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Potential Profit"}</p>
        <Button variant="contained" onClick={this.showMore}>Show More...</Button>
        {this.state.itemInfo}
      </div>
    );
  }
}

export default AuctionCard;