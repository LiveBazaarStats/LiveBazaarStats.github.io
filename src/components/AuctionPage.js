import React from "react";
import styles from "./AuctionPage.module.css";
import LoginPage from "./LoginPage";
import AuctionCard from "./AuctionCard";
import mineParse from "./scripts/ColorCodeConverter";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

class AuctionPage extends React.Component {
  constructor(props) {
    super(props);
    const firebaseConfig = {
      apiKey: "AIzaSyCYmm2l56LkPhB2o6FmakhioBnfHslkq7U",

      authDomain: "live-bazaar-stats.firebaseapp.com",

      projectId: "live-bazaar-stats",

      storageBucket: "live-bazaar-stats.appspot.com",

      messagingSenderId: "38601534331",

      appId: "1:38601534331:web:f37873a4cf1d4b65a2abde",
      dataBaseURL: "https://live-bazaar-stats-default-rtdb.firebaseio.com/",
    };
    this.state = {
      auctionCards: [],
      app: initializeApp(firebaseConfig),
      LoginPage: <LoginPage handleSubmitClick={this.submitClick} />,
      ApiKey: "",
      CurrentEnchantPrices: [],
      EnchantNames: [
        "Angler",
        "Aqua Affinity",
        "Bane of Arthropods",
        "Bank",
        "Big Brain",
        "Blast Protection",
        "Blessing",
        "Caster",
        "Chance",
        "Charm",
        "Chimera",
        "Cleave",
        "Combo",
        "Compact",
        "Corruption",
        "Counter-Strike",
        "Critical",
        "Cubism",
        "Cultivating",
        "Delicate",
        "Depth Strider",
        "Dragon Hunter",
        "Dragon Tracer",
        "Duplex",
        "Efficiency",
        "Ender Slayer",
        "Execute",
        "Experience",
        "Expertise",
        "Fatal Tempo",
        "Feather Falling",
        "Fire Aspect",
        "Fire Protection",
        "First Strike",
        "Flame",
        "Flash",
        "Fortune",
        "Frail",
        "Frost Walker",
        "Giant Killer",
        "Growth",
        "Harvesting",
        "Impaling",
        "Inferno",
        "Infinite Quiver",
        "Knockback",
        "Last Stand",
        "Legion",
        "Lethality",
        "Life Steal",
        "Looting",
        "Luck",
        "Luck of the Sea",
        "Lure",
        "Mana Steal",
        "Magnet",
        "No Pain No Gain",
        "One For All",
        "Overload",
        "Piercing",
        "Power",
        "Pristine",
        "Projectile Protection",
        "Prosecute",
        "Protection",
        "Punch",
        "Rainbow",
        "Rejuvenate",
        "Rend",
        "Replenish",
        "Respiration",
        "Respite",
        "Scavenger",
        "Sharpness",
        "Silk Touch",
        "Smelting Touch",
        "Smarty Pants",
        "Smite",
        "Snipe",
        "Soul Eater",
        "Spiked Hook",
        "Sugar Rush",
        "Swarm",
        "Syphon",
        "Thorns",
        "Thunderbolt",
        "Thunderlord",
        "Titan Killer",
        "Triple Strike",
        "True Protection",
        "Turbo-Wheat",
        "Turbo-Carrot",
        "Turbo-Potato",
        "Turbo-Pumpkin",
        "Turbo-Melon",
        "Turbo-Mushrooms",
        "Turbo-Cocoa",
        "Turbo-Cactus",
        "Turbo-Cane",
        "Turbo-Warts",
        "Ultimate Jerry",
        "Ultimate Wise",
        "Vampirism",
        "Venomous",
        "Vicious",
        "Wisdom",
      ],
    };
  }

  submitClick = () => {
    this.setState({
      ApiKey: document.getElementById("ApiKey").value,
    }, this.handleSubmitClick);
  };

