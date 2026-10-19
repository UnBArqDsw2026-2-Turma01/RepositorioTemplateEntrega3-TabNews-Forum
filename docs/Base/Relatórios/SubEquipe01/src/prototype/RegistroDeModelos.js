"use strict";

const { Prototipo } = require("./ModeloDeConteudo");

/**
 * Registro de protótipos (prototype manager, descrito pelo GoF como
 * variação de implementação do padrão).
 *
 * Guarda os modelos originais e entrega apenas cópias. Assim, o cliente
 * cria novos rascunhos sem conhecer a classe concreta do modelo e sem
 * risco de modificar o original.
 */
class RegistroDeModelos {
  #prototipos = new Map();

  registrar(chave, prototipo) {
    if (typeof chave !== "string" || !chave.trim()) {
      throw new Error("A chave do modelo é obrigatória.");
    }
    if (!(prototipo instanceof Prototipo)) {
      throw new TypeError("Somente objetos do tipo Prototipo podem ser registrados.");
    }
    this.#prototipos.set(chave.trim(), prototipo);
    return this;
  }

  criar(chave) {
    const prototipo = this.#prototipos.get(chave);
    if (!prototipo) {
      throw new Error(`Modelo não registrado: ${chave}.`);
    }
    return prototipo.clonar();
  }

  listarChaves() {
    return [...this.#prototipos.keys()];
  }
}

module.exports = RegistroDeModelos;
