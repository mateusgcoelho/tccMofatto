let state = {
    balance: 0,
    currencyType: "Moedas",
};

let controllers = {
    balance: document.getElementById("balance"),
    backgroundList: document.getElementById("background_list"),
};

let backgrounds = [
    {
        id: 1,
        name: "Mont Fuji",
        price: 200,
    },
    {
        id: 2,
        name: "Londres",
        price: 420,
    },
    {
        id: 3,
        name: "Farol",
        price: 750,
    },
    {
        id: 4,
        name: "Veneza",
        price: 1050,
    },
];

const formatBalance = new Intl.NumberFormat('pt-BR');

const clearInfos = () => {
    localStorage.removeItem("roomie:backgrounds");
    localStorage.removeItem("roomie:backgrounds@selected");

    window.location.href = "./play.html";
};

// Iniciando variaveis
const initialize = () => {
    try {
        const balance = localStorage.getItem("roomie:balance");
        const backgrounds = localStorage.getItem("roomie:backgrounds");
        const backgroundSelected = localStorage.getItem("roomie:backgrounds@selected");

        if (!backgrounds) {
            localStorage.setItem("roomie:backgrounds", JSON.stringify([1]));
        }

        if (!backgroundSelected) {
            localStorage.setItem("roomie:backgrounds@selected", JSON.stringify({
                id: 1,
                type: "day",
            }));
        }

        if (!balance) {
            localStorage.setItem("roomie:balance", 50);
            state.balance = 50;
        } else {
            state.balance = Number(JSON.parse(balance));
        }

        populateInterface();
    } catch (error) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: error,
            showConfirmButton: false,
            timer: 1500,
        });

        clearInfos();
    } 
};

// Alterar Background no localStorage
const updateBackground = (type, id) => {
    localStorage.setItem("roomie:backgrounds@selected", JSON.stringify({
        id,
        type,
    }));
    
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Você alterou o background!",
        showConfirmButton: false,
        timer: 1500,
    }).then(() => window.location.href = "./play.html");
};

// Alterar Background
const changeBackground = (id) => {
    Swal.fire({
        title: '<strong>Escolha o horario</strong>',
        html:
          `
            <a href="#" class="button_market" onclick="updateBackground('day', ${id})">Dia</a>
            <a href="#" class="button_market" onclick="updateBackground('sunset', ${id})">Tarde</a>
            <a href="#" class="button_market" onclick="updateBackground('night', ${id})">Noite</a>
          `,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        focusConfirm: false,
    });
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

    const backgroundsLocal = JSON.parse(localStorage.getItem("roomie:backgrounds"));
    const backgroundSelected = JSON.parse(localStorage.getItem("roomie:backgrounds@selected"));

    controllers.backgroundList.innerHTML = '';

    backgroundsLocal.map((backgroundId) => {
        let indexId = backgroundId - 1;
        controllers.backgroundList.innerHTML += `
            <div class="content_item ${backgroundSelected.id == backgroundId ? 'active' : ''}" style="
                background: url('../assets/backgrounds/${backgrounds[indexId].id}/day.gif') center;
                background-size: cover;

                transition: all 1s ease-in;
                -moz-transition: all 1s ease-in;
                -ms-transition: all 1s ease-in;
                -o-transition: all 1s ease-in;
                -webkit-transition: all 1s ease-in;
                background-repeat: no-repeat;
            ">
                <div class="content_item_modal" style="${backgroundSelected.id == backgroundId && `
                    opacity: 1;
                    background: rgba(0, 0, 0, 0.4);
                `}">
                    <section class="info">
                        <h3>Background ${backgrounds[indexId].name}</h3>                    
                    </section>

                    <section class="buttons">
                        <a href="#" class="button_market ${backgroundSelected.id == backgroundId && 'disabled'}" onclick="changeBackground(${backgroundId})">
                            ${backgroundSelected.id == backgroundId ? 'EM USO' : 'UTILIZAR'}
                        </a>
                    </section>
                </div>
            </div>
        `;
    });
};

initialize();
