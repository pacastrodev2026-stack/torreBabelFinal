// =============================== // PROTAGONISTA // ===============================

function Protagonista(context, teclado) {
    this.context = context;
    this.teclado = teclado;

    // tamanho
    this.tamanho = 60;

    // posição inicial
    this.x = (this.context.canvas.width - this.tamanho) / 2;
    this.y = (this.context.canvas.height - this.tamanho) / 2;

    // Hurtbox do protagonista
    this.hurtbox = new Hitbox(
        this.x,
        this.y,
        this.tamanho,
        this.tamanho
    );

    // velocidade
    this.velocidade = 4;

    //vida
    this.vida = 10;

    //Controle de invunerabilidade
    this.invulneravel = false;
    this.tempoInvulnerabilidade = 1000;
    this.ultimoDano = 0;

    // visual do protagonista, sofrerá alterações
    this.visual = new Image();
    this.visual.src = "./IMG/heart.png";
}

// =============================== // ATUALIZAR // ===============================

Protagonista.prototype.atualizar = function() {

    // Esquerda
    if (this.teclado.pressionada(TECLA_A)) {
        this.x -= this.velocidade;
    }

    // Direita
    if (this.teclado.pressionada(TECLA_D)) {
        this.x += this.velocidade;
    }

    // Cima
    if (this.teclado.pressionada(TECLA_W)) {
        this.y -= this.velocidade;
    }

    // Baixo
    if (this.teclado.pressionada(TECLA_S)) {
        this.y += this.velocidade;
    }

    // =============================== // LIMITES DO CANVAS // ===============================

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > this.context.canvas.width - this.tamanho) {
        this.x = this.context.canvas.width - this.tamanho;
    }

    if (this.y < 0) {
        this.y = 0;
    }

    if (this.y > this.context.canvas.height - this.tamanho) {
        this.y = this.context.canvas.height - this.tamanho;
    }

    // =============================== // ATUALIZAR HURTBOX // ===============================

    this.hurtbox.x = this.x;
    this.hurtbox.y = this.y;

    // =============================== // ATUALIZAR HURTBOX // ===============================
    //Verificar se o tempo de proteção terminou
    if (
        this.invulneravel && 
        Date.now() - this.ultimoDano >= this.tempoInvulnerabilidade
    ) {
        this.invulneravel = false;
    }
};

// =============================== // RECEBER DANO // ===============================

Protagonista.prototype.receberDano = function(dano) {

    //Verificar se está invulnerável
    if (this.invulneravel) return;

    //Descontar a vida sem permitir valores negativos
    this.vida = Math.max(0, this.vida - dano);

    //Ativar invulnerabiildade 
    this.invulneravel = true;
    this.ultimoDano = Date.now();
    
    console.log("Vida do protagonista:", this.vida);
};

// =============================== // DESENHAR // ===============================

Protagonista.prototype.desenhar = function() {

    //Verificar se o protagonista está invulnerável
    if (this.invulneravel) {

        //Alternar a visibilidade para criar o efeito de piscar
        if (Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }
    }

    this.context.drawImage(
        this.visual,
        this.x,
        this.y,
        this.tamanho,
        this.tamanho
    );
};