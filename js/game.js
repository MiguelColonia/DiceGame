

const data = JSON.parse(localStorage.getItem("data"));
const containsDice = document.querySelector(".contains-Dice"); 
const messageLost = document.querySelector(".lost-turn"); 
const whoLost = document.querySelector(".lost-turn p"); 
const buttonStop = document.querySelector(".button-Stop");
const buttonThrow = document.querySelector(".button-Throw"); 
const turnBegins = document.querySelector(".turn-Begins"); 
const buttonPlayAgain = document.querySelector(".turn-Begins button");
const seedice = document.querySelector(".see-dice-select div"); 
const audioDice = document.getElementById("audio-dices");
const element = document.querySelector(".turn-Begins p");
const players = data.players;

let arrayDice = []; 
let lostTurn;
let newTurn = true; 
let time = 2000; 
let turn = "player"; 
let scoreUsuario; //user 
let scoreMaquina; // machine
let winScore = false;
let scoreActual = 0;


// Starts the configuration for the scoring table
const newTableScore = () => {
  const table = document.getElementById("table-score");
  table.innerHTML = "";

 // number of players starting the game is validated
  if (players.length == 1) {
    return (table.innerHTML = `
    <tr class="usuario">
      <th>${players[0]}</th>
      <td id="score-usuario">0</td>
    </tr>
    <tr class="maquina">
      <th>Computer</th>
      <td id="score-maquina">0</td>
    </tr>
    `);
  }

  for (let i = 0; i < players.length; i++) {
    table.innerHTML += `
    <tr class="usuario" id="player${i + 1}">
      <th>${players[i]}</th>
      <td id="score-usuario">0</td>
    </tr>`;
  }

// Applies to multiplayer only
  startPlayPlayers();
}; 

// Displays who starts the turn
const displayTurn = () => {
  const playerRandom = Math.floor(Math.random() * 2 + 1); 
  if (playerRandom == 1) {
    buttonThrow.disabled = false;
    turn = "player";
    turnBegins.style.display = "flex";
    element.innerHTML = `Start ${players[0]}`;
    setTimeout(() => {
      const maquina = document.querySelector(".usuario");
      maquina.style = "background-color : green";
      turnBegins.style.display = "none";
    }, 2000);
    return;
  }

  turn = "maquina";
  turnBegins.style.display = "flex";
  element.innerHTML = "Start the computer";
  setTimeout(() => {
    const maquina = document.querySelector(".maquina");
    maquina.style = "background-color : green";
    turnBegins.style.display = "none";
    juegoMaquina();
  }, 2000);
};

// This is the first method, the beginning.
const whoBegins = () => {
  buttonPlayAgain.style.display = "none";
  arrayDice = []; // we ensure that in case of a new game, the array containing the dice is empty so that no dice from previous games are accumulated.
  containsDice.innerHTML = ""; // This is the dice container that appears in the bottom right-hand corner of the screen, and this is where the selected dice are accumulated.
  displayTurn(); // It randomly generates who starts the turn.
  newTableScore(); // We create a points table with the username you entered at the beginning of the game..
  scoreUsuario = document.querySelector("#score-usuario");
  localStorage.setItem("scoreUs", 0);  
};


const drawingNumber = (numero) => {
  if (numero == 1) {
    return `
        <div class='contiene-numero-1'>
            <div></div>
        </div>
        `;
  } else if (numero == 2) {
    return `
        <div class='contiene-numero-2'>
        <div class='contiene-circulo-1'>
            <div></div>
        </div>
        <div class='contiene-circulo'>
           <div></div>
        </div>
       </div>
        `;
  } else if (numero == 3) {
    return `
    <div class='contiene-numero-2'>
     <div class='contiene-circulo-1'>
       <div></div>
     </div>
     <div class='contiene-circulo-2'>
       <div></div>
     </div>
     <div class='contiene-circulo'>
      <div></div>
     </div>
    </div>
    `;
  } else if (numero == 4) {
    return `
    <div class='contiene-numero-2'>
    <div class='contiene-circulo-3'>
        <div></div>
        <div></div>
    </div>
    <div class='contiene-circulo-3'>
      <div></div>
      <div></div>
    </div>
   </div>
    `;
  } else if (numero == 5) {
    return `
    <div class='contiene-numero-2'>
    <div class='contiene-circulo-3'>
        <div></div>
        <div></div>
    </div>
    <div class='contiene-circulo-4'>
      <div></div>
    </div>
    <div class='contiene-circulo-3'>
      <div></div>
      <div></div>
    </div>
   </div>
    `;
  } else {
    return `
    <div class='contiene-numero-2'>
    <div class='contiene-circulo-3'>
        <div></div>
        <div></div>
    </div>
    <div class='contiene-circulo-3'>
      <div></div>
      <div></div>
    </div>
    <div class='contiene-circulo-3'>
      <div></div>
      <div></div>
    </div>
   </div>
    `;
  }
};


