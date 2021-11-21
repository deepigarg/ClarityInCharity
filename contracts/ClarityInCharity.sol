pragma solidity >=0.4.21 <0.6.0;

contract  ClarityInCharity{
    uint public projectCount = 0;
    uint public donorCount = 0;
    uint public shopCount = 0;

    struct Project{
        uint projectID;
        string name;
        string description;
        uint requiredAmount;
        uint DAPPtokenBalance;
        address Address;
        bool completed;
    }

    struct Donor{
		uint donorID;
        string name;
        uint DAPPtokenBalance;
        address Address;
    }

    struct Shop{
        uint shopID;
        string name;
        address payable Address;
    }

    mapping(uint => Project) public projects;
    mapping(uint => Donor) public donors;
    mapping(uint => Shop) public shops;

    constructor() public {
        // createShop("Patanjali Healthcare", web3.eth.accounts[0]);
        // createShop("Paradise Plaza", web3.eth.accounts[1]);
        // createShop("Mummy da Dhaba Bhojan Bhandar", web3.eth.accounts[2]);
        // createShop("Sharma and sons", web3.eth.accounts[3]);
        // createShop("GuptaJi Furnitures", web3.eth.accounts[4]);
    }

    function createDonor(string memory myName) public {
        Donor memory d = Donor({ 
            donorID:donorCount+1,
            name:myName, 
            DAPPtokenBalance:0,
            Address:msg.sender });
        donorCount++;
        donors[donorCount] = d;
    }

    function createProject(string memory myName, string memory myDescription, uint amount) public {
        Project memory d = Project(
            {projectID:projectCount+1,
            name:myName, 
            description:myDescription,
            requiredAmount:amount,
            DAPPtokenBalance:0,
            Address:msg.sender, 
            completed:false});
        projectCount++;
        projects[projectCount] = d;
    }

    function createShop(string memory myName) public {
        Shop memory s = Shop({
            shopID:shopCount+1,
            name:myName,
            Address: msg.sender});
        shopCount++;
        shops[shopCount] = s;
    }
    
    function sendMoney(uint shopId) public payable{
        Shop memory s = shops[shopId];
        address payable addr = s.Address;
        addr.transfer(msg.value);
    }
}


contract Money{
    uint public amount = 1 ether;

    function send(address payable _addr) public payable{
        require(msg.value >= amount);
        _addr.transfer(msg.value);
    }
}
