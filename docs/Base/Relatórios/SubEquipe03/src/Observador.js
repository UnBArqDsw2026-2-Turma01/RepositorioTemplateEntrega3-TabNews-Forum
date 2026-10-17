// Participante GoF: Observer.
class Observador {
  constructor() {
    if (new.target === Observador) {
      throw new TypeError("Observador é abstrata e não pode ser instanciada diretamente.");
    }
  }

  atualizar(evento) {
    throw new Error(`${this.constructor.name} deve sobrescrever o método atualizar(evento).`);
  }
}

module.exports = Observador;
