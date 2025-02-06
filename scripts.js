let state = [
    {id:0,name:null,data:null,isDisplay:true},
    {id:1,name:null,data:null,isDisplay:false},
    {id:2,name:null,data:null,isDisplay:false},
]
let requestSenderId = null
let subredditInput = null


const btnDialogAll = document.querySelectorAll(".rounded-circle")
const dialogAddSubreddit = document.querySelector("dialog")
const btnAddSubreddit = document.getElementById("subreddit-dialog-btn")
const inputSubreddit = document.getElementById("subreddit-input")

btnDialogAll.forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault()
    requestSenderId = e.target.id
    dialogAddSubreddit.showModal()
}))

btnAddSubreddit.addEventListener('click',e=>{
    e.preventDefault()
    if (inputSubreddit.value){
        subredditInput = inputSubreddit.value
        dialogAddSubreddit.close()
        fetchData()
    }else(
        alert("input field cannot be empty")
    )
})

function fetchData (){
        fetch(`https://www.reddit.com/r/${subredditInput}.json`)
        .then(response=>response.json())
        .then(data => data.kind ? saveData(data):alert("Wrong subreddit name!"))
        .catch(console.error());
}

function indexFinder(str){
    switch (str){
        case "first": return 0;
        case "second": return 1;
        case "third": return 2
    }
}

function saveData(data){
    const index = indexFinder(requestSenderId)
    state.forEach(
        obj => {
            if (obj.id===index){
                obj.data = data
                obj.name = subredditInput
            }
        }
    )
}