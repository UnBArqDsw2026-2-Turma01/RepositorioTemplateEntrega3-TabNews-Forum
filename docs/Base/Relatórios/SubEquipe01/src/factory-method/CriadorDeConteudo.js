"use strict";

const { Conteudo, ConteudoRaiz, Comentario } = require("./Conteudo");

/**
 * Creator do padrão Factory Method.
 *
 * prepararConteudo() é a operação comum a todos os criadores: ela pede o
 * produto ao método-fábrica criarConteudo(), confere o contrato e registra
 * quantos conteúdos foram preparados. Somente o método-fábrica muda entre
 * os criadores concretos.
 */
class CriadorDeConteudo {
  #conteudosPreparados = 0;

  constructor() {
    if (new.target === CriadorDeConteudo) {
      throw new Error("CriadorDeConteudo é abstrato: use um criador concreto.");
    }
  }

  // Método-fábrica (factory method): implementado pelas subclasses.
  criarConteudo(_dados) {
    throw new Error("Criadores concretos devem implementar criarConteudo().");
  }

  prepararConteudo(dados) {
    const conteudo = this.criarConteudo(dados);

    if (!(conteudo instanceof Conteudo)) {
      throw new TypeError("criarConteudo() deve retornar uma instância de Conteudo.");
    }

    this.#conteudosPreparados += 1;
    return conteudo;
  }

  get conteudosPreparados() {
    return this.#conteudosPreparados;
  }
}

/** ConcreteCreator: decide que o produto é um ConteudoRaiz. */
class CriadorDeConteudoRaiz extends CriadorDeConteudo {
  criarConteudo(dados) {
    return new ConteudoRaiz(dados);
  }
}

/** ConcreteCreator: decide que o produto é um Comentario. */
class CriadorDeComentario extends CriadorDeConteudo {
  criarConteudo(dados) {
    return new Comentario(dados);
  }
}

module.exports = { CriadorDeConteudo, CriadorDeConteudoRaiz, CriadorDeComentario };
