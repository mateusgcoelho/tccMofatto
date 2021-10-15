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

const formatBalance = new Intl.NumberFormat("pt-BR");

const clearInfos = () => {
  localStorage.removeItem("roomie:backgrounds");
  localStorage.removeItem("roomie:backgrounds@selected");

  window.location.href = "./play.html";
};

// Iniciando variaveis
const initialize = () => {
  try {
    const balance = localStorage.getItem("roomie:balance");

    if (!balance) {
      localStorage.setItem("roomie:balance", 50);
      state.balance = 50;
    } else {
      state.balance = Number(JSON.parse(balance));
    }

    populateInterface();
    populateBackgroundList();
  } catch (error) {
    alert(error);
    clearInfos();
  }
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
};

// Setando Backgrounds na Lista
const populateBackgroundList = () => {
  try {
    const backgroundsLocal = JSON.parse(
      localStorage.getItem("roomie:backgrounds")
    );

    controllers.backgroundList.innerHTML = "";
    if (backgroundsLocal.length < backgrounds.length) {
      backgrounds.map((background) => {
        if (!backgroundsLocal.includes(background.id)) {
          controllers.backgroundList.innerHTML += `
                        <div class="content_item" style="
                            background: url('../assets/backgrounds/${background.id}/day.gif') center;
                            background-size: cover;

                            transition: all 1s ease-in;
                            -moz-transition: all 1s ease-in;
                            -ms-transition: all 1s ease-in;
                            -o-transition: all 1s ease-in;
                            -webkit-transition: all 1s ease-in;
                            background-repeat: no-repeat;
                            margin-bottom: 3rem;
                        ">
                            <div class="content_item_modal">
                                <section class="info">
                                    <h3>Background ${background.name}</h3>
            
                                    <span class="content_item_balance">${background.price} ${state.currencyType}</span>
                                </section>
            
                                <section class="buttons">
                                    <a href="#" class="button_market" onclick="buyItem(${background.id})">ADQUIRIR</a>
                                </section>
                            </div>
                        </div>
                    `;
        }
      });
    } else {
      controllers.backgroundList.innerHTML =
        "<p>Nenhum background disponivel para compra!</p>";
    }
  } catch (error) {
    clearInfos();
  }
};

// Função de comprar algum item na loja
const buyItem = (id) => {
  let itemIndex = id - 1;

  if (state.balance >= backgrounds[itemIndex].price) {
    const backgroundsLocal = JSON.parse(
      localStorage.getItem("roomie:backgrounds")
    );

    Swal.fire({
      title: "Deseja mesmo Comprar?",
      text: `O Item Background ${backgrounds[itemIndex].name} custa ${backgrounds[itemIndex].price} Moedas`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff92b8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Comprar",
      cancelButtonText: "Cancelar",
    })
      .then((result) => {
        if (result.value == true) {
          localStorage.setItem(
            "roomie:balance",
            state.balance - backgrounds[itemIndex].price
          );
          state.balance -= backgrounds[itemIndex].price;

          populateInterface();

          let newBackgrounds = [id];

          backgroundsLocal.map((backgroundId) => {
            newBackgrounds.push(backgroundId);
          });

          localStorage.setItem(
            "roomie:backgrounds",
            JSON.stringify(newBackgrounds)
          );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Você adquiriu o Background",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => (window.location.href = "./play.html"));
        }
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Saldo insuficiente!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

initialize();
