pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Soulcapper{

  //track
  //TODO getters and setters with owner only where appropriet
   uint16 transfer_percent_fee;
   uint256  minting_fee_eth;
   address  owner;
   uint256  itemId = 1; //must be set to 1 as default.
   address  ZRX_erc20_contrct;
   uint16  ZRX_discount_percent;
   uint256  max_souls_per_body;

   // ================================= Main Structs and Modifiers =========================== //
  struct Soul{
    address body;
    String uri;
    uint64 type;
  }

   mapping(uint => Soul) public souls;
   mapping(address => uint256) public captures_tracker;

   event Capped(
    address indexed _from,
    bytes32 indexed _id,
    uint _value
  );

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

   // Initialize the stuff.
   cosntructor() public {
       owner = msg.sender;
       percent_fee = 0;
       minting_fee_eth = 0.01eth;
       max_souls_per_body = 3;
   }


  //===================== functions =================================//

  //mint
  //Take a string for the url to the captured image.
  function captureSoul(address _to, String _URI, uint256 _type) public payable{
    //require the correct payment
    //TODO, this is a bit complex, need help

    //require that the user has not exceeded max souls per body, via captures tracker
    require(captures_tracker[msg.sender] < max_souls_per_body);

    //take url to cap image as string
    _mint(_to, itemId); // Use ERC 721 interface
    Soul memory instance = Soul(_to, _URI, _type);
    souls[itemId] = instance;

    //events and book keeping
    emit Capped(msg.sender, itemId, msg.value);
    itemId++; //increment id
    captures_tracker[msg.sender]++;// increment total number of souls capped from this address
  }

  //Allow users
  //canOperate modifier to allow third part services to trade on user behalds.
  //  maybe ZRX can integrate with that.
  function tradeSoul(uint256 _itemId, address _to) public canOperate(_itemId) {
    _safeTransferFrom(msg.sender, _to, _itemId, "");// Use ERC 721 interface
  }

  // cashout function, for ether. Owner can pay any address
  function cashout(address _payto) public onlyOwner {
    _payto.transfer(this.balance)
  }

  //allow owner to cashout any erc20 token sent to this address
  function withdraw(address[] erc20_contracts) public onlyOwner {
      for (uint i=0; i<erc20_contracts.length; i++) {

            EIP20 instance = EIP20(erc20_contracts[i]);

            uint256 _val = instance.balanceOf(this);

            bool succ = instance.transfer(msg.sender, _val);
        }
  }

}
