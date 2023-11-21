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

    event ProductEdited(
        uint id,
        string newName,
        uint newPrice
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
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true, _product.imageData);
    }

    function editProduct(uint _id, string memory _newName, uint _newPrice) public {
        require(_id > 0 && _id <= productCount);
        require(bytes(_newName).length > 0);
        require(_newPrice > 0);

        Product storage productToEdit = products[_id];
        require(msg.sender == productToEdit.owner, "Only the owner can edit the product");

        productToEdit.name = _newName;
        productToEdit.price = _newPrice;

        emit ProductEdited(_id, _newName, _newPrice);
    }
}
