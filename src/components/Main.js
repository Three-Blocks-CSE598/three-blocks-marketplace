import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content" className="container mt-5">
        <h1 className="text-center mb-4">🛒 Products</h1>
        <div className="row">
          {this.props.products.filter(prod => !prod.purchased).map((product, key) => (
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
                  <h5 className="card-title">🏷️ {product.name}</h5>
                  <p className="card-text">
                    💰 Price:{" "}
                    {window.web3.utils.fromWei(
                      product.price.toString(),
                      "Ether"
                    )}{" "}
                    ETH 🔐
                    <br />
                    👤 Owner: {product.owner}
                  </p>
                  {this.props.currentAccount !== product.owner ? (
                    <button
                      name={product.id}
                      value={product.price}
                      className="btn btn-dark"
                      onClick={(event) => {
                        this.props.purchaseProduct(
                          event.target.name,
                          event.target.value
                        );
                      }}
                    >
                      🛍️ Buy this item
                    </button>
                  ) : <button
                  name={product.id}
                  value={product.price}
                  className="btn btn-light btn-disabled"
                >
                  🚫 Cannot buy this, since you own it!
                </button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;