// Function to manage who lost the turn.
const whoLostTurn = () => {
  const scoreMachine = JSON.parse(localStorage.getItem("scoreMqn"));
  const scoreUser = JSON.parse(localStorage.getItem("scoreUs"));
  const audioPerdio = document.getElementById("audio-perdio");

  lostTurn = arrayDice.find((element) => element == 1 || element == 5);

  if (data.players.length > 1) {
    const ultimoValor = parseInt(turn.charAt(turn.length - 1) - 1);
    whoLost.innerHTML = `Missed turn ${players[ultimoValor]}`;
    messageLost.style.display = "flex";
    buttonStop.disabled = true;
    arrayDice = [];
    newTurn = true;
    containsDice.innerHTML = "";
    audioPerdio.play();

    setTimeout(() => {
      messageLost.style.display = "none";
    }, 3000);

    if (players.length == ultimoValor + 1) {
      setTimeout(() => {
        startPlayPlayers(ultimoValor + 1, true);
      }, 3000);
    } else {
      setTimeout(() => {
        startPlayPlayers(ultimoValor, false);
      }, 3000);
    }

    return;
  }

  if (!lostTurn && turn === "player") {
    newTurn = true;
    arrayDice = [];
    messageLost.style.display = "flex";
    whoLost.innerHTML = "player missed a turn";
    buttonStop.disabled = true;
    turn = "maquina";
    scoreUser
      ? (scoreUsuario.innerHTML = scoreUser)
      : (scoreUsuario.innerHTML = 0);
    audioPerdio.play();
    setTimeout(() => {
      messageLost.style.display = "none";
      terminoturnUsuario();
    }, 3000);
  } else if (!lostTurn && turn === "maquina") {
    newTurn = true;
    arrayDice = [];
    whoLost.innerHTML = "The machine missed its turn";
    messageLost.style.display = "flex";
    buttonStop.disabled = true;
    turn = "player";
    scoreMachine
      ? (scoreMachine.innerHTML = scoreUser)
      : (scoreMachine.innerHTML = 0);
    audioPerdio.play();
    setTimeout(() => {
      messageLost.style.display = "none";
      terminoturnMaquina();
    }, 3000);
  }
};

// Function that tells us the winner, not workin?
const whoWinner = () =>{
  let userPoints = parseInt(localStorage.getItem("scoreUs"));

  if (userPoints + scoreActual >= parseInt(data.quantyScore)) {
    turnBegins.style.display = "flex";
    setTimeout(() => {
      buttonPlayAgain.style.display = "flex";
    }, 2000);
    element.innerHTML = "The player has win";
    return (newTurn = true);
  }

  if (userPoints === 0) {
    userPoints = userPoints + scoreActual;
    scoreUsuario.innerHTML = userPoints;
  } else {
    userPoints = scoreActual + userPoints;
    scoreUsuario.innerHTML = userPoints;
  }


}

const gameBegin = () => {
  audioDice.play();
  winScore = false;
  //buttonThrow.disabled = true
  /** Inicia la logica para varios jugadores **/
  if (data.players.length > 1 && newTurn) {
    buttonStop.disabled = false;
    for (let i = 1; i <= data.numeroDados; i++) {
      arrayDice.push(0);
    }
    newTurn = false;
    showDice();
  }

  if (data.players.length > 1 && !newTurn) {
    showDice();
  }

  /** Termina la logica para varios jugadores **/

  if (newTurn) {
    buttonStop.disabled = true;
    for (let i = 1; i <= data.numeroDados; i++) {
      arrayDice.push(0);
    }
    showDice();
  } else {
    showDice();
  }

  whoLostTurn();

};

