pragma solidity >=0.4.21 <0.6.0;

contract  ClarityInCharity{
    Project[] public projects; // same as beneficiary

    struct Project{
        uint projectID;
        string name;
        string description;
        uint requiredAmount;
        uint DAPPtokenBalance;
        address Address;
        bool completed;
    }

    constructor() public {
        createProject("Deepi","IIITD fees bharni hai :(", 100);
    }

    function createProject(string memory myName, string memory myDescription, uint amount) public {
        Project memory d = Project(
            {projectID:projects.length,
            name:myName, 
            description:myDescription,
            requiredAmount:amount,
            DAPPtokenBalance:0,
            Address:msg.sender, 
            completed:false});
        projects.push(d);
    }
}
