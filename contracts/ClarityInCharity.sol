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
        uint DAPPtokenBalance;
        address Address;
    }

    mapping(uint => Project) public projects;
    mapping(uint => Donor) public donors;
    mapping(uint => Shop) public shops;

    constructor() public {
        
    }

    function createDonor(string memory myName) public {
        Donor memory d = Donor(
            { donorID:donorCount+1,
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
        Shop memory s = Shop(
            { shopID:shopCount+1,
            name:myName, 
            DAPPtokenBalance:0,
            Address:msg.sender });
        shopCount++;
        shops[shopCount] = s;
    }

    function sendMoney(uint projectID, uint donorID, uint amount) public {
        if (msg.sender == donors[donorID].Address){
            donors[donorID].DAPPtokenBalance -= amount;
            projects[projectID].DAPPtokenBalance += amount;
        }
    }

}
