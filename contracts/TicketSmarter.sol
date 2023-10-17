// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketSmarter is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        string day;
        string time;
        string location;
        uint256 price;
        uint256 maxTickets;
        uint256 tickets;
    }

    mapping(uint256 => Occasion) occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function list(
        string memory _name,
        string memory _day,
        string memory _time,
        string memory _location,
        uint256 _price,
        uint256 _maxTickets
    ) public onlyOwner {
        totalOccasions++;

        occasions[totalOccasions] = Occasion({
            id: totalOccasions,
            name: _name,
            day: _day,
            time: _time,
            location: _location,
            price: _price,
            maxTickets: _maxTickets,
            tickets: _maxTickets
        });
    }

    function mintTicket(uint256 _id, uint256 _seat) public payable {
        require(_id != 0, "ID must not be zero.");
        require(
            _id <= totalOccasions,
            "ID must be less than or equal to total occasions."
        );
        require(
            msg.value >= occasions[_id].price,
            "Insufficient payment for the occasion."
        );
        require(seatTaken[_id][_seat] == address(0), "Seat must not be taken.");
        require(
            _seat <= occasions[_id].maxTickets,
            "Exceeded maximum number of tickets for this occasion."
        );

        occasions[_id].tickets -= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
