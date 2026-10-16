const Observador = require("./Observador");

// Participante GoF: Subject.
// Mantém a lista de observadores e os notifica sem conhecer suas classes concretas (RN05).
class Sujeito {
  #observadores = [];

  constructor() {
    if (new.target === Sujeito) {
      throw new TypeError("Sujeito é abstrata e não pode ser instanciada diretamente.");
    }
  }

  inscrever(observador) {
    if (!(observador instanceof Observador)) {
      throw new TypeError("Somente instâncias de Observador podem ser inscritas.");
    }
    if (!this.#observadores.includes(observador)) {
      this.#observadores.push(observador);
    }
  }

  desinscrever(observador) {
    this.#observadores = this.#observadores.filter((inscrito) => inscrito !== observador);
  }

  // Protegido por convenção (# no diagrama): deve ser chamado apenas pelas subclasses.
  notificar(evento) {
    // Itera sobre uma cópia para que uma desinscrição durante a notificação não altere o laço.
    for (const observador of [...this.#observadores]) {
      try {
        observador.atualizar(evento);
      } catch (erro) {
        // RN06: a falha de um observador não impede a notificação dos demais.
        console.error(`[Sujeito] Falha em ${observador.constructor.name}: ${erro.message}`);
      }
    }
  }
}

module.exports = Sujeito;
