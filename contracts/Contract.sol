// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Contract is Ownable {
    string public name;
    uint256 public totalAmount;

    struct transaction {
        address sender;
        address receiver;
        uint256 amountInWei;
        uint256 fiat;
        bool locked;
        bool released;
    }

    mapping(uint256 => transaction) public trxs;

    event Recorded(
        uint256 indexed paymentId,
        address indexed sender,
        address indexed receiver,
        uint256 amountInWei,
        uint256 fiat
    );
    event Locked(uint256 indexed paymentId, uint256 amountInWei);
    event Released(
        uint256 indexed paymentId,
        address indexed sender,
        address indexed receiver,
        uint256 amountInWei,
        uint256 fiat
    );

    constructor(string memory _name) {
        name = _name;
        totalAmount = 0;
    }

    function createRecord(
        uint256 _paymentId,
        address _sender,
        address _receiver,
        uint256 _amountInWei,
        uint256 _fiat
    ) public onlyOwner {
        require(
            _sender != address(0) && _receiver != address(0),
            "Sender or receiver cannot be zero address"
        );
        require(
            trxs[_paymentId].amountInWei == 0,
            "Record already has been created"
        );
        require(
            _sender != _receiver,
            "Sender and receiver must be different addresses"
        );
        require(_amountInWei > 0, "Amount cannot be zero");
        require(_fiat > 0, "Fiat value cannot be zero");

        transaction memory trx = transaction(
            _sender,
            _receiver,
            _amountInWei,
            _fiat,
            false,
            false
        );
        trxs[_paymentId] = trx;

        emit Recorded(_paymentId, _sender, _receiver, _amountInWei, _fiat);
    }

    function lockFund(uint256 _paymentId) public payable {
        require(trxs[_paymentId].amountInWei > 0, "Record not found");
        require(msg.sender == trxs[_paymentId].sender, "Invalid sender");
        require(msg.value == trxs[_paymentId].amountInWei, "Invalid amount");
        require(
            msg.sender.code.length > 0 == false,
            "Caller cannot be a contract"
        );
        require(
            trxs[_paymentId].locked == false,
            "Fund has already been locked"
        );

        totalAmount += msg.value;
        trxs[_paymentId].locked = true;

        emit Locked(_paymentId, trxs[_paymentId].amountInWei);
    }

    function releaseFund(uint256 _paymentId) public onlyOwner {
        require(trxs[_paymentId].amountInWei > 0, "Record not found");
        require(trxs[_paymentId].locked == true, "Error in transaction status");
        require(
            trxs[_paymentId].released == false,
            "Error in transaction status"
        );

        address payable to = payable(trxs[_paymentId].receiver);

        to.transfer(trxs[_paymentId].amountInWei);
        totalAmount -= trxs[_paymentId].amountInWei;
        trxs[_paymentId].released = true;

        emit Released(
            _paymentId,
            trxs[_paymentId].sender,
            trxs[_paymentId].receiver,
            trxs[_paymentId].amountInWei,
            trxs[_paymentId].fiat
        );
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getTransactionById(uint256 _paymentId)
        public
        view
        returns (transaction memory)
    {
        return trxs[_paymentId];
    }
}
