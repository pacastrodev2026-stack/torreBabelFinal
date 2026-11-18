 // =============================== // SENTINELA // ===============================

 class Sentinela extends Inimigo {

    //Criar o sentinela
    constructor(context, protagonista) {
        super(context); 

    //Guardar o protagonista para mirar os ataques 
    this.protagonista = protagonista;

    //Estado inicial do ataque
    this.ataqueAtivo = false;

    //Tempo inicial do ataque
    this.tempoAtaque = 0;

    //Duração do aviso vermelho (em milissegundos)
    this.tempoAviso = 700;
   
     //Velocidade de deslocamento da lamina
    this.velocidade = 16;
  }

  // =============================== // LÂMINA // ===============================

  desenharLamina(x, y, angulo, cor) {

    //Guardar as configurações atuais do canvas
    this.context.save();    

    // Posicionar e rotacionar a lâmina
    this.context.translate(x, y);
    this.context.rotate(angulo);

    // Definir a cor da lâmnina
    this.context.fillStyle = cor;

    //Criar o formato crescente
    this.context.beginPath();

    this.context.moveTo(-160, 0);

    //Curva externa 
    this.context.bezierCurveTo(
      -100, -100, 
      100, -100,
      160, 0);

    //Curva interna
     this.context.bezierCurveTo(
      100, -90, 
      -100, -90,
      -160, 0);

    //Preencher o formato
    this.context.closePath();
    this.context.fill();

    //Restaurar as configurações anteriores do Canvas
    this.context.restore();
  }

  // =============================== // CALCULAR DIREÇÃO LÂMINA // ===============================

  calcularDirecao( x, y) {

    //Calcular a diferença entre as posições
    var diferencaX = (this.protagonista.x + this.protagonista.tamanho/ 2) - x;
    var diferencaY = (this.protagonista.y + this.protagonista.tamanho / 2) - y;

    //Calcular o ângulo em radianos
    return Math.atan2(diferencaY, diferencaX);
  }

    // =============================== // INICIAR ATAQUE // ===============================

    iniciarAtaque() {

      //Localizar o centro do protagonista
      var jogadorX = this.protagonista.x + this.protagonista.tamanho / 2;
      var jogadorY = this.protagonista.y + this.protagonista.tamanho / 2;

      //Obter as dimensões da arena
      var largura = this.context.canvas.width;
      var altura = this.context.canvas.height;

      //Calcular a distância até o centro de cada borda
      var distancias = [
        Math.hypot(jogadorX - largura / 2, jogadorY),
        Math.hypot(jogadorX - largura / 2, jogadorY - altura),
        Math.hypot(jogadorX, jogadorY - altura / 2),
        Math.hypot(jogadorX - largura, jogadorY - altura / 2)
      ];

      //Selecionar a borda mais distante
      var borda = distancias.indexOf(Math.max(...distancias));

      //Sortear uma posição na borda escolhida
      switch(borda) {

        //Borda superior 
        case 0:
          this.x = Math.random() * largura;
          this.y = 0;
          break;

        //Borda inferior
         case 1:
        this.x = Math.random() * largura;
        this.y = altura;
        break;

        //Borda esquerda
        case 2:
        this.x = 0;
        this.y = Math.random() * altura;
        break;

        //Borda direita
        case 3:
        this.x = largura;
        this.y = Math.random() * altura;
        break;
      }
      
      //Calcular a direção até o protagonista
      this.angulo = this.calcularDirecao(this.x, this.y)

      //Registrar o momento que o ataque começou
      this.tempoAtaque = Date.now();

      //Marcar o ataque como ativo
      this.ataqueAtivo = true;

      //Criar hitbox da lâmina
      this.hitbox = new Hitbox(
        this.x - 160,
        this.y - 100,
        320,
        100
      );
    }

// =============================== // MOVIMENTAR ATAQUE // ===============================

movimentarLamina() {

  //Não movimentar durante o aviso vermelho
  var tempoDecorrido = Date.now() - this.tempoAtaque;

  if(tempoDecorrido < this.tempoAviso) return;

  //Calcular o deslocamento horizontal
  this.x += Math.cos(this.angulo) * this.velocidade;

  //Calcular o deslocamento vertical
  this.y += Math.sin(this.angulo) * this.velocidade;

  //Atualizar posições da hitbox
  this.hitbox.x = this.x - 160;
  this.hitbox.y = this.y - 100;

  //Verificar se a lâmina saiu completamente da arena
  if (
    this.x < -200 || 
    this.x > this.context.canvas.width + 200 ||
    this.y < -200 ||
    this.y > this.context.canvas.height + 200
  ) {
    this.ataqueAtivo = false;
    this.iniciarAtaque();
  }
}

// =============================== // DESENHAR ATAQUE // ===============================

desenharAtaque() {

  //Verificar se existe um ataque ativo
  if (!this.ataqueAtivo) return;

  //Calcular o tempo decorrido desde o início
  var tempoDecorrido = Date.now() - this.tempoAtaque;

  //Definir a cor da lâmina
  var corLamina = tempoDecorrido < this.tempoAviso ? "red" : "white";

  //Desenhar a lâmina na posição  atual
  this.desenharLamina(this.x, this.y, this.angulo + Math.PI / 2, corLamina);
}
 }