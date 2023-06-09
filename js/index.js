let botonDado6 = document.querySelector(".button-dices-6");
let botonDado5 = document.querySelector(".button-dices-5");
const msgerror = document.querySelector(".msg-error-input");
const msgErrDados = document.querySelector(".msg-error-dados")
let numeroDados; //number of dice

const getDataPlay = (event) => {
  event.preventDefault();
  
  const name = event.target.name.value;
  const numberPlayers = event.target.quantyPlayers.value;
  const quantyScore = event.target.quantyScore.value
  const players = [];


  if(players.length === 1){
    if (!name) {
      msgerror.style.display = "block"    
     return  setTimeout(() =>{
        msgerror.style.display = "none"
     },3000 )
    }
  
    if (!name && players.length > 1) {
      msgerror.style.display = "block"    
     return  setTimeout(() =>{
        msgerror.style.display = "none"
     },3000 )
    }
  
    if (!numeroDados) {
      msgErrDados.style.display = "block"    
      return  setTimeout(() =>{
         msgErrDados.style.display = "none"
      },3000 )
    }
  }
 

  if (numberPlayers > 1) {
    for (let i = 1; i <= numberPlayers; i++) {
      const namePlayer = event.target[`name${i}`].value;
      players.push(namePlayer);
    }
  }else{
    players.push(name)
  }
    
  const data = {
    numeroDados,
    players,
    quantyScore
  };

  localStorage.setItem("data", JSON.stringify(data)); 
  window.location = "./pages/game.html";
};

//cantidadDados how many dice
const cantidadDados = (event, cantidad) => {
  const element = event.target;
  numeroDados = cantidad;

  if (element.innerHTML == botonDado6.innerHTML) {
    botonDado6.style = "background-color : #94ff02";
    botonDado5.style = "background-color : none";
  } else {
    botonDado5.style = "background-color : #94ff02";
    botonDado6.style = "background-color : none";
  }
};

const createInputs = (event) => {
  const contInputs = document.querySelector(".cont-input-players");
  const numberInputs = event.target.value;
  contInputs.innerHTML = "";

  for (let i = 1; i <= numberInputs; i++) {
    contInputs.innerHTML += ` 
      <div>
        <label for="">Nombre jugador ${i}</label>
        <input class="input-name" type="text" name="name${i}" placeholder="Nombre ${i}" />
      </div>`;
  }
};
