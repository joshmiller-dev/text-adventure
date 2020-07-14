const gameDisplay = document.querySelector(".game-text");
const playerTextHistory = document.querySelector(".player-text");
const playerInput = document.querySelector(".text-input");
const healthDisplay = document.querySelector("#health");
let screen = document.querySelector(".screen-main");
let currentHealth = 3;
let inventory = [];
let foundState;
let textInput;



const states = [
    {
        location: "start",
        text: "You are back in the forest.  There appears to be a house to the <strong>left</strong> and a river to the <strong>right</strong>.",
        choices: {
            left: "house",
            right: "river"
        },
        desc: "It's incredibly dark.  Only the moonlight allows you to see what little you can.  Other than the paths to the left and right there is not much of note."
    },
    {
        location: "house",
        text: "This house is spoopy.  You see stairs going <strong>up</strong> and what looks to be a basement going <strong>down</strong>.  There is also a shiny <strong>key</strong> lying on the floor.",
        text2: "This house is spoopy.  You see stairs going up and what looks to be a basement going down.",
        choices: {
            up: "upstairs",
            down: "downstairs",
            back: "start"
        },
        desc: "This house has clearly seen better days.  All doors appear locked other than stairs leading up and down.",
        item: {
            name: "key",
            desc: "A shiny metal key engraved with the letter B.",
            unlocks: "basement"
        },
        itemText: "You pick up the key.  Oddly, it feels warm to the touch."
    },
    {
        location: "river",
        text: "This river is wet and stuff.  You can probably look for some way to go <strong>over</strong> it or try to swim <strong>across</strong>",
        choices: {
            over: "cave",
            across: "crab"
        }
    },
    {
        location: "crab",
        text: "You try to wade across but not even halfway there, a dark crab-shaped shadow snaps at your leg causing intense pain.  You struggle to free yourself from it and decide to head <strong>back</strong> and find another way across.",
        choices: {
            back: "river",
        },
        health: -1
    }
];

let currentState = {
    location: "start",
    text: "You wake up in a forest.  There appears to be a house to the <strong>left</strong> and a river to the <strong>right</strong>",
    choices: {
        left: "house",
        right: "river"
    },
    desc: "It's incredibly dark.  Only the moonlight allows you to see what little you can.  Other than the paths to the left and right there is not much of note."
}


//making sure text input is always in focus
playerInput.focus();
playerInput.addEventListener("blur", function(event){
    playerInput.focus();
});


//set starting text
gameDisplay.innerHTML = currentState.text;
healthDisplay.innerHTML = `Health: ${currentHealth}`

//on press of ENTER key
playerInput.addEventListener("keydown", event =>{
    if (event.keyCode === 13){
        console.log(currentHealth);
        //capture typed text as a variable
        textInput = playerInput.value.toLowerCase();
        //clear input box
        playerInput.value = "";
        //create history text above
        createTextHistory();
        //checking for keywords
        parseInput(textInput);

    }
});

const createTextHistory = () =>{

    //create new text line
    let newP = document.createElement("p");
    newP.classList.add("history");
    //give it content and add it to the <p>
    let pContent = document.createTextNode(`${gameDisplay.textContent}`);
    newP.appendChild(pContent);
    //add to DOM
    screen.insertBefore(newP, gameDisplay);

    //Do the same for player input history
    let newP2 = document.createElement("p");
    newP2.classList.add("history-player");
    //give it content and add it to the <p>
    let pContent2 = document.createTextNode(`> ${textInput}`);
    newP2.appendChild(pContent2);
    //add to DOM
    screen.insertBefore(newP2, gameDisplay);
}

//checking if player input matches certain keywords
const parseInput = (input) =>{
    //handle cases where none of the below are true
    gameDisplay.textContent = "That's not a word I recognize.";

    //checking various system keywords
    if (input.includes("help")){
        gameDisplay.textContent = "Type in the bolded commands to make choices.  Type 'help' for help menu.  Type 'inventory' for Inventory."
    }
    if (input.includes("look") || input === "l"){
        gameDisplay.textContent = currentState.desc;
    }
    //inspect item
    if (inventory.length > 0){
        for (let i = 0; i < inventory.length; i++){
            if (input.includes("inspect " + inventory[i].name)){
                gameDisplay.innerHTML = inventory[i].desc;
            }
        }
    }

    if (input.includes("inventory") || input === "i"){
        if (inventory.length === 0){
            gameDisplay.textContent = "Your pockets are empty."
        }else{
            gameDisplay.textContent = "You currently have: "
            for (let i = 0; i < inventory.length; i++){
                if (i < (inventory.length - 1)){
                    gameDisplay.innerHTML += `<strong>${inventory[i].name}</strong>, `              
                }else{
                    gameDisplay.innerHTML += `<strong>${inventory[i].name}</strong> `
                }
            }
        }
    }

    //CHECK IF MATCHING CHOICE IS TYPED
    if (currentState.choices[input]){
        //set new location
        currentState.location = currentState.choices[input];
        //TODO: clean this part up
        for(let i = 0; i < states.length; i++){
            if (states[i].location === currentState.location){
                foundState = states[i];
                //update current state atributes to that of the selected state
                currentState.text = foundState.text;
                currentState.choices = foundState.choices;
                currentState.desc = foundState.desc;
                currentState.item = foundState.item;
                //update health if there is a health event
                if(foundState.health){
                    currentHealth += foundState.health;
                    healthDisplay.innerHTML = `Health: ${currentHealth} `
                }
                gameDisplay.innerHTML = foundState.text;
            }
        }
    }

    //CHECK IF MATCHING ITEM IS TYPED
    if (currentState.item){
        if (input === currentState.item.name){
            // check if already have item
            if (inventory.includes(currentState.item)){
                gameDisplay.textContent = `You already have the ${currentState.item.name}.`
            }else{
                //add item to inventory and clear item from pool
                inventory.push(currentState.item);
                // currentState.item = {};
                // foundState.item = {};
                //show text for acquiring item
                gameDisplay.textContent = foundState.itemText;
                //display second text from now on (excludes item desc)
                foundState.text = foundState.text2;
            }
        }
    }
}






