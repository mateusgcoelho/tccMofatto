let state = {
    health: 100,
    food: 100,
    balance: 0,
    currencyType: "Moedas",
};

let controllers = {
    balance: document.getElementById("balance"),
    health: document.getElementById("health"),
    food: document.getElementById("food"),
    background: document.getElementById("background_shop"),
};

const formatBalance = new Intl.NumberFormat('pt-BR');

// Atualização automatica de 100ms
setInterval(() => {
    populateInterface();
}, 100);

// Adicionando dinheiro com o tempo
setInterval(() => {
    state.balance += 57;

    localStorage.setItem("roomie:balance", state.balance);

    Swal.fire({
        position: "center",
        icon: "success",
        title: "Você ganhou 57 moedas!",
        showConfirmButton: false,
        timer: 1500,
    });

    populateInterface();
}, 60 * 1000);

// Select Background
const initialize = () => {
    try {
        const backgrounds = localStorage.getItem("roomie:backgrounds");
        const backgroundSelected = localStorage.getItem("roomie:backgrounds@selected");
        const balance = localStorage.getItem("roomie:balance");

        if (!balance) {
            localStorage.setItem("roomie:balance", 50);
            state.balance = 50;
        } else {
            state.balance = Number(JSON.parse(balance));
        }

        if (!backgrounds) {
            localStorage.setItem("roomie:backgrounds", JSON.stringify([1]));
        }
        
        if (!backgroundSelected) {
            localStorage.setItem("roomie:backgrounds@selected", JSON.stringify({
                id: 1,
                type: "day",
            }));       
        }

        changeBackground();
    } catch (error) {
        localStorage.clear();

        console.log(error);
        alert("Erro interno -> " + error);
    } 
};

const changeBackground = () => {
    const backgroundSelected = JSON.parse(localStorage.getItem("roomie:backgrounds@selected"));

    controllers.background.style.backgroundImage = 
        "url('" + `../assets/backgrounds/${backgroundSelected.id}/${backgroundSelected.type}.gif` + "')";
};


// Função para popular dados para interface
const populateInterface = () => {
    // Setando visualmente o Dinheiro
    controllers.balance.innerHTML = `
        <p id="balance">
            ${formatBalance.format(state.balance)} 
            <span style="font-size: 1rem;">${state.currencyType}</span>
        </p>
    `;

    // Setando visualmente a vida
    controllers.health.style = `height: 1.5rem; width: ${state.health}%;`;

    // Setando visualmente a fome
    controllers.food.style = `height: 1.5rem; width: ${state.food}%;`;
};

initialize();
