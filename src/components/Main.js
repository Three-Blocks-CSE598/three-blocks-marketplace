import { faDollarSign, faStar, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editProductId: 0,
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
    const id = this.state.editProductId;
    const description = this.productDescription.value;
    this.props.editProduct(id, name, price, description);
    this.toggleModal();
  };

  render() {
    const { products, currentAccount } = this.props;
    const { showMyProducts } = this.props;

    const filteredProducts = showMyProducts
      ? products.filter((prod) => prod.owner === currentAccount)
      : products.filter(
          (prod) => !prod.purchased && prod.owner != currentAccount
        );

    return (
      <div id="content" className="container mt-5">
        <h1 className="text-center mb-4" style={{ fontFamily: "Comic Sans" }}>
          Discover, Shop, and Own the Extraordinary!
        </h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${!showMyProducts && "active"}`}
              onClick={() => this.props.changeMyProductsVisibility(false)}
            >
              Products to buy
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${showMyProducts && "active"}`}
              onClick={() => this.props.changeMyProductsVisibility(true)}
            >
              My Products
            </button>
          </li>
        </ul>

        <div
          className={`modal ${this.state.showModal ? "show" : ""}`}
          style={{ display: this.state.showModal ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faStar} /> Edit your product
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
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="productName">
                      <FontAwesomeIcon icon={faTag} /> Product Name
                    </label>
                    <input
                      id="productName"
                      type="text"
                      ref={(input) => {
                        this.productName = input;
                      }}
                      className="form-control"
                      placeholder="Enter new product name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productPrice">
                      <FontAwesomeIcon icon={faDollarSign} /> Product Price (in
                      Ether)
                    </label>
                    <input
                      id="productPrice"
                      type="number"
                      ref={(input) => {
                        this.productPrice = input;
                      }}
                      className="form-control"
                      placeholder="Enter new product price"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productDescription">
                      <FontAwesomeIcon icon={faDollarSign} /> Product
                      Description
                    </label>
                    <input
                      id="productDescription"
                      type="text"
                      ref={(input) => {
                        this.productDescription = input;
                      }}
                      className="form-control"
                      placeholder="Enter new product description"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    <FontAwesomeIcon icon={faStar} /> Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center">
              <p className="no-products-message extravagant">
                No products found
              </p>
            </div>
          ) : (
            filteredProducts.map((product, key) => (
              <div key={key} className="col-md-4 mb-4">
                <div className="card">
                  <div style={{ width: "100%", height: "400px" }}>
                    <img
                      src={
                        product.imageData ||
                        `https://placehold.co/600x400?text=${encodeURIComponent(
                          product.name
                        )}`
                      }
                      className="card-img-top"
                      alt="Product Thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="card-body">
                    <h5 className="card-title mb-2">
                      🏷️ {product.name}{" "}
                      {product.purchased ? "(Purchased)" : null}
                    </h5>
                    <span>{product.description}</span>
                    <p className="card-text mb-2">
                      💰
                      {window.web3.utils.fromWei(
                        product.price.toString(),
                        "Ether"
                      )}{" "}
                      ETH
                    </p>
                    {this.props.currentAccount !== product.owner && (
                      <div className="mb-2">
                        👤 Posted by{" "}
                        <span style={{ fontSize: "0.7rem" }}>
                          {product.owner}
                        </span>
                      </div>
                    )}
                    {this.props.currentAccount !== product.owner ? (
                      <button
                        name={product.id}
                        value={product.price}
                        className="btn btn-dark"
                        onClick={(event) => {
                          const proceed = window.confirm(
                            `Are you sure you want to purchase this product (${
                              product.name
                            } - ${window.web3.utils.fromWei(
                              product.price
                            )}ETH)?`
                          );
                          if (proceed) {
                            this.props.purchaseProduct(
                              event.target.name,
                              event.target.value
                            );
                          }
                        }}
                      >
                        🛍️ Buy this item
                      </button>
                    ) : !product.purchased ? (
                      <button
                        name={product.id}
                        value={product.price}
                        className="btn btn-light btn-dark"
                        onClick={() => {
                          this.productName.value = product.name;
                          this.productPrice.value = window.web3.utils.fromWei(
                            product.price,
                            "ether"
                          );
                          this.productDescription.value = product.description;
                          this.setState({ editProductId: product.id });
                          this.toggleModal();
                        }}
                      >
                        📝 Edit this item
                      </button>
                    ) : (
                      <button
                        name={product.id}
                        value={product.price}
                        className="btn btn-light btn-dark"
                        disabled
                      >
                        🚫 Item cannot be edited
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Main;
