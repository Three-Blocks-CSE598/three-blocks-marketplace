import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Navbar from "./Navbar";
import Main from "./Main";
class App extends Component {
  
  // This has the function calls to be made when the parent (root) component is mounted in the DOM
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setState({
      authors: [
        "Harshak Krishnaa Keerthipati",
        "Rajkumar Sukumar",
        "Sai Ramya Linga",
      ],
    });

    window.ethereum.on('accountsChanged', () => {
      const proceed = window.confirm("Account change detected. Do you want to refresh the page?");
      if (proceed) {
        window.location.reload();
      } else {
        console.log("Cancelling...");
      }
    });
  }

  // Load the web3.js from the global window object.
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  // Fetches all the information (accounts, products) from the blockchain network by using web3.js
  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      this.setState({ loading: false });
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );

      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call();

      this.setState({ productCount });
      const products = [];
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        products.push(product);
      }
      this.setState({ products });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  // Handler for creating a product using the smart contract
  createProduct(name, price, imageData, description) {
    this.setState({ loading: true });

    this.state.marketplace.methods
      .createProduct(name, price, imageData, description)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
        this.loadBlockchainData();
      });
  }

  // Handler for purchasing a product using the smart contract
  purchaseProduct(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
        this.loadBlockchainData();
      });
  }

  // Handler for editing a product using the smart contract
  editProduct(id, newName, newPrice, newDescription) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .editProduct(id, newName, newPrice, newDescription)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
        this.loadBlockchainData();
      });
  }

  // Handler for toggling between "Products to buy" vs "My products"
  changeMyProductsVisibility(val) {
    this.setState({showMyProducts: val});
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
      authors: [],
      showMyProducts: false,
    };
    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.changeMyProductsVisibility = this.changeMyProductsVisibility.bind(this);
  }

  render() {
    return (
      <div>
        <Navbar
          createProduct={this.createProduct}
          account={this.state.account}
        />
        <div className="container-fluid my-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div
                  id="loader"
                  className="text-center position-fixed w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                >
                  <div
                    className="spinner-border text-info mb-2"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="font-weight-bold">Loading...</p>
                </div>
              ) : (
                <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                  editProduct={this.editProduct}
                  currentAccount={this.state.account}
                  showMyProducts={this.state.showMyProducts}
                  changeMyProductsVisibility={this.changeMyProductsVisibility}
                />
              )}
            </main>
          </div>
        </div>
        <footer className="fixed-bottom bg-dark text-light text-center p-1">
          <p className="align-middle d-inline">
            © {new Date().getFullYear()} |{" "}
            {this.state.authors &&
              this.state.authors.map((author, index) => (
                <span key={index}>
                  {author}
                  {index < this.state.authors.length - 1 && ", "}
                </span>
              ))}
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
