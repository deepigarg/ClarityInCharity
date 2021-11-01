App = {
  loading: false,
  contracts: {},

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

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const projectCount = await App.charity.projectCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= projectCount; i++) {
      // Fetch the task data from the blockchain
      const project = await App.charity.projects(i);
      const projectId = project[0].toNumber();
      const projectName = project[1];
      const projectDescription = project[2];
      const projectRequiredAmount = project[3].toNumber();
      const projectStatus = project[6];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.name').html(projectName)
      $newTaskTemplate.find('.description').html(projectDescription)
      $newTaskTemplate.find('.amount').html(projectRequiredAmount)
      $newTaskTemplate.find('input')
                      .prop('name', projectId)
                      .prop('checked', projectStatus)
                      .on('click', App.toggleCompleted)

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

  createTask: async () => {
    App.setLoading(true)
    const name = $('#newProjectname').val()
    const description = $('#newProjectDescription').val()
    const amount = $('#newProjectAmount').val()
    // console.log(name)
    // console.log(description)
    // console.log(amount)
    await App.charity.createProject(name,description,amount, {from: App.account })
    window.location.reload()
  },

  renderStores: async () => {
    // Load the total task count from the blockchain
    const shopCount = await App.charity.shopCount()
    const $storeTemplate = $('.storeTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= shopCount; i++) {
      // Fetch the task data from the blockchain
      const shop = await App.charity.shops(i);
      const shopId = shop[0].toNumber();
      const shopName = shop[1];
      const shopAddr = shop[2];

      // Create the html for the task
      const $newStoreTemplate = $storeTemplate.clone()
      $newStoreTemplate.find('.name').html(shopName)
      $newStoreTemplate.find('.address').html(shopAddr)

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
    // console.log(name)
    // console.log(description)
    // console.log(amount)
    await App.charity.createShop(sname, {from: App.account })
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






























