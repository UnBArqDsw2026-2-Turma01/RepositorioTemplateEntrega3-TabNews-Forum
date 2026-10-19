"use strict";

/**
 * Prototype abstrato: declara a operação de clonagem.
 */
class Prototipo {
  constructor() {
    if (new.target === Prototipo) {
      throw new Error("Prototipo é abstrato: use um protótipo concreto.");
    }
  }

  clonar() {
    throw new Error("Protótipos concretos devem implementar clonar().");
  }
}

/**
 * ConcretePrototype: modelo de rascunho de publicação.
 *
 * Um modelo guarda uma estrutura pronta (título sugerido e seções) que o
 * autor copia e preenche. Como as seções são objetos dentro de um array,
 * clonar() faz cópia profunda: alterar o clone não altera o modelo.
 */
class ModeloDeConteudo extends Prototipo {
  constructor({ nome, tituloSugerido, secoes = [] }) {
    super();

    if (typeof nome !== "string" || !nome.trim()) {
      throw new Error("O nome do modelo é obrigatório.");
    }
    if (typeof tituloSugerido !== "string" || !tituloSugerido.trim()) {
      throw new Error("O título sugerido do modelo é obrigatório.");
    }
    if (!Array.isArray(secoes)) {
      throw new TypeError("As seções do modelo devem ser informadas em um array.");
    }

    this.nome = nome.trim();
    this.tituloSugerido = tituloSugerido.trim();
    this.secoes = secoes.map((secao) => ({
      titulo: String(secao.titulo).trim(),
      texto: String(secao.texto ?? "").trim()
    }));
  }

  clonar() {
    return new ModeloDeConteudo({
      nome: this.nome,
      tituloSugerido: this.tituloSugerido,
      secoes: structuredClone(this.secoes)
    });
  }

  adicionarSecao(titulo, texto = "") {
    this.secoes.push({ titulo: String(titulo).trim(), texto: String(texto).trim() });
    return this;
  }

  preencherSecao(titulo, texto) {
    const secao = this.secoes.find((item) => item.titulo === titulo);
    if (!secao) {
      throw new Error(`A seção "${titulo}" não existe no modelo "${this.nome}".`);
    }
    secao.texto = String(texto).trim();
    return this;
  }

  montarCorpo() {
    return this.secoes
      .map((secao) => `## ${secao.titulo}\n\n${secao.texto || "(a preencher)"}`)
      .join("\n\n");
  }
}

module.exports = { Prototipo, ModeloDeConteudo };
