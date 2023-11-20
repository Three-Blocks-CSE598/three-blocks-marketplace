import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faStar,
  faDollarSign,
  faUser,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const name = this.productName.value;
    const price = window.web3.utils.toWei(
      this.productPrice.value.toString(),
      "Ether"
    );
    const image = this.productImage.value;

    this.props.createProduct(name, price, image);
    this.toggleModal();
  };

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-info fixed-top">
        <a
          className="navbar-brand"
          href="localhost"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faShoppingBag} /> Three Blocks Marketplace
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="btn btn-light" onClick={this.toggleModal}>
                <FontAwesomeIcon icon={faStar} /> Sell a Product
              </button>

              {/* Add Product Modal */}
              <div
                className={`modal ${this.state.showModal ? "show" : ""}`}
                style={{ display: this.state.showModal ? "block" : "none" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        <FontAwesomeIcon icon={faStar} /> Sell a Product
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={this.toggleModal}
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form
                        onSubmit={this.handleSubmit}
                      >
                        <div className="form-group">
                          <label htmlFor="productName">
                            <FontAwesomeIcon icon={faDollarSign} /> Product Name
                          </label>
                          <input
                            id="productName"
                            type="text"
                            ref={(input) => {
                              this.productName = input;
                            }}
                            className="form-control"
                            placeholder="Enter product name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="productPrice">
                            <FontAwesomeIcon icon={faDollarSign} /> Product
                            Price (in Ether)
                          </label>
                          <input
                            id="productPrice"
                            type="text"
                            ref={(input) => {
                              this.productPrice = input;
                            }}
                            className="form-control"
                            placeholder="Enter product price"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="productPrice">
                            <FontAwesomeIcon icon={faImage} /> Product
                            Image URL (https://...)
                          </label>
                          <input
                            id="productImage"
                            type="text"
                            ref={(input) => {
                              this.productImage = input;
                            }}
                            className="form-control"
                            placeholder="Enter product image URL"
                          />
                        </div>
                        <button type="submit" className="btn btn-success">
                          <FontAwesomeIcon icon={faStar} /> Add Product
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <span className="nav-link text-light">
                <FontAwesomeIcon icon={faUser} />{" "}
                <span id="account">{this.props.account}</span>
              </span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;