// This method displays the dice dynamically, using the draw number method of line 70 interpolating/concatenating, "template string".
const showDice = () => {
  containsDice.style.display = "flex";
  containsDice.innerHTML = "";

  let combinacionOne = [];
  let combinacionTwo = [];
  let combinacionThree = [];
  let combinacionFour = [];
  let combinacionFive = [];
  let combinacionSix = [];

  if (turn === "maquina") {
    containsDice.innerHTML = `<div class="bloqueo-click-maquina"></div>`;
  }

  for (let a = 0; a < arrayDice.length; a++) {
    const numeroDado = Math.floor(Math.random() * 6 + 1);
    arrayDice[a] = numeroDado;
  }

  /***** Inicia la logica de las combinaciones de dados ******/
  //Usamos operador ternario

  if (turn === "player") {
    combinacionOne = arrayDice.filter((num) => num === 1);
    combinacionTwo = arrayDice.filter((num) => num === 2);
    combinacionThree = arrayDice.filter((num) => num === 3);
    combinacionFour = arrayDice.filter((num) => num === 4);
    combinacionFive = arrayDice.filter((num) => num === 5);
    combinacionSix = arrayDice.filter((num) => num === 6);

    console.log(combinacionOne, combinacionTwo, combinacionThree);

    if (combinacionTwo.length === 3 || combinacionTwo.length === 4) {
      buttonStop.innerHTML = `Stop with (200)`;

      combinacionTwo.length === 3
        ? ((buttonStop.innerHTML = `Stop with (200)`),
          (scoreActual = scoreActual + 200))
        : ((buttonStop.innerHTML = `Stop with (2000)`),
          (scoreActual = scoreActual + 2000));
      winScore = true;
      buttonStop.disabled = false;
    } else if (combinacionThree.length === 3 || combinacionThree.length === 4) {
      combinacionThree.length === 3
        ? ((buttonStop.innerHTML = `Stop with (300)`),
          (scoreActual = scoreActual + 300))
        : ((buttonStop.innerHTML = `Stop with (3000)`),
          (scoreActual = scoreActual + 3000));
      winScore = true;
      scoreActual = 200;
      buttonStop.disabled = false;
    } else if (combinacionFour.length === 3 || combinacionFour.length === 4) {
      combinacionFour.length === 3
        ? ((buttonStop.innerHTML = `Stop with (400)`),
          (scoreActual = scoreActual + 400))
        : ((buttonStop.innerHTML = `Stop with (4000)`),
          (scoreActual = scoreActual + 4000));
      winScore = true;

      buttonStop.disabled = false;
    } else if (combinacionOne.length === 3) {
      const dados = document.querySelectorAll(".class11");

      buttonStop.innerHTML = `Stop with (1000)`;
      scoreActual = scoreActual + 1000;
      winScore = true;

      buttonStop.disabled = false;
    } else if (combinacionFive.length === 3 || combinacionFive.length === 4) {
      combinacionFive.length === 3
        ? ((buttonStop.innerHTML = `Stop with (500)`),
          (scoreActual = scoreActual + 500))
        : ((buttonStop.innerHTML = `Stop with (5000)`),
          (scoreActual = scoreActual + 5000));
      winScore = true;

      buttonStop.disabled = false;
    } else if (combinacionSix.length === 3 || combinacionSix.length === 4) {
      combinacionSix.length === 3
        ? ((buttonStop.innerHTML = `Stop with (600)`),
          (scoreActual = scoreActual + 600))
        : ((buttonStop.innerHTML = `Stop with (600)`),
          (scoreActual = scoreActual + 6000));
      winScore = true;

      buttonStop.disabled = false;
    }
  }

  for (let a = 0; a < arrayDice.length; a++) {
    const numeroDado = arrayDice[a];
    let isClick = false;

    if (numeroDado === 1 || numeroDado === 5) {
      isClick = true;
    } else if (turn === "player") {
      if (
        numeroDado === 2 &&
        (combinacionTwo.length === 3 || combinacionTwo.length === 4)
      ) {
        isClick = true;
      } else if (
        numeroDado === 3 &&
        (combinacionThree.length === 3 || combinacionThree.length === 4)
      ) {
        isClick = true;
      } else if (
        numeroDado === 4 &&
        (combinacionFour.length === 3 || combinacionFour.length === 4)
      ) {
        isClick = true;
      } else if (
        numeroDado === 5 &&
        (combinacionFive.length === 3 || combinacionFive.length === 4)
      ) {
        isClick = true;
      } else if (
        numeroDado === 6 &&
        (combinacionSix.length === 3 || combinacionSix.length === 4)
      ) {
        isClick = true;
      }
    }

    if (isClick) {
      containsDice.innerHTML += `
      <div class='dado class${a} class${numeroDado + "" + numeroDado}'
           onclick="valor1(event, ${numeroDado})">
        <div class='capa-dado'></div>
        ${drawingNumber(numeroDado)}
      </div>`;
    } else {
      containsDice.innerHTML += `
      <div class='dado class${numeroDado + "" + numeroDado}'>
        ${drawingNumber(numeroDado)}
      </div>`;
    }
    console.log(numeroDado);
  }

  /***** Termina la logica de las combinaciones *******/

  console.log(arrayDice);
  newTurn = false;
};

