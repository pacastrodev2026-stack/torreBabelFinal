// =============================== // CANVAS // ===============================

// Localizar o canvas no html
var canvas = document.getElementById("meu_canvas2");

// Obter o contexto 2D pra desenhar no canvas
var context = canvas.getContext("2d");

// =============================== // TECLADO // ===============================
// Criar o objeto responsável por detectar as teclas apertadas
var teclado = new Teclado(window);

// =============================== // TELA DO COMBATE // ===============================
// Localizar a tela do jogador no HTML
var telaJogador = document.querySelector(".tela-jogador");

// Localizar a caixa de texto 
var caixaTexto = document.querySelector(".caixa-texto");

// =============================== // OPÇÕES DE AÇÃO // ===============================
// Localizar os quatro botões de ação
var opcoesAcao = document.querySelectorAll(".opcao-acao");

// Localizar os textos dos quatro botões
var textosOpcoes = document.querySelectorAll(".texto-opcao");

//Atualizar os nomes das opções de ação
function atualizarBotoes(nomes) {
    textosOpcoes.forEach(function(texto, indice) {
        texto.textContent = nomes[indice];
    });
}

// =============================== // ATUALIZAR SELEÇÃO // ===============================
//Mostrar somente o jogador na opção selecionada
function atualizarSelecao() {
    opcoesAcao.forEach(function(opcao, indice) {
        var cursor = opcao.querySelector(".cursor-opcao");

        if (indice === opcaoSelecionada) {
            cursor.style.visibility = "visible";
        } else {
            cursor.style.visibility = "hidden";
        }
    });
}

// Preparar a seleção inicial 
atualizarSelecao();

// =============================== // PROTAGONISTA // ===============================
// Criar o protagonista, passando o contexto de desenho e o teclado
var protagonista = new Protagonista(context, teclado);

// =============================== // DISPLAY HP // ===============================
var valorHP = document.getElementById("valor-hp");

// =============================== // SENTINELA // ===============================
// Criar o sentinela, passando o ocntexto de desenho e o protagonista
var sentinela = new Sentinela(context, protagonista);

// =============================== // SENTINELA // ===============================
var imagemSentinela = document.querySelector(".imagem-sentinela img");

var indicadorDano = document.querySelector(".indicador-dano");

// =============================== // INICIAR TURNOS // ===============================
//Inicializar o sistema de turnos 
InicializarTurnos(teclado, atualizarSelecao, sentinela, caixaTexto, atualizarBotoes);

// =============================== // CONTROLE DO SENTINELA // ===============================
//Guarda o turno anterior
var turnoAnterior = null;

// =============================== // RETORNO AO MENU // ===============================
var temporizadorRetorno = null;

// =============================== // LOOP PRINCIPAL // ===============================
//  Atualizar e desenhar o protagonista continuamente
function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

//Atualizar mostrador de HP
valorHP.textContent = protagonista.vida;

// =============================== // CONDIÇÃO DE DERROTA // ===============================

if (protagonista.vida <= 0 && turnoAtual !== TURNO_FIM) {
    turnoAtual = TURNO_FIM;
    caixaTexto.textContent = "VOCÊ PERDEU!";
    clearTimeout(temporizadorRetorno);
}

// =============================== // DETECTAR NOVO TURNO // ===============================
//Verificar se o turno mudou
if(turnoAtual !== turnoAnterior) {

    //Iniciar o ataque quando começar o turno inimigo
    if(turnoAtual === TURNO_INIMIGO) {
        sentinela.iniciarAtaque();
    }

    //Retornar ao menu após a vitória
    if(turnoAtual === TURNO_FIM) {
        temporizadorRetorno = setTimeout(function() {

            //Iniciar escurecimento da tela
            document.body.classList.add("escurecer-tela");

            //Reiniciar o jogo após escurecimento
            setTimeout(function() {
                location.reload();
            }, 3000);

        }, 2000);
    }

    //Atualizar o turno anterior
    turnoAnterior = turnoAtual;
}

// =============================== // MOSTRAR A TELA DO JOGADOR // ===============================
// Mostrar ou esconder a interface conforme o turno
if (turnoAtual  === TURNO_JOGADOR || turnoAtual === TURNO_FIM) {
    telaJogador.style.display = "flex";
    
    if (turnoAtual === TURNO_JOGADOR) {
        atualizarSelecao();
    }
} else {
    telaJogador.style.display = "none";
}

// =============================== // INDICADOR DE DANO // ===============================

if (sentinela.danoVisual) {
    var tempoDano = Date.now() - sentinela.danoVisual.inicio;

    if (tempoDano < 1000) {
        var posicaoY = 20 - (tempoDano * 0.025);

        indicadorDano.textContent = sentinela.danoVisual.texto;
        indicadorDano.style.transform = "translate(-50%, -" + posicaoY + "px)";
        indicadorDano.style.opacity = 1 - (tempoDano / 1000);

    } else {
        indicadorDano.textContent = "";
        indicadorDano.style.opacity = 0;
        sentinela.danoVisual = null;
    }
}

// =============================== // MOVIMENTAR E DESENHAR // ===============================
// O protagonista só se move e aparece durante o turno inimigo
if (turnoAtual === TURNO_INIMIGO) {
    protagonista.atualizar();
    protagonista.desenhar();

//Movimentar a lâmina
sentinela.movimentarLamina();

//Verificar colisão lâmina
if (
    sentinela.ataqueAtivo &&
    Date.now() - sentinela.tempoAtaque >= sentinela.tempoAviso &&
    sentinela.hitbox.colideComoutra(protagonista.hurtbox)
) {
    protagonista.receberDano(1);
}

//Desenhar o ataque do sentinela
    sentinela.desenharAtaque();
}
    requestAnimationFrame(loop);
}

// =============================== // MENU INICIAL // ===============================

// Localizar os elementos do menu e do combate
var menuInicial = document.querySelector(".menu-inicial");
var areaCombate = document.querySelector(".area-combate");
var botaoIniciar = document.getElementById("botao-iniciar");

// Mostrar o combate quando clicar em INICIAR
botaoIniciar.addEventListener("click", function() {
    menuInicial.style.display = "none";
    areaCombate.style.display = "flex";
});

//Iniciar o loop
loop();