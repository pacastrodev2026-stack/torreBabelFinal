// =============================== // INIMIGO // ===============================

 class Inimigo {
    //Criar um inimigo
    constructor(context) {
        this.context = context;
    
    //Vida inicial do inimigo
    this.vida = 5;
 }

// =============================== // RECEBER DANO // ===============================

 receberDano(dano) {
    this.vida -= dano;

    //Impedir que a vida fique negativa
    if (this.vida < 0) {
        this.vida = 0;
    }
 }
 
// =============================== // VERIFICAR DERROTA // ===============================
 estaDerrotado() {
    return this.vida <= 0;
 }
 }