//Esta funcion se ejecuta cuando salen los dados 1 o 5
const valor1 = (event, numeroDado) => {
  scoreMaquina = document.querySelector("#score-maquina");
  const dados = document.querySelectorAll(`.class${numeroDado}${numeroDado}`);

  dados.forEach((dado) => {
    dado.style.display = "none";
    console.log(dado);
  });


  if (turn == "player") {
    buttonThrow.disabled = false;
  }

  /* Inicia la logia para varios jugadores */
  if (data.players.length > 1) {
    const player = document.querySelector(`#${turn} td`);
    const scoreActual = parseInt(player.innerHTML);

    if (numeroDado == 1) {
      player.innerHTML = scoreActual + 100;
    } else {
      player.innerHTML = scoreActual + 50;
    }

    arrayDice.pop();

    if (arrayDice.length == 0) {
      mePlanto();
    }

    return;
  }

  /* Termina la logica para varios jugadores */

  //const scoreActual = parseInt(scoreUsuario.innerHTML);

  buttonStop.disabled = false;

  if (numeroDado == 1) {
    //scoreUsuario.innerHTML = scoreActual + 100;
    scoreActual = scoreActual + 100;

    seedice.innerHTML += `      
        <div
          class="contiene-numero-1"
          style="
            width: 40px;
            height: 40px;
            border: 1px solid black;
            border-radius: 5px;
            background-color: white;
          "
        >
          <div style="width: 10px; height: 10px;"></div>
        </div>
      `;

    buttonStop.innerHTML = `Stop with (${scoreActual})`;
  } else {
    seedice.innerHTML += `
    <div
          class="contiene-numero-2"
          style="
            width: 40px;
            height: 40px;
            border: 1px solid black;
            border-radius: 5px;
            background-color: white;
            padding: 2px;
          "
        >
          <div class="contiene-circulo-3">
            <div style="width: 10px; height: 10px"></div>
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="contiene-circulo-4">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="contiene-circulo-3">
            <div style="width: 10px; height: 10px"></div>
            <div style="width: 10px; height: 10px"></div>
          </div>
        </div>
    `;
    //scoreUsuario.innerHTML = scoreActual + 50;
    scoreActual = scoreActual + 50;
    buttonStop.innerHTML = `Stop with(${scoreActual})`;
  }

  event.target.parentElement.style.display = "none";
  arrayDice.pop();

  if (arrayDice.length == 0) {
    return mePlanto();
  }

  if (scoreActual >= parseInt(data.quantyScore)) {
    
    turnBegins.style.display = "flex";
    setTimeout(() => {
      buttonPlayAgain.style.display = "flex";
    }, 2000);
    element.innerHTML = "The player has won";
    newTurn = true;
  }
};

