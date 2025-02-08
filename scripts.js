let state = [
  { id: 0, name: null, data: null },
  { id: 1, name: null, data: null },
  { id: 2, name: null, data: null },
];
let requestSenderId = null;
let subredditInput = null;
let pendingAction = null

const btnDialogAll = document.querySelectorAll(".rounded-circle");
const dialogAddSubreddit = document.querySelector("dialog");
const btnAddSubreddit = document.getElementById("subreddit-dialog-btn");
const inputSubreddit = document.getElementById("subreddit-input");
const firstDiv = document.getElementById("first");
const SecondDiv = document.getElementById("second");
const thirdDiv = document.getElementById("third");
const dropdownItemAll = document.querySelectorAll(".dropdown-item");

dropdownItemAll.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    requestSenderId = e.target.parentElement.id
    pendingAction = e.target.textContent
    if (pendingAction === "Refresh"){
        subredditInput = state[requestSenderId].name
        fetchData()
        showData()
    }
})
);

btnDialogAll.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    requestSenderId = e.target.id;
    dialogAddSubreddit.showModal();
  })
);

btnAddSubreddit.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputSubreddit.value) {
    subredditInput = inputSubreddit.value;
    dialogAddSubreddit.close();
    fetchData();
  } else alert("input field cannot be empty");
});


function fetchData() {
  fetch(`https://www.reddit.com/r/${subredditInput}.json`)
    .then((response) => response.json())
    .then((data) =>
      data.kind ? saveData(data) : alert("Wrong subreddit name!")
    )
    .catch((err) => console.log(err));
}

function indexFinder(str) {
  switch (str) {
    case "first":
      return 0;
    case "second":
      return 1;
    case "third":
      return 2;
    default:
      return false;
  }
}

function divFinder(int) {
  switch (int) {
    case 0:
      return firstDiv;
    case 1:
      return SecondDiv;
    case 2:
      return thirdDiv;
    default:
      return null;
  }
}

function saveData(data) {
  const index = indexFinder(requestSenderId);
  if (index !== false) {
    state[index].data = data.data.children;
    state[index].name = subredditInput;
    showData();
  }
}

function showData() {
  state.forEach((item) => {
    if (item.data) {
      const higherDiv = divFinder(item.id);
      const div = higherDiv.querySelector(".output");
      div.innerHTML = "";
      higherDiv.querySelector(".rounded-circle").classList.add("hide");
      const elipsMenu = higherDiv.querySelector("#elipse-menu");
      elipsMenu.classList.remove("hide");
      elipsMenu.querySelector(".col-10").textContent = `/r/${subredditInput}`;
      if (item.id < 2) {
        const nextDiv = divFinder(item.id + 1);
        if (nextDiv) {
          nextDiv.classList.remove("hide");
        }
      }

      item.data.forEach((data) => {
        div.innerHTML += `
            <div class="container border-bottom border-dark">
                <div class="row">
                    <span id="upvotes" class="col-2">${data.data.score}</span>
                    <span id="title" class="col">${data.data.title}</span>
                </div>
            </div>
                `;
      });
    }
  });
}