  handleSubmitClick = () => {
    if (this.state.ApiKey === "") {
      this.setState({
        LoginPage: <LoginPage handleSubmitClick={this.submitClick} />,
      });
    } else {
      fetch(`https://api.hypixel.net/skyblock/news?key=${this.state.ApiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data["success"] === true) {
      this.setState({
        LoginPage: undefined,
      });
      this.updateDatabase();
      setInterval(() => {
        this.updateDatabase();
      }, 600000);
      setTimeout(() => {
          this.displayAuctionCards();
          setInterval(() => {
            this.displayAuctionCards();
        }, 30000);
        }, 2000);
    }
    else {
      this.setState({
        LoginPage: <LoginPage handleSubmitClick={this.submitClick} />,
      });
    }
  });
  }
}

  displayAuctionCards = () => {
    let database = getDatabase(this.state.app);
    let auctionCards = [];
    let enchantNames = this.state.EnchantNames;
    let self = this;
    fetch(`https://api.hypixel.net/skyblock/auctions`)
      .then((response) => response.json())
      .then((data) => {
        let auctions = data["auctions"];
        for (let i = 0; i < auctions.length; i++) {
          let auction = auctions[i];
          if (auction !== undefined) {
          let itemLore = auction["item_lore"];
          let itemLoreEncoded = mineParse(itemLore);
          let uuid = auction["uuid"];
          let itemName = auction["item_name"];
          let isBin = auction["bin"];
          let price = auction["starting_bid"];
          let rarity = auction["tier"];
          if (isBin){
          let enchantments = [];
          for (let j = 0; j < enchantNames.length; j++) {
            let enchantment = enchantNames[j];
            if (itemLore.includes(enchantment)) {
              let enchantmentLevel = itemLore.substring(
                itemLore.indexOf(enchantment) + enchantment.length + 1,
                itemLore.indexOf(enchantment) + enchantment.length + 4
              );
              enchantmentLevel = enchantmentLevel.split(", ")[0];
              enchantmentLevel = enchantmentLevel.replace(/\n/g, "");
              if (enchantmentLevel.includes("§")) {
                if (enchantmentLevel.split("§")[0].replace(/\s/g, "") === "") {
                  enchantmentLevel = enchantmentLevel.split("§")[1].substring(1);
                }
                else{
                enchantmentLevel = enchantmentLevel.split("§")[0];
                }
              }
              enchantments.push(enchantment + " " + enchantmentLevel);
            }
          }
          let averagePriceEnchantments = 0;
          let dbref = ref(database);
          try{
          for (let j = 0; j < enchantments.length; j++) {
            let enchantment = enchantments[j];
            get(child(dbref, "Books/" + enchantment)).then(function(snapshot) {
              let bookData = snapshot.val();
              if (bookData !== null) {
                averagePriceEnchantments += bookData["averagePrice"];
              }
            });
          }
          let averagePriceItemName = 0;
          get(child(dbref, "Items/" + itemName + rarity)).then(function(snapshot) {
            let itemData = snapshot.val();
            if (itemData !== null) {
              averagePriceItemName = itemData["averagePrice"];
              let tax = averagePriceItemName * 0.01;
                        if (averagePriceItemName > 1000000) {
                            tax += averagePriceItemName * 0.01;
                        }
                        averagePriceItemName -= tax;
              let averagePrice = averagePriceItemName + averagePriceEnchantments;
          let potentialProfit = averagePrice - price;
          auctionCards.push(
            <AuctionCard
              key={uuid}
              itemName={itemName}
              itemLore={itemLoreEncoded.raw}
              itemPrice={price.toString()}
              itemPotentialProfit={(Math.round(potentialProfit * 10) / 10).toString()}
              uuid={uuid}
            />
          );
          auctionCards.sort(function(a, b) {
            return b.props.itemPotentialProfit - a.props.itemPotentialProfit;
          }
          );
          self.setState({
            auctionCards: auctionCards,
          });
            }
          });
          
          }catch(e){
            console.log(e);
          }
        }
      }
    }
      });
  };

  updateDatabase = () => {
    let database = getDatabase(this.state.app);
    let self = this;
    fetch("https://api.hypixel.net/skyblock/auctions_ended")
      .then((response) => response.json())
      .then((data) => {
        if (data["success"]) {
          let auctions = data["auctions"];
          let apikey = this.state.ApiKey;
          let EnchantNames = this.state.EnchantNames;
          console.log("Please wait " + auctions.length * 0.75 + " seconds");
          let index = 0;
          (function myLoop(i) {
            setTimeout(function() {
              let auction = auctions[index];
              if (auction !== undefined) {
              let uuid = auction["auction_id"];
              let isBin = auction["bin"];
              if (isBin) {
                fetch(
                  `https://api.hypixel.net/skyblock/auction?uuid=${uuid}&key=${apikey}`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    try{
                    let auction = data["auctions"][0];
                    let itemLore = auction["item_lore"];
                    let itemName = auction["item_name"];
                    let enchantments = [];
                    for (let i = 0; i < EnchantNames.length; i++) {
                      let enchantment = EnchantNames[i];
                      if (itemLore.includes(enchantment)) {
                        let enchantmentLevel = itemLore.substring(
                          itemLore.indexOf(enchantment) +
                            enchantment.length +
                            1,
                          itemLore.indexOf(enchantment) + enchantment.length + 4
                        );
                        enchantmentLevel = enchantmentLevel.split(", ")[0];
                        enchantmentLevel = enchantmentLevel.replace(/\n/g, "");
                        if (enchantmentLevel.includes("§")) {
                          enchantmentLevel = enchantmentLevel.split("§")[0];
                        }
                        enchantments.push(enchantment + " " + enchantmentLevel);
                      }
                    }
                    if (
                      itemName === "Enchanted Book" &&
                      enchantments.length === 1
                    ) {
                      let databaseRef = ref(
                        database,
                        "Books/" + enchantments[0]
                      );
                      let dbref = ref(database);
                      get(child(dbref, "Books/" + enchantments[0])).then(
                        function(snapshot) {
                          let bookData = snapshot.val();
                          
                          if (bookData === null) {
                            bookData = {
                              prices: [auction["highest_bid_amount"]],
                              averagePrice: auction["highest_bid_amount"],
                            };
                          } else {
                            if (bookData["prices"].length < 5) {
                            bookData["prices"].push(
                              auction["highest_bid_amount"]
                            );
                            bookData["averagePrice"] =
                              bookData["prices"].reduce((a, b) => a + b, 0) /
                              bookData["prices"].length;
                          }
                          else{
                            if (auction["highest_bid_amount"] > bookData["averagePrice"] * 1.5 || auction["highest_bid_amount"] < bookData["averagePrice"] * 0.5) {
                              bookData["prices"].push(
                                auction["highest_bid_amount"]
                              );
                              bookData["averagePrice"] =
                                bookData["prices"].reduce((a, b) => a + b, 0) /
                                bookData["prices"].length;
                            }
                          }
                        }
                          set(databaseRef, bookData);
                        }
                      );
                    }
                    
                    else if (itemName !== "Enchanted Book") {
                      let databaseRef = ref(
                        database,
                        "Items/" + itemName + auction["tier"]
                      );
                      let dbref = ref(database);
                      let bookDatas = [];
                      get(
                        child(dbref, "Items/" + itemName + auction["tier"])
                      ).then(function(snapshot) { 
                        let price = 0;
                        if (enchantments.length > 0) {
                          let dbref = ref(database);
                          for (let i = 0; i < enchantments.length; i++) {
                      get(child(dbref, "Books/" + enchantments[i])).then(
                        function(snapshot) {
                          let bookData = snapshot.val();
                          if (bookData !== null) {
                            bookDatas.push(bookData);
                            self.setState({
                              CurrentEnchantPrices: bookDatas,
                            });
                          }
                        }
                      );
                          }
                        let allPricesEnchants = self.state.CurrentEnchantPrices.map(({averagePrice}) => averagePrice);
                        console.log(allPricesEnchants);
                        let enchantsPrice = allPricesEnchants.reduce((a, b) => a + b, 0);
                        console.log(enchantsPrice);
                        price = auction["highest_bid_amount"] - enchantsPrice;
                        }
                        else{
                          price = auction["highest_bid_amount"];
                        }
                        let itemData = snapshot.val();
                        if (itemData === null) {
                          itemData = {
                            prices: [price],
                            averagePrice: price,
                          };
                        } else {
                          if (itemData["prices"].length < 5) {
                          itemData["prices"].push(price);
                          itemData["averagePrice"] =
                            itemData["prices"].reduce((a, b) => a + b, 0) /
                            itemData["prices"].length;
                        }
                        else{
                          if (price > itemData["averagePrice"] * 1.5 || price < itemData["averagePrice"] * 0.5) {
                            itemData["prices"].push(price);
                            itemData["averagePrice"] =
                              itemData["prices"].reduce((a, b) => a + b, 0) /
                              itemData["prices"].length;
                          }
                        }
                      }
                        set(databaseRef, itemData);
                      });
                    }
                  }catch(e){console.log(e);} })
                  .catch((error) => console.log(error));
              }
            }
              index++;
              if (--i) myLoop(i);
            }, 750);
          })(Object.keys(auctions).length);
        } else {
          console.log("Error");
        }
      })
      .catch((error) => console.log(error));
  };

  fillEnchantPricesArray = (callback, enchantments) => {
    return callback(enchantments);
  }
  

  render() {
    return (
      <div>
        <h1>Auction Page</h1>
        {this.state.LoginPage}
        <div className={styles.AuctionCards}>{this.state.auctionCards}</div>
      </div>
    );
  }
}

export default AuctionPage;