const iStop= () => {

  /** Starts the multiplayer logic **/

  let ultimoValor = parseInt(turn.charAt(turn.length - 1) - 1);
  const playerSelect = document.querySelector(`#player${ultimoValor + 1} th`);
  const nextTurn = document.querySelector(`#player${ultimoValor + 2} th`);
  const prueba = parseInt(turn.charAt(turn.length - 1));

  if (ultimoValor == -1) {
    ultimoValor = 9;
  }

  if (data.players.length > 1) {
   //To find out who the last player is
    if (players.length == ultimoValor + 1) {
      arrayDice = [];
      newTurn = true;
      containsDice.innerHTML = "";
      buttonStop.disabled = true;
      return startPlayPlayers(players.length, true);
    } else {
      arrayDice = [];
      newTurn = true;
      containsDice.innerHTML = "";
      buttonStop.disabled = true;
      return startPlayPlayers(ultimoValor, false);
    }
  }

/** End of the multiplayer logic **/

  /* We check if the score is higher than the one set at the beginning of the game
  to determine who wins */
  let userPoints = parseInt(localStorage.getItem("scoreUs"));

  whoWinner()

  buttonStop.innerHTML = "Stop";
//Modifies the score of the in the HTML table
  
  //Resets the score when the player is planted
  scoreActual = 0;

  const element = document.querySelector(".turn-Begins p");

  turnBegins.style.display = "flex";
  element.innerHTML = "The turn of the computer";

  setTimeout(() => {
    const maquina = document.querySelector(".maquina");
    maquina.style = "background-color : green";
    const user = document.querySelector(".usuario");
    user.style = "background-color : white";
    turnBegins.style.display = "none";
    containsDice.innerHTML = "";
    seedice.innerHTML = "";
    turn = "maquina";
    juegoMaquina();
  }, 3000);

  localStorage.setItem("scoreUs", userPoints);
  arrayDice = [];
  newTurn = true;
};

const juegoMaquina = () => {
  scoreMaquina = document.querySelector("#score-maquina");
  const scoreMqn = JSON.parse(localStorage.getItem("scoreMqn"));
  let gano = false;
  time = 2000;
  buttonThrow.disabled = true;
  setTimeout(() => {
    gameBegin();

    const numeroarrayDice = arrayDice.length;
    const newarrayDice = [...arrayDice];

    for (let i = 0; i < numeroarrayDice; i++) {
      if (arrayDice[i] == 1) {
        const prueba = setTimeout(() => {
          const puntajeMaquina = parseInt(scoreMaquina.innerHTML);
          const elementScore = document.querySelector(`.class${i}`);
          elementScore.style.display = "none";
          scoreMaquina.innerHTML = puntajeMaquina + 100;
          arrayDice.pop();

          //Draws die number 1 in the selected dice container
          seedice.innerHTML += `      
          <div
            class="contiene-numero-1"
            style="
              width: 40px;
              height: 40px;
              border: 1px solid black;
              border-radius: 5px;
              background-color: white;
            "
          >
            <div style="width: 10px; height: 10px;"></div>
          </div>
        `;
        }, time);

        setTimeout(() => {
          if (parseInt(scoreMaquina.innerHTML) >= parseInt(data.quantyScore)) {
            const buttonPlayAgain = document.querySelector(
              ".turn-Begins button"
            );
            turnBegins.style.display = "flex";
            element.innerHTML = "The machine has won";
            setTimeout(() => {
              buttonPlayAgain.style.display = "flex";
            }, 2000);
            newTurn = true;
            gano = true;
            clearTimeout(prueba);
          }
        }, time);

        time += 2000;
      } else if (arrayDice[i] == 5) {
        const prueba = setTimeout(() => {
          const puntajeMaquina = parseInt(scoreMaquina.innerHTML);
          const elementScore = document.querySelector(`.class${i}`);
          elementScore.style.display = "none";
          scoreMaquina.innerHTML = puntajeMaquina + 50;
          arrayDice.pop();

          //Draws die number 5 in the selected dice container
          seedice.innerHTML += `
        <div
          class="contiene-numero-2"
          style="
            width: 40px;
            height: 40px;
            border: 1px solid black;
            border-radius: 5px;
            background-color: white;
            padding: 2px;
          "
        >
          <div class="contiene-circulo-3">
            <div style="width: 10px; height: 10px"></div>
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="contiene-circulo-4">
            <div style="width: 10px; height: 10px"></div>
          </div>
          <div class="contiene-circulo-3">
            <div style="width: 10px; height: 10px"></div>
            <div style="width: 10px; height: 10px"></div>
          </div>
        </div>
    `;
        }, time);

        setTimeout(() => {
          if (parseInt(scoreMaquina.innerHTML) >= parseInt(data.quantyScore)) {
            turnBegins.style.display = "flex";
            element.innerHTML = "The machine has won";

            setTimeout(() => {
              buttonPlayAgain.style.display = "flex";
            }, 2000);

            gano = true;
            clearTimeout(prueba);
          }
        }, time);

        time += 2000;
      }
    }

    setTimeout(() => {
      if (gano) {
        return;
      }

      if (arrayDice.length > 3) {
        juegoMaquina();
      } else if (turn == "maquina") {
        let puntajeMaquina = parseInt(scoreMaquina.innerHTML);
        localStorage.setItem("scoreMqn", puntajeMaquina);
        terminoturnMaquina();
      }
    }, time);
  }, 1000);
};

