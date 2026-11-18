class Hitbox {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }

    // Verifica se esta hitbox está colidindo com outra
    colideComoutra(hitbox) {
        return (
            this.x < hitbox.x + hitbox.largura &&
            this.x + this.largura > hitbox.x &&
            this.y < hitbox.y + hitbox.altura &&
            this.y + this.altura > hitbox.y
        );
    }
}