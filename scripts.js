const app = {
  state: [
    { id: 0, name: null, data: null },
    { id: 1, name: null, data: null },
    { id: 2, name: null, data: null },
  ],
  requestSenderId: null,
  subredditInput: null,
  
  init: function() {
    this.bindEvents();
  },
  
  bindEvents: function() {
    document.querySelectorAll(".dropdown-item").forEach(btn => {
      btn.addEventListener("click", this.handleDropdownClick.bind(this));
    });

    document.querySelectorAll(".rounded-circle").forEach(btn => {
      btn.addEventListener("click", this.handleDialogClick.bind(this));
    });

    document.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click",this.handleChange.bind(this))
    });

    document.getElementById("subreddit-dialog-btn").addEventListener("click", this.handleAddSubreddit.bind(this));
  },
  
  handleChange: function(e){
    e.preventDefault()
    const action = e.target.textContent
    this.requestSenderId = parseInt(e.target.closest("li").id)
    this.subredditInput = this.state[this.requestSenderId].name
    action==="Refresh" ? this.handleRefresh() : this.handleDelete()
  },

  handleRefresh: function(){
    this.fetchData()
  },

  handleDelete: function(){
    this.state[this.requestSenderId].data = null
    this.state[this.requestSenderId].name = null
    const divElement = document.getElementById(this.requestSenderId)
    divElement.querySelector(".output").innerHTML = ''
    divElement.querySelector(".rounded-circle").classList.remove("hide")
    divElement.querySelector("#elipse-menu").classList.add("hide")
    divElement.querySelector("#elipse-menu .col-10").textContent = ''
  },

  handleDropdownClick: function(e) {
    e.preventDefault();
    this.requestSenderId = parseInt(e.target.closest("li").id);
  },

  handleDialogClick: function(e) {
    e.preventDefault();
    this.requestSenderId = parseInt(e.target.closest("button").id);
    document.querySelector("dialog").showModal();
  },

  handleAddSubreddit: function(e) {
    e.preventDefault();
    const inputSubreddit = document.getElementById("subreddit-input");
    if (inputSubreddit.value) {
      this.subredditInput = inputSubreddit.value;
      document.querySelector("dialog").close();
      this.fetchData();
      inputSubreddit.value = ""
    } else {
      alert("Input field cannot be empty");
    }
  },
  
  fetchData: function() {
    fetch(`https://www.reddit.com/r/${this.subredditInput}.json`)
      .then(response => response.json())
      .then(data => data.kind ? this.saveData(data) : alert("Wrong subreddit name!"))
      .catch(err => console.log(err));
  },

  saveData: function(data) {
    if (this.requestSenderId !== false && this.state[this.requestSenderId] !== undefined) {
      this.state[this.requestSenderId].data = data.data.children;
      this.state[this.requestSenderId].name = this.subredditInput;
      this.showData();
    } else {
      console.error("Invalid requestSenderId:", this.requestSenderId);
    }
  },

  showData: function() {
    this.state.forEach(item => {
      if (item.data) {
        const higherDiv = document.getElementById(item.id);
        const div = higherDiv.querySelector(".output");
        div.innerHTML = ""; 
  
        // Hide the add button and show the ellipse menu
        higherDiv.querySelector(".rounded-circle").classList.add("hide");
        const elipsMenu = higherDiv.querySelector("#elipse-menu");
        elipsMenu.classList.remove("hide");
        elipsMenu.querySelector(".col-10").textContent = `/r/${item.name}`;
  
        // Show the next div if there is one
          const nextDiv = document.getElementById(item.id + 1);
          if (nextDiv) {
            nextDiv.classList.remove("hide");
          }
  
        // Display the fetched data
        item.data.forEach(data => {
          div.innerHTML += `
            <div class="container border-bottom border-dark">
              <div class="row">
                <span id="upvotes" class="col-2">${data.data.score}</span>
                <span id="title" class="col">${data.data.title}</span>
              </div>
            </div>`;
        });
      }
    });
  }  
}  

app.init();
