pragma solidity >=0.4.21 <0.6.0;

contract  ClarityInCharity{
    uint public projectCount = 0;

    struct Project{
        uint projectID;
        string name;
        string description;
        uint requiredAmount;
        uint DAPPtokenBalance;
        address Address;
        bool completed;
    }

    mapping(uint => Project) public projects;

    constructor() public {
        createProject("Deepi","IIITD fees bharni hai :(", 100);
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
}
