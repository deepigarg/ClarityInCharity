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
bool complete;
}

function createProject(string myName, string myDescription, uint amount) public {
Project memory d = Project(
{ name:myName, 
	   description:myDescription,
	   requiredAmount:amount,
	   completed:false,
   projectID:projects.length,
   DAPPtokenBalance:0,
   Address:msg.sender });
   projects.push(d);
 }
}
