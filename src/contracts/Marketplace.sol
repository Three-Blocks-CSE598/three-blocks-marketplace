pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    constructor() public {
        name = "Three Blocks Marketplace";
    }

    struct Product {
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
        string imageData;
    } 

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address owner,
        bool purchased,
        string imageData
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        string imageData
    );

    function createProduct(string memory _name, uint _price, string memory _imageData) public {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false, _imageData);
        emit ProductCreated(productCount, _name, _price, msg.sender, false, _imageData);
    }

    function purchaseProduct(uint _id) public payable {
        Product memory _product = products[_id];
        address payable _seller = address(uint160(_product.owner));
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
