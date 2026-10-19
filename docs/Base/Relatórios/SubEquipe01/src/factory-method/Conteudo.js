"use strict";

const ConfiguracaoDoForum = require("../singleton/ConfiguracaoDoForum");

/**
 * Produto abstrato do padrão Factory Method.
 *
 * Reúne o que é comum a qualquer conteúdo do fórum (autor e corpo) e
 * deixa para as subclasses o que muda entre os tipos de conteúdo.
 */
class Conteudo {
  constructor({ autor, corpo }) {
    if (new.target === Conteudo) {
      throw new Error("Conteudo é abstrato: instancie ConteudoRaiz ou Comentario.");
    }
    if (typeof autor !== "string" || !autor.trim()) {
      throw new Error("O autor do conteúdo é obrigatório.");
    }
    if (typeof corpo !== "string" || !corpo.trim()) {
      throw new Error("O corpo do conteúdo é obrigatório.");
    }

    const limite = ConfiguracaoDoForum.obterInstancia().limiteDeCaracteresDoCorpo;
    if (corpo.trim().length > limite) {
      throw new Error(`O corpo do conteúdo excede o limite de ${limite} caracteres.`);
    }

    this.autor = autor.trim();
    this.corpo = corpo.trim();
  }

  get tipo() {
    throw new Error("Subclasses de Conteudo devem definir o tipo.");
  }

  resumo() {
    throw new Error("Subclasses de Conteudo devem implementar resumo().");
  }
}

/**
 * Produto concreto: publicação de nível superior, que exige título.
 * O slug é derivado do título, como ocorre em endereços de publicações.
 */
class ConteudoRaiz extends Conteudo {
  constructor({ autor, titulo, corpo }) {
    super({ autor, corpo });

    if (typeof titulo !== "string" || !titulo.trim()) {
      throw new Error("O título é obrigatório em um conteúdo raiz.");
    }
    const limite = ConfiguracaoDoForum.obterInstancia().limiteDeCaracteresDoTitulo;
    if (titulo.trim().length > limite) {
      throw new Error(`O título excede o limite de ${limite} caracteres.`);
    }

    this.titulo = titulo.trim();
    this.slug = ConteudoRaiz.gerarSlug(this.titulo);
  }

  get tipo() {
    return "conteudo-raiz";
  }

  resumo() {
    return `[${this.tipo}] "${this.titulo}" por ${this.autor} (/${this.autor}/${this.slug})`;
  }

  static gerarSlug(titulo) {
    return titulo
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

/**
 * Produto concreto: resposta a outro conteúdo. Não tem título, mas
 * precisa referenciar o conteúdo ao qual responde.
 */
class Comentario extends Conteudo {
  constructor({ autor, corpo, idDoConteudoPai }) {
    super({ autor, corpo });

    if (typeof idDoConteudoPai !== "string" || !idDoConteudoPai.trim()) {
      throw new Error("Um comentário precisa indicar o conteúdo que está respondendo.");
    }

    this.idDoConteudoPai = idDoConteudoPai.trim();
  }

  get tipo() {
    return "comentario";
  }

  resumo() {
    return `[${this.tipo}] resposta de ${this.autor} ao conteúdo ${this.idDoConteudoPai}`;
  }
}

module.exports = { Conteudo, ConteudoRaiz, Comentario };
