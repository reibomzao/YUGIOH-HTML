const state = {
    score:{
        timeDuel: 60,
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        nome: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        time: document.querySelector("#time")
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    action:{
        button: document.getElementById("next-duel"),
        timeplay: null
    },
    playerSide:{
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    }
}

const dataCard = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"paper",
        img:"./ImagemSom/icons/dragon.png",
        WinOf:[1],
        LoseOf:[2]
    },
    {
        id:1,
        name:"Dark Magician",
        type:"rock",
        img:"./ImagemSom/icons/magician.png",
        WinOf:[2],
        LoseOf:[0]
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img:"./ImagemSom/icons/exodia.png",
        WinOf:[0],
        LoseOf:[1]
    }
]

async function getRandomCards(){
    const randomIndex = Math.floor(Math.random()*dataCard.length);
    return dataCard[randomIndex].id;
}

async function createCardImage(randomCard,fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./ImagemSom/icons/card-back.png");
    cardImage.setAttribute("data-id", randomCard)
    cardImage.classList.add("card")

    if(fieldSide === state.playerSide.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(randomCard)
        })
        
        cardImage.addEventListener("click", ()=>{
            setCardField(cardImage.getAttribute("data-id"));
        })
    }

 
    return cardImage 
}

async function setCardField(dataid){
        await removeAllCardsImage()

        let computerCardID = await getRandomCards()

        state.cardSprites.avatar.src = ""
        state.cardSprites.nome.innerText = ""
        state.cardSprites.type.innerText = ""
        state.fieldCards.player.style.display = "block"
        state.fieldCards.computer.style.display = "block"

        state.fieldCards.player.src = dataCard[dataid].img;
        state.fieldCards.computer.src = dataCard[computerCardID].img;

        let checkDuel = await checkDuelResult(dataid,computerCardID);

        await updateScore()
        await drawButton(checkDuel)

}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";
    init();
    if(state.score.timeDuel <= 0||state.score.timeDuel >= 60){
    Time()
    }
}

function startTime(){
    
    if(state.score.timeDuel <= 0){
        state.score.timeDuel = 0;
        clearInterval(state.action.timeplay)
        state.action.timeplay = null
        if(state.score.playerScore > state.score.computerScore){
            alert("Ganhou com margim de "+(state.score.playerScore-state.score.computerScore)+" pontos")
        }else if(state.score.playerScore < state.score.computerScore){
            alert("Perdeu com margim de "+(state.score.computerScore-state.score.playerScore)+" pontos")
        }else{
            alert("Terminou em empate")
        }
        drawButton("Inicio")
        removeAllCardsImage()
    }else{
        state.score.timeDuel--;
        state.cardSprites.time.textContent = state.score.timeDuel;
    }
    
}

async function playAudio(status){
    const audio = new Audio("./ImagemSom/audios/"+status+".wav");
    
    try{
        audio.play()
    }catch{

    }
}

async function updateScore(){
    state.score.scoreBox.innerText = "Win: "+ state.score.playerScore +"| Lose: "+ state.score.computerScore
}

async function drawButton(text){
     state.action.button.innerHTML = text;
     state.action.button.style.display = "block"
}

async function checkDuelResult(dataid,computerID){
    let duelResult = "Empate";
    let playerCard = dataCard[dataid];

    if(playerCard.WinOf.includes(computerID)){
        duelResult = "Ganhou";
        await playAudio("win")
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerID)){
        duelResult = "Perdeu";
        await playAudio("lose")
        state.score.computerScore++;
    }
    return duelResult
}

async function removeAllCardsImage(){
    let card = state.playerSide.computerBOX;
    let imgElement = card.querySelectorAll("img");
    imgElement.forEach((img)=>img.remove())

    card = state.playerSide.player1BOX;
    imgElement = card.querySelectorAll("img");
    imgElement.forEach((img)=>img.remove())
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = dataCard[index].img;
    state.cardSprites.type.innerText = "Attribute: "+ dataCard[index].type;
    state.cardSprites.nome.innerText = "Nome: "+ dataCard[index].name;
}


async function drawCards(cardN, fieldSide){
    for(let i =0;i<cardN;i++){
        const randomCard = await getRandomCards();
        const cardImage = await createCardImage(randomCard,fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }

}

function BGM(){
    const bgm = document.getElementById("bgm");
    bgm.play(); 
}

function init(){

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    BGM()
    
    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.computer);
}

function Time(){
    state.score.timeDuel = 60;
    state.score.playerScore = 0;
    state.score.computerScore = 0;
    updateScore();
    state.action.timeplay = setInterval(startTime,1000)
}

drawButton("Inicio")
