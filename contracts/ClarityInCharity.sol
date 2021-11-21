pragma solidity >=0.4.21 <0.6.0;

contract  ClarityInCharity{
    uint public projectCount = 0;
    uint public donorCount = 0;
    uint public shopCount = 0;
    uint public paymentCount = 0;

    struct Project{
        uint projectID;
        string name;
        string description;
        uint requiredAmount;
        uint balance;
        address Address;
        bool completed;
        uint shopID;
        mapping(uint => bool) due_signs;
    }

    struct Donor{
		uint donorID;
        string name;
        uint balance;
        address Address;
    }

    struct Shop{
        uint shopID;
        string name;
        address payable Address;
        mapping(uint => uint) project_payments;
    }

    mapping(uint => Project) public projects;
    mapping(uint => Donor) public donors;
    mapping(uint => Shop) public shops;
    mapping(uint => Payment) public payments;


    constructor() public {
        // createShop("Patanjali Healthcare", web3.eth.accounts[0]);
        // createShop("Paradise Plaza", web3.eth.accounts[1]);
        // createShop("Mummy da Dhaba Bhojan Bhandar", web3.eth.accounts[2]);
        // createShop("Sharma and sons", web3.eth.accounts[3]);
        // createShop("GuptaJi Furnitures", web3.eth.accounts[4]);
    }

    function createDonor(string memory myName) public {
        Donor memory d = Donor({ 
            donorID:donorCount,
            name:myName, 
            balance:0,
            Address:msg.sender });
        donors[donorCount] = d;
        donorCount++;

    }

    function createProject(string memory myName, string memory myDescription, uint amount, uint shopID) public {
        Project memory d = Project(
            {projectID:projectCount,
            name:myName, 
            description:myDescription,
            requiredAmount:amount,
            balance:0,
            Address:msg.sender, 
            completed:false,
            shopID:shopID});
        projects[projectCount] = d;
        Shop storage s = shops[shopID];
        s.project_payments[projectCount]=0;
        projectCount++;
    }

    function createShop(string memory myName) public {
        Shop memory s = Shop({
            shopID:shopCount,
            name:myName,
            Address: msg.sender});
        shops[shopCount] = s;
        shopCount++;
    }

  
  struct Payment{
      uint PaymentID;
      address donorAddr; 
      uint projID;
      uint shopID;
      uint amount;
      bool signedByProject;
  }

  function createPayment(uint projectID, uint amt) public{
    Payment memory pay = Payment({ 
        PaymentID:paymentCount,
        donorAddr : msg.sender,
        projID : projectID,
        shopID: projects[projectID].shopID,
        amount : amt,
        signedByProject:false
        });
    Project storage pro = projects[projectID];
    pro.balance+=amt;
    payments[paymentCount] = pay;
    pro.due_signs[paymentCount]=true;
    paymentCount++;
  }

  function signPayment(uint paymentID) public {
    require (msg.sender == projects[payments[paymentID].projID].Address);
    require (!payments[paymentID].signedByProject);
    payments[paymentID].signedByProject = true;
    delete (projects[payments[paymentID].projID].due_signs[paymentID]);
  }

  function sendMoney(uint paymentID) public payable{
    require(payments[paymentID].signedByProject && msg.sender == payments[paymentID].donorAddr);
    Payment memory pay = payments[paymentID];
    address payable addr = shops[pay.shopID].Address;
    addr.transfer(msg.value);
    shops[pay.shopID].project_payments[pay.projID]+=msg.value;
  }
}