//Executed when the machine passes or misses shifts.
const terminoturnMaquina = () => {
  seedice.innerHTML = "";
  turnBegins.style.display = "flex";
  element.innerHTML = "The turn of player";
  turn = "player";
  setTimeout(() => {
    const maquina = document.querySelector(".maquina");
    maquina.style = "background-color : white";
    const user = document.querySelector(".usuario");
    user.style = "background-color : green";
    turnBegins.style.display = "none";
    buttonThrow.disabled = false;
    arrayDice = [];
    newTurn = true;
    containsDice.innerHTML = "";
  }, 2000);
};

const terminoturnUsuario = () => {
  turnBegins.style.display = "flex";
  element.innerHTML = "The turn of the computer";
  turn = "maquina";

  setTimeout(() => {
    const maquina = document.querySelector(".maquina");
    maquina.style = "background-color : green";
    const user = document.querySelector(".usuario");
    user.style = "background-color : white";
    turnBegins.style.display = "none";
    buttonThrow.disabled = false;
    arrayDice = [];
    newTurn = true;
    containsDice.innerHTML = "";
    juegoMaquina();
  }, 2000);
};

const startPlayPlayers = (ultimoValor, ultimoJugador) => {
  if (ultimoValor && ultimoJugador) {
    const playerSelect = document.querySelector(`#player${ultimoValor} th`);
    const nextPlayer = document.querySelector(`#player1 th`);
    playerSelect.style = " background-color : white";
    nextPlayer.style = " background-color : green";
    turn = "player1";
    turnBegins.style.display = "flex";
    element.innerHTML = `El turn es de ${players[0]}`;

    return setTimeout(() => {
      turnBegins.style.display = "none";
    }, 2000);
  }

  if (ultimoValor >= 0 && !ultimoJugador) {
    console.log("linea 445");
    const playerSelect = document.querySelector(`#player${ultimoValor + 1} th`);
    const nextPlayer = document.querySelector(`#player${ultimoValor + 2} th`);
    playerSelect.style = " background-color : white";
    nextPlayer.style = " background-color : green";
    turn = `player${ultimoValor + 2}`;
    turnBegins.style.display = "flex";
    element.innerHTML = `El turn es de ${players[ultimoValor + 1]}`;
    return setTimeout(() => {
      turnBegins.style.display = "none";
    }, 2000);
  }

  const numberRandom = Math.floor(Math.random() * players.length + 1);
  const playerSelect = document.querySelector(`#player${numberRandom} th`);
  playerSelect.style = " background-color : green";
  turn = `player${numberRandom}`;
  turnBegins.style.display = "flex";
  element.innerHTML = `Start ${players[numberRandom - 1]}`;
  setTimeout(() => {
    turnBegins.style.display = "none";
  }, 2000);
};

whoBegins();
