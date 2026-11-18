// =============================== // SISTEMA DE TURNOS // ===============================
// Fases possíveis da batalha 
var TURNO_JOGADOR = "jogador";
var TURNO_INIMIGO = "inimigo";

//A batalha começa pelo turno do inimigo
var turnoAtual = TURNO_INIMIGO;

//Batalha encerrada
var TURNO_FIM = "fim";

// =============================== // SELEÇÃO DE AÇÃO // ===============================
// Começar pela primeira opção (ATACAR)
var opcaoSelecionada = 0;

// =============================== // INICIAR TURNOS  // ===============================

function InicializarTurnos(teclado, atualizarSelecao, sentinela, caixaTexto, atualizarBotoes) {

// =============================== // TURNO AUTOMÁTICO E MANUAL // ===============================
//Guardar o temporizador do turno inimigo
var temporizadorInimigo;

//Iniciar a contagem do turno inimigo
function iniciarTurnoInimigo() {
    clearTimeout(temporizadorInimigo);

    turnoAtual = TURNO_INIMIGO;

    temporizadorInimigo = setTimeout(function() {
        turnoAtual = TURNO_JOGADOR;
        caixaTexto.textContent = "Sua vez! Escolha uma ação.";
    }, 30000);
}

//P passa manualmente para o turno do jogador
teclado.disparou(TECLA_P, function() {
    if (turnoAtual === TURNO_INIMIGO) {
        clearTimeout(temporizadorInimigo);
            turnoAtual = TURNO_JOGADOR;
            caixaTexto.textContent = "Sua vez! Escolha uma ação.";
    }
});

// =============================== // CONFIRMAR AÇÃO // ===============================

var acaoSelecionada = false;

// =============================== // SUBMENUS // ===============================
//Menu atualmente aberto 
var menuAtual = "principal";

//Opções do menu principal
var opcoesPrincipais = ["ATACAR", "ITENS", "AGIR", "STATUS"];

//Voltar para o menu principal
function voltarMenuPrincipal() {
    menuAtual = "principal";
    opcaoSelecionada = 0;

    atualizarBotoes(opcoesPrincipais);
    atualizarSelecao();

    caixaTexto.textContent = "Sua vez! Escolha uma ação";
}

//Espaço confirma ou executa a ação
teclado.disparou(ESPACO, function() {
    if (turnoAtual !== TURNO_JOGADOR) return;

    //Primeiro espaço: selecionar a opção
    if (!acaoSelecionada) {
        acaoSelecionada = true;

        if (menuAtual === "principal") {
            switch(opcaoSelecionada) {
                case 0:
                    caixaTexto.textContent = "ATACAR - Confirmar ação?";
                    break;
                case 1:
                    caixaTexto.textContent = "ITENS - Confirmar ação?";
                    break;
                case 2:
                    caixaTexto.textContent = "AGIR - Confirmar ação?";
                    break;
                case 3:
                    caixaTexto.textContent = "STATUS - Confirmar ação?";
                    break;
            }
        }

        else if (menuAtual === "atacar") {
            caixaTexto.textContent = opcaoSelecionada === 0
                ? "ATACAR - Confirmar ação?"
                : "VOLTAR - Confirmar?";
        }

        else if (menuAtual === "itens") {
            caixaTexto.textContent = "VOLTAR - Confirmar?";
        }

        else if (menuAtual === "agir") {
            var acoes = ["CONVERSAR", "OBSERVAR", "PROVOCAR", "VOLTAR"];
            caixaTexto.textContent = acoes[opcaoSelecionada] + " - Confirmar?";
        }

        else if (menuAtual === "status") {
            caixaTexto.textContent = "VOLTAR - Confirmar?";
        }

    } else {

        //Segundo espaço: confirmar a opção

        if (menuAtual === "principal") {

            if (opcaoSelecionada === 0) {
                menuAtual = "atacar";
                atualizarBotoes(["ATACAR", "VOLTAR", "VOLTAR", "VOLTAR"]);
            }

            else if (opcaoSelecionada === 1) {
                menuAtual = "itens";
                atualizarBotoes(["VOLTAR", "VOLTAR", "VOLTAR", "VOLTAR"]);
            }

            else if (opcaoSelecionada === 2) {
                menuAtual = "agir";
                atualizarBotoes(["CONVERSAR", "OBSERVAR", "PROVOCAR", "VOLTAR"]);
            }

            else if (opcaoSelecionada === 3) {
                menuAtual = "status";
                atualizarBotoes(["VOLTAR", "VOLTAR", "VOLTAR", "VOLTAR"]);

                caixaTexto.textContent = "SENTINELA — HP: " + sentinela.vida;
            }

            opcaoSelecionada = 0;
            atualizarSelecao();
        }

        else if (menuAtual === "atacar") {

            if (opcaoSelecionada === 0) {
                sentinela.receberDano(1);

                sentinela.danoVisual = {
                    texto: "-1",
                    inicio: Date.now()
                };

                if (sentinela.estaDerrotado()) {
                    caixaTexto.textContent = "VOCÊ VENCEU!";
                    turnoAtual = TURNO_FIM;
                    acaoSelecionada = false;
                    return;
                }

                caixaTexto.textContent = "Você atacou!";
                acaoSelecionada = false;
                iniciarTurnoInimigo();
                return;
            }

            voltarMenuPrincipal();
        }

        else if (menuAtual === "itens") {
            caixaTexto.textContent = "Você entrou de mãos vazias.";
            voltarMenuPrincipal();
        }

        else if (menuAtual === "agir") {

            if (opcaoSelecionada === 3) {
                voltarMenuPrincipal();
            } else {
                caixaTexto.textContent = "A Sentinela não reage.";
                voltarMenuPrincipal();
            }
        }

        else if (menuAtual === "status") {
            voltarMenuPrincipal();
        }

        acaoSelecionada = false;
    }
});

// =============================== // MOVIMENTAR A SELEÇÃO // ===============================
//Mover o cursor durante o turno do jogador 
teclado.disparou(TECLA_A, function() {
    if (turnoAtual === TURNO_JOGADOR) {
        if (opcaoSelecionada % 2 === 1) {
            opcaoSelecionada--;
        }
        atualizarSelecao();
    }
}); 

teclado.disparou(TECLA_D, function() {
    if (turnoAtual === TURNO_JOGADOR) {
        if (opcaoSelecionada % 2 === 0) {
            opcaoSelecionada++;
        }
        atualizarSelecao();
    }
}); 

teclado.disparou(TECLA_W, function() {
    if (turnoAtual === TURNO_JOGADOR && opcaoSelecionada >= 2) {
            opcaoSelecionada -= 2;  
            atualizarSelecao();
    }
}); 

teclado.disparou(TECLA_S, function() {
    if (turnoAtual === TURNO_JOGADOR && opcaoSelecionada < 2) {
            opcaoSelecionada += 2;  
            atualizarSelecao();
    }
}); 

//Iniciar o primeiro turno inimigo
iniciarTurnoInimigo();

}