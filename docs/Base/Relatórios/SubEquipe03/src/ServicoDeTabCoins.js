const Observador = require("./Observador");
const { TipoDeEvento } = require("./EventoDeConteudo");

const VALOR_POR_CONTEUDO = 1;

// Participante GoF: ConcreteObserver.
class ServicoDeTabCoins extends Observador {
  #saldos = new Map();

  atualizar(evento) {
    switch (evento.tipo) {
      case TipoDeEvento.COMENTARIO_PUBLICADO:
        this.#creditar(evento.conteudo.autor);
        break;
      case TipoDeEvento.CONTEUDO_REMOVIDO:
        this.#debitar(evento.conteudo.autor);
        break;
    }
  }

  consultarSaldo(usuario) {
    return this.#saldos.get(usuario) ?? 0;
  }

  #creditar(usuario) {
    this.#saldos.set(usuario, this.consultarSaldo(usuario) + VALOR_POR_CONTEUDO);
    console.log(`[TabCoins] +${VALOR_POR_CONTEUDO} para ${usuario} (saldo: ${this.consultarSaldo(usuario)})`);
  }

  #debitar(usuario) {
    this.#saldos.set(usuario, this.consultarSaldo(usuario) - VALOR_POR_CONTEUDO);
    console.log(`[TabCoins] -${VALOR_POR_CONTEUDO} para ${usuario} (saldo: ${this.consultarSaldo(usuario)})`);
  }
}

module.exports = ServicoDeTabCoins;
