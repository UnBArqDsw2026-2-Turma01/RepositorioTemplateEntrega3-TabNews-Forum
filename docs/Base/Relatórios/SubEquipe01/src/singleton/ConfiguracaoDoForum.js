"use strict";

/**
 * Padrão GoF Singleton.
 *
 * ConfiguracaoDoForum concentra parâmetros globais da demonstração do
 * Fórum TabNews (nome da plataforma e limites de caracteres). Todos os
 * componentes que precisam desses valores devem consultar a mesma
 * instância, obtida por ConfiguracaoDoForum.obterInstancia().
 *
 * Os valores são ilustrativos e não foram lidos do sistema real do TabNews.
 */
class ConfiguracaoDoForum {
  static #instancia = null;
  static #criacaoAutorizada = false;
  static #instanciasCriadas = 0;

  constructor() {
    if (!ConfiguracaoDoForum.#criacaoAutorizada) {
      throw new Error(
        "ConfiguracaoDoForum é um Singleton: use ConfiguracaoDoForum.obterInstancia()."
      );
    }

    this.nomeDaPlataforma = "Fórum TabNews (demonstração acadêmica)";
    this.limiteDeCaracteresDoTitulo = 255;
    this.limiteDeCaracteresDoCorpo = 20000;

    ConfiguracaoDoForum.#instanciasCriadas += 1;
    Object.freeze(this);
  }

  static obterInstancia() {
    if (ConfiguracaoDoForum.#instancia === null) {
      ConfiguracaoDoForum.#criacaoAutorizada = true;
      try {
        ConfiguracaoDoForum.#instancia = new ConfiguracaoDoForum();
      } finally {
        ConfiguracaoDoForum.#criacaoAutorizada = false;
      }
    }
    return ConfiguracaoDoForum.#instancia;
  }

  static get instanciasCriadas() {
    return ConfiguracaoDoForum.#instanciasCriadas;
  }

  obter(chave) {
    if (!Object.prototype.hasOwnProperty.call(this, chave)) {
      throw new Error(`Parâmetro de configuração desconhecido: ${chave}.`);
    }
    return this[chave];
  }
}

module.exports = ConfiguracaoDoForum;
