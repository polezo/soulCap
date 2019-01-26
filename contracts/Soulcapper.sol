pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//TODO add iep 20 interface

contract Soulcapper is ERC721{

  //track
  //TODO getters and setters with owner only where appropriet
   uint256 private transfer_percent_fee;
   uint256 private minting_fee_wei;
   address private owner;
   uint256 itemId = 1; //must be set to 1 as default.
   address private ZRX_erc20_contrct;
   uint16 private ZRX_discount_percent;
   uint256 private max_souls_per_body;
   //TODO set small trading fee

   // ================================= Main Structs and Modifiers =========================== //
  struct Soul{
    address body;
    string name;
    string uri;
    uint64 soul_type;
  }

   mapping(uint => Soul) public souls;
   mapping(address => uint256) public captures_tracker;

   event Capped(
    address indexed _from,
    string _name,
    bytes32 indexed _id,
    uint _value
  );

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

   // Initialize the stuff.
   constructor() public {
       owner = msg.sender;
       percent_fee = 0;
       minting_fee_wei = 5e15;
       max_souls_per_body = 3;
       ZRX_discount_percent = 50;
       transfer_percent_fee_over_ten = 1;
   }

   //Helper check to see if the user has erc20
   function hasZRX(address user) public returns(bool){
     EIP20 instance = EIP20(ZRX_erc20_contrct);
     if( instance.balanceOf(user) > 0){
       return true;
     }else{
       return false;
     }
   }


  //===================== functions =================================//

  //mint
  //Take a string for the url to the captured image.
  function captureSoul(address _to, string memory _name, string memory _URI, uint256 _type) public payable{
    //require the correct payment
    uint fee = minting_fee_wei;
    if(hasZRX(msg.sender)){
      fee = fee - (fee * ZRX_discount_percent / 100); //update fee for ZRX users
    }
    require(msg.value >= fee);

    //require that the user has not exceeded max souls per body, via captures tracker
    require(captures_tracker[msg.sender] < max_souls_per_body);

    //take url to cap image as string
    _mint(_to, itemId); // Use ERC 721 interface
    Soul memory instance = Soul(msg.sender, _name, _URI, _type);
    souls[itemId] = instance;

    //events and book keeping
    emit Capped(msg.sender, _name, itemId, msg.value);
    itemId++; //increment id
    captures_tracker[msg.sender]++;// increment total number of souls capped from this address
  }

  //allow the owner of a token to set its name
  function setName(uint _id, string _name) public{
    require(ownerOf(_id) == msg.sender);
    souls[_id].name = _name;
  }

  //Allow users
  //canOperate modifier to allow third part services to trade on user behalds.
  //  maybe ZRX can integrate with that.
  function tradeSoul(uint256 _itemId, address _to) public canOperate(_itemId) payable{
    _safeTransferFrom(msg.sender, _to, _itemId, "");// Use ERC 721 interface
  }

  // cashout function, for ether. Owner can pay any address
  function cashout(address _payto) public onlyOwner {
    _payto.transfer(this.balance);
  }

  //allow owner to cashout any erc20 token sent to this address
  function withdraw(address[] erc20_contracts) public onlyOwner {
      for (uint i=0; i<erc20_contracts.length; i++) {

            ERC20 instance = ERC20(erc20_contracts[i]);

            uint256 _val = instance.balanceOf(this);

            bool succ = instance.transfer(msg.sender, _val);
        }
  }

  function setEverything(uint256 _transfer_percent_fee, uint256 _minting_fee_wei, address _ZRX_erc20_contrct, uint16 _ZRX_discount_percent, uint256 _max_souls_per_body) public onlyOwner {

    //set everything
    transfer_percent_fee = _transfer_percent_fee;
    minting_fee_wei = _minting_fee_wei;
    ZRX_erc20_contrct = _ZRX_erc20_contrct;
    ZRX_discount_percent = _ZRX_discount_percent;
    max_souls_per_body = _max_souls_per_body;
  }

}