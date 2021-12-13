App = {
  loading: false,
  contracts: {},
  selectedShopID:0,
  shopBalance:"",
  selectedProjectId:0,
  selectedPaymentId:0,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  //#####################################################
  // METAMASK BIT STARTS
  //#####################################################
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  //#####################################################
  // METAMASK BIT ENDS
  //#####################################################

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    web3.eth.getBalance(App.account, (err, balance) => {
      balance = web3.fromWei(balance, "ether") + " ETH"
      App.shopBalance=balance
    });

  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const charity = await $.getJSON('ClarityInCharity.json')

    // console.log(charity)
    App.contracts.Charity = TruffleContract(charity)
    App.contracts.Charity.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.charity = await App.contracts.Charity.deployed()
  },


  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()
    await App.renderStores()
    await App.renderPayments()
    await App.renderTransactions()


    // Update loading state
    App.setLoading(false)
  },

  renderPayments: async () => {

    const projectCount = await App.charity.projectCount()
    // const $taskTemplate = $('.taskTemplate')
    var projectID = 0;
    // Render out each task with a new task template
    for (var i = 0; i < projectCount; i++) {
      // Fetch the task data from the blockchain
      const project = await App.charity.projects(i);
      const projectId = project[0].toNumber();
      const projectAddr = project[5];
      if(projectAddr==App.account){
        projectID = projectId;
      }
    }
    // Load the total task count from the blockchain
    const paymentCount = await App.charity.paymentCount()
    // console.log(paymentCount)
    const $paymentTemplate = $('.paymentTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < paymentCount; i++) {
      // Fetch the task data from the blockchain
      const pmt = await App.charity.payments(i);
      const projId = pmt[2]
      if(projId==projectID){
        console.log("Mil gyaaaaaaa")
        const pmtId = pmt[0].toNumber();
        const dnrAddr = pmt[1];
        const donatedamt = pmt[4].toNumber();
        const signedbyproj = pmt[5];

      // if(signedbyproj==false){
        const $newPmtTemplate = $paymentTemplate.clone()
        $newPmtTemplate.find('.paymentId').html(pmtId)
        $newPmtTemplate.find('.donorAddr').html(dnrAddr)
        $newPmtTemplate.find('.donatedAmt').html(donatedamt)

        const funcCall = "App.selectPayment("
        const param = funcCall.concat(String(i))
        $newPmtTemplate.find('.sign-btn').attr("onclick",param.concat(")"))

        $('#paymentList').append($newPmtTemplate)
        $newPmtTemplate.show()
      // }
      }

      
      // const projectRequiredAmount = project[3].toNumber();
      // const projectStatus = project[6];
      // const projectShopNo = project[7].toNumber();
      
      // const url = "donate.html?id="
      // $newTaskTemplate.find('#amt-to-give').attr("projectId",String(i))

      // $newTaskTemplate.find('input')
      //                 .prop('name', projectId)
      //                 .prop('checked', projectStatus)
      //                 .on('click', App.toggleCompleted)

      // Put the task in the correct list

      // Show the task
      
    }
  },

  sendmoney: async() => {
    // console.log(App.selectedPaymentId)
    // await App.charity.sendMoney(App.selectedPaymentId, {from: App.account })
  },

  renderTransactions: async() => {
    // const donorCount = await App.charity.donorCount()
    // // const $taskTemplate = $('.taskTemplate')
    // var donorID = 0;
    // // Render out each task with a new task template
    // for (var i = 0; i < donorCount; i++) {
    //   // Fetch the task data from the blockchain
    //   const donor = await App.charity.donors(i);
    //   const dnrId = donor[0].toNumber();
    //   const dnrAddr = donor[3];
    //   if(dnrAddr==App.account){
    //     donorID = dnrId;
    //   }
    // }
    // Load the total task count from the blockchain
    const paymentCount = await App.charity.paymentCount()
    // console.log(paymentCount)
    const $payTemplate = $('.payTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < paymentCount; i++) {
      // Fetch the task data from the blockchain
      const pmt = await App.charity.payments(i);
      const donrAddr = pmt[1]
      if(donrAddr==App.account){
        // console.log("Mil gyaaaaaaa")
        const pmtId = pmt[0].toNumber();
        const proID = pmt[2].toNumber();
        const shopID = pmt[3].toNumber();
        const donatedamt = pmt[4].toNumber();
        const signedbyproj = pmt[5];

      if(signedbyproj==true){
        const $newPayTemplate = $payTemplate.clone()
        $newPayTemplate.find('.paymentId').html(pmtId)
        $newPayTemplate.find('.projID').html(proID)
        $newPayTemplate.find('.shopID').html(shopID)
        $newPayTemplate.find('.amt').html(donatedamt)

        // const funcCall = "App.selectPayment("
        // const param = funcCall.concat(String(i))
        // $newPayTemplate.find('.send-btn').attr("onclick",param.concat(")"))

        $('#payList').append($newPayTemplate)
        $newPayTemplate.show()
      }
      }
      
    }

  },

  addSign: async() => {
    console.log(App.selectedPaymentId)
    await App.charity.signPayment(App.selectedPaymentId, {from: App.account })
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const projectCount = await App.charity.projectCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < projectCount; i++) {
      // Fetch the task data from the blockchain
      const project = await App.charity.projects(i);
      const projectId = project[0].toNumber();
      const projectName = project[1];
      const projectDescription = project[2];
      const projectRequiredAmount = project[3].toNumber();
      const projectStatus = project[6];
      const projectShopNo = project[7].toNumber();
      const projectshop = await App.charity.shops(projectShopNo);

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      const img_url= "images/don"
      const img_url1= img_url.concat(String(i))
      $newTaskTemplate.find('.card-img').attr("src",img_url1.concat(".jpg"))
      $newTaskTemplate.find('.name').html(projectName)
      $newTaskTemplate.find('.description').html(projectDescription)
      $newTaskTemplate.find('.amount').html(projectRequiredAmount)
      $newTaskTemplate.find('.shop').html(projectshop[1])

      const funcCall = "App.selectProject("
      const param = funcCall.concat(String(i))
      $newTaskTemplate.find('.transfer-btn').attr("onclick",param.concat(")"))
      // const url = "donate.html?id="
      // $newTaskTemplate.find('#amt-to-give').attr("projectId",String(i))

      // $newTaskTemplate.find('input')
      //                 .prop('name', projectId)
      //                 .prop('checked', projectStatus)
      //                 .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (projectStatus) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

  selectProject: async(projectID) => {
    selectedProjectId = projectID;
    App.startTransfer();
  },

  selectPayment: async(paymentID) => {
    selectedPaymentId = paymentID;
    App.addSign();
  },

  startTransfer: async()=>{
    App.setLoading(true)

    const amtToGive = $('#amttogive').val()
    // const projectId = $('#amttogive').attr("projectId")
    console.log("blalalalal",amtToGive)
    console.log(selectedProjectId)
    await App.charity.createPayment(selectedProjectId,amtToGive, {from: App.account })
    window.location.reload()
  },

  showShopData: async () => {
    const $shopInfo = $('.shopInfo')
    // web3.eth.getBalance(App.account, (err, balance) => {
    //   balance = web3.fromWei(balance, "ether") + " ETH"
    // });
    const $newshopInfo = $shopInfo.clone()
    $newshopInfo.find('.total-bal').html(App.shopBalance)
    $('#balanceShop').append($newshopInfo)
    $newshopInfo.show()

    // const shopCount = await App.charity.shopCount()
    // for (var i = 0; i < shopCount; i++) {
    //   const shop = await App.charity.shops(i)
    //   const shopAddress = shop[6]
    //   if (shopAddress==App.account){
    //     // payments = shop[7]
    //     console.log(shop[7])
    //     // for (var i=0;i<)
    //   }
    // }
  },

  // createTask: async () => {
  //   App.setLoading(true)
  //   const name = $('#newProjectname').val()
  //   const description = $('#newProjectDescription').val()
  //   const amount = $('#newProjectAmount').val()
  //   // const shopId = $('#newProjectShop').val()
  //   // console.log(name)
  //   // console.log(description)
  //   // console.log(amount)
  //   // await App.charity.createProject(name,description,amount,shopId, {from: App.account })
  //   // window.location.reload()
  // },

  selectShop: (shopID) => {
    selectedShopID = shopID;
  },

  submitProject: async () => {
    App.setLoading(true)
    const name = $('#newProjectname').val()
    const description = $('#newProjectDescription').val()
    const amount = $('#newProjectAmount').val()
    await App.charity.createProject(name,description,amount,selectedShopID, {from: App.account })
    window.location.reload()
  },

  renderStores: async () => {
    // Load the total task count from the blockchain
    const shopCount = await App.charity.shopCount()
    const $storeTemplate = $('.storeTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < shopCount; i++) {
      // Fetch the task data from the blockchain
      const shop = await App.charity.shops(i);
      const shopId = shop[0].toNumber();
      const shopName = shop[1];
      const shopDesc = shop[2];
      const shopPhone = shop[3];
      const shopUrl = shop[4];
      const shopCat = shop[5];
      // const shopAddr = shop[5];

      // Create the html for the task
      const $newStoreTemplate = $storeTemplate.clone()
      const img_url= "images/"
      const img_url1= img_url.concat(shopCat)
      $newStoreTemplate.find('.card-img').attr("src",img_url1.concat(".jpg"))
      $newStoreTemplate.find('.name').html(shopName)
      $newStoreTemplate.find('.description').html(shopDesc)
      $newStoreTemplate.find('.phone').html(shopPhone)
      $newStoreTemplate.find('.site').html(shopUrl)
      const funcCall = "App.selectShop("
      const param = funcCall.concat(String(i))
      $newStoreTemplate.find('.btn').attr("onclick",param.concat(")"))

      // $newStoreTemplate.find('.address').html(shopAddr)

      $('#storeList').append($newStoreTemplate)
      // Put the task in the correct list
      // if (projectStatus) {
      //   $('#completedTaskList').append($newTaskTemplate)
      // } else {
      // }

      // Show the task
      $newStoreTemplate.show()
    }
  },

  createStore: async () => {
    App.setLoading(true)
    const sname = $('#newShopname').val()
    const sdesc = $('#newShopDesc').val()
    const sphone = $('#newShopPhone').val()
    const surl = $('#newShopUrl').val()
    const scat = $('#newShopCat').val() 
    // console.log(name)
    // console.log(description)
    // console.log(amount)
    await App.charity.createShop(sname, sdesc, sphone, surl, scat, {from: App.account })
    window.location.reload()
  },
  // toggleCompleted: async (e) => {
  //   App.setLoading(true)
  //   const taskId = e.target.name
  //   await App.todoList.toggleCompleted(taskId)
  //   window.location.reload()
  // },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})






























